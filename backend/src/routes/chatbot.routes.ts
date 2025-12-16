import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Utils: saludo y presupuesto
function extractBudget(text: string): number | null {
  if (!text) return null;
  const raw = text.toLowerCase();

  // Evitar confundir modelos (rtx 4070, rx 6800, i7-12700, ryzen 5600) con presupuesto
  const hasHardwareModel = /(rtx|gtx|rx|ryzen|core\s*i\d|i3|i5|i7|i9|threadripper|xeon)\s*\d{3,5}/i.test(text);
  if (hasHardwareModel) return null;

  // Solo activar detección de presupuesto si hay indicios claros de dinero
  const hasBudgetCue = /(s\/?|s\.\s*|soles?|presupuesto|budget|monto)/i.test(raw);
  if (!hasBudgetCue) return null;

  const normalized = raw
    .replace(/\./g, '')
    .replace(/\ss\/?\s*/g, ' s/')
    .replace(/\s+/g, ' ');

  // Buscar primero cantidades con prefijo S/
  let m = normalized.match(/s\/\s*(\d{3,6})/i);
  if (!m) {
    // Si no hay S/, buscar cualquier número de 3-6 dígitos cuando existe palabra de dinero
    m = normalized.match(/(\d{3,6})/);
  }
  if (m && m[1]) {
    const n = parseInt(m[1], 10);
    if (!Number.isNaN(n) && n > 0) return n;
  }
  return null;
}

function isGreeting(text: string): boolean {
  const t = (text || '').trim().toLowerCase();
  return /(hola|buenas|buenos dias|buenas tardes|buenas noches|hey|hello|hi|holi)/.test(t);
}

// Utils: detección de saludo y presupuesto
 

// Obtener contexto de productos para el chatbot
async function getProductsContext() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      category: true,
    },
    take: 50,
  });

  const categories = await prisma.category.findMany();

  return {
    products: products.map(p => ({
      name: p.name,
      price: p.price.toString(),
      category: p.category.name,
      description: p.description,
      stock: p.stock,
      slug: p.slug,
    })),
    categories: categories.map(c => ({ name: c.name, slug: c.slug })),
  };
}

// Declaración de funciones (tools) para el modelo (Function Calling)
const functionDeclarations: any[] = [
  {
    name: 'searchProducts',
    description: 'Busca productos por nombre o descripción.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        limit: { type: 'integer', minimum: 1, maximum: 20 },
      },
      required: ['query'],
    },
  },
  {
    name: 'listByBudget',
    description: 'Lista productos con precio menor o igual al presupuesto dado.',
    parameters: {
      type: 'object',
      properties: {
        budget: { type: 'number', minimum: 1 },
        limit: { type: 'integer', minimum: 1, maximum: 20 },
      },
      required: ['budget'],
    },
  },
  {
    name: 'getFeatured',
    description: 'Obtiene productos destacados.',
    parameters: {
      type: 'object',
      properties: { limit: { type: 'integer', minimum: 1, maximum: 20 } },
    },
  },
  {
    name: 'getCategories',
    description: 'Lista categorías disponibles.',
    parameters: { type: 'object', properties: {} },
  },
];

async function tool_searchProducts(args: any) {
  const { query, limit = 6 } = args || {};
  const items = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query ?? '', mode: 'insensitive' } },
        { description: { contains: query ?? '', mode: 'insensitive' } },
      ],
    },
    include: { category: true },
    take: Math.min(Math.max(limit, 1), 20),
  });
  return items.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price?.toString?.() ?? String(p.price),
    category: p.category?.name ?? null,
    slug: p.slug,
    image: p.images?.[0] ?? null,
    stock: p.stock,
    isFeatured: (p as any).isFeatured ?? false,
  }));
}

async function tool_listByBudget(args: any) {
  const { budget, limit = 6 } = args || {};
  const items = await prisma.product.findMany({
    where: { isActive: true, price: { lte: Number(budget) || 0 } },
    include: { category: true },
    orderBy: [{ isFeatured: 'desc' as any }, { price: 'desc' }],
    take: Math.min(Math.max(limit, 1), 20),
  });
  return items.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price?.toString?.() ?? String(p.price),
    category: p.category?.name ?? null,
    slug: p.slug,
    image: p.images?.[0] ?? null,
    stock: p.stock,
    isFeatured: (p as any).isFeatured ?? false,
  }));
}

async function tool_getFeatured(args: any) {
  const { limit = 6 } = args || {};
  const items = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: [{ isFeatured: 'desc' as any }, { createdAt: 'desc' }],
    take: Math.min(Math.max(limit, 1), 20),
  });
  return items.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price?.toString?.() ?? String(p.price),
    category: p.category?.name ?? null,
    slug: p.slug,
    image: p.images?.[0] ?? null,
    stock: p.stock,
    isFeatured: (p as any).isFeatured ?? false,
  }));
}

async function tool_getCategories() {
  const cats = await prisma.category.findMany({ where: { isActive: true as any } as any });
  return cats.map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
}

// Endpoint principal del chatbot
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [] }: { message: string; history: ChatMessage[] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'El mensaje es requerido' });
    }

    // Respuesta rápida a saludos
    if (isGreeting(message)) {
      const greet = `👋 ¡Hola! Soy tu asistente experto de **Gaming Store**. \n\nPuedo ayudarte con:\n\n🎮 **Armar PC gaming** según tu presupuesto y juegos favoritos\n💻 **Recomendar GPUs y CPUs** comparando rendimiento\n⚡ **Optimizar configuraciones** evitando cuellos de botella\n🔧 **Explicar compatibilidades** entre componentes\n\n**¿Cómo puedo ayudarte hoy?**\n\nPuedes decirme tu presupuesto (ej: "S/ 2500") o qué tipo de componente necesitas.`;
      return res.json({ success: true, message: greet, timestamp: new Date().toISOString(), quick: true });
    }

    // Si el usuario indica presupuesto, ofrecer opciones dentro de ese monto
    const budget = extractBudget(message);
    if (budget) {
      const affordable = await prisma.product.findMany({
        where: { isActive: true, price: { lte: budget } },
        include: { category: true },
        orderBy: [{ isFeatured: 'desc' }, { price: 'desc' }],
        take: 6,
      });
      if (affordable.length > 0) {
        const lines = affordable.map(p => `• **${p.name}** — S/ ${p.price.toString()} — *${p.category?.name ?? 'Sin categoría'}* — [Ver detalles](/products/${p.slug})`);
        const text = `💰 Con un presupuesto de **S/ ${budget}**, estas opciones encajan perfectamente:\n\n${lines.join('\n')}\n\n¿Para qué resolución/juegos la quieres?\n• 1080p competitivo (eSports)\n• 1440p (juegos AAA)\n• 4K gaming\n\n¿Prefieres Intel o AMD? ¿Nvidia o AMD para GPU?`;
        return res.json({ success: true, message: text, timestamp: new Date().toISOString(), budgetBased: true });
      } else {
        const alternative = await prisma.product.findMany({
          where: { isActive: true },
          include: { category: true },
          orderBy: [{ price: 'asc' }],
          take: 3,
        });
        if (alternative.length > 0) {
          const altLines = alternative.map(p => `• **${p.name}** — S/ ${p.price.toString()} — [Ver detalles](/products/${p.slug})`);
          const altText = `Con S/ ${budget} no encontré opciones exactas, pero aquí están las más económicas disponibles:\n\n${altLines.join('\n')}\n\n¿Puedes aumentar un poco el presupuesto o quieres ver opciones en categorías específicas?`;
          return res.json({ success: true, message: altText, timestamp: new Date().toISOString() });
        }
      }
    }

    // Obtener contexto de productos
    const context = await getProductsContext();

  // Configurar el modelo (permitir override por ENV) + tools para function calling
  const modelName = process.env.GEMINI_MODEL || 'gemini-pro';
  const model = genAI.getGenerativeModel({
    model: modelName,
    tools: [{ functionDeclarations }] as any,
  } as any);

    // Prompt del sistema con contexto de la tienda
    const systemPrompt = `Eres un asistente virtual experto de "Gaming Store", especializado en componentes gaming y hardware de PC.

Tu trabajo es:
1. Ayudar a encontrar productos ideales según presupuesto y necesidades
2. Recomendar configuraciones de PC gaming completas
3. Comparar especificaciones técnicas (GPUs, CPUs, RAM, etc.)
4. Explicar compatibilidades y cuellos de botella
5. Sugerir mejoras de PC existentes

IMPORTANTE: 
- Responde SIEMPRE en español de forma profesional pero amigable
- Cuando menciones productos, SIEMPRE incluye el enlace: [Nombre del Producto](/products/{slug})
- Usa formato Markdown: **negrita** para nombres, *cursiva* para categorías
- Menciona precios en Soles: S/ XXX
- Si recomiendas varios productos, organízalos en lista con viñetas
- Incluye emojis relevantes para mejorar la experiencia: 🎮 💻 🖥️ ⚡ 🔥

PRODUCTOS DISPONIBLES:
${JSON.stringify(context.products, null, 2)}

CATEGORÍAS:
${context.categories.map(c => `${c.name} (/categories/${c.slug})`).join(', ')}

Al recomendar un producto, estructura así:
• **[Nombre]** — S/ [precio] — *[categoría]* — [Ver detalles](/products/{slug})

Si preguntan por algo no disponible, sugiere alternativas similares y explica por qué.`;

    // Construir historial de conversación
    const conversationHistory = history.map((msg: ChatMessage) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Agregar mensaje actual
    conversationHistory.push({
      role: 'user',
      parts: [{ text: `${systemPrompt}\n\nUsuario: ${message}` }],
    });

    // Generar respuesta con posibilidad de function calling
    const chat = model.startChat({ history: conversationHistory.slice(0, -1) } as any);

    let result: any = await chat.sendMessage(conversationHistory[conversationHistory.length - 1].parts[0].text);

    for (let i = 0; i < 3; i++) {
      const candidates: any[] = result?.response?.candidates ?? [];
      const parts: any[] = candidates?.[0]?.content?.parts ?? [];
      const calls = parts.filter((p: any) => p?.functionCall);
      if (!calls.length) break;

      for (const call of calls) {
        const { name, args } = call.functionCall;
        let toolResponse: any = null;
        try {
          if (name === 'searchProducts') toolResponse = await tool_searchProducts(args);
          else if (name === 'listByBudget') toolResponse = await tool_listByBudget(args);
          else if (name === 'getFeatured') toolResponse = await tool_getFeatured(args);
          else if (name === 'getCategories') toolResponse = await tool_getCategories();
          else toolResponse = { error: 'unknown_tool', name };
        } catch (e: any) {
          toolResponse = { error: 'tool_error', message: e?.message ?? String(e) };
        }

        result = await chat.sendMessage({
          role: 'tool',
          parts: [
            {
              functionResponse: {
                name,
                response: toolResponse,
              },
            },
          ],
        } as any);
      }
    }

    const response = result?.response?.text?.() ?? 'No pude generar una respuesta en este momento.';

    res.json({
      success: true,
      message: response,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Error en chatbot:', error);
    // Fallback: responder con una búsqueda básica de productos cuando el modelo falle
    try {
      const q: string = (req.body?.message || '').toString().slice(0, 100);
      const budget = extractBudget(q);

      if (budget) {
        const affordable = await prisma.product.findMany({
          where: { isActive: true, price: { lte: budget } },
          include: { category: true },
          orderBy: [{ isFeatured: 'desc' }, { price: 'desc' }],
          take: 6,
        });
        if (affordable.length > 0) {
          const lines = affordable.map(p => `• ${p.name} — S/ ${p.price.toString()} — ${p.category?.name ?? ''} — /products/${p.slug}`);
          const text = `Tuve un inconveniente con el modelo de IA, pero con presupuesto S/ ${budget} encontré estas opciones que encajan bien:\n\n${lines.join('\n')}\n\n¿Te ayudo a priorizar rendimiento en juegos competitivos o AAA?`;
          return res.json({ success: true, message: text, timestamp: new Date().toISOString(), fallback: true });
        }
      }
      const products = await prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        include: { category: true },
        take: 5,
      });

      if (products.length > 0) {
        const lines = products.map((p) => `• ${p.name} — S/ ${p.price.toString()} — /products/${p.slug}`);
        const text = `Tuve un inconveniente al consultar el modelo de IA, pero encontré estas opciones relacionadas a tu búsqueda:\n\n${lines.join('\n')}\n\n¿Quieres que te recomiende entre estas opciones según tu presupuesto?`;
        return res.json({ success: true, message: text, timestamp: new Date().toISOString(), fallback: true });
      }

      // Si no hay coincidencias, sugerir destacados o recientes
      const fallbackList = await prisma.product.findMany({
        where: { isActive: true },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        include: { category: true },
        take: 5,
      });
      const lines2 = fallbackList.map((p) => `• ${p.name} — S/ ${p.price.toString()} — /products/${p.slug}`);
      const text2 = `Tuve un inconveniente con el motor de IA y no encontré coincidencias exactas. Aquí tienes algunas opciones populares recientes para empezar:\n\n${lines2.join('\n')}\n\n¿Puedes darme más detalles (presupuesto, categoría o marca) para afinar mejor la recomendación?`;
      return res.json({
        success: true,
        message: text2,
        timestamp: new Date().toISOString(),
        fallback: true,
      });
    } catch (fallbackErr) {
      console.error('Error en fallback de chatbot:', fallbackErr);
      return res.status(500).json({
        success: false,
        error: 'Error al procesar el mensaje',
        message: 'Lo siento, tuve un problema al procesar tu mensaje. Por favor intenta de nuevo.',
      });
    }
  }
});

// Endpoint para búsqueda inteligente de productos
router.post('/search-products', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'La consulta es requerida' });
    }

    // Buscar productos relevantes
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        category: true,
      },
      take: 5,
    });

    res.json({
      success: true,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price.toString(),
        category: p.category.name,
        slug: p.slug,
        image: p.images[0] || null,
        stock: p.stock,
      })),
    });

  } catch (error) {
    console.error('Error en búsqueda de productos:', error);
    res.status(500).json({ error: 'Error al buscar productos' });
// Endpoint para sugerencias rápidas
router.get('/suggestions', async (req: Request, res: Response) => {
  try {
    const suggestions = [
      '¿Qué GPUs tienen disponibles?',
      'Recomiéndame una PC para gaming 1440p',
      'Tengo S/2000, ¿qué GPU me recomiendas?',
      'Necesito RAM de 32GB',
      'Procesadores Intel vs AMD',
      'Productos en oferta esta semana',
      'Tarjeta gráfica para juegos AAA',
      'Mejor relación calidad-precio'
    ];

    res.json({
      success: true,
      suggestions,
    });

  } catch (error) {
    console.error('Error al obtener sugerencias:', error);
    res.status(500).json({ error: 'Error al obtener sugerencias' });
  }
}); console.error('Error al obtener sugerencias:', error);
    res.status(500).json({ error: 'Error al obtener sugerencias' });
  }
});

export default router;

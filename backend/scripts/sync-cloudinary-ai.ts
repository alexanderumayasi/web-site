import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const prisma = new PrismaClient();

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configurar Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function matchImageWithAI(imageName: string, products: any[]): Promise<string | null> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const productList = products.map((p, i) => `${i + 1}. ${p.name} (${p.slug})`).join('\n');
    
    const prompt = `Tienes esta imagen: "${imageName}"

Y estos productos de tecnología:
${productList}

Analiza el nombre de la imagen y determina cuál producto corresponde mejor.
Responde SOLO con el número del producto (1-${products.length}) o "0" si no hay match claro.
No agregues explicaciones, solo el número.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();
    const matchIndex = parseInt(response) - 1;
    
    if (matchIndex >= 0 && matchIndex < products.length) {
      return products[matchIndex].id;
    }
    return null;
  } catch (error) {
    console.error(`Error al matchear "${imageName}":`, error);
    return null;
  }
}

async function syncImagesWithAI() {
  try {
    console.log('🤖 Iniciando sincronización inteligente con Gemini AI...\n');
    
    // Obtener productos de la base de datos
    const products = await prisma.product.findMany({
      select: { id: true, name: true, slug: true, categoryId: true }
    });
    
    console.log(`📦 Productos en base de datos: ${products.length}\n`);
    
    // Obtener imágenes de Cloudinary
    console.log('🔍 Obteniendo imágenes de Cloudinary...');
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 500,
      resource_type: 'image'
    });

    console.log(`✅ Encontradas ${result.resources.length} imágenes\n`);
    
    // Agrupar imágenes por producto usando IA
    console.log('🧠 Analizando imágenes con Gemini AI...');
    const productImages: { [productId: string]: string[] } = {};
    let matchedCount = 0;
    let unmatchedCount = 0;
    
    for (let i = 0; i < result.resources.length; i++) {
      const resource = result.resources[i];
      const imageName = resource.public_id;
      const imageUrl = resource.secure_url;
      
      // Mostrar progreso
      process.stdout.write(`\r   Procesando: ${i + 1}/${result.resources.length} imágenes...`);
      
      const productId = await matchImageWithAI(imageName, products);
      
      if (productId) {
        if (!productImages[productId]) {
          productImages[productId] = [];
        }
        productImages[productId].push(imageUrl);
        matchedCount++;
      } else {
        unmatchedCount++;
      }
      
      // Pequeña pausa para no saturar la API (límite: 15 RPM en free tier)
      await new Promise(resolve => setTimeout(resolve, 4100)); // ~4 segundos entre llamadas
    }
    
    console.log('\n\n📊 Resultados del matching:');
    console.log(`   ✅ Imágenes matcheadas: ${matchedCount}`);
    console.log(`   ❌ Imágenes sin match: ${unmatchedCount}\n`);
    
    // Actualizar productos en la base de datos
    console.log('💾 Actualizando productos en base de datos...\n');
    let updatedCount = 0;
    
    for (const [productId, images] of Object.entries(productImages)) {
      const product = products.find(p => p.id === productId);
      if (product && images.length > 0) {
        await prisma.product.update({
          where: { id: productId },
          data: { images }
        });
        
        console.log(`   ✅ ${product.name}: ${images.length} imagen(es)`);
        updatedCount++;
      }
    }
    
    // Actualizar categorías con primera imagen de cada tipo
    console.log('\n🗂️  Actualizando categorías...\n');
    const categories = await prisma.category.findMany();
    
    for (const category of categories) {
      // Encontrar productos de esta categoría
      const categoryProducts = products.filter(p => p.categoryId === category.id);
      
      if (categoryProducts.length > 0) {
        // Buscar imágenes de productos de esta categoría
        for (const product of categoryProducts) {
          if (productImages[product.id] && productImages[product.id].length > 0) {
            await prisma.category.update({
              where: { id: category.id },
              data: { image: productImages[product.id][0] }
            });
            
            console.log(`   ✅ ${category.name}: ${productImages[product.id][0].substring(0, 60)}...`);
            break;
          }
        }
      }
    }
    
    console.log('\n🎉 ¡Sincronización completada!');
    console.log(`   📦 ${updatedCount} productos actualizados`);
    console.log(`   🗂️  ${categories.length} categorías actualizadas`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

syncImagesWithAI();

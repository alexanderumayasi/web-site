import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

const prisma = new PrismaClient();

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function syncImages() {
  try {
    console.log('🔍 Obteniendo imágenes de Cloudinary...');
    
    // Obtener todas las imágenes de Cloudinary
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 500,
      resource_type: 'image'
    });

    console.log(`✅ Encontradas ${result.resources.length} imágenes`);
    
    // Crear un mapa de imágenes por categoría (basado en el nombre del archivo)
    const imageMap: Record<string, string[]> = {
      cpu: [],
      gpu: [],
      ram: [],
      ssd: [],
      motherboard: [],
      monitor: [],
      laptop: [],
      otros: []
    };

    // Clasificar imágenes por tipo
    const allImages: string[] = [];
    const resourceDetails: Record<string, { publicId: string }> = {};
    result.resources.forEach((resource: any) => {
      const url = resource.secure_url;
      const filename = resource.public_id.toLowerCase();
      allImages.push(url);
      resourceDetails[url] = { publicId: resource.public_id };

      if (filename.includes('ryzen') || filename.includes('intel') || filename.includes('cpu') || filename.includes('processor')) {
        imageMap.cpu.push(url);
      } else if (filename.includes('nvidia') || filename.includes('rtx') || filename.includes('radeon') || filename.includes('gpu') || filename.includes('graphic')) {
        imageMap.gpu.push(url);
      } else if (filename.includes('ram') || filename.includes('memoria') || filename.includes('ddr') || filename.includes('corsair') || filename.includes('gskill') || filename.includes('kingston')) {
        imageMap.ram.push(url);
      } else if (filename.includes('ssd') || filename.includes('nvme') || filename.includes('samsung') || filename.includes('wd') || filename.includes('western')) {
        imageMap.ssd.push(url);
      } else if (filename.includes('motherboard') || filename.includes('mobo') || filename.includes('asus') || filename.includes('msi') || filename.includes('gigabyte') || filename.includes('asrock')) {
        imageMap.motherboard.push(url);
      } else if (filename.includes('monitor') || filename.includes('display') || filename.includes('screen')) {
        imageMap.monitor.push(url);
      } else if (filename.includes('laptop') || filename.includes('notebook')) {
        imageMap.laptop.push(url);
      } else {
        imageMap.otros.push(url);
      }
    });

    console.log('\n📊 Imágenes clasificadas:');
    console.log(`  CPUs: ${imageMap.cpu.length}`);
    console.log(`  GPUs: ${imageMap.gpu.length}`);
    console.log(`  RAM: ${imageMap.ram.length}`);
    console.log(`  SSDs: ${imageMap.ssd.length}`);
    console.log(`  Motherboards: ${imageMap.motherboard.length}`);
    console.log(`  Monitores: ${imageMap.monitor.length}`);
    console.log(`  Laptops: ${imageMap.laptop.length}`);
    console.log(`  Otros: ${imageMap.otros.length}`);

    const shuffle = <T,>(items: T[]) => {
      const copy = [...items];
      for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    const pools: Record<string, string[]> = Object.entries(imageMap).reduce(
      (acc, [key, urls]) => {
        acc[key] = shuffle(urls);
        return acc;
      },
      {} as Record<string, string[]>
    );

    const reservePool = shuffle(allImages);

    const peekPool = (poolKey: string) => {
      const pool = pools[poolKey];
      if (!pool || pool.length === 0) {
        return undefined;
      }
      return pool[pool.length - 1];
    };

    const takeFromPool = (poolKey: string, count: number) => {
      const pool = pools[poolKey];
      const taken: string[] = [];
      if (pool && pool.length) {
        while (pool.length > 0 && taken.length < count) {
          const candidate = pool.pop();
          if (candidate) {
            taken.push(candidate);
          }
        }
      }
      return taken;
    };

    const takeFallback = (count: number) => {
      const taken: string[] = [];
      while (reservePool.length > 0 && taken.length < count) {
        const image = reservePool.pop();
        if (image) {
          taken.push(image);
        }
      }
      return taken;
    };

    // Actualizar categorías
    console.log('\n🔄 Actualizando categorías...');
    const categories = await prisma.category.findMany();

    let miscCategory = categories.find((category) => category.slug === 'otros');
    if (!miscCategory) {
      miscCategory = await prisma.category.create({
        data: {
          name: 'Accesorios y Otros',
          slug: 'otros',
          description: 'Catálogo sincronizado automáticamente desde Cloudinary.',
        },
      });
      categories.push(miscCategory);
      console.log(`  ➕ Categoría creada: ${miscCategory.name}`);
    }

    for (const category of categories) {
      let imageUrl = '';
      
      if (category.slug === 'procesadores') {
        imageUrl = peekPool('cpu') ?? peekPool('otros') ?? reservePool[0];
      } else if (category.slug === 'tarjetas-graficas') {
        imageUrl = peekPool('gpu') ?? peekPool('otros') ?? reservePool[0];
      } else if (category.slug === 'memoria-ram') {
        imageUrl = peekPool('ram') ?? peekPool('otros') ?? reservePool[0];
      } else if (category.slug === 'almacenamiento') {
        imageUrl = peekPool('ssd') ?? peekPool('otros') ?? reservePool[0];
      } else if (category.slug === 'placas-madre') {
        imageUrl = peekPool('motherboard') ?? peekPool('otros') ?? reservePool[0];
      } else if (category.slug === 'otros') {
        imageUrl = peekPool('otros') ?? reservePool[0];
      }

      if (imageUrl) {
        await prisma.category.update({
          where: { id: category.id },
          data: { image: imageUrl }
        });
        console.log(`  ✅ ${category.name}: ${imageUrl}`);
      }
    }

    // Actualizar productos
    console.log('\n🔄 Actualizando productos...');
    const products = await prisma.product.findMany({
      include: { category: true }
    });

    let updatedCount = 0;

    const slugToPool: Record<string, keyof typeof pools> = {
      'procesadores': 'cpu',
      'tarjetas-graficas': 'gpu',
      'memoria-ram': 'ram',
      'almacenamiento': 'ssd',
      'placas-madre': 'motherboard',
      'otros': 'otros',
    };

    for (const product of products) {
      const productName = product.name.toLowerCase();
      let images: string[] = [];

      if (productName.includes('ryzen') || productName.includes('intel') || productName.includes('core')) {
        images = takeFromPool('cpu', 3);
      } else if (productName.includes('rtx') || productName.includes('radeon') || productName.includes('gpu')) {
        images = takeFromPool('gpu', 3);
      } else if (productName.includes('corsair') || productName.includes('gskill') || productName.includes('ram') || productName.includes('ddr')) {
        images = takeFromPool('ram', 2);
      } else if (productName.includes('samsung') || productName.includes('wd') || productName.includes('ssd') || productName.includes('nvme')) {
        images = takeFromPool('ssd', 2);
      } else if (productName.includes('asus') || productName.includes('msi') || productName.includes('motherboard') || productName.includes('rog') || productName.includes('z790')) {
        images = takeFromPool('motherboard', 2);
      }

      if (images.length === 0 && product.category?.slug) {
        const poolKey = slugToPool[product.category.slug];
        if (poolKey) {
          images = takeFromPool(poolKey, 2);
        }
      }

      if (images.length === 0) {
        images = takeFromPool('otros', 2);
      }

      if (images.length === 0) {
        images = takeFallback(2);
      }

      if (images.length > 0) {
        await prisma.product.update({
          where: { id: product.id },
          data: { images }
        });
        console.log(`  ✅ ${product.name}: ${images.length} imagen(es)`);
        updatedCount++;
      }
    }

    console.log(`\n🧾 Productos existentes actualizados: ${updatedCount}`);

    const poolConfig: Record<string, {
      categorySlug: string;
      displayName: string;
      skuPrefix: string;
      priceRange: [number, number];
    }> = {
      cpu: { categorySlug: 'procesadores', displayName: 'Procesador', skuPrefix: 'CPU', priceRange: [800, 3500] },
      gpu: { categorySlug: 'tarjetas-graficas', displayName: 'Tarjeta Gráfica', skuPrefix: 'GPU', priceRange: [1500, 8500] },
      ram: { categorySlug: 'memoria-ram', displayName: 'Memoria RAM', skuPrefix: 'RAM', priceRange: [250, 1200] },
      ssd: { categorySlug: 'almacenamiento', displayName: 'Unidad SSD', skuPrefix: 'SSD', priceRange: [200, 2000] },
      motherboard: { categorySlug: 'placas-madre', displayName: 'Placa Madre', skuPrefix: 'MB', priceRange: [500, 2200] },
      monitor: { categorySlug: 'otros', displayName: 'Monitor', skuPrefix: 'MON', priceRange: [600, 2500] },
      laptop: { categorySlug: 'otros', displayName: 'Laptop', skuPrefix: 'LAP', priceRange: [1500, 6000] },
      otros: { categorySlug: 'otros', displayName: 'Accesorio', skuPrefix: 'ACC', priceRange: [100, 800] },
    };

    const categoriesBySlug = new Map(categories.map((category) => [category.slug, category]));
    const existingSlugs = new Set(products.map((product) => product.slug));
    const existingSkus = new Set(products.map((product) => product.sku));

    const slugify = (value: string) =>
      value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .replace(/-{2,}/g, '-');

    const titleCase = (value: string) =>
      value
        .split(/[-_.\s]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

    const randomBetween = (min: number, max: number) => {
      const value = Math.random() * (max - min) + min;
      return Math.round(value * 100) / 100;
    };

    const ensureUniqueSku = (prefix: string) => {
      let sku = '';
      do {
        sku = `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      } while (existingSkus.has(sku));
      existingSkus.add(sku);
      return sku;
    };

    const ensureUniqueSlug = (base: string) => {
      let candidate = base;
      let suffix = 1;
      while (!candidate || existingSlugs.has(candidate)) {
        candidate = suffix === 1 ? base : `${base}-${suffix}`;
        suffix += 1;
      }
      existingSlugs.add(candidate);
      return candidate;
    };

    let createdCount = 0;
    const MAX_NEW_PRODUCTS = 200;

    console.log('\n➕ Generando nuevos productos desde Cloudinary...');

    for (const [poolKey, config] of Object.entries(poolConfig)) {
      if (createdCount >= MAX_NEW_PRODUCTS) {
        break;
      }

      const category = categoriesBySlug.get(config.categorySlug);
      if (!category) {
        continue;
      }

      const pool = pools[poolKey];
      if (!pool || pool.length === 0) {
        continue;
      }

      let index = 1;
      while (pool.length > 0 && createdCount < MAX_NEW_PRODUCTS) {
        const primaryImage = pool.pop();
        if (!primaryImage) {
          break;
        }

        const detail = resourceDetails[primaryImage];
        const publicId = detail?.publicId ?? `${poolKey}-${Date.now()}`;
        const baseName = titleCase(publicId.split('/').pop() ?? publicId);
        const displayLabel = baseName.length > 2 ? baseName : `${config.displayName} ${String(index).padStart(3, '0')}`;
        const name = `${config.displayName} ${displayLabel}`.trim();
        let slugBase = slugify(name);
        if (!slugBase) {
          slugBase = slugify(`${config.displayName}-${poolKey}-${Date.now()}`);
        }
        const slug = ensureUniqueSlug(slugBase);
        const sku = ensureUniqueSku(config.skuPrefix);
        const price = randomBetween(config.priceRange[0], config.priceRange[1]);
        const comparePrice = Math.round(price * (1.1 + Math.random() * 0.25) * 100) / 100;
        const stock = Math.floor(Math.random() * 40) + 5;

        const additionalImages = takeFromPool(poolKey, 2).filter(Boolean);
        const images = [primaryImage, ...additionalImages];

        await prisma.product.create({
          data: {
            name,
            slug,
            description: `${config.displayName} sincronizado automáticamente desde Cloudinary (${publicId}).`,
            price,
            comparePrice,
            sku,
            stock,
            images,
            specifications: {
              source: 'cloudinary-sync',
              publicId,
              autogenerated: true,
            },
            isActive: true,
            isFeatured: Math.random() < 0.05,
            categoryId: category.id,
          },
        });

        createdCount += 1;
        index += 1;
      }
    }

    console.log(`  ➡️ Nuevos productos creados: ${createdCount}`);
    console.log(`\n🎉 ¡Completado!`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

syncImages();

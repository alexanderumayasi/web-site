import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function activateAllProducts() {
  console.log('🔄 Activando todos los productos...');
  
  const result = await prisma.product.updateMany({
    data: {
      isActive: true,
    },
  });

  console.log(`✅ ${result.count} productos activados`);
  
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      isActive: true,
      stock: true,
    },
  });

  console.log('\n📦 Productos en la base de datos:');
  products.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name} - Activo: ${p.isActive} - Stock: ${p.stock}`);
  });
}

activateAllProducts()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

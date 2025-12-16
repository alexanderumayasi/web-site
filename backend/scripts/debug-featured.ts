import prisma from '../src/utils/prisma';

async function main() {
  const products = await prisma.product.findMany({
    where: { isFeatured: true },
    select: {
      id: true,
      name: true,
      images: true,
      isActive: true,
    },
  });

  console.log(JSON.stringify(products, null, 2));
}

main()
  .catch((err) => {
    console.error(err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

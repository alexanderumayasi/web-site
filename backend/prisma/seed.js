"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seed...');
    // Clean database
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.review.deleteMany();
    await prisma.address.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.coupon.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Database cleaned');
    // Create users
    const adminPassword = await bcryptjs_1.default.hash('Admin123!', 12);
    const userPassword = await bcryptjs_1.default.hash('User123!', 12);
    await prisma.user.create({
        data: {
            email: 'admin@gaming.com',
            password: adminPassword,
            firstName: 'Admin',
            lastName: 'Gaming Store',
            phone: '+51999888777',
            role: 'ADMIN',
            emailVerified: true,
        },
    });
    const customer = await prisma.user.create({
        data: {
            email: 'user@gaming.com',
            password: userPassword,
            firstName: 'Juan',
            lastName: 'Pérez',
            phone: '+51999123456',
            role: 'CUSTOMER',
            emailVerified: true,
        },
    });
    console.log('✅ Users created');
    // Create categories
    const categories = await Promise.all([
        prisma.category.create({
            data: {
                name: 'Procesadores',
                slug: 'procesadores',
                description: 'CPUs de alta gama para gaming',
                image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Tarjetas Gráficas',
                slug: 'tarjetas-graficas',
                description: 'GPUs para máximo rendimiento',
                image: 'https://res.cloudinary.com/demo/image/upload/v1652345767/docs/models.jpg',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Memoria RAM',
                slug: 'memoria-ram',
                description: 'Módulos RAM de alta velocidad',
                image: 'https://res.cloudinary.com/demo/image/upload/v1652366604/docs/digital_art.jpg',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Almacenamiento',
                slug: 'almacenamiento',
                description: 'SSDs y discos duros',
                image: 'https://res.cloudinary.com/demo/image/upload/v1652345874/docs/sneakers.jpg',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Placas Madre',
                slug: 'placas-madre',
                description: 'Motherboards gaming',
                image: 'https://res.cloudinary.com/demo/image/upload/v1652967656/docs/colored_pencils.jpg',
            },
        }),
    ]);
    console.log('✅ Categories created');
    // Create products
    const products = [
        {
            name: 'AMD Ryzen 9 7950X',
            slug: 'amd-ryzen-9-7950x',
            description: 'Procesador de 16 núcleos y 32 hilos con arquitectura Zen 4. Perfecto para gaming extremo y creación de contenido.',
            price: 2899,
            comparePrice: 3199,
            sku: 'CPU-AMD-7950X',
            stock: 15,
            categoryId: categories[0].id,
            images: [
                'https://res.cloudinary.com/demo/image/upload/v1652345767/docs/models.jpg',
            ],
            specifications: {
                cores: 16,
                threads: 32,
                baseClock: '4.5 GHz',
                boostClock: '5.7 GHz',
                tdp: '170W',
                socket: 'AM5',
            },
            isFeatured: true,
        },
        {
            name: 'Intel Core i9-13900K',
            slug: 'intel-core-i9-13900k',
            description: 'Procesador de 13va generación con 24 núcleos. Rendimiento excepcional para gaming y multitarea.',
            price: 2699,
            comparePrice: 2999,
            sku: 'CPU-INTEL-13900K',
            stock: 20,
            categoryId: categories[0].id,
            images: [
                'https://res.cloudinary.com/demo/image/upload/v1652366604/docs/digital_art.jpg',
            ],
            specifications: {
                cores: 24,
                threads: 32,
                baseClock: '3.0 GHz',
                boostClock: '5.8 GHz',
                tdp: '125W',
                socket: 'LGA1700',
            },
            isFeatured: true,
        },
        {
            name: 'NVIDIA RTX 4090',
            slug: 'nvidia-rtx-4090',
            description: 'La tarjeta gráfica más potente del mercado. 24GB GDDR6X para gaming en 4K y Ray Tracing.',
            price: 7999,
            comparePrice: 8499,
            sku: 'GPU-NVIDIA-4090',
            stock: 8,
            categoryId: categories[1].id,
            images: [
                'https://res.cloudinary.com/demo/image/upload/v1652345874/docs/sneakers.jpg',
            ],
            specifications: {
                memory: '24GB GDDR6X',
                coreClock: '2.52 GHz',
                cudaCores: 16384,
                interface: 'PCIe 4.0',
                ports: '3x DisplayPort 1.4a, 1x HDMI 2.1',
            },
            isFeatured: true,
        },
        {
            name: 'AMD Radeon RX 7900 XTX',
            slug: 'amd-radeon-rx-7900-xtx',
            description: 'GPU de última generación con 24GB de memoria. Excelente para gaming en alta resolución.',
            price: 4999,
            comparePrice: 5499,
            sku: 'GPU-AMD-7900XTX',
            stock: 12,
            categoryId: categories[1].id,
            images: [
                'https://res.cloudinary.com/demo/image/upload/v1652967656/docs/colored_pencils.jpg',
            ],
            specifications: {
                memory: '24GB GDDR6',
                gameClock: '2.3 GHz',
                boostClock: '2.5 GHz',
                interface: 'PCIe 4.0',
            },
            isFeatured: false,
        },
        {
            name: 'Corsair Vengeance DDR5 32GB',
            slug: 'corsair-vengeance-ddr5-32gb',
            description: 'Kit de 32GB (2x16GB) DDR5 a 6000MHz. Optimizado para plataformas AMD e Intel de última generación.',
            price: 699,
            sku: 'RAM-CORSAIR-DDR5-32',
            stock: 30,
            categoryId: categories[2].id,
            images: [
                'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            ],
            specifications: {
                capacity: '32GB (2x16GB)',
                speed: '6000MHz',
                type: 'DDR5',
                latency: 'CL36',
                voltage: '1.35V',
            },
        },
        {
            name: 'G.Skill Trident Z5 RGB 64GB',
            slug: 'gskill-trident-z5-rgb-64gb',
            description: 'Kit de 64GB (2x32GB) DDR5 con iluminación RGB. Máxima capacidad y velocidad.',
            price: 1299,
            sku: 'RAM-GSKILL-DDR5-64',
            stock: 18,
            categoryId: categories[2].id,
            images: [
                'https://res.cloudinary.com/demo/image/upload/v1652345874/docs/sneakers.jpg',
            ],
            specifications: {
                capacity: '64GB (2x32GB)',
                speed: '6400MHz',
                type: 'DDR5',
                latency: 'CL32',
                rgb: 'Yes',
            },
        },
        {
            name: 'Samsung 990 PRO 2TB',
            slug: 'samsung-990-pro-2tb',
            description: 'SSD NVMe M.2 PCIe 4.0 de 2TB. Velocidades de hasta 7,450 MB/s para tiempos de carga instantáneos.',
            price: 899,
            comparePrice: 999,
            sku: 'SSD-SAMSUNG-990PRO-2TB',
            stock: 25,
            categoryId: categories[3].id,
            images: [
                'https://res.cloudinary.com/demo/image/upload/v1652366604/docs/digital_art.jpg',
            ],
            specifications: {
                capacity: '2TB',
                interface: 'PCIe 4.0 x4, NVMe 2.0',
                formFactor: 'M.2 2280',
                readSpeed: '7,450 MB/s',
                writeSpeed: '6,900 MB/s',
            },
            isFeatured: true,
        },
        {
            name: 'WD Black SN850X 4TB',
            slug: 'wd-black-sn850x-4tb',
            description: 'SSD de alto rendimiento con 4TB de capacidad. Ideal para biblioteca de juegos extensa.',
            price: 1699,
            sku: 'SSD-WD-SN850X-4TB',
            stock: 15,
            categoryId: categories[3].id,
            images: [
                'https://res.cloudinary.com/demo/image/upload/v1652967656/docs/colored_pencils.jpg',
            ],
            specifications: {
                capacity: '4TB',
                interface: 'PCIe Gen4 x4',
                readSpeed: '7,300 MB/s',
                writeSpeed: '6,600 MB/s',
            },
        },
        {
            name: 'ASUS ROG Strix X670E-E',
            slug: 'asus-rog-strix-x670e-e',
            description: 'Placa madre premium para AMD Ryzen 7000. PCIe 5.0, DDR5, WiFi 6E y RGB Aura Sync.',
            price: 1899,
            comparePrice: 2099,
            sku: 'MB-ASUS-X670E',
            stock: 10,
            categoryId: categories[4].id,
            images: [
                'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            ],
            specifications: {
                socket: 'AM5',
                chipset: 'AMD X670E',
                formFactor: 'ATX',
                memory: 'DDR5, 4x DIMM, Max 128GB',
                pcie: 'PCIe 5.0',
                networking: 'WiFi 6E, 2.5G LAN',
            },
        },
        {
            name: 'MSI MPG Z790 Carbon WiFi',
            slug: 'msi-mpg-z790-carbon-wifi',
            description: 'Motherboard gaming para Intel 13va gen. Diseño robusto con excelente VRM.',
            price: 1599,
            sku: 'MB-MSI-Z790',
            stock: 14,
            categoryId: categories[4].id,
            images: [
                'https://res.cloudinary.com/demo/image/upload/v1652345874/docs/sneakers.jpg',
            ],
            specifications: {
                socket: 'LGA1700',
                chipset: 'Intel Z790',
                formFactor: 'ATX',
                memory: 'DDR5, 4x DIMM',
                networking: 'WiFi 6E',
            },
        },
    ];
    for (const productData of products) {
        await prisma.product.create({ data: productData });
    }
    console.log('✅ Products created');
    // Create addresses
    await prisma.address.create({
        data: {
            userId: customer.id,
            firstName: 'Juan',
            lastName: 'Pérez',
            street: 'Av. Javier Prado Este 4200',
            city: 'Lima',
            state: 'Lima',
            zipCode: '15023',
            country: 'PE',
            phone: '+51999123456',
            isDefault: true,
        },
    });
    console.log('✅ Addresses created');
    // Create coupons
    await Promise.all([
        prisma.coupon.create({
            data: {
                code: 'WELCOME10',
                description: '10% de descuento en tu primera compra',
                discountType: 'percentage',
                discountValue: 10,
                minPurchase: 500,
                maxDiscount: 200,
                usageLimit: 100,
                isActive: true,
                startDate: new Date(),
                endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            },
        }),
        prisma.coupon.create({
            data: {
                code: 'GAMING50',
                description: 'S/ 50 de descuento en compras mayores a S/ 1000',
                discountType: 'fixed',
                discountValue: 50,
                minPurchase: 1000,
                usageLimit: 50,
                isActive: true,
                startDate: new Date(),
                endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            },
        }),
    ]);
    console.log('✅ Coupons created');
    // Create sample reviews
    const productsForReview = await prisma.product.findMany({ take: 5 });
    for (const product of productsForReview) {
        await prisma.review.create({
            data: {
                productId: product.id,
                userId: customer.id,
                rating: 5,
                title: 'Excelente producto',
                comment: 'Superó mis expectativas. Muy buena calidad y rendimiento.',
                isVerified: true,
                isPublished: true,
            },
        });
    }
    console.log('✅ Reviews created');
    console.log('🎉 Database seeded successfully!');
    console.log('\n📧 Login credentials:');
    console.log('   Admin: admin@gaming.com / Admin123!');
    console.log('   User:  user@gaming.com / User123!');
}
main()
    .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});

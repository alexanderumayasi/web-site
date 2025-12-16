import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixPaymentStatus() {
  try {
    console.log('🔧 Actualizando estados de pago...\n');

    // Obtener todos los pedidos
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        total: true,
      },
    });

    console.log(`📦 Total de pedidos encontrados: ${orders.length}\n`);

    // Actualizar pedidos entregados a COMPLETED si el pago está PENDING
    const deliveredOrders = await prisma.order.updateMany({
      where: {
        status: 'DELIVERED',
        paymentStatus: 'PENDING',
      },
      data: {
        paymentStatus: 'COMPLETED',
      },
    });

    console.log(`✅ Pedidos ENTREGADOS actualizados a pago COMPLETADO: ${deliveredOrders.count}`);

    // Actualizar pedidos en PROCESSING a COMPLETED si el pago está PENDING
    const processingOrders = await prisma.order.updateMany({
      where: {
        status: 'PROCESSING',
        paymentStatus: 'PENDING',
      },
      data: {
        paymentStatus: 'COMPLETED',
      },
    });

    console.log(`✅ Pedidos EN PROCESO actualizados a pago COMPLETADO: ${processingOrders.count}`);

    // Actualizar pedidos en SHIPPED a COMPLETED si el pago está PENDING
    const shippedOrders = await prisma.order.updateMany({
      where: {
        status: 'SHIPPED',
        paymentStatus: 'PENDING',
      },
      data: {
        paymentStatus: 'COMPLETED',
      },
    });

    console.log(`✅ Pedidos ENVIADOS actualizados a pago COMPLETADO: ${shippedOrders.count}`);

    // Mostrar resumen
    console.log('\n📊 Resumen de pedidos después de la actualización:');
    const summary = await prisma.order.groupBy({
      by: ['status', 'paymentStatus'],
      _count: true,
      _sum: {
        total: true,
      },
    });

    summary.forEach((item) => {
      console.log(
        `   ${item.status} | Pago: ${item.paymentStatus} | Cantidad: ${item._count} | Total: S/ ${Number(item._sum.total || 0).toFixed(2)}`
      );
    });

    // Calcular total de ventas completadas
    const totalSales = await prisma.order.aggregate({
      where: {
        paymentStatus: 'COMPLETED',
      },
      _sum: {
        total: true,
      },
    });

    console.log(`\n💰 TOTAL DE VENTAS COMPLETADAS: S/ ${Number(totalSales._sum.total || 0).toFixed(2)}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPaymentStatus();

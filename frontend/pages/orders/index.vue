<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Breadcrumb -->
    <div class="bg-white border-b">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center space-x-2 text-sm">
          <NuxtLink to="/" class="text-gray-600 hover:text-primary-600">Inicio</NuxtLink>
          <span class="text-gray-400">/</span>
          <span class="text-gray-900">Mis Pedidos</span>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Historial de Pedidos</h1>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <Icon name="svg-spinners:ring-resize" class="w-12 h-12 mx-auto text-primary-600 mb-4" />
        <p class="text-gray-600">Cargando tus pedidos...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <Icon name="heroicons:exclamation-circle" class="w-12 h-12 mx-auto text-red-600 mb-3" />
        <h3 class="text-lg font-semibold text-red-900 mb-2">Error al cargar pedidos</h3>
        <p class="text-red-700 mb-4">{{ error }}</p>
        <button @click="fetchOrders" class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
          Reintentar
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!orders || orders.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
        <Icon name="heroicons:shopping-bag" class="w-20 h-20 mx-auto text-gray-400 mb-4" />
        <h3 class="text-2xl font-bold text-gray-900 mb-2">No tienes pedidos aún</h3>
        <p class="text-gray-600 mb-6">Cuando realices una compra, aparecerá aquí</p>
        <NuxtLink to="/" class="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
          Ir a la Tienda
        </NuxtLink>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-6">
        <div 
          v-for="order in orders" 
          :key="order.id"
          class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          <!-- Order Header -->
          <div class="bg-gray-50 px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4">
            <div class="flex flex-wrap items-center gap-6">
              <div>
                <p class="text-xs text-gray-600 uppercase">Número de pedido</p>
                <p class="font-bold text-gray-900">{{ order.orderNumber }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-600 uppercase">Fecha</p>
                <p class="font-semibold text-gray-900">
                  {{ new Date(order.createdAt).toLocaleDateString('es-PE', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-600 uppercase">Total</p>
                <p class="font-bold text-red-700 text-lg">S/ {{ Number(order.total).toFixed(2) }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <!-- Status Badge -->
              <span :class="getStatusClass(order.status)" class="px-4 py-2 rounded-full text-sm font-semibold">
                {{ getStatusText(order.status) }}
              </span>
              <!-- Payment Status Badge -->
              <span :class="getPaymentStatusClass(order.paymentStatus)" class="px-4 py-2 rounded-full text-sm font-semibold">
                {{ getPaymentStatusText(order.paymentStatus) }}
              </span>
            </div>
          </div>

          <!-- Order Items -->
          <div class="p-6">
            <div class="space-y-4">
              <div 
                v-for="item in order.items" 
                :key="item.id"
                class="flex items-center gap-4 pb-4 border-b last:border-b-0"
              >
                <NuxtLink :to="`/products/${item.product.slug}`" class="flex-shrink-0">
                  <img 
                    :src="item.product.images[0]" 
                    :alt="item.product.name"
                    class="w-20 h-20 object-contain rounded-lg border"
                  />
                </NuxtLink>
                <div class="flex-1">
                  <NuxtLink :to="`/products/${item.product.slug}`" class="font-semibold text-gray-900 hover:text-primary-600 line-clamp-2">
                    {{ item.product.name }}
                  </NuxtLink>
                  <p class="text-sm text-gray-600 mt-1">
                    Cantidad: {{ item.quantity }} × S/ {{ Number(item.price).toFixed(2) }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-gray-900">S/ {{ Number(item.total).toFixed(2) }}</p>
                </div>
              </div>
            </div>

            <!-- Shipping Address -->
            <div v-if="order.address" class="mt-6 pt-6 border-t">
              <h4 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Icon name="heroicons:map-pin" class="w-5 h-5 text-gray-600" />
                Dirección de Envío
              </h4>
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="font-semibold text-gray-900">
                  {{ order.address.firstName }} {{ order.address.lastName }}
                </p>
                <p class="text-gray-700">{{ order.address.street }}</p>
                <p class="text-gray-700">
                  {{ order.address.city }}, {{ order.address.state }} {{ order.address.zipCode }}
                </p>
                <p class="text-gray-700 mt-2">
                  <Icon name="heroicons:phone" class="w-4 h-4 inline mr-1" />
                  {{ order.address.phone }}
                </p>
              </div>
            </div>

            <!-- Order Actions -->
            <div class="mt-6 pt-6 border-t flex flex-wrap gap-3">
              <NuxtLink 
                :to="`/orders/${order.id}`"
                class="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
              >
                <Icon name="heroicons:eye" class="w-5 h-5" />
                Ver Detalles
              </NuxtLink>
              <button
                v-if="order.status === 'PENDING' || order.status === 'PROCESSING'"
                @click="trackOrder(order.orderNumber)"
                class="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors inline-flex items-center gap-2"
              >
                <Icon name="heroicons:truck" class="w-5 h-5" />
                Rastrear Pedido
              </button>
              <button
                @click="reorderItems(order)"
                class="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center gap-2"
              >
                <Icon name="heroicons:arrow-path" class="w-5 h-5" />
                Volver a Comprar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
});

const config = useRuntimeConfig();
const authStore = useAuthStore();
const cartStore = useCartStore();
const notificationStore = useNotificationStore();
const router = useRouter();

const orders = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchOrders = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await $fetch(`${config.public.apiUrl}/orders/my-orders`, {
      credentials: 'include',
      headers: authStore.accessToken ? {
        Authorization: `Bearer ${authStore.accessToken}`,
      } : {},
    });

    orders.value = response as any[];
  } catch (err: any) {
    console.error('Error fetching orders:', err);
    error.value = err.data?.error || err.message || 'No se pudieron cargar los pedidos';
  } finally {
    loading.value = false;
  }
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    PENDING: 'Pendiente',
    PROCESSING: 'En Proceso',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
  };
  return texts[status] || status;
};

const getPaymentStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    PENDING: 'bg-orange-100 text-orange-800',
    PAID: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-gray-100 text-gray-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getPaymentStatusText = (status: string) => {
  const texts: Record<string, string> = {
    PENDING: 'Pago Pendiente',
    PAID: 'Pagado',
    FAILED: 'Pago Fallido',
    REFUNDED: 'Reembolsado',
  };
  return texts[status] || status;
};

const trackOrder = (orderNumber: string) => {
  notificationStore.info(
    'Rastreo de pedido',
    `Pedido ${orderNumber} está en proceso de entrega`
  );
};

const reorderItems = async (order: any) => {
  try {
    // Agregar todos los items del pedido al carrito
    for (const item of order.items) {
      await cartStore.addItem(item.product.id, item.quantity);
    }
    
    notificationStore.success(
      'Productos agregados',
      `${order.items.length} productos agregados al carrito`
    );
    
    router.push('/cart');
  } catch (err: any) {
    notificationStore.error(
      'Error',
      err.message || 'No se pudieron agregar los productos al carrito'
    );
  }
};

// Fetch orders on mount
onMounted(() => {
  fetchOrders();
});

// SEO
useHead({
  title: 'Mis Pedidos - Gaming Store',
  meta: [
    { name: 'description', content: 'Consulta el historial de tus pedidos' },
    { name: 'robots', content: 'noindex' }
  ]
});
</script>

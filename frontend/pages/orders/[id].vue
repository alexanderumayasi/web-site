<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Breadcrumb -->
    <div class="bg-white border-b">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center space-x-2 text-sm">
          <NuxtLink to="/" class="text-gray-600 hover:text-primary-600">Inicio</NuxtLink>
          <span class="text-gray-400">/</span>
          <NuxtLink to="/orders" class="text-gray-600 hover:text-primary-600">Mis Pedidos</NuxtLink>
          <span class="text-gray-400">/</span>
          <span class="text-gray-900">{{ order?.orderNumber || 'Detalle' }}</span>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <Icon name="svg-spinners:ring-resize" class="w-12 h-12 mx-auto text-primary-600 mb-4" />
        <p class="text-gray-600">Cargando detalles del pedido...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <Icon name="heroicons:exclamation-circle" class="w-12 h-12 mx-auto text-red-600 mb-3" />
        <h3 class="text-lg font-semibold text-red-900 mb-2">Error al cargar el pedido</h3>
        <p class="text-red-700 mb-4">{{ error }}</p>
        <NuxtLink to="/orders" class="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 inline-block">
          Volver a Mis Pedidos
        </NuxtLink>
      </div>

      <!-- Order Details -->
      <div v-else-if="order" class="max-w-5xl mx-auto">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Pedido {{ order.orderNumber }}</h1>
              <p class="text-gray-600 mt-1">
                Realizado el {{ new Date(order.createdAt).toLocaleDateString('es-PE', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) }}
              </p>
            </div>
            <div class="flex gap-3">
              <span :class="getStatusClass(order.status)" class="px-4 py-2 rounded-full text-sm font-semibold">
                {{ getStatusText(order.status) }}
              </span>
              <span :class="getPaymentStatusClass(order.paymentStatus)" class="px-4 py-2 rounded-full text-sm font-semibold">
                {{ getPaymentStatusText(order.paymentStatus) }}
              </span>
            </div>
          </div>

          <!-- Order Timeline -->
          <div class="border-t pt-6">
            <h3 class="font-semibold text-gray-900 mb-4">Estado del Pedido</h3>
            <div class="flex items-center justify-between relative">
              <div class="absolute top-5 left-0 right-0 h-0.5 bg-gray-300 -z-10"></div>
              
              <div class="flex flex-col items-center">
                <div :class="['w-10 h-10 rounded-full flex items-center justify-center', 
                  order.status !== 'CANCELLED' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600']">
                  <Icon name="heroicons:check" class="w-6 h-6" />
                </div>
                <span class="text-xs mt-2 font-medium">Realizado</span>
              </div>

              <div class="flex flex-col items-center">
                <div :class="['w-10 h-10 rounded-full flex items-center justify-center', 
                  ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600']">
                  <Icon name="heroicons:cog-6-tooth" class="w-6 h-6" />
                </div>
                <span class="text-xs mt-2 font-medium">Procesando</span>
              </div>

              <div class="flex flex-col items-center">
                <div :class="['w-10 h-10 rounded-full flex items-center justify-center', 
                  ['SHIPPED', 'DELIVERED'].includes(order.status) ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600']">
                  <Icon name="heroicons:truck" class="w-6 h-6" />
                </div>
                <span class="text-xs mt-2 font-medium">Enviado</span>
              </div>

              <div class="flex flex-col items-center">
                <div :class="['w-10 h-10 rounded-full flex items-center justify-center', 
                  order.status === 'DELIVERED' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600']">
                  <Icon name="heroicons:home" class="w-6 h-6" />
                </div>
                <span class="text-xs mt-2 font-medium">Entregado</span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column - Items -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Order Items -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Productos</h2>
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
                      class="w-24 h-24 object-contain rounded-lg border"
                    />
                  </NuxtLink>
                  <div class="flex-1">
                    <NuxtLink :to="`/products/${item.product.slug}`" class="font-semibold text-gray-900 hover:text-primary-600">
                      {{ item.product.name }}
                    </NuxtLink>
                    <p class="text-sm text-gray-600 mt-1">SKU: {{ item.product.sku }}</p>
                    <p class="text-sm text-gray-600">
                      Cantidad: {{ item.quantity }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-gray-900">S/ {{ Number(item.total).toFixed(2) }}</p>
                    <p class="text-sm text-gray-600">S/ {{ Number(item.price).toFixed(2) }} c/u</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Shipping Address -->
            <div v-if="order.address" class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="heroicons:map-pin" class="w-6 h-6" />
                Dirección de Envío
              </h2>
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="font-bold text-gray-900 text-lg">
                  {{ order.address.firstName }} {{ order.address.lastName }}
                </p>
                <p class="text-gray-700 mt-2">{{ order.address.street }}</p>
                <p class="text-gray-700">
                  {{ order.address.city }}, {{ order.address.state }} {{ order.address.zipCode }}
                </p>
                <p class="text-gray-700 mt-3 flex items-center gap-2">
                  <Icon name="heroicons:phone" class="w-5 h-5" />
                  {{ order.address.phone }}
                </p>
              </div>
            </div>
          </div>

          <!-- Right Column - Summary -->
          <div class="lg:col-span-1">
            <!-- Order Summary -->
            <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Resumen del Pedido</h2>
              
              <div class="space-y-3 mb-4">
                <div class="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>S/ {{ Number(order.subtotal).toFixed(2) }}</span>
                </div>
                <div v-if="order.discount > 0" class="flex justify-between text-green-700">
                  <span>Descuento</span>
                  <span>-S/ {{ Number(order.discount).toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-gray-700">
                  <span>IGV (18%)</span>
                  <span>S/ {{ Number(order.tax).toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-gray-700">
                  <span>Envío</span>
                  <span>{{ order.shipping === 0 ? 'GRATIS' : `S/ ${Number(order.shipping).toFixed(2)}` }}</span>
                </div>
              </div>

              <div class="border-t pt-4 mb-6">
                <div class="flex justify-between items-center">
                  <span class="text-lg font-bold text-gray-900">Total</span>
                  <span class="text-2xl font-bold text-red-700">S/ {{ Number(order.total).toFixed(2) }}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="space-y-3">
                <NuxtLink to="/orders" class="block w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center">
                  Volver a Mis Pedidos
                </NuxtLink>
                <button
                  @click="reorderItems"
                  class="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Volver a Comprar
                </button>
              </div>

              <!-- Notes -->
              <div v-if="order.notes" class="mt-6 pt-6 border-t">
                <h3 class="font-semibold text-gray-900 mb-2">Notas</h3>
                <p class="text-sm text-gray-700">{{ order.notes }}</p>
              </div>
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

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const authStore = useAuthStore();
const cartStore = useCartStore();
const notificationStore = useNotificationStore();

const order = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchOrderDetails = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await $fetch(`${config.public.apiUrl}/orders/${route.params.id}`, {
      credentials: 'include',
      headers: authStore.accessToken ? {
        Authorization: `Bearer ${authStore.accessToken}`,
      } : {},
    });

    order.value = response;
  } catch (err: any) {
    console.error('Error fetching order:', err);
    error.value = err.data?.error || err.message || 'No se pudo cargar el pedido';
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

const reorderItems = async () => {
  if (!order.value) return;

  try {
    for (const item of order.value.items) {
      await cartStore.addItem(item.product.id, item.quantity);
    }
    
    notificationStore.success(
      'Productos agregados',
      `${order.value.items.length} productos agregados al carrito`
    );
    
    router.push('/cart');
  } catch (err: any) {
    notificationStore.error(
      'Error',
      err.message || 'No se pudieron agregar los productos al carrito'
    );
  }
};

// Fetch order on mount
onMounted(() => {
  fetchOrderDetails();
});

// SEO
useHead({
  title: `Pedido ${order.value?.orderNumber || ''} - Gaming Store`,
  meta: [
    { name: 'robots', content: 'noindex' }
  ]
});
</script>

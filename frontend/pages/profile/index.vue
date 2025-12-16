<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Mi Cuenta</h1>
        <p class="text-gray-600 mt-2">Gestiona tu información y revisa tus pedidos</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <!-- Usuario Info -->
            <div class="text-center mb-6 pb-6 border-b">
              <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900">{{ authStore.user?.name || 'Usuario' }}</h3>
              <p class="text-sm text-gray-600">{{ authStore.user?.email }}</p>
            </div>

            <!-- Menu -->
            <nav class="space-y-2">
              <button
                @click="activeTab = 'orders'"
                :class="[
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left',
                  activeTab === 'orders' ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Mis Pedidos
              </button>

              <button
                @click="activeTab = 'profile'"
                :class="[
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left',
                  activeTab === 'profile' ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mi Perfil
              </button>

              <button
                @click="activeTab = 'addresses'"
                :class="[
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left',
                  activeTab === 'addresses' ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                ]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Direcciones
              </button>

              <button
                @click="handleLogout"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left text-red-600 hover:bg-red-50"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar Sesión
              </button>
            </nav>
          </div>
        </div>

        <!-- Contenido Principal -->
        <div class="lg:col-span-3">
          <!-- Historial de Pedidos -->
          <div v-if="activeTab === 'orders'" class="space-y-6">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Historial de Pedidos</h2>
                <button @click="loadOrders" class="text-primary-600 hover:text-primary-700 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Actualizar
                </button>
              </div>

              <!-- Loading -->
              <div v-if="loading" class="text-center py-12">
                <svg class="animate-spin h-10 w-10 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="text-gray-600">Cargando pedidos...</p>
              </div>

              <!-- Sin pedidos -->
              <div v-else-if="orders.length === 0" class="text-center py-12">
                <svg class="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">No tienes pedidos aún</h3>
                <p class="text-gray-600 mb-6">Comienza a comprar y aquí aparecerán tus pedidos</p>
                <NuxtLink to="/products" class="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Ir a la Tienda
                </NuxtLink>
              </div>

              <!-- Lista de pedidos -->
              <div v-else class="space-y-4">
                <div
                  v-for="order in orders"
                  :key="order.id"
                  class="border border-gray-200 rounded-lg p-6 hover:border-primary-300 transition-colors cursor-pointer"
                  @click="selectOrder(order)"
                >
                  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <div class="flex items-center gap-3 mb-2">
                        <span class="font-mono font-semibold text-gray-900">{{ order.orderNumber }}</span>
                        <span :class="getStatusBadgeClass(order.status)">
                          {{ getStatusText(order.status) }}
                        </span>
                      </div>
                      <p class="text-sm text-gray-600">
                        <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {{ formatDate(order.createdAt) }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm text-gray-600 mb-1">Total</p>
                      <p class="text-2xl font-bold text-primary-600">S/ {{ order.total.toFixed(2) }}</p>
                    </div>
                  </div>

                  <!-- Mini preview de productos -->
                  <div class="flex items-center gap-3 flex-wrap">
                    <div class="flex items-center -space-x-2">
                      <img
                        v-for="(item, idx) in order.items.slice(0, 3)"
                        :key="idx"
                        :src="item.product?.images?.[0]"
                        :alt="item.product?.name"
                        class="w-12 h-12 rounded-lg object-cover border-2 border-white"
                      />
                    </div>
                    <span class="text-sm text-gray-600">
                      {{ order.items.length }} producto{{ order.items.length !== 1 ? 's' : '' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Perfil -->
          <div v-if="activeTab === 'profile'" class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Información Personal</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input type="text" :value="authStore.user?.name" disabled class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" :value="authStore.user?.email" disabled class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50" />
              </div>
              <div class="pt-4">
                <p class="text-sm text-gray-600">Para actualizar tu información de perfil, contacta con soporte.</p>
              </div>
            </div>
          </div>

          <!-- Direcciones -->
          <div v-if="activeTab === 'addresses'" class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Mis Direcciones</h2>
            <p class="text-gray-600">Las direcciones se guardarán automáticamente cuando realices un pedido.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalles del pedido -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedOrder" class="fixed inset-0 bg-gray-400 bg-opacity-80 flex items-center justify-center z-50 p-4" @click.self="selectedOrder = null">
          <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="bg-gradient-to-r from-primary-600 to-blue-600 p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-bold mb-2">Pedido {{ selectedOrder.orderNumber }}</h2>
                  <p class="text-blue-100 text-sm">{{ formatDate(selectedOrder.createdAt) }}</p>
                </div>
                <button @click="selectedOrder = null" class="text-white hover:text-gray-200">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="p-6 space-y-6">
              <!-- Estado -->
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p class="text-sm text-gray-600 mb-1">Estado del Pedido</p>
                  <span :class="getStatusBadgeClass(selectedOrder.status)">
                    {{ getStatusText(selectedOrder.status) }}
                  </span>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-600 mb-1">Total Pagado</p>
                  <p class="text-2xl font-bold text-primary-600">S/ {{ selectedOrder.total.toFixed(2) }}</p>
                </div>
              </div>

              <!-- Productos -->
              <div>
                <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Productos
                </h3>
                <div class="space-y-3">
                  <div v-for="item in selectedOrder.items" :key="item.id" class="flex items-center gap-4 border border-gray-200 rounded-lg p-4">
                    <img :src="item.product?.images?.[0]" :alt="item.product?.name" class="w-20 h-20 object-cover rounded-lg" />
                    <div class="flex-1">
                      <p class="font-semibold text-gray-900">{{ item.product?.name }}</p>
                      <p class="text-sm text-gray-600">Cantidad: {{ item.quantity }}</p>
                      <p class="text-sm text-gray-600">Precio: S/ {{ item.price.toFixed(2) }}</p>
                    </div>
                    <div class="text-right">
                      <p class="font-bold text-gray-900">S/ {{ (item.price * item.quantity).toFixed(2) }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Resumen -->
              <div class="border-t pt-4">
                <div class="space-y-2">
                  <div class="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>S/ {{ selectedOrder.subtotal.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span>{{ selectedOrder.shipping > 0 ? 'S/ ' + selectedOrder.shipping.toFixed(2) : 'GRATIS' }}</span>
                  </div>
                  <div class="flex justify-between text-gray-600">
                    <span>IGV (18%)</span>
                    <span>S/ {{ selectedOrder.tax.toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                    <span>Total</span>
                    <span class="text-primary-600">S/ {{ selectedOrder.total.toFixed(2) }}</span>
                  </div>
                </div>
              </div>

              <!-- Dirección -->
              <div v-if="selectedOrder.address" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 class="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Dirección de Envío
                </h4>
                <div class="text-sm text-gray-700 space-y-1">
                  <p class="font-semibold">{{ selectedOrder.address.firstName }} {{ selectedOrder.address.lastName }}</p>
                  <p>{{ selectedOrder.address.street }}</p>
                  <p>{{ selectedOrder.address.city }}, {{ selectedOrder.address.state }} {{ selectedOrder.address.zipCode }}</p>
                  <p>Tel: {{ selectedOrder.address.phone }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
});

const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const router = useRouter();
const config = useRuntimeConfig();

const activeTab = ref('orders');
const loading = ref(false);
const orders = ref<any[]>([]);
const selectedOrder = ref<any>(null);

const loadOrders = async () => {
  loading.value = true;
  try {
    const response = await $fetch(`${config.public.apiUrl}/orders/my-orders`, {
      credentials: 'include',
      headers: authStore.accessToken ? {
        Authorization: `Bearer ${authStore.accessToken}`,
      } : {},
    });
    orders.value = response;
  } catch (error: any) {
    console.error('Error cargando pedidos:', error);
    notificationStore.error('No se pudieron cargar los pedidos');
  } finally {
    loading.value = false;
  }
};

const selectOrder = async (order: any) => {
  try {
    const detailed = await $fetch(`${config.public.apiUrl}/orders/${order.id}`, {
      credentials: 'include',
      headers: authStore.accessToken ? {
        Authorization: `Bearer ${authStore.accessToken}`,
      } : {},
    });
    selectedOrder.value = detailed;
  } catch (error) {
    notificationStore.error('No se pudo cargar el detalle del pedido');
  }
};

const handleLogout = async () => {
  await authStore.logout();
  notificationStore.success('Sesión cerrada exitosamente');
  router.push('/');
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    PENDING: 'Pendiente',
    PROCESSING: 'Procesando',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
    REFUNDED: 'Reembolsado',
  };
  return map[status] || status;
};

const getStatusBadgeClass = (status: string) => {
  const baseClass = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold';
  const map: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-gray-100 text-gray-800',
  };
  return `${baseClass} ${map[status] || 'bg-gray-100 text-gray-800'}`;
};

onMounted(() => {
  loadOrders();
});

useHead({
  title: 'Mi Cuenta - Gaming Store',
  meta: [
    { name: 'description', content: 'Gestiona tu cuenta y revisa tu historial de pedidos' },
  ],
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>

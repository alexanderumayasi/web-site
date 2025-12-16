<template>
  <div class="space-y-8">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <!-- Ventas Totales -->
      <div class="admin-card group hover:shadow-xl transition-all duration-300">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-500 mb-1">Ventas Totales</p>
            <h3 class="text-3xl font-bold text-gray-900 mb-2">S/ {{ stats.totalRevenue.toFixed(2) }}</h3>
            <div class="flex items-center space-x-2">
              <span class="flex items-center text-sm font-semibold text-green-600">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                +12%
              </span>
              <span class="text-sm text-gray-500">vs mes anterior</span>
            </div>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Pedidos -->
      <div class="admin-card group hover:shadow-xl transition-all duration-300">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-500 mb-1">Pedidos</p>
            <h3 class="text-3xl font-bold text-gray-900 mb-2">{{ stats.totalOrders }}</h3>
            <div class="flex items-center space-x-2">
              <span class="flex items-center text-sm font-semibold text-blue-600">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                +8%
              </span>
              <span class="text-sm text-gray-500">vs mes anterior</span>
            </div>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Clientes -->
      <div class="admin-card group hover:shadow-xl transition-all duration-300">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-500 mb-1">Clientes</p>
            <h3 class="text-3xl font-bold text-gray-900 mb-2">{{ stats.totalCustomers }}</h3>
            <div class="flex items-center space-x-2">
              <span class="flex items-center text-sm font-semibold text-purple-600">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {{ stats.totalCustomers }}
              </span>
              <span class="text-sm text-gray-500">registrados</span>
            </div>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Productos -->
      <div class="admin-card group hover:shadow-xl transition-all duration-300">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-500 mb-1">Productos</p>
            <h3 class="text-3xl font-bold text-gray-900 mb-2">{{ stats.totalProducts }}</h3>
            <div class="flex items-center space-x-2">
              <span class="flex items-center text-sm font-semibold text-orange-600">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Activos
              </span>
              <span class="text-sm text-gray-500">en tienda</span>
            </div>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Sales Chart -->
      <div class="admin-card">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-bold text-gray-900">Ventas Mensuales</h3>
            <p class="text-sm text-gray-500 mt-1">Últimos 30 días</p>
          </div>
          <div class="flex items-center space-x-2">
            <button 
              @click="chartType = 'line'"
              :class="[
                'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
                chartType === 'line' 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
              ]"
            >
              Línea
            </button>
            <button 
              @click="chartType = 'bar'"
              :class="[
                'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
                chartType === 'bar' 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
              ]"
            >
              Barras
            </button>
          </div>
        </div>
        <div class="h-64">
          <SalesChart v-if="salesChartData.length > 0" :data="salesChartData" :type="chartType" />
          <div v-else class="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <div class="text-center">
              <svg class="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p class="text-gray-500 font-medium">Sin datos de ventas</p>
              <p class="text-sm text-gray-400 mt-1">Los datos aparecerán cuando haya ventas</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Products -->
      <div class="admin-card">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-bold text-gray-900">Productos Más Vendidos</h3>
            <p class="text-sm text-gray-500 mt-1">Top 5 del mes</p>
          </div>
          <button class="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
            Ver todos
          </button>
        </div>
        <div class="space-y-4">
          <div
            v-for="(product, index) in topProducts"
            :key="product.id"
            class="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
          >
            <div class="flex-shrink-0 relative">
              <img :src="product.images[0]" :alt="product.name" class="w-16 h-16 object-cover rounded-lg shadow-md" />
              <span class="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                {{ index + 1 }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-gray-900 truncate">{{ product.name }}</h4>
              <p class="text-sm text-gray-500 mt-1">{{ product.totalSold }} unidades vendidas</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-lg text-indigo-600">S/ {{ product.revenue }}</p>
              <p class="text-xs text-gray-500 mt-1">en ventas</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="admin-card">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-bold text-gray-900">Pedidos Recientes</h3>
          <p class="text-sm text-gray-500 mt-1">Últimos pedidos realizados</p>
        </div>
        <NuxtLink to="/admin/orders" class="flex items-center space-x-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors group">
          <span>Ver todos los pedidos</span>
          <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-4 px-4 text-sm font-semibold text-gray-600">Orden</th>
              <th class="text-left py-4 px-4 text-sm font-semibold text-gray-600">Cliente</th>
              <th class="text-left py-4 px-4 text-sm font-semibold text-gray-600">Total</th>
              <th class="text-left py-4 px-4 text-sm font-semibold text-gray-600">Estado</th>
              <th class="text-left py-4 px-4 text-sm font-semibold text-gray-600">Fecha</th>
              <th class="text-right py-4 px-4 text-sm font-semibold text-gray-600">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="order in recentOrders"
              :key="order.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="py-4 px-4">
                <span class="font-mono text-sm font-semibold text-gray-900">{{ order.orderNumber }}</span>
              </td>
              <td class="py-4 px-4">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {{ order.user.firstName.charAt(0) }}
                  </div>
                  <span class="font-medium text-gray-900">{{ order.user.firstName }} {{ order.user.lastName }}</span>
                </div>
              </td>
              <td class="py-4 px-4">
                <span class="font-bold text-gray-900">S/ {{ order.total }}</span>
              </td>
              <td class="py-4 px-4">
                <span :class="getStatusClass(order.status)" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold">
                  {{ getStatusText(order.status) }}
                </span>
              </td>
              <td class="py-4 px-4">
                <span class="text-sm text-gray-600">{{ formatDate(order.createdAt) }}</span>
              </td>
              <td class="py-4 px-4 text-right">
                <button class="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors">
                  Ver detalles
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
});

const config = useRuntimeConfig();
const authStore = useAuthStore();

const stats = ref({
  totalRevenue: 0,
  totalOrders: 0,
  totalCustomers: 0,
  totalProducts: 0,
});

const recentOrders = ref([]);
const topProducts = ref([]);
const salesChartData = ref([]);
const isLoading = ref(true);
const chartType = ref<'line' | 'bar'>('line');

onMounted(async () => {
  try {
    const response = await $fetch(`${config.public.apiUrl}/analytics/dashboard`, {
      credentials: 'include',
      headers: authStore.accessToken ? {
        Authorization: `Bearer ${authStore.accessToken}`,
      } : {},
    });

    stats.value = response.summary;
    recentOrders.value = response.recentOrders;
    topProducts.value = response.topProducts;
    salesChartData.value = response.salesChartData || [];
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
  } finally {
    isLoading.value = false;
  }
});

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    PROCESSING: 'bg-blue-100 text-blue-700 border border-blue-200',
    SHIPPED: 'bg-purple-100 text-purple-700 border border-purple-200',
    DELIVERED: 'bg-green-100 text-green-700 border border-green-200',
    CANCELLED: 'bg-red-100 text-red-700 border border-red-200',
  };
  return classes[status] || '';
};

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    PENDING: 'Pendiente',
    PROCESSING: 'Procesando',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
  };
  return texts[status] || status;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

useHead({
  title: 'Dashboard - Admin',
});
</script>

<style scoped>
.admin-card {
  @apply bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300;
}
</style>

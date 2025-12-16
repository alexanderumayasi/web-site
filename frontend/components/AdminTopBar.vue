<template>
  <div class="bg-white border-b border-gray-200 px-8 py-4 admin-topbar shadow-sm">
    <div class="flex items-center justify-between">
      <!-- Left Section: Breadcrumb & Title -->
      <div class="flex items-center space-x-6">
        <button 
          @click="$emit('toggleSidebar')"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
        >
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
          <p class="text-sm text-gray-500 mt-1">{{ pageSubtitle }}</p>
        </div>
      </div>
      
      <!-- Right Section: Actions & Profile -->
      <div class="flex items-center space-x-4">
        <!-- Search -->
        <div class="hidden md:block relative">
          <input 
            type="text"
            placeholder="Buscar..."
            class="w-64 px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
          />
          <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Notifications -->
        <button class="relative p-2 hover:bg-gray-100 rounded-xl transition-colors group">
          <svg class="w-6 h-6 text-gray-600 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <!-- Quick Actions -->
        <button class="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nuevo</span>
        </button>

        <!-- User Menu -->
        <div class="relative">
          <button class="flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 rounded-xl transition-colors group">
            <div class="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
              {{ authStore.fullName?.charAt(0).toUpperCase() || 'A' }}
            </div>
            <div class="hidden lg:block text-left">
              <p class="text-sm font-semibold text-gray-900">{{ authStore.fullName || 'Admin' }}</p>
              <p class="text-xs text-gray-500">Administrador</p>
            </div>
            <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const route = useRoute();

const pageTitle = computed(() => {
  const path = route.path;
  if (path === '/admin') return 'Dashboard';
  if (path.includes('/products')) return 'Gestión de Productos';
  if (path.includes('/orders')) return 'Gestión de Pedidos';
  if (path.includes('/categories')) return 'Categorías';
  if (path.includes('/coupons')) return 'Cupones y Descuentos';
  if (path.includes('/users')) return 'Usuarios';
  return 'Panel de Administración';
});

const pageSubtitle = computed(() => {
  const path = route.path;
  if (path === '/admin') return 'Resumen general de tu tienda';
  if (path.includes('/products')) return 'Administra tu catálogo de productos';
  if (path.includes('/orders')) return 'Gestiona y procesa pedidos';
  if (path.includes('/categories')) return 'Organiza tus productos por categorías';
  if (path.includes('/coupons')) return 'Crea y gestiona códigos de descuento';
  if (path.includes('/users')) return 'Administra usuarios y permisos';
  return '';
});

defineEmits(['toggleSidebar']);
</script>

<style scoped>
.admin-topbar {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.95);
}
</style>

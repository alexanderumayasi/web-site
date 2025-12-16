<template>
  <div 
    :class="[
      'bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-lg',
      collapsed ? 'w-20' : 'w-72'
    ]"
  >
    <!-- Logo -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div v-if="!collapsed" class="flex flex-col">
            <h2 class="text-xl font-bold text-gray-900">GameStore</h2>
            <span class="text-xs text-gray-500 font-medium">Admin Panel</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      <div v-if="!collapsed" class="px-4 mb-4">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Principal</p>
      </div>

      <NuxtLink to="/admin" class="sidebar-link group">
        <div class="flex items-center space-x-3 flex-1">
          <div class="sidebar-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
            </svg>
          </div>
          <span v-if="!collapsed" class="font-medium">Dashboard</span>
        </div>
      </NuxtLink>

      <NuxtLink to="/admin/products" class="sidebar-link group">
        <div class="flex items-center space-x-3 flex-1">
          <div class="sidebar-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span v-if="!collapsed" class="font-medium">Productos</span>
        </div>
        <span v-if="!collapsed" class="sidebar-badge">245</span>
      </NuxtLink>

      <NuxtLink to="/admin/orders" class="sidebar-link group">
        <div class="flex items-center space-x-3 flex-1">
          <div class="sidebar-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span v-if="!collapsed" class="font-medium">Pedidos</span>
        </div>
        <span v-if="!collapsed" class="sidebar-badge bg-red-100 text-red-600">12</span>
      </NuxtLink>

      <NuxtLink to="/admin/categories" class="sidebar-link group">
        <div class="flex items-center space-x-3 flex-1">
          <div class="sidebar-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <span v-if="!collapsed" class="font-medium">Categorías</span>
        </div>
      </NuxtLink>

      <NuxtLink to="/admin/coupons" class="sidebar-link group">
        <div class="flex items-center space-x-3 flex-1">
          <div class="sidebar-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <span v-if="!collapsed" class="font-medium">Cupones</span>
        </div>
      </NuxtLink>

      <NuxtLink to="/admin/users" class="sidebar-link group">
        <div class="flex items-center space-x-3 flex-1">
          <div class="sidebar-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <span v-if="!collapsed" class="font-medium">Usuarios</span>
        </div>
      </NuxtLink>

      <div v-if="!collapsed" class="px-4 mt-8 mb-4">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Configuración</p>
      </div>

      <NuxtLink to="/" class="sidebar-link group">
        <div class="flex items-center space-x-3 flex-1">
          <div class="sidebar-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <span v-if="!collapsed" class="font-medium">Ir a Tienda</span>
        </div>
      </NuxtLink>
    </nav>

    <!-- User Profile -->
    <div class="p-4 border-t border-gray-200">
      <div v-if="!collapsed" class="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50">
        <div class="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
          A
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-900 truncate">Admin User</p>
          <p class="text-xs text-gray-500 truncate">admin@gamestore.com</p>
        </div>
      </div>
      <div v-else class="flex justify-center">
        <div class="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
          A
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  collapsed?: boolean;
}

defineProps<Props>();
</script>

<style scoped>
.sidebar-link {
  @apply flex items-center justify-between px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 transition-all duration-200 relative;
}

.sidebar-link.router-link-active {
  @apply bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg;
}

.sidebar-link.router-link-active::before {
  content: '';
  @apply absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full;
}

.sidebar-link.router-link-active .sidebar-icon {
  @apply text-white;
}

.sidebar-icon {
  @apply transition-transform duration-200;
}

.sidebar-link:hover .sidebar-icon {
  @apply scale-110;
}

.sidebar-badge {
  @apply px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full;
}

.sidebar-link.router-link-active .sidebar-badge {
  @apply bg-white bg-opacity-20 text-white;
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  @apply bg-transparent;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}
</style>

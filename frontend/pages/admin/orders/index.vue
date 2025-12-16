<template>
  <div class="space-y-6">
    <!-- Header con estadísticas -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
        <p class="text-gray-600 text-sm mt-1">Controla y gestiona todos los pedidos de la tienda</p>
      </div>
      <button @click="loadOrders" class="btn-primary flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Actualizar
      </button>
    </div>

    <!-- Estadísticas generales -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="card-stat bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-900 text-sm">Total Pedidos</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ orders.length }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card-stat bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500/30">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-900 text-sm">Pendientes</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ ordersByStatus('PENDING') }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card-stat bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-900 text-sm">Completados</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ ordersByStatus('DELIVERED') }}</p>
          </div>
          <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card-stat bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-900 text-sm">Total Ventas</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">S/ {{ totalSales.toFixed(2) }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros mejorados -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            v-model="search" 
            type="text" 
            placeholder="Buscar pedido..." 
            class="input pl-10" 
          />
        </div>
        
        <select v-model="statusFilter" class="input">
          <option value="all">📦 Todos los estados</option>
          <option v-for="status in orderStatuses" :key="status" :value="status">
            {{ statusIcon(status) }} {{ translateStatus(status) }}
          </option>
        </select>
        
        <select v-model="paymentFilter" class="input">
          <option value="all">💳 Todos los pagos</option>
          <option v-for="status in paymentStatuses" :key="status" :value="status">
            {{ paymentIcon(status) }} {{ translatePaymentStatus(status) }}
          </option>
        </select>

        <select v-model="sortBy" class="input" @change="sortOrders">
          <option value="date-desc">🕒 Más recientes</option>
          <option value="date-asc">🕒 Más antiguos</option>
          <option value="total-desc">💰 Mayor valor</option>
          <option value="total-asc">💰 Menor valor</option>
        </select>
      </div>
      
      <div v-if="filteredOrders.length > 0" class="mt-4 text-sm text-gray-600">
        Mostrando <span class="text-gray-900 font-semibold">{{ filteredOrders.length }}</span> de <span class="text-gray-900 font-semibold">{{ orders.length }}</span> pedidos
      </div>
    </div>

    <!-- Lista de pedidos mejorada -->
    <div v-if="isLoading" class="card">
      <div class="flex items-center justify-center py-12">
        <div class="text-center">
          <svg class="animate-spin h-12 w-12 text-primary-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-400">Cargando pedidos...</p>
        </div>
      </div>
    </div>

    <div v-else-if="!filteredOrders.length" class="card">
      <div class="text-center py-12">
        <svg class="w-20 h-20 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No hay pedidos</h3>
        <p class="text-gray-600">No se encontraron pedidos que coincidan con los filtros</p>
      </div>
    </div>

    <!-- Cards de pedidos -->
    <div v-else class="grid grid-cols-1 gap-4">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="card-order hover:border-primary-500/50 transition-all cursor-pointer"
        @click="openOrder(order)"
      >
        <div class="flex flex-col lg:flex-row lg:items-center gap-4">
          <!-- Información principal -->
          <div class="flex-1 space-y-3">
            <div class="flex items-start justify-between gap-4">
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-lg font-bold text-gray-900 font-mono">{{ order.orderNumber }}</span>
                  <span :class="statusBadge(order.status)">
                    {{ statusIcon(order.status) }} {{ translateStatus(order.status) }}
                  </span>
                  <span :class="paymentBadge(order.paymentStatus)">
                    {{ paymentIcon(order.paymentStatus) }} {{ translatePaymentStatus(order.paymentStatus) }}
                  </span>
                </div>
                
                <div class="flex items-center gap-4 text-sm text-gray-600">
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {{ order.user?.firstName }} {{ order.user?.lastName }}
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {{ order.user?.email }}
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ formatDate(order.createdAt) }}
                  </span>
                </div>
              </div>

              <div class="text-right">
                <p class="text-sm text-gray-400 mb-1">Total</p>
                <p class="text-3xl font-bold text-primary-400">S/ {{ formatCurrency(order.total) }}</p>
              </div>
            </div>

            <!-- Productos resumidos -->
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-sm text-gray-600">Productos:</span>
              <div class="flex items-center gap-2">
                <img
                  v-for="(item, idx) in order.items.slice(0, 3)"
                  :key="idx"
                  :src="item.product?.images?.[0]"
                  :alt="item.product?.name"
                  class="w-10 h-10 object-cover rounded border-2 border-gray-700"
                  :title="item.product?.name"
                />
                <span v-if="order.items.length > 3" class="text-sm text-gray-600 font-semibold">
                  +{{ order.items.length - 3 }} más
                </span>
              </div>
              <span class="text-sm text-gray-500">
                ({{ order.items.reduce((sum, item) => sum + item.quantity, 0) }} items)
              </span>
            </div>

            <!-- Dirección de envío -->
            <div v-if="order.address" class="flex items-start gap-2 text-sm text-gray-600">
              <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{{ order.address.city }}, {{ order.address.state }}</span>
            </div>
          </div>

          <!-- Botón de acción -->
          <div class="lg:border-l lg:border-gray-700 lg:pl-6">
            <button class="btn-view-details">
              Ver Detalles
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="feedback.message" :class="feedback.type === 'success' ? 'alert-success' : 'alert-error'">
      {{ feedback.message }}
    </div>

    <!-- Modal de detalles mejorado -->
    <div v-if="selectedOrder" class="modal-backdrop" @click.self="closeOrder">
      <div class="modal max-w-6xl">
        <!-- Header del modal -->
        <div class="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h2 class="text-2xl font-bold text-gray-900">Pedido {{ selectedOrder.orderNumber }}</h2>
              <span :class="statusBadge(selectedOrder.status)">
                {{ statusIcon(selectedOrder.status) }} {{ translateStatus(selectedOrder.status) }}
              </span>
            </div>
            <p class="text-gray-600 text-sm flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Creado el {{ formatDate(selectedOrder.createdAt) }}
            </p>
          </div>
          <button class="btn-tertiary flex items-center gap-2" @click="closeOrder">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cerrar
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Columna principal -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Información del cliente -->
            <div class="card bg-gradient-to-br from-gray-600 to-gray-700 border-gray-500">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-white">Ínformación del Cliente</h3>
              </div>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-300 mb-1">Nombre</p>
                  <p class="text-white font-semibold">{{ selectedOrder.user?.firstName }} {{ selectedOrder.user?.lastName }}</p>
                </div>
                <div>
                  <p class="text-gray-300 mb-1">Email</p>
                  <p class="text-white font-semibold">{{ selectedOrder.user?.email }}</p>
                </div>
              </div>
            </div>

            <!-- Productos -->
            <div class="card bg-gradient-to-br from-gray-600 to-gray-700 border-gray-500">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-purple-500/30 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-white">Productos ({{ selectedOrder.items.length }})</h3>
              </div>
              
              <div class="space-y-3">
                <div
                  v-for="item in selectedOrder.items"
                  :key="item.id"
                  class="flex items-center gap-4 bg-gray-700 border border-gray-600 rounded-lg p-4 hover:border-primary-500/30 transition-colors"
                >
                  <img
                    v-if="item.product?.images?.length"
                    :src="item.product.images[0]"
                    :alt="item.product?.name"
                    class="w-20 h-20 object-cover rounded-lg border-2 border-gray-700"
                  />
                  <div class="flex-1">
                    <p class="font-semibold text-white mb-1">{{ item.product?.name }}</p>
                    <div class="flex items-center gap-4 text-xs text-gray-300">
                      <span class="flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        SKU: {{ item.product?.sku }}
                      </span>
                      <span class="flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Cantidad: {{ item.quantity }}
                      </span>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-xs text-gray-300 mb-1">Precio unitario</p>
                    <p class="font-semibold text-white">S/ {{ formatCurrency(item.price) }}</p>
                    <p class="text-xs text-primary-300 font-semibold mt-1">Total: S/ {{ formatCurrency(item.total) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Dirección de envío -->
            <div class="card bg-gradient-to-br from-gray-600 to-gray-700 border-gray-500">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-green-500/30 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-white">Dirección de Envío</h3>
              </div>
              <div class="text-sm text-white space-y-2 bg-gray-700 rounded-lg p-4">
                <p class="font-semibold text-white">{{ selectedOrder.address?.firstName }} {{ selectedOrder.address?.lastName }}</p>
                <p>{{ selectedOrder.address?.street }}</p>
                <p>{{ selectedOrder.address?.city }}, {{ selectedOrder.address?.state }} {{ selectedOrder.address?.zipCode }}</p>
                <p class="flex items-center gap-2 text-primary-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {{ selectedOrder.address?.phone }}
                </p>
              </div>
            </div>
          </div>

          <!-- Columna lateral -->
          <div class="space-y-6">
            <!-- Resumen financiero -->
            <div class="card bg-gradient-to-br from-gray-600 to-gray-700 border-gray-500">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-yellow-500/30 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-white">Resumen</h3>
              </div>
              
              <div class="space-y-3 text-sm">
                <div class="flex justify-between py-2 border-b border-gray-600">
                  <span class="text-gray-300">Subtotal</span>
                  <span class="text-white font-semibold">S/ {{ formatCurrency(selectedOrder.subtotal) }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-600">
                  <span class="text-gray-300">Descuento</span>
                  <span class="text-green-300 font-semibold">- S/ {{ formatCurrency(selectedOrder.discount) }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-600">
                  <span class="text-gray-300">IGV (18%)</span>
                  <span class="text-white font-semibold">S/ {{ formatCurrency(selectedOrder.tax) }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-600">
                  <span class="text-gray-300">Envío</span>
                  <span class="text-white font-semibold">
                    {{ selectedOrder.shipping > 0 ? 'S/ ' + formatCurrency(selectedOrder.shipping) : 'GRATIS' }}
                  </span>
                </div>
                <div class="flex justify-between py-3 bg-gray-800 rounded-lg px-3 mt-3">
                  <span class="text-white font-bold text-lg">Total</span>
                  <span class="text-primary-300 font-bold text-2xl">S/ {{ formatCurrency(selectedOrder.total) }}</span>
                </div>
              </div>
            </div>

            <!-- Estado del pedido -->
            <div class="card bg-gradient-to-br from-gray-600 to-gray-700 border-gray-500">
              <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualizar Estado
              </h3>
              
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-gray-300 mb-2">Estado del pedido</label>
                  <select v-model="orderStatus" class="input bg-gray-700 text-white border-gray-600">
                    <option v-for="status in orderStatuses" :key="status" :value="status">
                      {{ statusIcon(status) }} {{ translateStatus(status) }}
                    </option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm text-gray-300 mb-2">Estado del pago</label>
                  <div class="flex items-center gap-2">
                    <span :class="paymentBadge(selectedOrder.paymentStatus)">
                      {{ paymentIcon(selectedOrder.paymentStatus) }} {{ translatePaymentStatus(selectedOrder.paymentStatus) }}
                    </span>
                  </div>
                </div>

                <button 
                  class="btn-primary w-full flex items-center justify-center gap-2" 
                  :disabled="statusLoading || orderStatus === selectedOrder.status" 
                  @click="updateStatus"
                >
                  <svg v-if="statusLoading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ statusLoading ? 'Actualizando...' : 'Actualizar Estado' }}
                </button>
              </div>
            </div>

            <!-- Información adicional -->
            <div class="card bg-gradient-to-br from-gray-600 to-gray-700 border-gray-500">
              <h3 class="text-sm font-semibold text-gray-200 mb-3">Información Adicional</h3>
              <div class="space-y-2 text-xs text-gray-300">
                <div class="flex justify-between">
                  <span>Actualizado:</span>
                  <span class="text-white">{{ formatDate(selectedOrder.updatedAt) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>ID del pedido:</span>
                  <span class="text-white font-mono">{{ selectedOrder.id.substring(0, 8) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted, watch } from 'vue';
import { definePageMeta, useHead, useRuntimeConfig } from '#imports';
import { useAuthStore } from '../../../stores/auth';

definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
});

useHead({
  title: 'Pedidos | Admin',
});

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  total: number;
  product?: {
    id: string;
    name: string;
    sku: string;
    images: string[];
  } | null;
}

interface OrderAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

interface OrderUser {
  firstName: string;
  lastName: string;
  email: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  user?: OrderUser | null;
  address?: OrderAddress | null;
  items: OrderItem[];
}

const config = useRuntimeConfig();
const authStore = useAuthStore();

const orders = ref<Order[]>([]);
const isLoading = ref(false);
const statusLoading = ref(false);
const search = ref('');
const statusFilter = ref<'all' | string>('all');
const paymentFilter = ref<'all' | string>('all');
const sortBy = ref('date-desc');
const selectedOrder = ref<Order | null>(null);
const orderStatus = ref('');
const feedback = reactive({ message: '', type: 'success' as 'success' | 'error' });

const orderStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
const paymentStatuses = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'];

const authHeaders = computed((): Record<string, string> => {
  const headers: Record<string, string> = {};
  if (authStore.accessToken) {
    headers.Authorization = `Bearer ${authStore.accessToken}`;
  }
  return headers;
});

// Estadísticas
const ordersByStatus = (status: string) => {
  return orders.value.filter(order => order.status === status).length;
};

const totalSales = computed(() => {
  return orders.value
    .filter(order => order.paymentStatus === 'COMPLETED')
    .reduce((sum, order) => sum + order.total, 0);
});

const filteredOrders = computed(() => {
  let filtered = orders.value.filter((order) => {
    const matchesStatus = statusFilter.value === 'all' || order.status === statusFilter.value;
    const matchesPayment = paymentFilter.value === 'all' || order.paymentStatus === paymentFilter.value;
    const term = search.value.trim().toLowerCase();
    const matchesSearch = !term ||
      order.orderNumber.toLowerCase().includes(term) ||
      order.user?.email.toLowerCase().includes(term || '') ||
      `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.toLowerCase().includes(term);
    return matchesStatus && matchesPayment && matchesSearch;
  });

  // Ordenar
  return filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'date-desc':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'date-asc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'total-desc':
        return b.total - a.total;
      case 'total-asc':
        return a.total - b.total;
      default:
        return 0;
    }
  });
});

// Funciones de traducción y formateo
const translateStatus = (status: string) => {
  const translations: Record<string, string> = {
    PENDING: 'Pendiente',
    PROCESSING: 'Procesando',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
    REFUNDED: 'Reembolsado',
  };
  return translations[status] || status;
};

const translatePaymentStatus = (status: string) => {
  const translations: Record<string, string> = {
    PENDING: 'Pendiente',
    COMPLETED: 'Completado',
    FAILED: 'Fallido',
    REFUNDED: 'Reembolsado',
  };
  return translations[status] || status;
};

const statusIcon = (status: string) => {
  const icons: Record<string, string> = {
    PENDING: '⏳',
    PROCESSING: '⚙️',
    SHIPPED: '🚚',
    DELIVERED: '✅',
    CANCELLED: '❌',
    REFUNDED: '💰',
  };
  return icons[status] || '📦';
};

const paymentIcon = (status: string) => {
  const icons: Record<string, string> = {
    PENDING: '⏳',
    COMPLETED: '✅',
    FAILED: '❌',
    REFUNDED: '💰',
  };
  return icons[status] || '💳';
};

const formatCurrency = (value: number) => {
  return value ? Number(value).toFixed(2) : '0.00';
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const sortOrders = () => {
  // El computed filteredOrders ya maneja el ordenamiento
};

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    PENDING: 'badge-warning',
    PROCESSING: 'badge-info',
    SHIPPED: 'badge-info',
    DELIVERED: 'badge-success',
    CANCELLED: 'badge-danger',
    REFUNDED: 'badge-muted',
  };
  return map[status] || 'badge-muted';
};

const paymentBadge = (status: string) => {
  const map: Record<string, string> = {
    PENDING: 'badge-warning',
    COMPLETED: 'badge-success',
    FAILED: 'badge-danger',
    REFUNDED: 'badge-muted',
  };
  return map[status] || 'badge-muted';
};

const mapOrder = (order: any): Order => ({
  ...order,
  subtotal: Number(order.subtotal),
  discount: Number(order.discount),
  tax: Number(order.tax),
  shipping: Number(order.shipping),
  total: Number(order.total),
  items: order.items?.map((item: any) => ({
    ...item,
    price: Number(item.price),
    total: Number(item.total),
  })) || [],
});

const loadOrders = async () => {
  isLoading.value = true;
  feedback.message = '';

  try {
    const response = await $fetch<Order[]>(`${config.public.apiUrl}/orders`, {
      credentials: 'include',
      headers: {
        ...authHeaders.value,
      },
    });
    orders.value = response.map(mapOrder);
  } catch (error: any) {
    console.error('Error cargando pedidos', error);
    feedback.message = error?.data?.error || 'No se pudieron cargar los pedidos.';
    feedback.type = 'error';
  } finally {
    isLoading.value = false;
  }
};

const openOrder = async (order: Order) => {
  selectedOrder.value = null;
  orderStatus.value = order.status;

  try {
    const detailed = await $fetch<Order>(`${config.public.apiUrl}/orders/${order.id}`, {
      credentials: 'include',
      headers: {
        ...authHeaders.value,
      },
    });
    selectedOrder.value = mapOrder(detailed);
  } catch (error) {
    console.error('Error cargando detalle del pedido', error);
    feedback.message = 'No se pudo cargar el detalle del pedido.';
    feedback.type = 'error';
  }
};

const closeOrder = () => {
  selectedOrder.value = null;
  orderStatus.value = '';
};

const updateStatus = async () => {
  if (!selectedOrder.value || !orderStatus.value) return;
  statusLoading.value = true;
  feedback.message = '';

  try {
    await $fetch(`${config.public.apiUrl}/orders/${selectedOrder.value.id}/status`, {
      method: 'PATCH',
      body: { status: orderStatus.value },
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders.value,
      },
    });
    feedback.message = 'Estado del pedido actualizado.';
    feedback.type = 'success';
    await loadOrders();
    closeOrder();
  } catch (error) {
    console.error('Error actualizando estado', error);
    feedback.message = 'No se pudo actualizar el estado del pedido.';
    feedback.type = 'error';
  } finally {
    statusLoading.value = false;
  }
};

watch([statusFilter, paymentFilter], () => {
  // Trigger computed recalculation
});

onMounted(() => {
  loadOrders();
});
</script>

<style scoped lang="postcss">
.card {
  @apply bg-gaming-dark border border-gray-800 rounded-xl p-6;
}

.card-stat {
  @apply bg-white border border-gray-200 rounded-xl p-6 transition-all hover:scale-105 hover:shadow-lg;
}

.card-order {
  @apply bg-white border-2 border-gray-200 rounded-xl p-6 transition-all;
}

.card-order:hover {
  @apply border-primary-500/50 shadow-lg shadow-primary-500/10;
}

.input {
  @apply w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all;
}

.btn-secondary {
  @apply px-3 py-1.5 bg-gaming-darker hover:bg-gaming-dark transition-colors rounded-lg text-sm;
}

.btn-primary {
  @apply px-4 py-2 bg-primary-600 hover:bg-primary-500 transition-colors rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-tertiary {
  @apply px-3 py-1.5 bg-transparent border border-gray-700 hover:border-primary-500 hover:text-primary-400 transition-colors rounded-lg text-sm;
}

.btn-view-details {
  @apply px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold flex items-center gap-2 transition-all;
}

.alert-success {
  @apply bg-green-500 bg-opacity-20 text-green-300 border border-green-500 border-opacity-40 rounded-lg px-4 py-3;
}

.alert-error {
  @apply bg-red-500 bg-opacity-20 text-red-300 border border-red-500 border-opacity-40 rounded-lg px-4 py-3;
}

.badge-success {
  @apply inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold border border-green-300;
}

.badge-info {
  @apply inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-300;
}

.badge-warning {
  @apply inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold border border-yellow-300;
}

.badge-danger {
  @apply inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold border border-red-300;
}

.badge-muted {
  @apply inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-300;
}

.modal-backdrop {
  @apply fixed inset-0 bg-gray-400 bg-opacity-80 flex items-center justify-center z-50 px-4 backdrop-blur-sm;
}

.modal {
  @apply bg-white border border-gray-200 rounded-xl p-6 w-full max-h-[90vh] overflow-y-auto shadow-2xl;
}

/* Scrollbar personalizado */
.modal::-webkit-scrollbar {
  width: 8px;
}

.modal::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.modal::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.5);
  border-radius: 4px;
}

.modal::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.7);
}
</style>

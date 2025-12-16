<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8 text-center">
      <h1 class="text-4xl font-bold mb-4">Información de Envío</h1>
      <p class="text-gray-400">Todo lo que necesitas saber sobre nuestros envíos</p>
    </div>

    <div class="max-w-4xl mx-auto space-y-8">
      <!-- Shipping Methods -->
      <div class="card">
        <h2 class="text-2xl font-bold mb-6 flex items-center">
          <svg class="w-8 h-8 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
          Métodos de Envío
        </h2>
        <div class="space-y-4">
          <div class="p-4 bg-gaming-darker rounded-lg">
            <div class="flex items-start justify-between mb-2">
              <h3 class="font-semibold text-lg">Envío Estándar</h3>
              <span class="text-green-400 font-bold">GRATIS</span>
            </div>
            <p class="text-gray-400 text-sm mb-2">En compras mayores a S/ 500</p>
            <ul class="text-sm text-gray-400 space-y-1">
              <li>• Lima: 24-48 horas hábiles</li>
              <li>• Provincias: 3-5 días hábiles</li>
            </ul>
          </div>

          <div class="p-4 bg-gaming-darker rounded-lg">
            <div class="flex items-start justify-between mb-2">
              <h3 class="font-semibold text-lg">Envío Express</h3>
              <span class="text-primary-400 font-bold">S/ 30</span>
            </div>
            <p class="text-gray-400 text-sm mb-2">Entrega garantizada</p>
            <ul class="text-sm text-gray-400 space-y-1">
              <li>• Lima: 24 horas</li>
              <li>• Provincias: 2-3 días hábiles</li>
            </ul>
          </div>

          <div class="p-4 bg-gaming-darker rounded-lg">
            <div class="flex items-start justify-between mb-2">
              <h3 class="font-semibold text-lg">Recojo en Tienda</h3>
              <span class="text-green-400 font-bold">GRATIS</span>
            </div>
            <p class="text-gray-400 text-sm mb-2">Disponible en nuestras tiendas</p>
            <ul class="text-sm text-gray-400 space-y-1">
              <li>• Listo en 2-4 horas</li>
              <li>• Horario: Lun-Sáb 9AM-8PM</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Coverage -->
      <div class="card">
        <h2 class="text-2xl font-bold mb-6 flex items-center">
          <svg class="w-8 h-8 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Cobertura Nacional
        </h2>
        <p class="text-gray-400 mb-4">Realizamos envíos a todo el Perú</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-gaming-darker rounded-lg">
            <h3 class="font-semibold mb-2 text-primary-400">Lima Metropolitana</h3>
            <p class="text-sm text-gray-400">Todos los distritos</p>
          </div>
          <div class="p-4 bg-gaming-darker rounded-lg">
            <h3 class="font-semibold mb-2 text-primary-400">Callao</h3>
            <p class="text-sm text-gray-400">Todos los distritos</p>
          </div>
          <div class="p-4 bg-gaming-darker rounded-lg">
            <h3 class="font-semibold mb-2 text-primary-400">Provincias</h3>
            <p class="text-sm text-gray-400">Principales ciudades del Perú</p>
          </div>
          <div class="p-4 bg-gaming-darker rounded-lg">
            <h3 class="font-semibold mb-2 text-primary-400">Zonas Rurales</h3>
            <p class="text-sm text-gray-400">Consultar disponibilidad</p>
          </div>
        </div>
      </div>

      <!-- Packaging -->
      <div class="card">
        <h2 class="text-2xl font-bold mb-6 flex items-center">
          <svg class="w-8 h-8 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Empaquetado
        </h2>
        <p class="text-gray-400 mb-4">Garantizamos que tu pedido llegue en perfectas condiciones</p>
        <ul class="space-y-3 text-gray-400">
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>Embalaje especial para productos electrónicos</span>
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>Material de amortiguación para protección total</span>
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>Cajas reforzadas para mayor seguridad</span>
          </li>
          <li class="flex items-start">
            <svg class="w-5 h-5 text-green-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>Sellado hermético contra humedad</span>
          </li>
        </ul>
      </div>

      <!-- Tracking -->
      <div class="card bg-gradient-to-r from-primary-600/10 to-purple-600/10 border-primary-500/50">
        <h2 class="text-2xl font-bold mb-4">Rastrea tu Pedido</h2>
        <p class="text-gray-400 mb-6">
          Una vez que tu pedido sea enviado, recibirás un email con el código de seguimiento 
          para que puedas rastrear tu paquete en tiempo real.
        </p>
        <NuxtLink to="/auth/login" class="btn-primary">
          Iniciar Sesión para Ver Pedidos
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script needed for this static page
</script>

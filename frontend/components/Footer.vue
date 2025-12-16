<template>
  <footer class="bg-gray-700 border-t border-gray-600 mt-16">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- About -->
        <div>
          <h3 class="text-lg font-bold mb-4">Gaming Store</h3>
          <p class="text-gray-400 text-sm">
            Tu tienda de confianza para componentes gaming de alta gama.
          </p>
        </div>

        <!-- Links -->
        <div>
          <h4 class="font-semibold mb-4">Enlaces</h4>
          <ul class="space-y-2 text-gray-400 text-sm">
            <li><NuxtLink to="/products" class="hover:text-primary-400">Productos</NuxtLink></li>
            <li><NuxtLink to="/categories" class="hover:text-primary-400">Categorías</NuxtLink></li>
            <li><NuxtLink to="/deals" class="hover:text-primary-400">Ofertas</NuxtLink></li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h4 class="font-semibold mb-4">Soporte</h4>
          <ul class="space-y-2 text-gray-400 text-sm">
            <li><NuxtLink to="/contact" class="hover:text-primary-400">Contacto</NuxtLink></li>
            <li><NuxtLink to="/faq" class="hover:text-primary-400">FAQ</NuxtLink></li>
            <li><NuxtLink to="/shipping" class="hover:text-primary-400">Envíos</NuxtLink></li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h4 class="font-semibold mb-4">Newsletter</h4>
          <p class="text-gray-400 text-sm mb-4">Recibe nuestras ofertas</p>
          <div class="flex">
            <input
              type="email"
              placeholder="Tu email"
              class="flex-1 px-4 py-2 bg-gray-600 border border-gray-500 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-white placeholder-gray-300"
            />
            <button class="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-r-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
        <p>&copy; {{ new Date().getFullYear() }} Gaming Store. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>

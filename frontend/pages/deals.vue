<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-4">🔥 Ofertas Especiales</h1>
      <p class="text-gray-400">Los mejores descuentos en productos gaming</p>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="i in 8" :key="i" class="card animate-pulse">
        <div class="h-48 bg-gaming-darker rounded-lg mb-4"></div>
        <div class="h-6 bg-gaming-darker rounded mb-2"></div>
        <div class="h-4 bg-gaming-darker rounded w-2/3"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-400 mb-4">Error al cargar las ofertas</p>
      <button @click="refresh()" class="btn-primary">
        Reintentar
      </button>
    </div>

    <!-- Products Grid -->
    <div v-else-if="products && products.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="w-24 h-24 mx-auto text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
      <p class="text-gray-400">No hay ofertas disponibles en este momento</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Fetch products with discount (comparePrice exists)
const { data: products, pending, error, refresh } = await useFetch('/api/products', {
  baseURL: 'http://localhost:3001',
  query: {
    limit: 20
  },
  transform: (data: any) => {
    // Filter only products with discount
    return data.products?.filter((p: any) => p.comparePrice && p.comparePrice > p.price) || [];
  }
});
</script>

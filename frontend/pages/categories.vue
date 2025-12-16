<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-4">Categorías</h1>
      <p class="text-gray-400">Explora nuestras categorías de productos gaming</p>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="card animate-pulse">
        <div class="h-48 bg-gray-300 rounded-lg mb-4"></div>
        <div class="h-6 bg-gray-300 rounded mb-2"></div>
        <div class="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-400 mb-4">Error al cargar las categorías</p>
      <button @click="refresh()" class="btn-primary">
        Reintentar
      </button>
    </div>

    <!-- Categories Grid -->
    <div v-else-if="categories && categories.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="category in categories"
        :key="category.id"
        :to="`/products?categoryId=${category.id}`"
        class="card group cursor-pointer hover:border-primary-500 transition-all duration-300"
      >
        <!-- Image -->
        <div class="relative h-48 mb-4 rounded-lg overflow-hidden bg-gray-300">
          <img
            v-if="category.image"
            :src="category.image"
            :alt="category.name"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <svg class="w-16 h-16 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>

        <!-- Content -->
        <div>
          <h3 class="text-xl font-bold mb-2 group-hover:text-primary-400 transition-colors">
            {{ category.name }}
          </h3>
          <p class="text-gray-400 text-sm mb-3 line-clamp-2">
            {{ category.description }}
          </p>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">
              {{ category._count?.products || 0 }} productos
            </span>
            <svg class="w-5 h-5 text-primary-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="w-24 h-24 mx-auto text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <p class="text-gray-400">No hay categorías disponibles</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Categorías',
  description: 'Explora todas nuestras categorías de productos gaming'
});

// Fetch categories
const { data: categories, pending, error, refresh } = await useFetch('/api/categories', {
  baseURL: 'http://localhost:3001'
});
</script>

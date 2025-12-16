<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Search Header -->
    <div class="bg-white border-b">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">
          Resultados de búsqueda
          <span v-if="searchQuery" class="text-primary-600">para "{{ searchQuery }}"</span>
        </h1>
        
        <!-- Search Bar -->
        <div class="max-w-2xl">
          <div class="relative">
            <input 
              v-model="localQuery"
              @keyup.enter="performSearch"
              type="text" 
              placeholder="Buscar productos..."
              class="w-full border-2 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-primary-500"
            />
            <button 
              @click="performSearch"
              class="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Icon name="heroicons:magnifying-glass" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Filters Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
            
            <!-- Categories -->
            <div class="mb-6">
              <h4 class="font-medium text-gray-700 mb-3">Categorías</h4>
              <div class="space-y-2 max-h-48 overflow-y-auto">
                <label 
                  v-for="category in categories" 
                  :key="category.id"
                  class="flex items-center"
                >
                  <input 
                    type="checkbox" 
                    :value="category.id"
                    v-model="selectedCategories"
                    class="mr-2"
                  />
                  <span class="text-sm">{{ category.name }} ({{ category._count?.products || 0 }})</span>
                </label>
              </div>
            </div>

            <!-- Price Range -->
            <div class="mb-6">
              <h4 class="font-medium text-gray-700 mb-3">Rango de precio</h4>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input type="radio" v-model="priceFilter" value="all" class="mr-2" />
                  <span class="text-sm">Todos</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" v-model="priceFilter" value="0-500" class="mr-2" />
                  <span class="text-sm">Menos de S/ 500</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" v-model="priceFilter" value="500-1000" class="mr-2" />
                  <span class="text-sm">S/ 500 - S/ 1,000</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" v-model="priceFilter" value="1000-2000" class="mr-2" />
                  <span class="text-sm">S/ 1,000 - S/ 2,000</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" v-model="priceFilter" value="2000+" class="mr-2" />
                  <span class="text-sm">Más de S/ 2,000</span>
                </label>
              </div>
            </div>

            <!-- Stock -->
            <div class="mb-6">
              <h4 class="font-medium text-gray-700 mb-3">Disponibilidad</h4>
              <label class="flex items-center">
                <input type="checkbox" v-model="inStockOnly" class="mr-2" />
                <span class="text-sm">Solo en stock</span>
              </label>
            </div>

            <!-- Clear Filters -->
            <button 
              @click="clearFilters"
              class="w-full text-primary-600 border border-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors text-sm"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        <!-- Results -->
        <div class="lg:col-span-3">
          <!-- Results Header -->
          <div class="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p class="text-lg font-semibold text-gray-900">
                {{ filteredProducts.length }} resultados encontrados
              </p>
              <p v-if="searchQuery" class="text-sm text-gray-600">
                Búsqueda: "{{ searchQuery }}"
              </p>
            </div>
            
            <select 
              v-model="sortBy" 
              class="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="relevance">Más relevantes</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="name-asc">Nombre: A-Z</option>
              <option value="name-desc">Nombre: Z-A</option>
              <option value="newest">Más recientes</option>
            </select>
          </div>

          <!-- Products Grid -->
          <div v-if="sortedProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard 
              v-for="product in sortedProducts" 
              :key="product.id" 
              :product="product"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="bg-white rounded-lg shadow-sm p-12 text-center">
            <Icon name="heroicons:magnifying-glass" class="w-24 h-24 mx-auto text-gray-400 mb-4" />
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No se encontraron resultados</h3>
            <p class="text-gray-600 mb-4">
              No encontramos productos que coincidan con tu búsqueda.
            </p>
            <div class="space-y-2 text-sm text-gray-600 mb-6">
              <p>Intenta:</p>
              <ul class="list-disc list-inside">
                <li>Verificar la ortografía</li>
                <li>Usar palabras clave más generales</li>
                <li>Ajustar los filtros</li>
              </ul>
            </div>
            <div class="flex justify-center gap-4">
              <button 
                @click="clearFilters"
                class="text-primary-600 border border-primary-600 px-6 py-2 rounded-lg hover:bg-primary-50 transition-colors"
              >
                Limpiar filtros
              </button>
              <NuxtLink 
                to="/"
                class="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Volver al inicio
              </NuxtLink>
            </div>
          </div>

          <!-- Popular Searches -->
          <div v-if="sortedProducts.length === 0 && popularSearches.length > 0" class="mt-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Búsquedas populares</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="term in popularSearches"
                :key="term"
                @click="searchPopular(term)"
                class="bg-white border border-gray-300 px-4 py-2 rounded-full text-sm hover:border-primary-600 hover:text-primary-600 transition-colors"
              >
                {{ term }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useFetch, useHead, useRuntimeConfig } from 'nuxt/app';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  images: string[];
  stock: number;
  categoryId: string;
  createdAt: string;
  averageRating?: number;
  reviewCount?: number;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface ProductsResponse {
  products: ProductSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  _count?: {
    products?: number;
  };
}

const searchQuery = ref(route.query.q as string || '');
const localQuery = ref(searchQuery.value);

const {
  data: productsResponse,
  refresh: refreshProducts,
} = await useFetch<ProductsResponse>(() => `${config.public.apiUrl}/products`, {
  query: computed(() => ({
    search: searchQuery.value || undefined,
    limit: 48,
  })),
});

const products = computed<ProductSummary[]>(() => productsResponse.value?.products ?? []);
const { data: categoriesResponse } = await useFetch<CategorySummary[]>(() => `${config.public.apiUrl}/categories`);
const categories = computed<CategorySummary[]>(() => categoriesResponse.value ?? []);

const selectedCategories = ref<string[]>([]);
const priceFilter = ref('all');
const inStockOnly = ref(false);
const sortBy = ref('relevance');

const popularSearches = ref([
  'RTX 4090',
  'AMD Ryzen',
  'Intel Core i9',
  'DDR5 RAM',
  'SSD NVMe',
  'Placa Madre'
]);

const filteredProducts = computed(() => {
  if (!products.value.length) return [];

  let filtered = [...products.value];

  // Filter by category
  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter((product) => 
      selectedCategories.value.includes(product.categoryId)
    );
  }

  // Filter by price
  if (priceFilter.value !== 'all') {
    const [minStr, maxStr] = priceFilter.value.split('-');
    const min = minStr === undefined || minStr === '' ? 0 : Number(minStr);
    const max = maxStr === undefined
      ? undefined
      : maxStr === '+'
        ? Infinity
        : Number(maxStr);

    filtered = filtered.filter((product) => {
      if (max === undefined) {
        return product.price >= min;
      }
      return product.price >= min && product.price < max;
    });
  }

  // Filter by stock
  if (inStockOnly.value) {
    filtered = filtered.filter((product) => product.stock > 0);
  }

  return filtered;
});

const sortedProducts = computed<ProductSummary[]>(() => {
  const sorted = [...filteredProducts.value];

  switch (sortBy.value) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    default:
      return sorted;
  }
});

const performSearch = () => {
  const trimmedQuery = localQuery.value.trim();

  if (!trimmedQuery) {
    router.push('/search');
    searchQuery.value = '';
    refreshProducts();
    return;
  }

  router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  searchQuery.value = trimmedQuery;
  refreshProducts();
};

const searchPopular = (term: string) => {
  localQuery.value = term;
  performSearch();
};

const clearFilters = () => {
  selectedCategories.value = [];
  priceFilter.value = 'all';
  inStockOnly.value = false;
};

// Watch for route changes
watch(
  () => route.query.q,
  (newQuery) => {
    const normalizedQuery = Array.isArray(newQuery) ? newQuery[0] ?? '' : newQuery ?? '';
    searchQuery.value = normalizedQuery;
    localQuery.value = normalizedQuery;
    refreshProducts();
  }
);

// SEO
useHead({
  title: searchQuery.value ? `Búsqueda: ${searchQuery.value} - Gaming Store` : 'Búsqueda - Gaming Store',
  meta: [
    { name: 'description', content: `Resultados de búsqueda para ${searchQuery.value}` }
  ]
});
</script>

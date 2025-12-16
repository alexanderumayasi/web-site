<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Breadcrumb -->
    <div class="bg-white border-b">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center space-x-2 text-sm">
          <NuxtLink to="/" class="text-gray-600 hover:text-primary-600">Inicio</NuxtLink>
          <span class="text-gray-400">/</span>
          <NuxtLink to="/categories" class="text-gray-600 hover:text-primary-600">Categorías</NuxtLink>
          <span class="text-gray-400">/</span>
          <span class="text-gray-900">{{ category?.name }}</span>
        </div>
      </div>
    </div>

    <!-- Category Header -->
    <div v-if="category" class="bg-white border-b">
      <div class="container mx-auto px-4 py-8">
        <div class="flex items-center space-x-6">
          <img 
            v-if="category.image" 
            :src="category.image" 
            :alt="category.name"
            class="w-24 h-24 object-contain rounded-lg border"
          />
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ category.name }}</h1>
            <p v-if="category.description" class="text-gray-600 mt-2">{{ category.description }}</p>
            <p class="text-sm text-gray-500 mt-2">{{ products.length }} productos disponibles</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Products -->
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar Filters -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
            
            <!-- Precio -->
            <div class="mb-6">
              <h4 class="font-medium text-gray-700 mb-3">Precio</h4>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input type="radio" v-model="priceFilter" value="all" class="mr-2" />
                  <span class="text-sm">Todos los precios</span>
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

            <!-- Disponibilidad -->
            <div class="mb-6">
              <h4 class="font-medium text-gray-700 mb-3">Disponibilidad</h4>
              <label class="flex items-center">
                <input type="checkbox" v-model="inStockOnly" class="mr-2" />
                <span class="text-sm">Solo productos en stock</span>
              </label>
            </div>

            <!-- Ofertas -->
            <div class="mb-6">
              <h4 class="font-medium text-gray-700 mb-3">Ofertas</h4>
              <label class="flex items-center">
                <input type="checkbox" v-model="onSaleOnly" class="mr-2" />
                <span class="text-sm">Solo productos en oferta</span>
              </label>
            </div>

            <!-- Botón limpiar filtros -->
            <button 
              @click="clearFilters"
              class="w-full text-primary-600 border border-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors text-sm"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="lg:col-span-3">
          <!-- Sort Bar -->
          <div class="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
            <p class="text-sm text-gray-600">
              Mostrando {{ filteredProducts.length }} de {{ products.length }} productos
            </p>
            <select 
              v-model="sortBy" 
              class="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="name-asc">Nombre: A-Z</option>
              <option value="name-desc">Nombre: Z-A</option>
              <option value="newest">Más recientes</option>
            </select>
          </div>

          <!-- Products -->
          <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard 
              v-for="product in sortedProducts" 
              :key="product.id" 
              :product="product"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="bg-white rounded-lg shadow-sm p-12 text-center">
            <Icon name="heroicons:magnifying-glass" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
            <p class="text-gray-600 mb-4">Intenta ajustar los filtros o busca otro término</p>
            <button 
              @click="clearFilters"
              class="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const { data: category } = await useFetch(`/api/categories/${route.params.slug}`);
const { data: products } = await useFetch(`/api/products?category=${route.params.slug}`);

const priceFilter = ref('all');
const inStockOnly = ref(false);
const onSaleOnly = ref(false);
const sortBy = ref('featured');

const filteredProducts = computed(() => {
  if (!products.value) return [];
  
  let filtered = [...products.value];

  // Filtro de precio
  if (priceFilter.value !== 'all') {
    const [min, max] = priceFilter.value.split('-').map(v => v === '+' ? Infinity : Number(v));
    filtered = filtered.filter(p => {
      if (max === undefined) return p.price >= min;
      return p.price >= min && p.price < max;
    });
  }

  // Filtro de stock
  if (inStockOnly.value) {
    filtered = filtered.filter(p => p.stock > 0);
  }

  // Filtro de ofertas
  if (onSaleOnly.value) {
    filtered = filtered.filter(p => p.comparePrice && p.comparePrice > p.price);
  }

  return filtered;
});

const sortedProducts = computed(() => {
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

const clearFilters = () => {
  priceFilter.value = 'all';
  inStockOnly.value = false;
  onSaleOnly.value = false;
};

// SEO
useHead({
  title: category.value?.name || 'Categoría',
  meta: [
    { name: 'description', content: category.value?.description || '' }
  ]
});
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Breadcrumb -->
    <div class="bg-white border-b">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center space-x-2 text-sm">
          <NuxtLink to="/" class="text-gray-600 hover:text-primary-600">Inicio</NuxtLink>
          <span class="text-gray-400">/</span>
          <span class="text-gray-900">Productos</span>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-6">
      <div class="flex gap-6">
        <!-- Sidebar -->
        <aside class="hidden lg:block w-64 flex-shrink-0">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Filtros</h2>

            <!-- Search -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Buscar</label>
              <input
                v-model="filters.search"
                type="text"
                placeholder="Buscar productos..."
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                @input="debouncedSearch"
              />
            </div>

            <!-- Categories -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-3">Categorías</label>
              <div class="space-y-2">
                <label class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="radio"
                    v-model="filters.categoryId"
                    value=""
                    @change="fetchProducts"
                    class="w-4 h-4 text-primary-600"
                  />
                  <span class="ml-2 text-sm text-gray-700">Todas las categorías</span>
                  <span class="ml-auto text-xs text-gray-500">({{ totalProducts }})</span>
                </label>
                <label
                  v-for="cat in categories"
                  :key="cat.id"
                  class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="radio"
                    v-model="filters.categoryId"
                    :value="cat.id"
                    @change="fetchProducts"
                    class="w-4 h-4 text-primary-600"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ cat.name }}</span>
                  <span class="ml-auto text-xs text-gray-500">({{ cat._count?.products || 0 }})</span>
                </label>
              </div>
            </div>

            <!-- Price Range -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-3">Rango de Precio</label>
              <div class="space-y-3">
                <div>
                  <label class="text-xs text-gray-600">Precio mínimo</label>
                  <input
                    v-model.number="filters.minPrice"
                    type="number"
                    min="0"
                    placeholder="S/ 0"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    @change="fetchProducts"
                  />
                </div>
                <div>
                  <label class="text-xs text-gray-600">Precio máximo</label>
                  <input
                    v-model.number="filters.maxPrice"
                    type="number"
                    min="0"
                    placeholder="S/ 10000"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    @change="fetchProducts"
                  />
                </div>
              </div>
            </div>

            <!-- Featured Products -->
            <div class="mb-6">
              <label class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  v-model="filters.isFeatured"
                  @change="fetchProducts"
                  class="w-4 h-4 text-primary-600 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">Solo productos destacados</span>
              </label>
            </div>

            <!-- Clear Filters -->
            <button
              @click="clearFilters"
              class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1">
          <!-- Header -->
          <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">
                  {{ selectedCategory ? selectedCategory.name : 'Todos los Productos' }}
                </h1>
                <p class="text-sm text-gray-600 mt-1">
                  {{ pagination?.total || 0 }} productos encontrados
                </p>
              </div>

              <!-- Mobile Filter Toggle -->
              <button
                @click="showMobileFilters = !showMobileFilters"
                class="lg:hidden flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-semibold"
              >
                <Icon name="heroicons:funnel" class="w-5 h-5" />
                Filtros
              </button>

              <!-- Sort -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">Ordenar:</label>
                <select
                  v-model="filters.sortBy"
                  @change="fetchProducts"
                  class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="createdAt">Más recientes</option>
                  <option value="price">Precio</option>
                  <option value="name">Nombre</option>
                </select>
                <select
                  v-model="filters.order"
                  @change="fetchProducts"
                  class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="desc">Descendente</option>
                  <option value="asc">Ascendente</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Products Grid -->
          <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div v-for="i in 12" :key="i" class="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
              <div class="h-64 bg-gray-200"></div>
              <div class="p-4 space-y-3">
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>

          <div v-else-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
            />
          </div>

          <div v-else class="bg-white rounded-lg shadow-sm p-16 text-center">
            <Icon name="heroicons:face-frown" class="w-24 h-24 mx-auto text-gray-400 mb-4" />
            <h3 class="text-2xl font-bold text-gray-900 mb-2">No se encontraron productos</h3>
            <p class="text-gray-600 mb-6">Intenta ajustar los filtros de búsqueda</p>
            <button
              @click="clearFilters"
              class="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>

          <!-- Pagination -->
          <div v-if="pagination && pagination.totalPages > 1" class="mt-8 flex justify-center gap-2">
            <button
              @click="goToPage(pagination.page - 1)"
              :disabled="pagination.page === 1"
              class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              class="px-4 py-2 rounded-lg transition-colors"
              :class="page === pagination.page 
                ? 'bg-primary-600 text-white' 
                : 'border border-gray-300 hover:bg-gray-50'"
            >
              {{ page }}
            </button>
            <button
              @click="goToPage(pagination.page + 1)"
              :disabled="pagination.page === pagination.totalPages"
              class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </main>
      </div>
    </div>

    <!-- Mobile Filters Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showMobileFilters"
          class="fixed inset-0 z-50 lg:hidden"
          @click.self="showMobileFilters = false"
        >
          <div class="absolute inset-0 bg-gray-900 bg-opacity-50"></div>
          <div class="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto">
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-gray-900">Filtros</h2>
                <button @click="showMobileFilters = false" class="text-gray-600 hover:text-gray-900">
                  <Icon name="heroicons:x-mark" class="w-6 h-6" />
                </button>
              </div>

              <!-- Same filters as sidebar -->
              <div class="space-y-6">
                <!-- Search -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Buscar</label>
                  <input
                    v-model="filters.search"
                    type="text"
                    placeholder="Buscar productos..."
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    @input="debouncedSearch"
                  />
                </div>

                <!-- Categories -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-3">Categorías</label>
                  <div class="space-y-2">
                    <label class="flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded">
                      <input
                        type="radio"
                        v-model="filters.categoryId"
                        value=""
                        @change="fetchProducts"
                        class="w-4 h-4 text-primary-600"
                      />
                      <span class="ml-2 text-sm">Todas</span>
                    </label>
                    <label
                      v-for="cat in categories"
                      :key="cat.id"
                      class="flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded"
                    >
                      <input
                        type="radio"
                        v-model="filters.categoryId"
                        :value="cat.id"
                        @change="fetchProducts"
                        class="w-4 h-4 text-primary-600"
                      />
                      <span class="ml-2 text-sm">{{ cat.name }}</span>
                    </label>
                  </div>
                </div>

                <!-- Apply Filters -->
                <button
                  @click="showMobileFilters = false"
                  class="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700"
                >
                  Aplicar filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const products = ref<any[]>([]);
const categories = ref<any[]>([]);
const pagination = ref<any>(null);
const isLoading = ref(true);
const showMobileFilters = ref(false);
const totalProducts = ref(0);

const filters = ref({
  search: (route.query.search as string) || '',
  categoryId: (route.query.categoryId as string) || '',
  minPrice: route.query.minPrice ? Number(route.query.minPrice) : undefined,
  maxPrice: route.query.maxPrice ? Number(route.query.maxPrice) : undefined,
  sortBy: (route.query.sortBy as string) || 'createdAt',
  order: (route.query.order as string) || 'desc',
  isFeatured: route.query.isFeatured === 'true',
  page: route.query.page ? Number(route.query.page) : 1,
  limit: 12,
});

const selectedCategory = computed(() => {
  return categories.value.find(cat => cat.id === filters.value.categoryId);
});

const visiblePages = computed(() => {
  if (!pagination.value) return [];
  
  const { page, totalPages } = pagination.value;
  const pages: number[] = [];
  const maxVisible = 5;
  
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

let searchTimeout: NodeJS.Timeout;

const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchProducts();
  }, 500);
};

const fetchProducts = async () => {
  isLoading.value = true;
  
  try {
    const params: any = {
      page: filters.value.page,
      limit: filters.value.limit,
      sortBy: filters.value.sortBy,
      order: filters.value.order,
    };

    if (filters.value.search) params.search = filters.value.search;
    if (filters.value.categoryId) params.categoryId = filters.value.categoryId;
    if (filters.value.minPrice) params.minPrice = filters.value.minPrice;
    if (filters.value.maxPrice) params.maxPrice = filters.value.maxPrice;
    if (filters.value.isFeatured) params.isFeatured = 'true';

    // Update URL query
    router.push({ query: params });

    const queryString = new URLSearchParams(params).toString();
    const response = await $fetch(`${config.public.apiUrl}/products?${queryString}`);

    products.value = response.products || [];
    pagination.value = response.pagination || null;
  } catch (error) {
    console.error('Error fetching products:', error);
    products.value = [];
  } finally {
    isLoading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    const response = await $fetch(`${config.public.apiUrl}/categories`);
    categories.value = response as any[];
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const fetchTotalProducts = async () => {
  try {
    const response = await $fetch(`${config.public.apiUrl}/products?limit=1`);
    totalProducts.value = response.pagination?.total || 0;
  } catch (error) {
    console.error('Error fetching total products:', error);
  }
};

const goToPage = (page: number) => {
  if (page < 1 || (pagination.value && page > pagination.value.totalPages)) {
    return;
  }
  filters.value.page = page;
  fetchProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const clearFilters = () => {
  filters.value = {
    search: '',
    categoryId: '',
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: 'createdAt',
    order: 'desc',
    isFeatured: false,
    page: 1,
    limit: 12,
  };
  fetchProducts();
};

// Fetch data on mount
onMounted(() => {
  fetchCategories();
  fetchTotalProducts();
  fetchProducts();
});

// SEO
useHead({
  title: 'Productos - Gaming Store',
  meta: [
    { name: 'description', content: 'Explora nuestra amplia selección de componentes gaming de alta gama' }
  ]
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>

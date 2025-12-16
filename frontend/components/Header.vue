<template>
  <!-- Header Principal estilo Amazon -->
  <header class="sticky top-0 z-50 shadow-md">
    <!-- Top Bar - Negro con logo y búsqueda -->
    <div class="bg-gray-700 text-white">
      <div class="container mx-auto px-4">
        <div class="flex items-center gap-4 h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2 flex-shrink-0">
            <div class="w-10 h-10 bg-primary-600 rounded flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span class="text-xl font-bold hidden sm:inline">Gaming<span class="text-primary-500">Store</span></span>
          </NuxtLink>

          <!-- Barra de Búsqueda Mejorada -->
          <div class="flex-1 max-w-3xl relative">
            <div class="relative flex">
              <input
                type="text"
                placeholder="Buscar productos, marcas y más..."
                class="w-full px-4 py-2.5 text-gray-900 font-medium rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-gray-500"
                @keyup.enter="handleSearch"
                @input="handleSearchInput"
                @focus="showSearchSuggestions = true"
                v-model="searchQuery"
                autocomplete="off"
              />
              <button 
                @click="handleSearch"
                class="bg-primary-600 hover:bg-primary-700 px-6 rounded-r-md transition-colors flex items-center justify-center"
                aria-label="Buscar"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            <!-- Search Suggestions Dropdown -->
            <div
              v-if="showSearchSuggestions && (searchSuggestions.length > 0 || isSearching)"
              v-click-outside="closeSearchSuggestions"
              class="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50"
            >
              <!-- Loading -->
              <div v-if="isSearching" class="p-4 text-center">
                <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                <p class="text-sm text-gray-600 mt-2 font-medium">Buscando...</p>
              </div>

              <!-- Suggestions -->
              <div v-else-if="searchSuggestions.length > 0" class="py-2">
                <NuxtLink
                  v-for="product in searchSuggestions"
                  :key="product.id"
                  :to="`/products/${product.slug}`"
                  @click="closeSearchSuggestions"
                  class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <img
                    v-if="product.images && product.images.length > 0"
                    :src="product.images[0]"
                    :alt="product.name"
                    class="w-12 h-12 object-cover rounded border border-gray-200"
                  />
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-semibold text-gray-900 truncate">{{ product.name }}</h4>
                    <p class="text-xs text-gray-600 font-medium">{{ product.category?.name }}</p>
                    <p class="text-sm font-bold text-primary-600 mt-1">${{ product.price.toFixed(2) }}</p>
                  </div>
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </NuxtLink>

                <!-- Ver todos los resultados -->
                <button
                  v-if="searchSuggestions.length >= 5"
                  @click="handleSearch"
                  class="w-full px-4 py-3 text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-colors text-center border-t border-gray-200"
                >
                  Ver todos los resultados ({{ searchSuggestions.length }}+)
                </button>
              </div>

              <!-- No results -->
              <div v-else-if="searchQuery.length > 2" class="p-4 text-center">
                <svg class="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-sm font-medium text-gray-900">No se encontraron resultados</p>
                <p class="text-xs text-gray-600 mt-1">Intenta con otras palabras clave</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3 flex-shrink-0">
            <!-- User Menu -->
            <div v-if="authStore.isAuthenticated" class="relative">
              <button
                @click="toggleUserMenu"
                class="flex flex-col items-start px-3 py-1 hover:bg-gray-800 rounded border border-transparent hover:border-gray-700 transition-colors"
              >
                <span class="text-xs text-gray-300">Hola, {{ authStore.user?.firstName }}</span>
                <span class="text-sm font-bold flex items-center gap-1">
                  Mi Cuenta
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              <!-- Dropdown -->
              <div
                v-if="showUserMenu"
                v-click-outside="() => showUserMenu = false"
                class="absolute right-0 mt-1 w-64 bg-white text-gray-900 border border-gray-200 rounded-md shadow-lg py-2 z-50"
              >
                <!-- Close Button -->
                <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                  <span class="text-sm font-semibold text-gray-700">Mi Cuenta</span>
                  <button 
                    @click="showUserMenu = false" 
                    class="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Cerrar menú"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <NuxtLink to="/profile" @click="showUserMenu = false" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors">
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div class="font-medium">Mi Cuenta</div>
                </NuxtLink>
                <NuxtLink to="/orders" @click="showUserMenu = false" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors">
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <div class="font-medium">Mis Pedidos</div>
                </NuxtLink>
                <NuxtLink v-if="authStore.isAdmin" to="/admin" @click="showUserMenu = false" class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors">
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <div class="font-medium">Panel Admin</div>
                </NuxtLink>
                <hr class="my-2 border-gray-200" />
                <button @click="handleLogout" class="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Cerrar Sesión
                </button>
              </div>
            </div>

            <!-- Login/Register -->
            <NuxtLink v-else to="/auth/login" class="flex flex-col items-start px-3 py-1 hover:bg-gray-800 rounded border border-transparent hover:border-gray-700 transition-colors">
              <span class="text-xs text-gray-300">Hola, identifícate</span>
              <span class="text-sm font-bold">Cuenta y Listas</span>
            </NuxtLink>

            <!-- Carrito -->
            <NuxtLink to="/cart" class="relative flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded border border-transparent hover:border-gray-700 transition-colors">
              <div class="relative">
                <svg 
                  :class="['w-8 h-8 transition-transform duration-300', cartPulse ? 'scale-110' : 'scale-100']" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span 
                  v-if="cartStore.itemCount > 0"
                  :class="[
                    'absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center transition-all duration-300',
                    cartPulse ? 'animate-bounce scale-125' : 'scale-100'
                  ]"
                >
                  {{ cartStore.itemCount }}
                </span>
              </div>
              <span class="text-sm font-bold hidden lg:inline">Carrito</span>
            </NuxtLink>
          </div>

          <!-- Mobile Menu Button -->
          <button @click="toggleMobileMenu" class="lg:hidden p-2 hover:bg-gray-800 rounded">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Secondary Navigation Bar -->
    <div class="bg-gray-800 text-white">
      <div class="container mx-auto px-4">
        <div class="flex items-center gap-6 h-10 text-sm">
          <!-- Categories Menu -->
          <button
            class="flex items-center gap-1 font-medium hover:text-primary-400 transition-colors"
            @click="toggleCategoryPanel"
            :aria-expanded="showCategoryPanel"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Todas las Categorías
          </button>

          <nav class="hidden md:flex items-center gap-6">
            <NuxtLink to="/deals" class="hover:text-primary-400 transition-colors font-medium">
              Ofertas del Día
            </NuxtLink>
            <NuxtLink to="/products" class="hover:text-primary-400 transition-colors">
              Nuevos Productos
            </NuxtLink>
            <NuxtLink to="/categories" class="hover:text-primary-400 transition-colors">
              Explorar Categorías
            </NuxtLink>
            <NuxtLink to="/contact" class="hover:text-primary-400 transition-colors">
              Atención al Cliente
            </NuxtLink>
          </nav>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="showMobileMenu" class="lg:hidden bg-gray-700 text-white border-t border-gray-600">
      <nav class="container mx-auto px-4 py-4 flex flex-col gap-2">
        <NuxtLink to="/products" class="px-4 py-2 hover:bg-gray-800 rounded transition-colors">
          Todos los Productos
        </NuxtLink>
        <NuxtLink to="/categories" class="px-4 py-2 hover:bg-gray-800 rounded transition-colors">
          Categorías
        </NuxtLink>
        <NuxtLink to="/deals" class="px-4 py-2 hover:bg-gray-800 rounded transition-colors">
          Ofertas del Día
        </NuxtLink>
        <NuxtLink to="/contact" class="px-4 py-2 hover:bg-gray-800 rounded transition-colors">
          Atención al Cliente
        </NuxtLink>
      </nav>
    </div>
  </header>

  <Teleport to="body">
    <transition name="fade">
      <div v-if="showCategoryPanel" class="fixed inset-0 z-[60]">
        <div class="absolute inset-0 bg-gray-600/50" @click="closeCategoryPanel"></div>
        <aside
          class="relative h-full w-full max-w-sm bg-white text-gray-900 shadow-xl overflow-y-auto"
        >
          <div class="bg-gray-700 text-white px-6 py-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <div class="text-sm text-gray-300">Hola</div>
              <div class="text-lg font-semibold">Identifícate</div>
            </div>
            <button
              class="ml-auto text-sm text-white/70 hover:text-white"
              @click="closeCategoryPanel"
            >
              Cerrar
            </button>
          </div>

          <section class="px-6 py-5 border-b border-gray-100">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Contenido y dispositivos digitales
            </h3>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/">Prime Video</NuxtLink></li>
              <li><NuxtLink to="/">Amazon Music</NuxtLink></li>
              <li><NuxtLink to="/">Kindle y Libros</NuxtLink></li>
              <li><NuxtLink to="/">Appstore</NuxtLink></li>
            </ul>
          </section>

          <section class="px-6 py-5 border-b border-gray-100">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Buscar por departamento
              </h3>
              <span v-if="categoriesPending" class="text-xs text-gray-400">Cargando...</span>
            </div>
            <ul class="space-y-1.5 text-sm">
              <li
                v-for="category in departmentCategories"
                :key="category.id"
              >
                <button
                  class="w-full text-left px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                  @click="handleCategoryNavigate(category.id)"
                >
                  {{ category.name }}
                </button>
              </li>
            </ul>
            <button
              v-if="remainingCategories.length"
              class="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700"
              @click="showAllCategories = !showAllCategories"
            >
              {{ showAllCategories ? 'Ver menos' : 'Ver todo' }}
            </button>
            <transition name="fade">
              <ul v-if="showAllCategories" class="mt-3 space-y-1.5 text-sm">
                <li
                  v-for="category in remainingCategories"
                  :key="category.id"
                >
                  <button
                    class="w-full text-left px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                    @click="handleCategoryNavigate(category.id)"
                  >
                    {{ category.name }}
                  </button>
                </li>
              </ul>
            </transition>
          </section>

          <section class="px-6 py-5 border-b border-gray-100">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Programas y funcionalidades
            </h3>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/deals">Ofertas del día</NuxtLink></li>
              <li><NuxtLink to="/orders">Compras recurrentes</NuxtLink></li>
              <li><NuxtLink to="/contact">Atención al cliente</NuxtLink></li>
              <li><NuxtLink to="/">Tienda internacional</NuxtLink></li>
            </ul>
          </section>

          <section class="px-6 py-5">
            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Ayuda y configuración
            </h3>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/auth/login">Tu cuenta</NuxtLink></li>
              <li><NuxtLink to="/auth/login">Identifícate</NuxtLink></li>
              <li><NuxtLink to="/">Cambiar país/región</NuxtLink></li>
              <li><NuxtLink to="/">Centro de ayuda</NuxtLink></li>
            </ul>
          </section>
        </aside>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { navigateTo, useFetch, useRuntimeConfig } from 'nuxt/app';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';

const authStore = useAuthStore();
const cartStore = useCartStore();

const searchQuery = ref('');
const showUserMenu = ref(false);
const showMobileMenu = ref(false);
const showCategoryPanel = ref(false);
const showAllCategories = ref(false);
const cartPulse = ref(false);
const showSearchSuggestions = ref(false);
const searchSuggestions = ref<any[]>([]);
const isSearching = ref(false);
let searchTimeout: NodeJS.Timeout | null = null;

// Detectar cambios en el carrito para animar
watch(() => cartStore.itemCount, (newCount, oldCount) => {
  if (newCount > oldCount) {
    cartPulse.value = true;
    setTimeout(() => {
      cartPulse.value = false;
    }, 600);
  }
});

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

const config = useRuntimeConfig();
const { data: categoriesResponse, pending: categoriesPending } = await useFetch<CategoryItem[]>(
  `${config.public.apiUrl}/categories`
);

const categories = computed(() => categoriesResponse.value ?? []);
const departmentCategories = computed(() => categories.value.slice(0, 8));
const remainingCategories = computed(() => categories.value.slice(8));

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const toggleCategoryPanel = () => {
  showCategoryPanel.value = !showCategoryPanel.value;
  if (!showCategoryPanel.value) {
    showAllCategories.value = false;
  }
};

const closeCategoryPanel = () => {
  showCategoryPanel.value = false;
  showAllCategories.value = false;
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    showSearchSuggestions.value = false;
    navigateTo(`/products?search=${encodeURIComponent(searchQuery.value)}`);
  }
};

const handleSearchInput = async () => {
  const query = searchQuery.value.trim();
  
  // Clear previous timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  // If query is too short, hide suggestions
  if (query.length < 2) {
    showSearchSuggestions.value = false;
    searchSuggestions.value = [];
    return;
  }

  // Debounce search - wait 300ms after user stops typing
  searchTimeout = setTimeout(async () => {
    isSearching.value = true;
    showSearchSuggestions.value = true;
    
    try {
      const response = await fetch(
        `${config.public.apiUrl}/products?search=${encodeURIComponent(query)}&limit=5`
      );
      
      if (response.ok) {
        const data = await response.json();
        searchSuggestions.value = data.products || [];
      }
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      searchSuggestions.value = [];
    } finally {
      isSearching.value = false;
    }
  }, 300);
};

const closeSearchSuggestions = () => {
  showSearchSuggestions.value = false;
};

// Click outside directive
const vClickOutside = {
  mounted: (el: HTMLElement, binding: any) => {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value();
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted: (el: any) => {
    document.removeEventListener('click', el.clickOutsideEvent);
  },
};

const handleLogout = async () => {
  await authStore.logout();
  navigateTo('/');
};

const handleCategoryNavigate = (categoryId: string) => {
  closeCategoryPanel();
  navigateTo(`/products?categoryId=${categoryId}`);
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeCategoryPanel();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleEscape);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

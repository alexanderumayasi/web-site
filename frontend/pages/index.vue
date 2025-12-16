<template>
  <div class="bg-gray-50">
    <!-- Hero Banner Carousel - Estilo Amazon -->
    <section class="relative bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
      <div class="container mx-auto px-0">
        <!-- Carousel de banners -->
        <div class="relative h-[400px] md:h-[500px]">
          <div 
            v-for="(banner, index) in banners" 
            :key="index"
            v-show="currentBanner === index"
            class="absolute inset-0 transition-opacity duration-700"
            :class="currentBanner === index ? 'opacity-100' : 'opacity-0'"
          >
            <div class="relative h-full flex items-center justify-center bg-cover bg-center"
                 :style="{ backgroundImage: `url(${banner.image})` }">
              <div class="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
              <div class="relative z-10 container mx-auto px-4 md:px-8">
                <div class="max-w-xl">
                  <p class="text-sm md:text-base text-gray-300 mb-2">{{ banner.tag }}</p>
                  <h2 class="text-3xl md:text-5xl font-bold text-white mb-4">{{ banner.title }}</h2>
                  <p class="text-lg md:text-xl text-gray-200 mb-6">{{ banner.subtitle }}</p>
                  <NuxtLink :to="banner.link" class="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-md font-semibold transition-colors">
                    {{ banner.cta }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Controles del carousel -->
          <button 
            @click="prevBanner"
            class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all z-20"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            @click="nextBanner"
            class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all z-20"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <!-- Indicadores -->
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            <button 
              v-for="(_, index) in banners" 
              :key="index"
              @click="currentBanner = index"
              class="w-2 h-2 rounded-full transition-all"
              :class="currentBanner === index ? 'bg-white w-8' : 'bg-white/50'"
            />
          </div>
        </div>
      </div>
    </section>


    <!-- Categorías con Imágenes - Estilo Amazon -->
    <section class="container mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Compra por categoría</h2>
      
      <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div v-for="i in 6" :key="i" class="bg-white rounded-lg p-4 shadow-sm animate-pulse">
          <div class="aspect-square bg-gray-200 rounded-lg mb-3"></div>
          <div class="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="`/products?categoryId=${category.id}`"
          class="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all group"
        >
          <div class="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
            <img 
              v-if="category.image"
              :src="category.image" 
              :alt="category.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <h3 class="font-medium text-sm text-gray-900 group-hover:text-primary-600 transition-colors">
            {{ category.name }}
          </h3>
        </NuxtLink>
      </div>
    </section>

    <!-- Catálogo principal -->
    <section class="container mx-auto px-4 pb-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Más productos para ti</h2>
          <p class="text-sm text-gray-600 mt-1">Explora el catálogo con más componentes disponibles.</p>
        </div>
        <NuxtLink to="/products" class="text-primary-600 hover:text-primary-700 font-medium text-sm">
          Ver catálogo completo →
        </NuxtLink>
      </div>

      <div v-if="latestPending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 8" :key="`latest-skeleton-${i}`" class="bg-white rounded-lg shadow-sm p-4 animate-pulse">
          <div class="aspect-square bg-gray-200 rounded-lg mb-4"></div>
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div class="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div v-else-if="catalogProducts.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in catalogProducts"
          :key="`latest-${product.id}`"
          :product="product as any"
        />
      </div>

      <div v-else class="bg-white rounded-lg shadow-sm p-8 text-center">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Todavía no hay más productos</h3>
        <p class="text-sm text-gray-600">Sigue explorando las categorías o vuelve más tarde para ver nuevas llegadas.</p>
      </div>
    </section>

    <!-- Ofertas del Día - Estilo Amazon Deals -->
    <section class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Ofertas del día</h2>
            <p class="text-sm text-gray-600 mt-1">Descuentos especiales por tiempo limitado</p>
          </div>
          <NuxtLink to="/deals" class="text-primary-600 hover:text-primary-700 font-medium text-sm">
            Ver todas las ofertas →
          </NuxtLink>
        </div>

        <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div v-for="i in 6" :key="i" class="animate-pulse">
            <div class="aspect-square bg-gray-200 rounded-lg mb-3"></div>
            <div class="h-4 bg-gray-200 rounded mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <NuxtLink
            v-for="product in dealProducts"
            :key="product.id"
            :to="`/products/${product.slug}`"
            class="group"
          >
            <div class="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
              <img 
                v-if="product.images?.[0]"
                :src="product.images[0]" 
                :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div v-if="product.comparePrice && Number(product.comparePrice) > Number(product.price)" 
                   class="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-md text-xs font-bold">
                -{{ getDiscountPercent(product) }}%
              </div>
            </div>
            <h3 class="text-sm text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
              {{ product.name }}
            </h3>
            <div class="flex items-baseline gap-2">
              <span class="text-lg font-bold text-red-600">S/ {{ formatPrice(product.price) }}</span>
              <span v-if="product.comparePrice && Number(product.comparePrice) > Number(product.price)" 
                    class="text-sm text-gray-500 line-through">
                S/ {{ formatPrice(product.comparePrice) }}
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="container mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Productos destacados</h2>
      
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 8" :key="i" class="bg-white rounded-lg shadow-sm p-4 animate-pulse">
          <div class="aspect-square bg-gray-200 rounded-lg mb-4"></div>
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div class="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in featuredProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>


    <!-- Features / Beneficios - Estilo Amazon -->
    <section class="bg-gray-100 py-8">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 mb-1">Productos Originales</h3>
              <p class="text-sm text-gray-600">100% garantizados y certificados</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 mb-1">Envío Rápido</h3>
              <p class="text-sm text-gray-600">24-48h en Lima Metropolitana</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 mb-1">Pago Seguro</h3>
              <p class="text-sm text-gray-600">Múltiples métodos de pago</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 mb-1">Soporte 24/7</h3>
              <p class="text-sm text-gray-600">Asistencia técnica disponible</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useFetch, useHead, useRuntimeConfig } from 'nuxt/app';
import { useProductStore } from '../stores/product';

interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number | string;
  comparePrice?: number | string;
  images: string[];
  stock: number;
  averageRating?: number;
  reviewCount?: number;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface ProductListResponse {
  products: ApiProduct[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
}

const formatPrice = (value: number | string | undefined) => Number(value ?? 0).toFixed(2);

const getDiscountPercent = (product: ApiProduct) => {
  const compare = Number(product.comparePrice ?? 0);
  const price = Number(product.price ?? 0);
  if (compare <= 0 || compare <= price) {
    return 0;
  }
  return Math.round((1 - price / compare) * 100);
};

const productStore = useProductStore();
const config = useRuntimeConfig();

const {
  data: featuredResponse,
  pending: featuredPending,
  error: featuredError,
} = await useFetch<ProductListResponse>(`${config.public.apiUrl}/products`, {
  params: {
    isFeatured: true,
    limit: 8,
  },
});

const {
  data: dealsResponse,
  pending: dealsPending,
  error: dealsError,
} = await useFetch<ProductListResponse>(`${config.public.apiUrl}/products`, {
  params: {
    limit: 6,
  },
});

const {
  data: latestResponse,
  pending: latestPending,
  error: latestError,
} = await useFetch<ProductListResponse>(`${config.public.apiUrl}/products`, {
  params: {
    limit: 20,
  },
});

const {
  data: categoriesResponse,
  pending: categoriesPending,
  error: categoriesError,
} = await useFetch<CategoryItem[]>(`${config.public.apiUrl}/categories`);

const featuredProducts = computed<ApiProduct[]>(
  () => featuredResponse.value?.products ?? []
);
const featuredIds = computed(() => new Set(featuredProducts.value.map((product) => product.id)));
const dealProducts = computed<ApiProduct[]>(() => {
  const products = dealsResponse.value?.products ?? [];
  return products.filter((product) => {
    const comparePrice = Number(product.comparePrice ?? 0);
    const price = Number(product.price ?? 0);
    const hasDiscount = comparePrice > price;
    if (!hasDiscount) {
      return false;
    }
    return !featuredIds.value.has(product.id);
  });
});
const dealIds = computed(() => new Set(dealProducts.value.map((product) => product.id)));
const latestProducts = computed<ApiProduct[]>(() => latestResponse.value?.products ?? []);
const catalogProducts = computed<ApiProduct[]>(() =>
  latestProducts.value.filter(
    (product) => !featuredIds.value.has(product.id) && !dealIds.value.has(product.id)
  )
);
const categories = computed<CategoryItem[]>(() => categoriesResponse.value ?? []);
const isLoading = computed(
  () =>
    featuredPending.value ||
    dealsPending.value ||
    latestPending.value ||
    categoriesPending.value
);

watch(
  featuredProducts,
  (value: ApiProduct[]) => {
    productStore.featuredProducts = value as unknown as any;
  },
  { immediate: true }
);

const loadError = computed(
  () =>
    featuredError.value ??
    dealsError.value ??
    latestError.value ??
    categoriesError.value
);
const currentBanner = ref(0);

// Banners del carousel
const banners = ref([
  {
    tag: 'NUEVOS ARRIVALS',
    title: 'RTX 4090 & AMD RX 7900 XTX',
    subtitle: 'Las tarjetas gráficas más potentes del mercado',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1920&q=80',
    link: '/products?categoryId=2',
    cta: 'Ver GPUs'
  },
  {
    tag: 'SUPER OFERTA',
    title: 'Hasta 30% OFF en Procesadores',
    subtitle: 'Intel Core i9 y AMD Ryzen 9 en promoción',
    image: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=1920&q=80',
    link: '/products?categoryId=1',
    cta: 'Ver Procesadores'
  },
  {
    tag: 'GAMING SETUP',
    title: 'Monitores Gaming 240Hz',
    subtitle: 'Máxima fluidez para tus partidas competitivas',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1920&q=80',
    link: '/products',
    cta: 'Ver Monitores'
  },
  {
    tag: 'TECNOLOGÍA DE PUNTA',
    title: 'Teclados Mecánicos RGB',
    subtitle: 'Switches Cherry MX y RGB personalizables',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1920&q=80',
    link: '/products',
    cta: 'Comprar Ahora'
  }
]);

// Auto-rotate carousel
let bannerInterval: ReturnType<typeof setInterval> | null = null;
onMounted(() => {
  // Auto-redirect admin users to admin panel on login
  const authStore = useAuthStore();
  if (authStore.isAuthenticated && authStore.isAdmin) {
    const fromLogin = sessionStorage.getItem('just-logged-in');
    if (fromLogin === 'true') {
      sessionStorage.removeItem('just-logged-in');
      navigateTo('/admin');
      return;
    }
  }

  bannerInterval = setInterval(() => {
    nextBanner();
  }, 5000);
});

onUnmounted(() => {
  if (bannerInterval !== null) {
    clearInterval(bannerInterval);
  }
});

const nextBanner = () => {
  currentBanner.value = (currentBanner.value + 1) % banners.value.length;
};

const prevBanner = () => {
  currentBanner.value = currentBanner.value === 0 ? banners.value.length - 1 : currentBanner.value - 1;
};

// SEO
useHead({
  title: 'Inicio - Gaming Store',
  meta: [
    {
      name: 'description',
      content: 'Compra los mejores componentes gaming: CPUs, GPUs, RAM, SSDs y más. Envío rápido y garantía. Ofertas especiales todos los días.',
    },
  ],
});

if (loadError.value) {
  console.error('Failed to load home data:', loadError.value);
}
</script>

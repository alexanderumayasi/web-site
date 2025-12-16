<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-4 group">
    <NuxtLink :to="`/products/${product.slug}`" class="block">
      <!-- Image -->
      <div class="relative aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100">
        <img
          v-if="product.images && product.images[0]"
          :src="product.images[0]"
          :alt="product.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <svg class="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <!-- Discount Badge -->
        <div v-if="product.comparePrice && Number(product.comparePrice) > Number(product.price)" 
             class="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
          -{{ Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100) }}%
        </div>
      </div>

      <!-- Content -->
      <div>
        <h3 class="text-sm text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2 min-h-[40px]">
          {{ product.name }}
        </h3>

        <!-- Rating -->
        <div v-if="product.averageRating" class="flex items-center mb-2">
          <div class="flex items-center gap-0.5">
            <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= Math.round(product.averageRating) ? 'text-yellow-500' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <span class="text-xs text-gray-600 ml-1">({{ product.reviewCount || 0 }})</span>
        </div>

        <!-- Price -->
        <div class="mb-2">
          <div class="flex items-baseline gap-2">
            <span class="text-xl font-bold text-red-700">S/ {{ Number(product.price).toFixed(2) }}</span>
            <span v-if="product.comparePrice && Number(product.comparePrice) > Number(product.price)" 
                  class="text-sm text-gray-500 line-through">
              S/ {{ Number(product.comparePrice).toFixed(2) }}
            </span>
          </div>
          <p v-if="product.comparePrice && Number(product.comparePrice) > Number(product.price)" 
             class="text-xs text-green-700">
            Ahorras S/ {{ (Number(product.comparePrice) - Number(product.price)).toFixed(2) }}
          </p>
        </div>

        <!-- Stock & Shipping -->
        <div class="text-xs mb-3">
          <p v-if="product.stock > 10" class="text-green-700 font-medium">En stock</p>
          <p v-else-if="product.stock > 0" class="text-orange-600 font-medium">
            Solo quedan {{ product.stock }} unidades
          </p>
          <p v-else class="text-red-600 font-medium">Agotado</p>
          <p v-if="product.stock > 0" class="text-gray-600 mt-1">Envío GRATIS</p>
        </div>
      </div>
    </NuxtLink>

    <!-- Add to Cart Button -->
    <button
      v-if="product.stock > 0"
      @click="handleAddToCart"
      :disabled="isAdding"
      :class="[
        'w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 relative overflow-hidden',
        isAdding 
          ? 'bg-gray-400 cursor-not-allowed' 
          : addedAnimation
            ? 'bg-green-600 text-white'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
      ]"
    >
      <!-- Loading Spinner -->
      <span v-if="isAdding" class="flex items-center justify-center">
        <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Agregando...
      </span>
      
      <!-- Success Check -->
      <span v-else-if="addedAnimation" class="flex items-center justify-center animate-bounce">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
        ¡Agregado!
      </span>
      
      <!-- Normal State -->
      <span v-else class="flex items-center justify-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Agregar al carrito
      </span>
      
      <!-- Ripple Effect -->
      <span v-if="!isAdding && !addedAnimation" class="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
    </button>
    <button
      v-else
      disabled
      class="w-full bg-gray-300 text-gray-600 py-2.5 px-4 rounded-lg text-sm font-semibold cursor-not-allowed"
    >
      <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
      No disponible
    </button>
  </div>
</template>

<script setup lang="ts">
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  stock: number;
  averageRating?: number;
  reviewCount?: number;
}

const props = defineProps<{
  product: Product;
}>();

const cartStore = useCartStore();
const notificationStore = useNotificationStore();
const authStore = useAuthStore();
const router = useRouter();
const isAdding = ref(false);
const addedAnimation = ref(false);

const handleAddToCart = async () => {
  // Verificar si está autenticado
  if (!authStore.isAuthenticated) {
    notificationStore.warning(
      'Inicia sesión',
      'Debes iniciar sesión para agregar productos al carrito'
    );
    router.push('/auth/login');
    return;
  }

  isAdding.value = true;
  
  try {
    await cartStore.addItem(props.product.id, 1);
    
    // Mostrar animación de éxito
    addedAnimation.value = true;
    setTimeout(() => {
      addedAnimation.value = false;
    }, 1000);
    
    // Notificación de éxito
    notificationStore.success(
      '¡Producto agregado!',
      `${props.product.name} se agregó al carrito correctamente`,
      3000
    );
  } catch (error: any) {
    console.error(error.message);
    notificationStore.error(
      'Error',
      error.message || 'No se pudo agregar el producto al carrito',
      4000
    );
  } finally {
    isAdding.value = false;
  }
};
</script>

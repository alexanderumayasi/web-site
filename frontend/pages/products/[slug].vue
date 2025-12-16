<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Breadcrumb -->
    <div class="bg-white border-b">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center space-x-2 text-sm">
          <NuxtLink to="/" class="text-gray-600 hover:text-primary-600">Inicio</NuxtLink>
          <span class="text-gray-400">/</span>
          <NuxtLink v-if="product?.category" :to="`/categories/${product.category.slug}`" class="text-gray-600 hover:text-primary-600">
            {{ product.category.name }}
          </NuxtLink>
          <span class="text-gray-400">/</span>
          <span class="text-gray-900">{{ product?.name }}</span>
        </div>
      </div>
    </div>

    <!-- Product Detail -->
    <div v-if="product" class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Galería de Imágenes -->
          <div>
            <!-- Imagen Principal -->
            <div class="bg-white border rounded-lg overflow-hidden mb-4">
              <img 
                :src="currentImage" 
                :alt="product.name"
                class="w-full aspect-square object-contain p-8"
              />
            </div>
            
            <!-- Miniaturas -->
            <div v-if="product.images.length > 1" class="grid grid-cols-4 gap-2">
              <button
                v-for="(image, index) in product.images"
                :key="index"
                @click="currentImage = image"
                class="border rounded-lg overflow-hidden hover:border-primary-600 transition-colors"
                :class="{ 'border-primary-600 ring-2 ring-primary-200': currentImage === image }"
              >
                <img 
                  :src="image" 
                  :alt="`${product.name} - Vista ${index + 1}`"
                  class="w-full aspect-square object-contain p-2"
                />
              </button>
            </div>
          </div>

          <!-- Información del Producto -->
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>
            
            <!-- Rating y Reviews -->
            <div class="flex items-center space-x-4 mb-4">
              <div class="flex items-center">
                <div class="flex text-yellow-500">
                  <Icon v-for="i in 5" :key="i" 
                    :name="i <= Math.round(product.averageRating) ? 'heroicons:star-solid' : 'heroicons:star'" 
                    class="w-5 h-5"
                  />
                </div>
                <span class="ml-2 text-sm text-gray-600">
                  {{ product.averageRating?.toFixed(1) || '0.0' }}
                </span>
              </div>
              <span class="text-sm text-gray-600">
                {{ product._count?.reviews || 0 }} valoraciones
              </span>
            </div>

            <!-- Precio -->
            <div class="mb-6">
              <div v-if="product.comparePrice && Number(product.comparePrice) > Number(product.price)" class="flex items-baseline space-x-3">
                <span class="text-sm text-gray-500 line-through">S/ {{ Number(product.comparePrice).toFixed(2) }}</span>
                <span class="text-3xl font-bold text-red-700">S/ {{ Number(product.price).toFixed(2) }}</span>
                <span class="text-sm text-green-700 font-semibold">
                  -{{ Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100) }}%
                </span>
              </div>
              <div v-else class="text-3xl font-bold text-red-700">
                S/ {{ Number(product.price).toFixed(2) }}
              </div>
              <p class="text-sm text-green-700 mt-1">Envío GRATIS</p>
            </div>

            <!-- Stock -->
            <div class="mb-6">
              <p v-if="product.stock > 10" class="text-green-700 font-semibold">
                ✓ En stock
              </p>
              <p v-else-if="product.stock > 0" class="text-orange-600 font-semibold">
                ⚠ Solo quedan {{ product.stock }} unidades
              </p>
              <p v-else class="text-red-600 font-semibold">
                ✗ Agotado
              </p>
            </div>

            <!-- Cantidad y Agregar al Carrito -->
            <div class="mb-6 space-y-4">
              <div class="flex items-center space-x-4">
                <label class="text-sm font-medium text-gray-700">Cantidad:</label>
                <div class="flex items-center border rounded-lg">
                  <button 
                    @click="quantity = Math.max(1, quantity - 1)"
                    class="px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    <Icon name="heroicons:minus" class="w-4 h-4" />
                  </button>
                  <input 
                    v-model.number="quantity" 
                    type="number" 
                    min="1" 
                    :max="product.stock"
                    class="w-16 text-center border-x focus:outline-none py-2"
                  />
                  <button 
                    @click="quantity = Math.min(product.stock, quantity + 1)"
                    class="px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    <Icon name="heroicons:plus" class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div class="flex space-x-3">
                <button
                  @click="addToCart"
                  :disabled="product.stock === 0 || isAdding"
                  :class="[
                    'flex-1 px-8 py-3.5 rounded-lg font-bold text-base transition-all duration-300 relative overflow-hidden',
                    isAdding || product.stock === 0
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : addedAnimation
                        ? 'bg-green-600 text-white shadow-xl scale-105'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1'
                  ]"
                >
                  <!-- Loading Spinner -->
                  <span v-if="isAdding" class="flex items-center justify-center">
                    <svg class="animate-spin h-6 w-6 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Agregando al carrito...
                  </span>
                  
                  <!-- Success Check -->
                  <span v-else-if="addedAnimation" class="flex items-center justify-center">
                    <svg class="w-6 h-6 mr-3 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                    ¡Producto Agregado!
                  </span>
                  
                  <!-- Normal State -->
                  <span v-else class="flex items-center justify-center">
                    <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Agregar al carrito
                  </span>
                </button>
                
                <button
                  @click="buyNow"
                  :disabled="product.stock === 0 || isAdding"
                  class="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3.5 rounded-lg font-bold text-base transition-all duration-300 shadow-lg hover:shadow-2xl disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:-translate-y-1"
                >
                  <svg class="w-6 h-6 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Comprar ahora
                </button>
              </div>
            </div>

            <!-- Descripción -->
            <div class="border-t pt-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
              <p class="text-gray-700 whitespace-pre-line">{{ product.description }}</p>
            </div>
          </div>
        </div>

        <!-- Especificaciones Técnicas -->
        <div v-if="product.specifications && Object.keys(product.specifications).length > 0" class="mt-8 border-t pt-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-6">Especificaciones Técnicas</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="(value, key) in product.specifications" 
              :key="key"
              class="flex border-b pb-3"
            >
              <span class="font-semibold text-gray-700 w-1/2">{{ key }}:</span>
              <span class="text-gray-600 w-1/2">{{ value }}</span>
            </div>
          </div>
        </div>

        <!-- Reviews -->
        <div class="mt-8 border-t pt-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-6">Opiniones de clientes</h3>
          
          <div v-if="reviews.length === 0" class="text-center py-8 text-gray-500">
            <Icon name="heroicons:chat-bubble-left-ellipsis" class="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Aún no hay opiniones para este producto</p>
          </div>

          <div v-else class="space-y-6">
            <div 
              v-for="review in reviews" 
              :key="review.id"
              class="border-b pb-6 last:border-b-0"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-3">
                  <span class="font-semibold text-gray-900">{{ review.user ? `${review.user.firstName} ${review.user.lastName}` : 'Cliente' }}</span>
                  <div class="flex text-yellow-500">
                    <Icon v-for="i in 5" :key="i" 
                      :name="i <= review.rating ? 'heroicons:star-solid' : 'heroicons:star'" 
                      class="w-4 h-4"
                    />
                  </div>
                </div>
                <span class="text-sm text-gray-500">
                  {{ new Date(review.createdAt).toLocaleDateString('es-ES') }}
                </span>
              </div>
              <p v-if="review.comment" class="text-gray-700">{{ review.comment }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="container mx-auto px-4 py-20 text-center">
      <Icon name="svg-spinners:ring-resize" class="w-12 h-12 mx-auto text-primary-600" />
      <p class="mt-4 text-gray-600">Cargando producto...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const cartStore = useCartStore();
const notificationStore = useNotificationStore();
const authStore = useAuthStore();
const router = useRouter();
const config = useRuntimeConfig();

const { data: product } = await useFetch(`${config.public.apiUrl}/products/${route.params.slug}`);

const reviews = computed(() => product.value?.reviews || []);

const currentImage = ref(product.value?.images[0] || '');
const quantity = ref(1);
const isAdding = ref(false);
const addedAnimation = ref(false);

// Actualizar imagen actual cuando cambia el producto
watch(() => product.value?.images, (newImages) => {
  if (newImages && newImages.length > 0) {
    currentImage.value = newImages[0];
  }
}, { immediate: true });

const addToCart = async () => {
  if (!product.value) return;
  
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
    await cartStore.addItem(product.value.id, quantity.value);
    
    // Mostrar animación de éxito
    addedAnimation.value = true;
    setTimeout(() => {
      addedAnimation.value = false;
    }, 1500);
    
    // Notificación de éxito personalizada
    notificationStore.success(
      '¡Producto agregado!',
      `${product.value.name} (${quantity.value} ${quantity.value > 1 ? 'unidades' : 'unidad'}) se agregó al carrito`,
      3500
    );
    
    // Resetear cantidad después de agregar
    quantity.value = 1;
  } catch (error: any) {
    console.error(error);
    notificationStore.error(
      'Error al agregar',
      error.message || 'No se pudo agregar el producto al carrito',
      4000
    );
  } finally {
    isAdding.value = false;
  }
};

const buyNow = async () => {
  await addToCart();
  if (addedAnimation.value) {
    // Esperar a que termine la animación y redirigir al carrito
    setTimeout(() => {
      router.push('/cart');
    }, 500);
  }
};

// SEO
useHead({
  title: product.value?.name || 'Producto',
  meta: [
    { name: 'description', content: product.value?.description || '' }
  ]
});
</script>

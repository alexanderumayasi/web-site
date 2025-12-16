<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Carrito de Compras</h1>

    <div v-if="cartStore.isEmpty" class="text-center py-16">
      <svg class="w-24 h-24 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <h3 class="text-2xl font-bold mb-2">Tu carrito está vacío</h3>
      <p class="text-gray-400 mb-6">Agrega productos para continuar</p>
      <NuxtLink to="/products" class="btn-primary">
        Ir a la Tienda
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in cartStore.items"
          :key="item.id"
          class="card flex items-center space-x-4"
        >
          <img
            :src="item.product.images[0]"
            :alt="item.product.name"
            class="w-24 h-24 object-cover rounded-lg"
          />

          <div class="flex-1">
            <h3 class="font-semibold">{{ item.product.name }}</h3>
            <p class="text-sm text-gray-400">SKU: {{ item.product.sku }}</p>
            <p class="text-primary-400 font-bold mt-2">S/ {{ item.product.price }}</p>
          </div>

          <div class="flex items-center space-x-2">
            <button
              @click="decreaseQuantity(item)"
              class="w-8 h-8 bg-gray-600 rounded hover:bg-gray-500 transition-colors"
            >
              -
            </button>
            <span class="w-12 text-center">{{ item.quantity }}</span>
            <button
              @click="increaseQuantity(item)"
              class="w-8 h-8 bg-gray-600 rounded hover:bg-gray-500 transition-colors"
              :disabled="item.quantity >= item.product.stock"
            >
              +
            </button>
          </div>

          <button
            @click="removeItem(item.productId)"
            class="p-2 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="card sticky top-24">
          <h3 class="text-xl font-bold mb-4">Resumen del Pedido</h3>

          <!-- Coupon Section -->
          <div class="mb-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700">
            <label class="block text-sm font-semibold mb-2">¿Tienes un cupón?</label>
            <div class="flex gap-2">
              <input
                v-model="couponCode"
                type="text"
                placeholder="Código de cupón"
                class="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-400"
                :disabled="appliedCoupon !== null"
              />
              <button
                v-if="!appliedCoupon"
                @click="applyCoupon"
                :disabled="!couponCode || isApplyingCoupon"
                class="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
              >
                {{ isApplyingCoupon ? 'Verificando...' : 'Aplicar' }}
              </button>
              <button
                v-else
                @click="removeCoupon"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
              >
                Quitar
              </button>
            </div>
            
            <!-- Coupon Applied -->
            <div v-if="appliedCoupon" class="mt-3 p-3 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg flex items-center justify-between">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p class="text-sm font-semibold text-green-400">{{ appliedCoupon.code }}</p>
                  <p class="text-xs text-gray-400">{{ appliedCoupon.description }}</p>
                </div>
              </div>
            </div>

            <!-- Coupon Error -->
            <div v-if="couponError" class="mt-3 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg flex items-center gap-2">
              <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-red-400">{{ couponError }}</p>
            </div>
          </div>

          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>S/ {{ cartStore.subtotal.toFixed(2) }}</span>
            </div>
            <div v-if="appliedCoupon" class="flex justify-between text-green-400">
              <span>Descuento ({{ appliedCoupon.code }})</span>
              <span>- S/ {{ discount.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-400">
              <span>Envío</span>
              <span>{{ cartStore.subtotal > 100 ? 'Gratis' : 'S/ 10.00' }}</span>
            </div>
            <div class="flex justify-between text-gray-400">
              <span>IGV (18%)</span>
              <span>S/ {{ (finalSubtotal * 0.18).toFixed(2) }}</span>
            </div>
          </div>

          <div class="border-t border-gray-700 pt-4 mb-6">
            <div class="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span class="text-primary-400">
                S/ {{ finalTotal.toFixed(2) }}
              </span>
            </div>
          </div>

          <NuxtLink to="/checkout" class="w-full btn-primary block text-center">
            Proceder al Pago
          </NuxtLink>

          <button @click="cartStore.clearCart()" class="w-full mt-3 btn-secondary">
            Vaciar Carrito
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const cartStore = useCartStore();
const config = useRuntimeConfig();

const couponCode = ref('');
const appliedCoupon = ref<any>(null);
const couponError = ref('');
const isApplyingCoupon = ref(false);

const discount = computed(() => {
  if (!appliedCoupon.value) return 0;
  
  if (appliedCoupon.value.discountType === 'PERCENTAGE') {
    return (cartStore.subtotal * appliedCoupon.value.discountValue) / 100;
  } else {
    return appliedCoupon.value.discountValue;
  }
});

const finalSubtotal = computed(() => {
  return Math.max(0, cartStore.subtotal - discount.value);
});

const finalTotal = computed(() => {
  const shipping = cartStore.subtotal > 100 ? 0 : 10;
  const tax = finalSubtotal.value * 0.18;
  return finalSubtotal.value + shipping + tax;
});

const applyCoupon = async () => {
  if (!couponCode.value.trim()) return;

  isApplyingCoupon.value = true;
  couponError.value = '';

  try {
    const response = await $fetch(`${config.public.apiUrl}/coupons/validate`, {
      method: 'POST',
      body: { code: couponCode.value.toUpperCase() },
      credentials: 'include',
    });

    appliedCoupon.value = response;
    couponError.value = '';
  } catch (error: any) {
    couponError.value = error.data?.error || 'Cupón inválido o expirado';
    appliedCoupon.value = null;
  } finally {
    isApplyingCoupon.value = false;
  }
};

const removeCoupon = () => {
  appliedCoupon.value = null;
  couponCode.value = '';
  couponError.value = '';
};

const increaseQuantity = (item: any) => {
  cartStore.updateQuantity(item.productId, item.quantity + 1);
};

const decreaseQuantity = (item: any) => {
  if (item.quantity > 1) {
    cartStore.updateQuantity(item.productId, item.quantity - 1);
  }
};

const removeItem = (productId: string) => {
  cartStore.removeItem(productId);
};

onMounted(() => {
  cartStore.fetchCart();
});

useHead({
  title: 'Carrito de Compras',
});
</script>

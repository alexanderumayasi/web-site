<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Breadcrumb -->
    <div class="bg-white border-b">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center space-x-2 text-sm">
          <NuxtLink to="/" class="text-gray-600 hover:text-primary-600">Inicio</NuxtLink>
          <span class="text-gray-400">/</span>
          <NuxtLink to="/cart" class="text-gray-600 hover:text-primary-600">Carrito</NuxtLink>
          <span class="text-gray-400">/</span>
          <span class="text-gray-900">Checkout</span>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Finalizar compra</h1>

      <!-- Progress Steps -->
      <div class="mb-8">
        <div class="flex items-center justify-center space-x-4">
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
              1
            </div>
            <span class="ml-2 text-sm font-medium text-gray-900">Información</span>
          </div>
          <div class="w-16 h-0.5 bg-gray-300"></div>
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full border-2 border-gray-300 text-gray-400 flex items-center justify-center font-semibold">
              2
            </div>
            <span class="ml-2 text-sm font-medium text-gray-400">Envío</span>
          </div>
          <div class="w-16 h-0.5 bg-gray-300"></div>
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full border-2 border-gray-300 text-gray-400 flex items-center justify-center font-semibold">
              3
            </div>
            <span class="ml-2 text-sm font-medium text-gray-400">Pago</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Checkout Form -->
        <div class="lg:col-span-2">
          <form @submit.prevent="processCheckout" class="space-y-6">
            <!-- Contact Information -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-6">Información de contacto</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nombre <span class="text-red-600">*</span>
                  </label>
                  <input 
                    v-model="form.firstName"
                    type="text" 
                    required
                    class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Apellidos <span class="text-red-600">*</span>
                  </label>
                  <input 
                    v-model="form.lastName"
                    type="text" 
                    required
                    class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email <span class="text-red-600">*</span>
                  </label>
                  <input 
                    v-model="form.email"
                    type="email" 
                    required
                    class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono <span class="text-red-600">*</span>
                  </label>
                  <input 
                    v-model="form.phone"
                    type="tel" 
                    required
                    class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <!-- Shipping Address -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-6">Dirección de envío</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Dirección <span class="text-red-600">*</span>
                  </label>
                  <input 
                    v-model="form.address"
                    type="text" 
                    required
                    placeholder="Calle, número, departamento"
                    class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad <span class="text-red-600">*</span>
                    </label>
                    <input 
                      v-model="form.city"
                      type="text" 
                      required
                      class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Provincia <span class="text-red-600">*</span>
                    </label>
                    <input 
                      v-model="form.state"
                      type="text" 
                      required
                      class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Código Postal
                    </label>
                    <input 
                      v-model="form.zipCode"
                      type="text"
                      class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Notas de entrega (opcional)
                  </label>
                  <textarea 
                    v-model="form.notes"
                    rows="3"
                    placeholder="Instrucciones especiales para la entrega"
                    class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-6">Método de pago</h2>
              
              <div class="space-y-4">
                <label class="flex items-center p-4 border-2 border-primary-600 rounded-lg cursor-pointer">
                  <input 
                    type="radio" 
                    v-model="form.paymentMethod" 
                    value="card" 
                    class="mr-3 w-5 h-5 text-primary-600"
                  />
                  <svg class="w-6 h-6 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span class="font-semibold text-gray-900">Tarjeta de crédito/débito</span>
                </label>
                
                <label class="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer">
                  <input 
                    type="radio" 
                    v-model="form.paymentMethod" 
                    value="yape" 
                    class="mr-3 w-5 h-5 text-primary-600"
                  />
                  <svg class="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span class="font-semibold text-gray-900">Yape / Plin</span>
                </label>
                
                <label class="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer">
                  <input 
                    type="radio" 
                    v-model="form.paymentMethod" 
                    value="bank" 
                    class="mr-3 w-5 h-5 text-primary-600"
                  />
                  <svg class="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                  <span class="font-semibold text-gray-900">Transferencia bancaria</span>
                </label>
                
                <label class="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                  <input 
                    type="radio" 
                    v-model="form.paymentMethod" 
                    value="email-pin" 
                    class="mr-3 w-5 h-5 text-primary-600"
                  />
                  <svg class="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <span class="font-semibold text-gray-900">Pago por Email con PIN</span>
                    <p class="text-xs text-gray-600">Te enviaremos un código de verificación</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Terms and Submit -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <label class="flex items-start mb-4">
                <input 
                  v-model="form.acceptTerms" 
                  type="checkbox" 
                  required
                  class="mt-1 mr-3"
                />
                <span class="text-sm text-gray-700">
                  Acepto los <NuxtLink to="/terms" class="text-primary-600 hover:text-primary-700">términos y condiciones</NuxtLink> 
                  y la <NuxtLink to="/privacy" class="text-primary-600 hover:text-primary-700">política de privacidad</NuxtLink>
                </span>
              </label>

              <button 
                type="submit"
                :disabled="processing || !form.acceptTerms"
                class="w-full bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg v-if="processing" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-if="processing">Procesando...</span>
                <span v-else>Proceder al Pago</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Resumen del pedido</h2>

            <!-- Items -->
            <div class="space-y-4 mb-6 max-h-64 overflow-y-auto">
              <div 
                v-for="item in cartStore.items" 
                :key="item.id"
                class="flex space-x-3"
              >
                <img 
                  :src="item.product.images[0]" 
                  :alt="item.product.name"
                  class="w-16 h-16 object-contain rounded border"
                />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900 line-clamp-2">{{ item.product.name }}</p>
                  <p class="text-sm text-gray-600">Cantidad: {{ item.quantity }}</p>
                  <p class="text-sm font-bold text-red-700">S/ {{ (item.product.price * item.quantity).toFixed(2) }}</p>
                </div>
              </div>
            </div>

            <!-- Totals -->
            <div class="space-y-3 border-t pt-4">
              <div class="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>S/ {{ cartStore.subtotal.toFixed(2) }}</span>
              </div>

              <div class="flex justify-between text-gray-700">
                <span>Envío:</span>
                <span class="text-green-700 font-semibold">GRATIS</span>
              </div>

              <div class="flex justify-between text-xl font-bold text-gray-900 border-t pt-3">
                <span>Total:</span>
                <span class="text-red-700">S/ {{ cartStore.total.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Security Badges -->
            <div class="mt-6 pt-6 border-t space-y-2">
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Compra 100% segura
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                Envío GRATIS
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Devoluciones gratuitas
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Gateway Modal -->
    <PaymentGatewayModal
      :is-open="showPaymentModal"
      :amount="cartStore.total"
      :payment-method="form.paymentMethod"
      :order-data="form"
      :stripe-client-secret="stripeClientSecret"
      @close="showPaymentModal = false"
      @success="handlePaymentSuccess"
      @error="handlePaymentError"
    />
  </div>
</template>

<script setup lang="ts">
const cartStore = useCartStore();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const router = useRouter();

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  notes: '',
  paymentMethod: 'card',
  acceptTerms: false
});

const processing = ref(false);
const showPaymentModal = ref(false);
const stripeClientSecret = ref<string | null>(null);
const stripePaymentIntentId = ref<string | null>(null);

const processCheckout = async () => {
  // Prevent multiple submissions
  if (processing.value) {
    return;
  }

  if (!form.acceptTerms) {
    notificationStore.error('Términos requeridos', 'Debes aceptar los términos y condiciones');
    return;
  }

  if (cartStore.items.length === 0) {
    notificationStore.error('Carrito vacío', 'Tu carrito está vacío');
    return;
  }

  // Validar campos requeridos
  if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.address || !form.city || !form.state) {
    notificationStore.error('Campos incompletos', 'Por favor completa todos los campos requeridos');
    return;
  }

  processing.value = true;
  const config = useRuntimeConfig();

  try {
    const response = await $fetch(`${config.public.apiUrl}/stripe/create-payment-intent`, {
      method: 'POST',
      credentials: 'include',
      headers: authStore.accessToken ? {
        Authorization: `Bearer ${authStore.accessToken}`,
      } : {},
      body: {
        orderId: null,
      },
    });

    stripeClientSecret.value = response.clientSecret;
    stripePaymentIntentId.value = response.paymentIntentId;
    showPaymentModal.value = true;
  } catch (error: any) {
    console.error('Error al crear payment intent:', error);
    const errorMessage = error.data?.error || error.message || 'No se pudo iniciar Stripe';
    notificationStore.error('Error de pago', errorMessage);
  } finally {
    processing.value = false;
  }
};

const handlePaymentSuccess = async (paymentData: any) => {
  // Prevent multiple submissions
  if (processing.value) {
    return;
  }
  
  processing.value = true;

  try {
    const config = useRuntimeConfig();
    
    // Aquí harías la llamada al backend para crear la orden
    const response = await $fetch(`${config.public.apiUrl}/orders`, {
      method: 'POST',
      credentials: 'include',
      headers: authStore.accessToken ? {
        Authorization: `Bearer ${authStore.accessToken}`,
      } : {},
      body: {
        shippingAddress: {
          firstName: form.firstName,
          lastName: form.lastName,
          address: form.address,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          phone: form.phone,
          notes: form.notes,
        },
        paymentMethod: form.paymentMethod,
        paymentData: {
          ...paymentData,
          stripePaymentIntentId: stripePaymentIntentId.value,
        },
      }
    });

    // Limpiar carrito
    await cartStore.clearCart();

    // Cerrar modal de pago
    showPaymentModal.value = false;

    // Mostrar notificación de éxito
    notificationStore.success('¡Pedido realizado exitosamente!', 'Recibirás un email de confirmación.');
    
    // Redirigir a página de éxito con detalles
    await router.push({
      path: '/order-success',
      query: {
        orderNumber: response.orderNumber || 'ORD-' + Date.now(),
        transactionId: paymentData.transactionId,
        amount: response.total.toString(), // Usar el total real de la orden del backend
        paymentMethod: form.paymentMethod,
      }
    });
  } catch (error: any) {
    console.error('Error al crear la orden:', error);
    
    // Manejar errores específicos
    let errorMessage = 'Hubo un error al procesar tu pedido';
    
    if (error.data?.error) {
      errorMessage = error.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // Si es error de stock, recargar el carrito
    if (errorMessage.includes('Stock insuficiente') || errorMessage.includes('no está disponible')) {
      await cartStore.fetchCart();
      notificationStore.error('Carrito actualizado', errorMessage + '. Por favor revisa tu carrito.');
      showPaymentModal.value = false;
      await router.push('/cart');
    } else {
      notificationStore.error('Error en el pedido', errorMessage);
    }
  } finally {
    processing.value = false;
  }
};

const handlePaymentError = (error: any) => {
  notificationStore.error('El pago no pudo ser procesado. Por favor intenta nuevamente.');
};

// Redirect if cart is empty
onMounted(async () => {
  // Fetch latest cart data
  await cartStore.fetchCart();
  
  if (cartStore.items.length === 0) {
    notificationStore.error('Carrito vacío', 'Tu carrito está vacío');
    router.push('/cart');
    return;
  }

  // Pre-fill form if user is logged in
  if (authStore.user) {
    form.email = authStore.user.email;
    form.firstName = authStore.user.firstName || '';
    form.lastName = authStore.user.lastName || '';
    form.phone = authStore.user.phone || '';
  }
});

// SEO
useHead({
  title: 'Checkout - Gaming Store',
  meta: [
    { name: 'description', content: 'Finaliza tu compra de forma segura' },
    { name: 'robots', content: 'noindex' }
  ]
});
</script>

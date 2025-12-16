<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-60"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
          <div class="bg-gradient-to-r from-primary-600 to-blue-600 text-white p-6">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs uppercase tracking-widest text-white/70">Checkout seguro</p>
                <h2 class="text-2xl font-bold leading-tight">{{ paymentTitle }}</h2>
                <p class="text-sm text-white/70 mt-1">{{ paymentSubtitle }}</p>
              </div>
              <button
                class="text-white/80 hover:text-white transition-colors"
                type="button"
                :disabled="processing"
                @click="closeModal"
              >
                <span class="sr-only">Cerrar</span>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="p-6 space-y-6">
            <div class="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between">
              <div>
                <p class="text-xs text-gray-500">Total a pagar</p>
                <p class="text-2xl font-bold text-gray-900">S/ {{ props.amount.toFixed(2) }}</p>
              </div>
              <div class="text-right text-sm text-gray-500">
                <p class="font-semibold text-primary-600 capitalize">{{ props.paymentMethod }}</p>
                <p v-if="isCardMethod" class="text-xs text-gray-400">Procesado con Stripe</p>
              </div>
            </div>

            <div v-if="paymentStatus === 'success'" class="space-y-5">
              <div class="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-green-900">Pago verificado correctamente</p>
                  <p class="text-sm text-green-800">Tu transacción fue autorizada por la pasarela.</p>
                </div>
              </div>

              <div class="bg-gray-50 rounded-xl p-4 space-y-3 text-sm text-gray-700">
                <div class="flex justify-between">
                  <span class="text-gray-500">ID de transacción:</span>
                  <span class="font-mono text-gray-900">{{ transactionId }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Método:</span>
                  <span class="capitalize text-gray-900">{{ props.paymentMethod }}</span>
                </div>
                <div v-if="paymentDetails?.cardBrand || paymentDetails?.cardLastFour" class="flex justify-between">
                  <span class="text-gray-500">Tarjeta:</span>
                  <span class="text-gray-900">{{ paymentDetails?.cardBrand }} **** {{ paymentDetails?.cardLastFour }}</span>
                </div>
              </div>

              <div class="space-y-3">
                <button
                  type="button"
                  class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  @click="confirmPayment"
                >
                  Confirmar pago y continuar
                </button>
                <button
                  type="button"
                  class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold transition-colors"
                  @click="closeModal"
                >
                  Cerrar
                </button>
              </div>
            </div>

            <div v-else-if="paymentStatus === 'error'" class="space-y-5">
              <div class="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-red-900">No pudimos procesar el pago</p>
                  <p class="text-sm text-red-800">{{ errorMessage || 'Intenta de nuevo en unos segundos.' }}</p>
                </div>
              </div>

              <div class="space-y-3">
                <button
                  type="button"
                  class="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  :disabled="processing"
                  @click="retryPayment"
                >
                  Intentar de nuevo
                </button>
                <button
                  type="button"
                  class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold transition-colors"
                  :disabled="processing"
                  @click="closeModal"
                >
                  Cancelar
                </button>
              </div>
            </div>

            <form v-else class="space-y-6" @submit.prevent="processPayment">
              <div v-if="isCardMethod" class="space-y-4">
                <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-900">
                  <p class="font-semibold">Pagos protegidos por Stripe</p>
                  <p class="text-blue-800">Tus datos se cifran y nunca se almacenan en nuestros servidores.</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del titular <span class="text-red-600">*</span></label>
                  <input
                    v-model="cardForm.name"
                    type="text"
                    required
                    class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Juan Pérez"
                    :disabled="processing"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Datos de la tarjeta <span class="text-red-600">*</span></label>
                  <div id="card-element" class="stripe-card-container"></div>
                  
                  <!-- Test Cards Info - Expandible -->
                  <div class="mt-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-start justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <p class="text-sm font-bold text-gray-800">Tarjetas de Prueba Disponibles</p>
                      </div>
                      <button 
                        type="button"
                        @click="showTestCards = !showTestCards"
                        class="text-blue-600 hover:text-blue-700 text-xs font-semibold"
                      >
                        {{ showTestCards ? 'Ocultar' : 'Ver todas' }}
                      </button>
                    </div>
                    
                    <!-- Always show main test card -->
                    <div class="space-y-2">
                      <div class="bg-white rounded-lg p-3 border border-blue-100">
                        <div class="flex items-center justify-between">
                          <div>
                            <p class="text-xs font-semibold text-gray-700">✅ Pago Exitoso</p>
                            <p class="text-sm text-gray-900 font-mono font-bold">4242 4242 4242 4242</p>
                          </div>
                          <button
                            type="button"
                            @click="copyToClipboard('4242424242424242')"
                            class="text-blue-600 hover:text-blue-700"
                            title="Copiar número"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <!-- Expandible additional cards -->
                      <div v-if="showTestCards" class="space-y-2 mt-2">
                        <div class="bg-white rounded-lg p-3 border border-yellow-100">
                          <div class="flex items-center justify-between">
                            <div>
                              <p class="text-xs font-semibold text-gray-700">⚠️ Requiere Autenticación</p>
                              <p class="text-sm text-gray-900 font-mono">4000 0027 6000 3184</p>
                            </div>
                            <button
                              type="button"
                              @click="copyToClipboard('4000002760003184')"
                              class="text-blue-600 hover:text-blue-700"
                            >
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <div class="bg-white rounded-lg p-3 border border-red-100">
                          <div class="flex items-center justify-between">
                            <div>
                              <p class="text-xs font-semibold text-gray-700">❌ Tarjeta Rechazada</p>
                              <p class="text-sm text-gray-900 font-mono">4000 0000 0000 0002</p>
                            </div>
                            <button
                              type="button"
                              @click="copyToClipboard('4000000000000002')"
                              class="text-blue-600 hover:text-blue-700"
                            >
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div class="bg-white rounded-lg p-3 border border-orange-100">
                          <div class="flex items-center justify-between">
                            <div>
                              <p class="text-xs font-semibold text-gray-700">💳 Fondos Insuficientes</p>
                              <p class="text-sm text-gray-900 font-mono">4000 0000 0000 9995</p>
                            </div>
                            <button
                              type="button"
                              @click="copyToClipboard('4000000000009995')"
                              class="text-blue-600 hover:text-blue-700"
                            >
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <p class="text-xs text-gray-600 mt-3">
                        <span class="font-semibold">Fecha:</span> Cualquier fecha futura (ej: 12/28) • 
                        <span class="font-semibold">CVC:</span> Cualquier 3 dígitos (ej: 123)
                      </p>
                    </div>
                  </div>
                  
                  <p class="text-xs text-green-600 mt-2 flex items-center space-x-1 bg-green-50 px-3 py-2 rounded-lg">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="font-semibold">Modo de prueba activo - Usa las tarjetas de arriba</span>
                  </p>
                  
                  <p v-if="stripeError" class="text-sm text-red-600 mt-2">{{ stripeError }}</p>
                  <div v-if="!props.stripeClientSecret" class="bg-red-50 border border-red-200 rounded-lg p-3 mt-3 text-sm text-red-700">
                    No pudimos inicializar Stripe. Cierra el modal y vuelve a intentarlo.
                  </div>
                </div>
              </div>

              <div v-else-if="isEmailPinMethod" class="space-y-4">
                <div class="bg-green-50 border border-green-100 rounded-xl p-4 text-sm text-green-900">
                  <p class="font-semibold">Verifica tu compra con un PIN</p>
                  <p>Te enviaremos un código de 6 dígitos a tu correo {{ userEmail || 'registrado' }}.</p>
                </div>

                <div v-if="pinSent" class="space-y-4">
                  <div v-if="devPin" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                    <p class="font-semibold text-xs uppercase tracking-widest">Modo desarrollo</p>
                    <p>PIN generado: <span class="font-mono text-lg">{{ devPin }}</span></p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Ingresa el PIN <span class="text-red-600">*</span></label>
                    <input
                      v-model="pinCode"
                      type="text"
                      maxlength="6"
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 text-center text-2xl tracking-[0.4em] font-mono"
                      placeholder="••••••"
                      @input="formatPIN"
                      :disabled="processing"
                      required
                    />
                    <p class="text-xs text-gray-500 mt-1">Código válido por 10 minutos.</p>
                  </div>

                  <button
                    type="button"
                    class="text-sm text-primary-600 hover:text-primary-700"
                    :disabled="processing || resendCooldown > 0"
                    @click="resendPIN"
                  >
                    {{ resendCooldown > 0 ? `Reenviar PIN (${resendCooldown}s)` : 'Reenviar PIN' }}
                  </button>
                </div>

                <div v-else class="space-y-3 text-sm text-gray-700">
                  <p>Presiona el botón para recibir tu código PIN y confirmar la compra.</p>
                  <ul class="list-disc list-inside text-xs text-gray-500">
                    <li>Revisa tu bandeja de entrada y spam.</li>
                    <li>Cada código es válido por una sola compra.</li>
                  </ul>
                </div>
              </div>

              <div v-else class="space-y-3 text-sm text-gray-700">
                <p>Confirma tu pago para continuar con el pedido.</p>
                <p class="text-xs text-gray-500">Recibirás instrucciones adicionales en tu correo.</p>
              </div>

              <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {{ errorMessage }}
              </div>

              <div class="space-y-3">
                <button
                  v-if="isEmailPinMethod && !pinSent"
                  type="button"
                  class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                  :disabled="processing"
                  @click="sendPIN"
                >
                  <svg
                    v-if="processing"
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span v-if="processing">Enviando PIN...</span>
                  <span v-else>Enviar PIN a mi correo</span>
                </button>

                <button
                  v-else
                  type="submit"
                  class="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                  :disabled="isPrimaryDisabled"
                >
                  <svg
                    v-if="processing"
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span v-if="processing">
                    {{ isEmailPinMethod ? 'Verificando PIN...' : 'Procesando pago...' }}
                  </span>
                  <span v-else-if="isEmailPinMethod">Verificar PIN y pagar</span>
                  <span v-else-if="isCardMethod">Pagar S/ {{ props.amount.toFixed(2) }}</span>
                  <span v-else>Confirmar pago</span>
                </button>

                <button
                  type="button"
                  class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold transition-colors disabled:opacity-60"
                  :disabled="processing"
                  @click="closeModal"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { loadStripe, type Stripe, type StripeElements, type StripeCardElement } from '@stripe/stripe-js';
import { useAuthStore } from '~/stores/auth';

interface Props {
  isOpen: boolean;
  amount: number;
  paymentMethod: string;
  orderData?: any;
  stripeClientSecret?: string | null;
}

const props = defineProps<Props>();
const emit = defineEmits(['close', 'success', 'error']);

const config = useRuntimeConfig();
const authStore = useAuthStore();
const isClient = import.meta.client;

const processing = ref(false);
const paymentStatus = ref<'success' | 'error' | null>(null);
const transactionId = ref('');
const errorMessage = ref('');
const paymentDetails = ref<Record<string, any> | null>(null);

const isCardMethod = computed(() => props.paymentMethod === 'card');
const isEmailPinMethod = computed(() => props.paymentMethod === 'email-pin');

const paymentTitle = computed(() => {
  if (isCardMethod.value) return 'Pago con tarjeta';
  if (isEmailPinMethod.value) return 'Pago por código PIN';
  return 'Confirmar pago';
});

const paymentSubtitle = computed(() => {
  if (isCardMethod.value) return 'Procesamos tu tarjeta con Stripe de manera segura.';
  if (isEmailPinMethod.value) return 'Verifica tu compra ingresando el código enviado a tu correo.';
  return 'Revisa y confirma los datos antes de continuar.';
});

const cardForm = reactive({
  name: '',
});

const stripeInstance = ref<Stripe | null>(null);
const stripeElements = ref<StripeElements | null>(null);
const cardElement = ref<StripeCardElement | null>(null);
const cardElementMounted = ref(false);
const stripeError = ref('');
const showTestCards = ref(false);

const pinSent = ref(false);
const pinId = ref('');
const pinCode = ref('');
const devPin = ref('');
const resendCooldown = ref(0);
const userEmail = computed(() => authStore.user?.email || '');
let resendTimer: ReturnType<typeof setInterval> | null = null;

const stopResendCooldown = () => {
  if (resendTimer) {
    clearInterval(resendTimer);
    resendTimer = null;
  }
  resendCooldown.value = 0;
};

const startResendCooldown = () => {
  stopResendCooldown();
  resendCooldown.value = 60;
  resendTimer = setInterval(() => {
    resendCooldown.value = Math.max(resendCooldown.value - 1, 0);
    if (resendCooldown.value === 0 && resendTimer) {
      clearInterval(resendTimer);
      resendTimer = null;
    }
  }, 1000);
};

const formatPIN = (event: Event) => {
  const input = event.target as HTMLInputElement;
  pinCode.value = input.value.replace(/\D/g, '').slice(0, 6);
};

const loadStripeInstance = async () => {
  if (stripeInstance.value) {
    return stripeInstance.value;
  }

  if (!config.public.stripeKey) {
    stripeError.value = 'Falta la clave pública de Stripe (NUXT_PUBLIC_STRIPE_KEY).';
    return null;
  }

  stripeInstance.value = await loadStripe(config.public.stripeKey);

  if (!stripeInstance.value) {
    stripeError.value = 'No pudimos inicializar Stripe.';
  }

  return stripeInstance.value;
};

const mountStripeCard = async () => {
  if (!isClient || cardElementMounted.value || !isCardMethod.value || !props.isOpen) {
    return;
  }

  if (!props.stripeClientSecret) {
    stripeError.value = 'No recibimos autorización de Stripe. Cierra el modal e inténtalo nuevamente.';
    return;
  }

  await nextTick();
  const container = document.getElementById('card-element');
  if (!container) {
    return;
  }

  const stripe = await loadStripeInstance();
  if (!stripe) {
    return;
  }

  stripeElements.value = stripe.elements();
  cardElement.value = stripeElements.value.create('card', {
    style: {
      base: {
        color: '#1f2937',
        fontSize: '16px',
        '::placeholder': { color: '#9ca3af' },
      },
      invalid: {
        color: '#dc2626',
      },
    },
  });
  cardElement.value.mount(container);
  cardElementMounted.value = true;
};

const unmountStripeCard = () => {
  if (cardElement.value) {
    cardElement.value.destroy();
  }
  cardElement.value = null;
  stripeElements.value = null;
  cardElementMounted.value = false;
  stripeError.value = '';
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    const notificationStore = useNotificationStore();
    notificationStore.success('Copiado', 'Número de tarjeta copiado al portapapeles');
  } catch (err) {
    console.error('Error copying to clipboard:', err);
  }
};

const sendPIN = async () => {
  if (!authStore.accessToken) {
    errorMessage.value = 'Debes iniciar sesión para usar este método.';
    paymentStatus.value = 'error';
    emit('error', errorMessage.value);
    return;
  }

  processing.value = true;
  errorMessage.value = '';

  try {
    const response = await $fetch(`${config.public.apiUrl}/payment-pin/send-pin`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: {
        orderId: props.orderData?.id || 'temp_order',
        amount: props.amount,
      },
    });

    if (response.success) {
      pinSent.value = true;
      pinId.value = response.pinId;
      devPin.value = response.devPin || '';
      startResendCooldown();
      return;
    }

    throw new Error(response.message || 'No pudimos enviar el PIN.');
  } catch (error: any) {
    errorMessage.value = error.data?.message || error.message || 'Error al enviar el PIN.';
    emit('error', errorMessage.value);
  } finally {
    processing.value = false;
  }
};

const resendPIN = async () => {
  pinSent.value = false;
  pinCode.value = '';
  await sendPIN();
};

const verifyPIN = async () => {
  if (!authStore.accessToken) {
    errorMessage.value = 'Debes iniciar sesión para verificar el PIN.';
    paymentStatus.value = 'error';
    emit('error', errorMessage.value);
    return;
  }

  if (pinCode.value.length !== 6) {
    errorMessage.value = 'Ingresa el código completo.';
    return;
  }

  processing.value = true;
  paymentStatus.value = null;
  errorMessage.value = '';

  try {
    const response = await $fetch(`${config.public.apiUrl}/payment-pin/verify-pin`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: {
        pinId: pinId.value,
        pin: pinCode.value,
      },
    });

    if (response.success) {
      transactionId.value = response.transactionId;
      paymentDetails.value = {
        method: 'email-pin',
        verificationMethod: 'email-pin',
        pinId: pinId.value,
      };
      paymentStatus.value = 'success';
      return;
    }

    throw new Error(response.message || 'PIN incorrecto.');
  } catch (error: any) {
    errorMessage.value = error.data?.message || error.message || 'No pudimos verificar el PIN.';
    paymentStatus.value = 'error';
    emit('error', errorMessage.value);
  } finally {
    processing.value = false;
  }
};

const handleStripePayment = async () => {
  if (!props.stripeClientSecret) {
    stripeError.value = 'No recibimos autorización de pago. Cierra el modal y vuelve a intentarlo.';
    errorMessage.value = stripeError.value;
    paymentStatus.value = 'error';
    emit('error', stripeError.value);
    return;
  }

  if (!cardForm.name.trim()) {
    stripeError.value = 'Ingresa el nombre del titular.';
    return;
  }

  await mountStripeCard();

  const stripe = await loadStripeInstance();
  if (!stripe || !cardElement.value) {
    stripeError.value = 'Stripe no está listo. Intenta nuevamente.';
    paymentStatus.value = 'error';
    errorMessage.value = stripeError.value;
    emit('error', stripeError.value);
    return;
  }

  processing.value = true;
  paymentStatus.value = null;
  errorMessage.value = '';
  stripeError.value = '';

  const { error, paymentIntent } = await stripe.confirmCardPayment(props.stripeClientSecret, {
    payment_method: {
      card: cardElement.value,
      billing_details: {
        name: cardForm.name,
        email: userEmail.value || undefined,
      },
    },
  });

  processing.value = false;

  if (error) {
    stripeError.value = error.message || 'No pudimos procesar el pago con la tarjeta.';
    paymentStatus.value = 'error';
    errorMessage.value = stripeError.value;
    emit('error', stripeError.value);
    return;
  }

  if (!paymentIntent || paymentIntent.status !== 'succeeded') {
    paymentStatus.value = 'error';
    errorMessage.value = 'El pago no se completó. Intenta nuevamente.';
    emit('error', errorMessage.value);
    return;
  }

  transactionId.value = paymentIntent.id;
  paymentDetails.value = {
    method: 'card',
    stripePaymentIntentId: paymentIntent.id,
    stripeStatus: paymentIntent.status,
    amountReceived: paymentIntent.amount_received,
    currency: paymentIntent.currency,
    cardBrand: paymentIntent.charges?.data?.[0]?.payment_method_details?.card?.brand,
    cardLastFour: paymentIntent.charges?.data?.[0]?.payment_method_details?.card?.last4,
  };
  paymentStatus.value = 'success';
};

const processPayment = async () => {
  if (processing.value) {
    return;
  }

  if (isCardMethod.value) {
    await handleStripePayment();
    return;
  }

  if (isEmailPinMethod.value) {
    await verifyPIN();
    return;
  }

  processing.value = true;
  paymentStatus.value = null;
  errorMessage.value = '';
  await new Promise(resolve => setTimeout(resolve, 1200));
  transactionId.value = 'SIM-' + Math.random().toString(36).slice(2, 10).toUpperCase();
  paymentDetails.value = { method: props.paymentMethod, simulated: true };
  paymentStatus.value = 'success';
  processing.value = false;
};

const confirmPayment = () => {
  emit('success', {
    transactionId: transactionId.value,
    amount: props.amount,
    paymentMethod: props.paymentMethod,
    ...(paymentDetails.value || {}),
  });
  closeModal();
};

const retryPayment = () => {
  paymentStatus.value = null;
  errorMessage.value = '';
  stripeError.value = '';
};

const closeModal = () => {
  if (processing.value) {
    return;
  }
  emit('close');
};

const resetState = () => {
  processing.value = false;
  paymentStatus.value = null;
  transactionId.value = '';
  errorMessage.value = '';
  stripeError.value = '';
  paymentDetails.value = null;
  cardForm.name = '';
  pinSent.value = false;
  pinId.value = '';
  pinCode.value = '';
  devPin.value = '';
  stopResendCooldown();
  unmountStripeCard();
};

const isPrimaryDisabled = computed(() => {
  if (processing.value) {
    return true;
  }

  if (isCardMethod.value) {
    return !props.stripeClientSecret || !cardForm.name.trim();
  }

  if (isEmailPinMethod.value) {
    return !pinSent.value || pinCode.value.length !== 6;
  }

  return false;
});

watch(() => props.isOpen, async (isOpen) => {
  if (!isClient) {
    return;
  }
  document.body.style.overflow = isOpen ? 'hidden' : '';
  if (isOpen && isCardMethod.value) {
    await mountStripeCard();
  }
  if (!isOpen) {
    resetState();
  }
}, { immediate: true });

watch(isCardMethod, async (isCard) => {
  if (!isClient || !props.isOpen) {
    return;
  }
  if (isCard) {
    await mountStripeCard();
  } else {
    unmountStripeCard();
  }
});

watch(isEmailPinMethod, (isEmail) => {
  if (!isEmail) {
    pinSent.value = false;
    pinCode.value = '';
    pinId.value = '';
    devPin.value = '';
    stopResendCooldown();
  }
});

watch(() => props.stripeClientSecret, async (secret) => {
  if (!isClient || !props.isOpen || !isCardMethod.value) {
    return;
  }

  unmountStripeCard();

  if (secret) {
    stripeError.value = '';
    await mountStripeCard();
  } else {
    stripeError.value = 'No recibimos autorización de Stripe. Cierra el modal e inténtalo nuevamente.';
  }
});

onUnmounted(() => {
  resetState();
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

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.25s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: translateY(10px) scale(0.98);
}

/* Contenedor del elemento de tarjeta de Stripe */
.stripe-card-container {
  padding: 14px;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  min-height: 42px;
}

/* Estilos del elemento de Stripe */
:deep(.StripeElement) {
  width: 100%;
}

:deep(.StripeElement--focus) {
  border-color: #2563eb !important;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important;
}

:deep(.StripeElement--invalid) {
  border-color: #dc2626 !important;
}

/* Ocultar mensajes de advertencia de autocompletado */
:deep(.StripeElement iframe) {
  height: 100% !important;
}

/* Ocultar el mensaje rojo de "conexión no segura" en desarrollo */
:deep([class*="__PrivateStripeElement-input"]) {
  filter: none !important;
}
</style>

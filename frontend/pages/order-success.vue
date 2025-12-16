<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
    <div class="max-w-2xl w-full">
      <!-- Success Card -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Header with Animation -->
        <div class="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
          <div class="mb-4">
            <div class="inline-block">
              <svg 
                class="w-24 h-24 text-white animate-bounce-once" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
          </div>
          <h1 class="text-3xl font-bold text-white mb-2">
            ¡Pago Exitoso!
          </h1>
          <p class="text-green-100 text-lg">
            Tu pedido ha sido confirmado
          </p>
        </div>

        <!-- Order Details -->
        <div class="p-8">
          <!-- Order Number -->
          <div class="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
            <div class="text-center">
              <p class="text-sm text-gray-600 mb-1">Número de Orden</p>
              <p class="text-2xl font-bold text-gray-900 font-mono">
                {{ orderNumber }}
              </p>
            </div>
          </div>

          <!-- Payment Info -->
          <div class="space-y-4 mb-8">
            <div class="flex items-center justify-between py-3 border-b">
              <span class="text-gray-600">Fecha de compra:</span>
              <span class="font-semibold text-gray-900">{{ orderDate }}</span>
            </div>

            <div class="flex items-center justify-between py-3 border-b">
              <span class="text-gray-600">Método de pago:</span>
              <span class="font-semibold text-gray-900">{{ paymentMethodText }}</span>
            </div>

            <div class="flex items-center justify-between py-3 border-b">
              <span class="text-gray-600">Total pagado:</span>
              <span class="text-2xl font-bold text-green-600">S/ {{ amount.toFixed(2) }}</span>
            </div>

            <div v-if="transactionId" class="flex items-center justify-between py-3 border-b">
              <span class="text-gray-600">ID de transacción:</span>
              <span class="font-mono text-sm text-gray-900">{{ transactionId }}</span>
            </div>
          </div>

          <!-- Next Steps -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 class="font-bold text-gray-900 mb-3 flex items-center">
              <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Próximos pasos
            </h3>
            <ul class="space-y-2 text-sm text-gray-700">
              <li class="flex items-start">
                <svg class="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Recibirás un email de confirmación en los próximos minutos</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Tu pedido será procesado y enviado en las próximas 24-48 horas</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Podrás hacer seguimiento de tu pedido desde tu cuenta</span>
              </li>
            </ul>
          </div>

          <!-- Action Buttons -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- WhatsApp Button -->
            <button
              @click="sendWhatsAppReceipt"
              class="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Enviar a WhatsApp
            </button>
            
            <NuxtLink 
              to="/"
              class="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center"
            >
              Volver al Inicio
            </NuxtLink>
            
            <NuxtLink 
              to="/products"
              class="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
            >
              Seguir Comprando
            </NuxtLink>
          </div>

          <!-- Support Info -->
          <div class="mt-8 pt-6 border-t">
            <p class="text-sm text-gray-600 mb-3 text-center">
              ¿Tienes alguna pregunta sobre tu pedido?
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="https://wa.me/51973061049"
                target="_blank"
                class="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-sm"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                +51 973 061 049
              </a>
              <span class="text-gray-400">•</span>
              <a 
                href="mailto:umayasialexander@gmail.com"
                class="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                umayasialexander@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="mt-6 text-center text-sm text-gray-600">
        <p>Se ha enviado una copia de tu recibo a tu email</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const authStore = useAuthStore();

// Get order details from route query or props
const orderNumber = computed(() => {
  return route.query.orderNumber || 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
});

const transactionId = computed(() => {
  return route.query.transactionId as string || '';
});

const amount = computed(() => {
  return parseFloat(route.query.amount as string) || 0;
});

const paymentMethod = computed(() => {
  return route.query.paymentMethod as string || 'card';
});

const paymentMethodText = computed(() => {
  const methods: Record<string, string> = {
    'card': 'Tarjeta de Crédito/Débito',
    'yape': 'Yape / Plin',
    'bank': 'Transferencia Bancaria',
  };
  return methods[paymentMethod.value] || 'Tarjeta de Crédito';
});

const orderDate = computed(() => {
  const now = new Date();
  return now.toLocaleDateString('es-PE', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
});

// Función para enviar comprobante por WhatsApp
const sendWhatsAppReceipt = () => {
  // Obtener información del cliente
  const customerName = authStore.user?.name || 'Cliente';
  const customerEmail = authStore.user?.email || '';
  
  // Construir el mensaje del comprobante
  const message = `
🎮 *GAMING STORE - COMPROBANTE DE PAGO* 🎮

✅ *¡PAGO EXITOSO!*

👤 *Cliente:* ${customerName}
${customerEmail ? `📧 *Email:* ${customerEmail}\n` : ''}
📋 *Detalles de la compra:*

🔢 *Número de Orden:* ${orderNumber.value}

📅 *Fecha de compra:* ${orderDate.value}

💳 *Método de pago:* ${paymentMethodText.value}

💰 *Total pagado:* S/ ${amount.value.toFixed(2)}

${transactionId.value ? `🔐 *ID de transacción:* ${transactionId.value}\n` : ''}
-----------------------------------

📦 *Estado:* Confirmado

🚚 *Envío:* Tu pedido será procesado en las próximas 24-48 horas

📧 *Confirmación:* Recibirás un email con todos los detalles

-----------------------------------

¿Preguntas? Contáctanos:
📞 WhatsApp: +51 973 061 049
📧 Email: umayasialexander@gmail.com

¡Gracias por tu compra! 🎉
`.trim();

  // Crear el enlace de WhatsApp SIN número específico (cliente puede enviarlo a quien quiera)
  const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
  
  // Abrir WhatsApp en una nueva ventana
  window.open(whatsappURL, '_blank');
};

// SEO
useHead({
  title: 'Pago Exitoso - Gaming Store',
  meta: [
    { name: 'description', content: 'Tu pago ha sido procesado exitosamente' },
    { name: 'robots', content: 'noindex' }
  ]
});
</script>

<style scoped>
@keyframes bounce-once {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-25px);
  }
}

.animate-bounce-once {
  animation: bounce-once 1s ease-in-out;
}
</style>

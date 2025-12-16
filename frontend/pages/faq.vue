<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8 text-center">
      <h1 class="text-4xl font-bold mb-4">Preguntas Frecuentes</h1>
      <p class="text-gray-400">Encuentra respuestas a las preguntas más comunes</p>
    </div>

    <!-- FAQ Sections -->
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- General -->
      <div>
        <h2 class="text-2xl font-bold mb-4 text-primary-400">General</h2>
        <div class="space-y-4">
          <div v-for="(faq, index) in generalFaqs" :key="index" class="card">
            <button
              @click="toggleFaq('general', index)"
              class="w-full flex items-center justify-between text-left"
            >
              <h3 class="font-semibold text-lg pr-4">{{ faq.question }}</h3>
              <svg
                class="w-5 h-5 text-primary-400 transition-transform"
                :class="{ 'rotate-180': openFaqs.general === index }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-if="openFaqs.general === index" class="mt-4 text-gray-400">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>

      <!-- Pedidos y Envíos -->
      <div>
        <h2 class="text-2xl font-bold mb-4 text-primary-400">Pedidos y Envíos</h2>
        <div class="space-y-4">
          <div v-for="(faq, index) in shippingFaqs" :key="index" class="card">
            <button
              @click="toggleFaq('shipping', index)"
              class="w-full flex items-center justify-between text-left"
            >
              <h3 class="font-semibold text-lg pr-4">{{ faq.question }}</h3>
              <svg
                class="w-5 h-5 text-primary-400 transition-transform"
                :class="{ 'rotate-180': openFaqs.shipping === index }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-if="openFaqs.shipping === index" class="mt-4 text-gray-400">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>

      <!-- Pagos -->
      <div>
        <h2 class="text-2xl font-bold mb-4 text-primary-400">Pagos y Facturación</h2>
        <div class="space-y-4">
          <div v-for="(faq, index) in paymentFaqs" :key="index" class="card">
            <button
              @click="toggleFaq('payment', index)"
              class="w-full flex items-center justify-between text-left"
            >
              <h3 class="font-semibold text-lg pr-4">{{ faq.question }}</h3>
              <svg
                class="w-5 h-5 text-primary-400 transition-transform"
                :class="{ 'rotate-180': openFaqs.payment === index }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-if="openFaqs.payment === index" class="mt-4 text-gray-400">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact CTA -->
    <div class="max-w-4xl mx-auto mt-12 card bg-gradient-to-r from-primary-600/10 to-purple-600/10 border-primary-500/50">
      <div class="text-center">
        <h3 class="text-2xl font-bold mb-2">¿No encuentras lo que buscas?</h3>
        <p class="text-gray-400 mb-6">Nuestro equipo de soporte está listo para ayudarte</p>
        <NuxtLink to="/contact" class="btn-primary">
          Contáctanos
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const openFaqs = ref({
  general: -1,
  shipping: -1,
  payment: -1
});

const toggleFaq = (section: string, index: number) => {
  if (openFaqs.value[section as keyof typeof openFaqs.value] === index) {
    openFaqs.value[section as keyof typeof openFaqs.value] = -1;
  } else {
    openFaqs.value[section as keyof typeof openFaqs.value] = index;
  }
};

const generalFaqs = [
  {
    question: '¿Cómo puedo crear una cuenta?',
    answer: 'Puedes crear una cuenta haciendo clic en "Registrarse" en la parte superior derecha de la página. Solo necesitas proporcionar tu email, nombre y contraseña.'
  },
  {
    question: '¿Puedo modificar mi pedido después de realizarlo?',
    answer: 'Sí, puedes modificar tu pedido dentro de las primeras 2 horas después de haberlo realizado. Contacta a nuestro servicio al cliente para hacer cambios.'
  },
  {
    question: '¿Los productos tienen garantía?',
    answer: 'Sí, todos nuestros productos tienen garantía del fabricante. El período de garantía varía según el producto y está especificado en la descripción de cada artículo.'
  }
];

const shippingFaqs = [
  {
    question: '¿Cuánto tiempo tarda el envío?',
    answer: 'El tiempo de envío varía según tu ubicación: Lima (24-48 horas), Provincias (3-5 días hábiles). Los envíos express están disponibles para entregas en 24 horas.'
  },
  {
    question: '¿Cuál es el costo de envío?',
    answer: 'El envío es GRATIS en compras mayores a S/ 500. Para compras menores, el costo es de S/ 15 en Lima y S/ 25 a provincias.'
  },
  {
    question: '¿Puedo rastrear mi pedido?',
    answer: 'Sí, una vez que tu pedido sea enviado, recibirás un código de seguimiento por email para rastrear tu paquete en tiempo real.'
  }
];

const paymentFaqs = [
  {
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos tarjetas de crédito/débito (Visa, Mastercard), transferencias bancarias, y billeteras digitales (Yape, Plin).'
  },
  {
    question: '¿Es seguro pagar en línea?',
    answer: 'Sí, utilizamos encriptación SSL y procesamos los pagos a través de Stripe, uno de los procesadores de pago más seguros del mundo.'
  },
  {
    question: '¿Puedo obtener una factura?',
    answer: 'Sí, todas las compras incluyen boleta electrónica. Si necesitas factura, puedes solicitarla proporcionando tu RUC antes de finalizar la compra.'
  }
];
</script>

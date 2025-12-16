<template>
  <div class="fixed bottom-4 right-4 z-50">
    <!-- Chat Button -->
    <button
      v-if="!isOpen"
      @click="toggleChat"
      class="relative bg-primary-600 text-white rounded-full p-4 shadow-lg hover:bg-primary-700 transition-all hover:scale-110"
      aria-label="Abrir chat"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
        {{ unreadCount }}
      </span>
    </button>

    <!-- Chat Window -->
    <Transition name="chat">
      <div
        v-if="isOpen"
        class="bg-white rounded-lg shadow-2xl w-96 h-[600px] flex flex-col overflow-hidden"
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold">Asistente Gaming Store</h3>
              <p class="text-xs text-primary-100">Powered by Gemini AI</p>
            </div>
          </div>
          <button
            @click="toggleChat"
            class="hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Messages -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          <!-- Welcome Message -->
          <div v-if="messages.length === 0" class="text-center py-8">
            <svg class="w-16 h-16 mx-auto text-primary-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h4 class="text-lg font-bold text-gray-900 mb-2">¡Hola! 👋</h4>
            <p class="text-sm font-medium text-gray-700 mb-4">
              Soy tu asistente virtual. Puedo ayudarte a:
            </p>
            <ul class="text-sm font-medium text-gray-700 text-left max-w-xs mx-auto space-y-2">
              <li>✓ Encontrar productos</li>
              <li>✓ Comparar especificaciones</li>
              <li>✓ Recomendar componentes</li>
              <li>✓ Responder tus preguntas</li>
            </ul>
          </div>

          <!-- Suggestions (only when no messages) -->
          <div v-if="messages.length === 0 && suggestions.length > 0" class="space-y-2">
            <p class="text-xs font-semibold text-gray-700 uppercase">SUGERENCIAS:</p>
            <button
              v-for="(suggestion, index) in suggestions"
              :key="index"
              @click="sendSuggestion(suggestion)"
              class="block w-full text-left text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-lg px-4 py-3 hover:border-primary-600 hover:bg-primary-50 hover:text-primary-700 transition-colors shadow-sm"
            >
              {{ suggestion }}
            </button>
          </div>

          <!-- Message List -->
          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']"
          >
            <div
              :class="[
                'max-w-[80%] rounded-lg px-4 py-2',
                msg.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border-2 border-gray-300 text-gray-900 shadow-sm'
              ]"
            >
              <div v-if="msg.role === 'assistant'" class="flex items-start space-x-2">
                <svg class="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <p 
                  class="text-sm font-medium text-gray-900 whitespace-pre-wrap leading-relaxed" 
                  v-html="formatMessage(msg.content)"
                  @click="handleMessageClick"
                ></p>
              </div>
              <p v-else class="text-sm font-medium whitespace-pre-wrap">{{ msg.content }}</p>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isTyping" class="flex justify-start">
            <div class="bg-white border-2 border-gray-300 rounded-lg px-4 py-3 shadow-sm">
              <div class="flex space-x-2">
                <div class="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                <div class="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="border-t bg-white p-4">
          <form @submit.prevent="sendMessage" class="flex space-x-2">
            <input
              v-model="inputMessage"
              type="text"
              placeholder="Escribe tu mensaje..."
              :disabled="isTyping"
              class="flex-1 border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-900 font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              :disabled="!inputMessage.trim() || isTyping"
              class="bg-primary-600 text-white rounded-lg px-4 py-2 hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
          <p class="text-xs text-gray-600 font-medium mt-2 text-center">
            Asistente impulsado por Gemini AI
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;
const router = useRouter();

const isOpen = ref(false);
const inputMessage = ref('');
const messages = ref<Message[]>([]);
const isTyping = ref(false);
const unreadCount = ref(0);
const messagesContainer = ref<HTMLElement | null>(null);
const suggestions = ref<string[]>([]);

// Cargar sugerencias al montar
onMounted(async () => {
  try {
    const response = await $fetch(`${apiUrl}/chatbot/suggestions`);
    if (response.success) {
      suggestions.value = response.suggestions;
    }
  } catch (error) {
    console.error('Error al cargar sugerencias:', error);
  }
});

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    unreadCount.value = 0;
    nextTick(() => scrollToBottom());
  }
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const sendSuggestion = (suggestion: string) => {
  inputMessage.value = suggestion;
  sendMessage();
};

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isTyping.value) return;

  const userMessage = inputMessage.value.trim();
  inputMessage.value = '';

  // Agregar mensaje del usuario
  messages.value.push({
    role: 'user',
    content: userMessage,
  });

  nextTick(() => scrollToBottom());

  // Mostrar indicador de escritura
  isTyping.value = true;

  try {
    const response = await $fetch(`${apiUrl}/chatbot/chat`, {
      method: 'POST',
      body: {
        message: userMessage,
        history: messages.value.slice(-10), // Últimos 10 mensajes para contexto
      },
    });

    if (response.success) {
      messages.value.push({
        role: 'assistant',
        content: response.message,
      });

      if (!isOpen.value) {
        unreadCount.value++;
      }
    } else {
      messages.value.push({
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.',
      });
    }
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    messages.value.push({
      role: 'assistant',
      content: 'Lo siento, no pude conectarme con el servidor. Por favor intenta más tarde.',
    });
  } finally {
    isTyping.value = false;
    nextTick(() => scrollToBottom());
  }
};

const formatMessage = (content: string) => {
  // Convertir links de productos en enlaces clicables
  let formatted = content.replace(/\[([^\]]+)\]\(\/products\/([a-z0-9-]+)\)/gi, (match, text, slug) => {
    return `<a href="/products/${slug}" class="text-primary-600 hover:underline font-semibold inline-flex items-center gap-1" data-product-slug="${slug}">${text} <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg></a>`;
  });
  
  // También soportar formato sin markdown []: /products/slug
  formatted = formatted.replace(/\/products\/([a-z0-9-]+)(?!\))/gi, (match, slug) => {
    return `<a href="/products/${slug}" class="text-primary-600 hover:underline font-semibold inline-flex items-center gap-1" data-product-slug="${slug}">Ver producto <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg></a>`;
  });
  
  // Convertir links de categorías
  formatted = formatted.replace(/\/categories\/([a-z0-9-]+)/gi, (match, slug) => {
    return `<a href="/categories/${slug}" class="text-blue-600 hover:underline font-semibold inline-flex items-center gap-1" data-category-slug="${slug}">Ver categoría <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg></a>`;
  });
  
  // Convertir saltos de línea
  formatted = formatted.replace(/\n/g, '<br>');
  
  // Resaltar precios en verde
  formatted = formatted.replace(/S\/\s*(\d+\.?\d*)/g, '<span class="font-bold text-green-700">S/ $1</span>');
  
  // Hacer negrita los nombres de productos (palabras entre ** **)
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
  
  // Hacer énfasis en texto entre * *
  formatted = formatted.replace(/\*(.+?)\*/g, '<em class="italic text-gray-800">$1</em>');
  
  return formatted;
};

// Manejar clics en enlaces de productos/categorías
const handleMessageClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const link = target.closest('a[data-product-slug], a[data-category-slug]');
  
  if (link) {
    event.preventDefault();
    event.stopPropagation();
    
    const href = link.getAttribute('href');
    
    if (href) {
      // Cerrar el chat antes de navegar
      isOpen.value = false;
      
      // Pequeño delay para asegurar que el chat se cierra antes de navegar
      setTimeout(() => {
        router.push(href);
      }, 100);
    }
  }
};

// Auto scroll cuando hay nuevos mensajes
watch(() => messages.value.length, () => {
  nextTick(() => scrollToBottom());
});
</script>

<style scoped>
.chat-enter-active,
.chat-leave-active {
  transition: all 0.3s ease;
}

.chat-enter-from,
.chat-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>

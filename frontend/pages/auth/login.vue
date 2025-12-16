<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gradient mb-2">Iniciar Sesión</h1>
        <p class="text-gray-400">Accede a tu cuenta de Gaming Store</p>
      </div>

      <form @submit.prevent="handleLogin" class="card space-y-4">
        <div v-if="error" class="bg-red-500 bg-opacity-10 border border-red-500 text-red-400 px-4 py-3 rounded-lg flex items-start gap-2">
          <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm">{{ error }}</span>
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="input-field"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2">Contraseña</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="input-field"
            placeholder="••••••••"
          />
        </div>

        <button type="submit" class="w-full btn-primary" :disabled="isLoading">
          <svg v-if="isLoading" class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-else>{{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}</span>
        </button>

        <div class="text-center text-sm text-gray-400">
          ¿No tienes cuenta?
          <NuxtLink to="/auth/register" class="text-primary-400 hover:text-primary-300 font-semibold">
            Regístrate
          </NuxtLink>
        </div>
      </form>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
});

const authStore = useAuthStore();
const router = useRouter();
const notificationStore = useNotificationStore();

const form = ref({
  email: '',
  password: '',
});

const isLoading = ref(false);
const error = ref('');

const handleLogin = async () => {
  isLoading.value = true;
  error.value = '';

  try {
    await authStore.login(form.value.email, form.value.password);
    
    // Si es admin, rechazar y NO permitir acceso
    if (authStore.isAdmin) {
      error.value = '⛔ Esta es el área de clientes. Los administradores deben usar el login de admin.';
      await authStore.logout();
      return;
    }
    
    // Redirigir a la página solicitada o al home
    const redirect = router.currentRoute.value.query.redirect as string;
    notificationStore.success('¡Bienvenido de vuelta!');
    router.push(redirect || '/');
  } catch (err: any) {
    error.value = err.message || 'Error al iniciar sesión. Verifica tus credenciales.';
  } finally {
    isLoading.value = false;
  }
};

useHead({
  title: 'Iniciar Sesión - Gaming Store',
});
</script>

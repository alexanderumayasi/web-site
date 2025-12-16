<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gradient mb-2">Crear Cuenta</h1>
        <p class="text-gray-400">Únete a Gaming Store</p>
      </div>

      <form @submit.prevent="handleRegister" class="card space-y-4">
        <div v-if="error" class="bg-red-500 bg-opacity-10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
          {{ error }}
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold mb-2">Nombre</label>
            <input
              v-model="form.firstName"
              type="text"
              required
              class="input-field"
              placeholder="Juan"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2">Apellido</label>
            <input
              v-model="form.lastName"
              type="text"
              required
              class="input-field"
              placeholder="Pérez"
            />
          </div>
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
          <label class="block text-sm font-semibold mb-2">Teléfono (opcional)</label>
          <input
            v-model="form.phone"
            type="tel"
            class="input-field"
            placeholder="+51 999 999 999"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2">Contraseña</label>
          <input
            v-model="form.password"
            type="password"
            required
            minlength="6"
            class="input-field"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2">Confirmar Contraseña</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            required
            class="input-field"
            placeholder="••••••••"
          />
        </div>

        <button type="submit" class="w-full btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
        </button>

        <div class="text-center text-sm text-gray-400">
          ¿Ya tienes cuenta?
          <NuxtLink to="/auth/login" class="text-primary-400 hover:text-primary-300">
            Inicia sesión
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

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
});

const isLoading = ref(false);
const error = ref('');

const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Las contraseñas no coinciden';
    return;
  }

  isLoading.value = true;
  error.value = '';

  try {
    const { confirmPassword, ...registerData } = form.value;
    await authStore.register(registerData);
    
    router.push('/');
  } catch (err: any) {
    error.value = err.message || 'Error al crear la cuenta';
  } finally {
    isLoading.value = false;
  }
};

useHead({
  title: 'Crear Cuenta',
});
</script>

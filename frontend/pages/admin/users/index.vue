<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Usuarios</h1>
        <p class="text-gray-600 text-sm">Consulta el listado de clientes y administradores.</p>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Usuarios</p>
            <p class="text-3xl font-bold text-gray-900">{{ users.length }}</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Clientes</p>
            <p class="text-3xl font-bold text-gray-900">{{ users.filter(u => u.role === 'CUSTOMER').length }}</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Administradores</p>
            <p class="text-3xl font-bold text-gray-900">{{ users.filter(u => u.role === 'ADMIN').length }}</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Pedidos</p>
            <p class="text-3xl font-bold text-gray-900">{{ users.reduce((sum, u) => sum + (u._count?.orders || 0), 0) }}</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="card space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input v-model="search" type="text" placeholder="Buscar por nombre o email" class="input" />
        <select v-model="roleFilter" class="input">
          <option value="all">Todos los roles</option>
          <option value="ADMIN">Administradores</option>
          <option value="CUSTOMER">Clientes</option>
        </select>
      </div>
    </div>

    <div class="card p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 text-left text-sm text-gray-700">
              <th class="px-4 py-3">Usuario</th>
              <th class="px-4 py-3">Rol</th>
              <th class="px-4 py-3">Teléfono</th>
              <th class="px-4 py-3">Pedidos</th>
              <th class="px-4 py-3">Registrado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="5" class="px-4 py-6 text-center text-gray-600">Cargando usuarios...</td>
            </tr>
            <tr v-else-if="!filteredUsers.length">
              <td colspan="5" class="px-4 py-6 text-center text-gray-600">No se encontraron usuarios.</td>
            </tr>
            <tr
              v-for="user in filteredUsers"
              v-else
              :key="user.id"
              class="border-t border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-4">
                <p class="font-semibold text-gray-900">{{ user.firstName }} {{ user.lastName }}</p>
                <p class="text-xs text-gray-600">{{ user.email }}</p>
              </td>
              <td class="px-4 py-4">
                <span :class="user.role === 'ADMIN' ? 'badge-admin' : 'badge-customer'">{{ user.role }}</span>
              </td>
              <td class="px-4 py-4 text-sm text-gray-700">{{ user.phone || '—' }}</td>
              <td class="px-4 py-4 text-sm text-primary-600 font-semibold">{{ user._count?.orders || 0 }}</td>
              <td class="px-4 py-4 text-sm text-gray-600">{{ formatDate(user.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="feedback.message" :class="feedback.type === 'success' ? 'alert-success' : 'alert-error'">
      {{ feedback.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue';
import { definePageMeta, useHead, useRuntimeConfig } from '#imports';
import { useAuthStore } from '../../../stores/auth';

definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
});

useHead({
  title: 'Usuarios | Admin',
});

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: 'ADMIN' | 'CUSTOMER';
  createdAt: string;
  _count?: {
    orders: number;
  };
}

const config = useRuntimeConfig();
const authStore = useAuthStore();

const users = ref<User[]>([]);
const isLoading = ref(false);
const search = ref('');
const roleFilter = ref<'all' | 'ADMIN' | 'CUSTOMER'>('all');
const feedback = reactive({ message: '', type: 'success' as 'success' | 'error' });

const authHeaders = computed((): Record<string, string> => {
  const headers: Record<string, string> = {};
  if (authStore.accessToken) {
    headers.Authorization = `Bearer ${authStore.accessToken}`;
  }
  return headers;
});

const filteredUsers = computed(() => {
  const term = search.value.trim().toLowerCase();
  return users.value.filter((user) => {
    const matchesRole = roleFilter.value === 'all' || user.role === roleFilter.value;
    const matchesSearch = !term ||
      user.email.toLowerCase().includes(term) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(term);
    return matchesRole && matchesSearch;
  });
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const loadUsers = async () => {
  isLoading.value = true;
  feedback.message = '';

  try {
    const response = await $fetch<User[]>(`${config.public.apiUrl}/users`, {
      credentials: 'include',
      headers: {
        ...authHeaders.value,
      },
    });
    users.value = response;
  } catch (error: any) {
    console.error('Error cargando usuarios', error);
    feedback.message = error?.data?.error || 'No se pudieron cargar los usuarios.';
    feedback.type = 'error';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadUsers();
});
</script>

<style scoped lang="postcss">
.card {
  @apply bg-white border border-gray-200 rounded-xl p-6;
}

.input {
  @apply w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500;
}

.badge-admin {
  @apply inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold border border-primary-300;
}

.badge-customer {
  @apply inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-300;
}

.alert-success {
  @apply bg-green-100 text-green-700 border border-green-300 rounded-lg px-4 py-3;
}

.alert-error {
  @apply bg-red-100 text-red-700 border border-red-300 rounded-lg px-4 py-3;
}
</style>

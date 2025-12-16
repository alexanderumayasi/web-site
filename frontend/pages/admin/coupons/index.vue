<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Cupones</h1>
        <p class="text-gray-600 text-sm">Crea promociones y controla su uso.</p>
      </div>
      <button class="btn-primary" @click="openCreateModal">
        Nuevo cupón
      </button>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Cupones</p>
            <p class="text-3xl font-bold text-gray-900">{{ coupons.length }}</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Activos</p>
            <p class="text-3xl font-bold text-gray-900">{{ coupons.filter(c => c.isActive).length }}</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Usos</p>
            <p class="text-3xl font-bold text-gray-900">{{ coupons.reduce((sum, c) => sum + c.usageCount, 0) }}</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Descuento Total</p>
            <p class="text-3xl font-bold text-gray-900">S/ {{ coupons.reduce((sum, c) => sum + (c.discountType === 'fixed' ? c.discountValue * c.usageCount : 0), 0).toFixed(2) }}</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="card space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input v-model="search" type="text" placeholder="Buscar por código o descripción" class="input" />
        <select v-model="statusFilter" class="input">
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
      </div>
    </div>

    <div class="card p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 text-left text-sm text-gray-700">
              <th class="px-4 py-3">Código</th>
              <th class="px-4 py-3">Tipo</th>
              <th class="px-4 py-3">Descuento</th>
              <th class="px-4 py-3">Uso</th>
              <th class="px-4 py-3">Vigencia</th>
              <th class="px-4 py-3">Estado</th>
              <th class="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="7" class="px-4 py-6 text-center text-gray-600">Cargando cupones...</td>
            </tr>
            <tr v-else-if="!filteredCoupons.length">
              <td colspan="7" class="px-4 py-6 text-center text-gray-600">No se encontraron cupones.</td>
            </tr>
            <tr
              v-for="coupon in filteredCoupons"
              v-else
              :key="coupon.id"
              class="border-t border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-4">
                <p class="font-semibold text-gray-900">{{ coupon.code }}</p>
                <p class="text-xs text-gray-600">{{ coupon.description }}</p>
              </td>
              <td class="px-4 py-4 text-sm text-gray-700 capitalize">{{ coupon.discountType }}</td>
              <td class="px-4 py-4 text-sm text-gray-900 font-semibold">
                <span v-if="coupon.discountType === 'percentage'">{{ formatCurrency(coupon.discountValue) }}%</span>
                <span v-else>S/ {{ formatCurrency(coupon.discountValue) }}</span>
              </td>
              <td class="px-4 py-4 text-sm text-gray-700">
                {{ coupon.usageCount }}
                <span v-if="coupon.usageLimit">/ {{ coupon.usageLimit }}</span>
              </td>
              <td class="px-4 py-4 text-sm text-gray-700">
                {{ formatDate(coupon.startDate) }} - {{ formatDate(coupon.endDate) }}
              </td>
              <td class="px-4 py-4">
                <span :class="coupon.isActive ? 'badge-success' : 'badge-muted'">
                  {{ coupon.isActive ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center justify-end gap-2">
                  <button class="btn-secondary" @click="openEditModal(coupon)">Editar</button>
                  <button class="btn-tertiary" @click="toggleActive(coupon)">
                    {{ coupon.isActive ? 'Desactivar' : 'Activar' }}
                  </button>
                  <button class="btn-danger" @click="confirmDelete(coupon)">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="feedback.message" :class="feedback.type === 'success' ? 'alert-success' : 'alert-error'">
      {{ feedback.message }}
    </div>

    <div v-if="showForm" class="modal-backdrop" @click.self="closeForm">
      <div class="modal max-w-3xl">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ editingCoupon ? 'Editar cupón' : 'Nuevo cupón' }}</h2>

        <form class="space-y-4" @submit.prevent="submitCoupon">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label" for="code">Código</label>
              <input id="code" v-model="couponForm.code" type="text" class="input" required />
            </div>
            <div>
              <label class="label" for="discountType">Tipo de descuento</label>
              <select id="discountType" v-model="couponForm.discountType" class="input" required>
                <option value="percentage">Porcentaje</option>
                <option value="fixed">Monto fijo</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label" for="discountValue">Valor de descuento</label>
              <input
                id="discountValue"
                v-model.number="couponForm.discountValue"
                type="number"
                min="0"
                step="0.01"
                class="input"
                required
              />
            </div>
            <div>
              <label class="label" for="usageLimit">Límite de uso (opcional)</label>
              <input id="usageLimit" v-model.number="couponForm.usageLimit" type="number" min="0" class="input" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label" for="minPurchase">Compra mínima (opcional)</label>
              <input id="minPurchase" v-model.number="couponForm.minPurchase" type="number" min="0" step="0.01" class="input" />
            </div>
            <div>
              <label class="label" for="maxDiscount">Descuento máximo (opcional)</label>
              <input id="maxDiscount" v-model.number="couponForm.maxDiscount" type="number" min="0" step="0.01" class="input" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label" for="startDate">Inicio</label>
              <input id="startDate" v-model="couponForm.startDate" type="datetime-local" class="input" required />
            </div>
            <div>
              <label class="label" for="endDate">Fin</label>
              <input id="endDate" v-model="couponForm.endDate" type="datetime-local" class="input" required />
            </div>
          </div>

          <div>
            <label class="label" for="description">Descripción</label>
            <textarea id="description" v-model="couponForm.description" class="input min-h-[100px]" />
          </div>

          <label class="flex items-center gap-2 text-sm text-gray-700">
            <input v-model="couponForm.isActive" type="checkbox" class="checkbox" />
            Cupón activo
          </label>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button type="button" class="btn-tertiary" @click="closeForm">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="formLoading">
              {{ formLoading ? 'Guardando...' : 'Guardar cambios' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDeleteConfirm" class="modal-backdrop" @click.self="closeDelete">
      <div class="modal max-w-md">
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Eliminar cupón</h2>
        <p class="text-gray-600 mb-6">
          ¿Seguro que deseas eliminar el cupón "{{ couponToDelete?.code }}"?
        </p>
        <div class="flex items-center justify-end gap-3">
          <button class="btn-tertiary" @click="closeDelete">Cancelar</button>
          <button class="btn-danger" :disabled="deleteLoading" @click="deleteCoupon">
            {{ deleteLoading ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
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
  title: 'Cupones | Admin',
});

interface Coupon {
  id: string;
  code: string;
  description?: string | null;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number | null;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usageCount: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

const config = useRuntimeConfig();
const authStore = useAuthStore();

const coupons = ref<Coupon[]>([]);
const isLoading = ref(false);
const search = ref('');
const statusFilter = ref<'all' | 'active' | 'inactive'>('all');
const showForm = ref(false);
const showDeleteConfirm = ref(false);
const editingCoupon = ref<Coupon | null>(null);
const couponToDelete = ref<Coupon | null>(null);
const formLoading = ref(false);
const deleteLoading = ref(false);
const feedback = reactive({ message: '', type: 'success' as 'success' | 'error' });

const couponForm = reactive({
  code: '',
  description: '',
  discountType: 'percentage' as 'percentage' | 'fixed',
  discountValue: 0,
  minPurchase: null as number | null,
  maxDiscount: null as number | null,
  usageLimit: null as number | null,
  startDate: '',
  endDate: '',
  isActive: true,
});

const authHeaders = computed((): Record<string, string> => {
  const headers: Record<string, string> = {};
  if (authStore.accessToken) {
    headers.Authorization = `Bearer ${authStore.accessToken}`;
  }
  return headers;
});

const filteredCoupons = computed(() => {
  return coupons.value.filter((coupon) => {
    const matchesStatus =
      statusFilter.value === 'all' || (statusFilter.value === 'active' ? coupon.isActive : !coupon.isActive);
    const term = search.value.trim().toLowerCase();
    const matchesSearch = !term ||
      coupon.code.toLowerCase().includes(term) ||
      (coupon.description || '').toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });
});

const formatCurrency = (value: number | null | undefined) => {
  if (value === null || value === undefined) return '0.00';
  return Number(value).toFixed(2);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const toDatetimeLocal = (date: string) => {
  const d = new Date(date);
  const pad = (num: number) => num.toString().padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const fromDatetimeLocal = (value: string) => {
  return value ? new Date(value).toISOString() : '';
};

const loadCoupons = async () => {
  isLoading.value = true;
  feedback.message = '';

  try {
    const response = await $fetch<Coupon[]>(`${config.public.apiUrl}/coupons`, {
      credentials: 'include',
      headers: {
        ...authHeaders.value,
      },
    });
    coupons.value = response.map((coupon) => ({
      ...coupon,
      discountValue: Number(coupon.discountValue),
      minPurchase: coupon.minPurchase !== null ? Number(coupon.minPurchase) : null,
      maxDiscount: coupon.maxDiscount !== null ? Number(coupon.maxDiscount) : null,
    }));
  } catch (error: any) {
    console.error('Error cargando cupones', error);
    feedback.message = error?.data?.error || 'No se pudieron cargar los cupones.';
    feedback.type = 'error';
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  editingCoupon.value = null;
  Object.assign(couponForm, {
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    minPurchase: null,
    maxDiscount: null,
    usageLimit: null,
    startDate: '',
    endDate: '',
    isActive: true,
  });
};

const openCreateModal = () => {
  resetForm();
  const now = new Date();
  const inSevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  couponForm.startDate = toDatetimeLocal(now.toISOString());
  couponForm.endDate = toDatetimeLocal(inSevenDays.toISOString());
  showForm.value = true;
};

const openEditModal = (coupon: Coupon) => {
  editingCoupon.value = coupon;
  Object.assign(couponForm, {
    code: coupon.code,
    description: coupon.description || '',
    discountType: coupon.discountType,
    discountValue: Number(coupon.discountValue),
    minPurchase: coupon.minPurchase ?? null,
    maxDiscount: coupon.maxDiscount ?? null,
    usageLimit: coupon.usageLimit ?? null,
    startDate: toDatetimeLocal(coupon.startDate),
    endDate: toDatetimeLocal(coupon.endDate),
    isActive: coupon.isActive,
  });
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  formLoading.value = false;
};

const buildPayload = () => {
  const payload: Record<string, any> = {
    code: couponForm.code,
    description: couponForm.description || undefined,
    discountType: couponForm.discountType,
    discountValue: Number(couponForm.discountValue),
    minPurchase: couponForm.minPurchase ? Number(couponForm.minPurchase) : null,
    maxDiscount: couponForm.maxDiscount ? Number(couponForm.maxDiscount) : null,
    usageLimit: couponForm.usageLimit ? Number(couponForm.usageLimit) : null,
    startDate: fromDatetimeLocal(couponForm.startDate),
    endDate: fromDatetimeLocal(couponForm.endDate),
    isActive: couponForm.isActive,
  };
  return payload;
};

const submitCoupon = async () => {
  formLoading.value = true;
  feedback.message = '';

  const payload = buildPayload();

  try {
    if (editingCoupon.value) {
      await $fetch(`${config.public.apiUrl}/coupons/${editingCoupon.value.id}`, {
        method: 'PUT',
        body: payload,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders.value,
        },
      });
      feedback.message = 'Cupón actualizado correctamente.';
    } else {
      await $fetch(`${config.public.apiUrl}/coupons`, {
        method: 'POST',
        body: payload,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders.value,
        },
      });
      feedback.message = 'Cupón creado correctamente.';
    }

    feedback.type = 'success';
    showForm.value = false;
    await loadCoupons();
  } catch (error: any) {
    console.error('Error guardando cupón', error);
    feedback.message = error?.data?.error || 'No se pudo guardar el cupón.';
    feedback.type = 'error';
  } finally {
    formLoading.value = false;
  }
};

const toggleActive = async (coupon: Coupon) => {
  feedback.message = '';

  try {
    await $fetch(`${config.public.apiUrl}/coupons/${coupon.id}`, {
      method: 'PUT',
      body: {
        isActive: !coupon.isActive,
      },
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders.value,
      },
    });
    feedback.message = !coupon.isActive ? 'Cupón activado correctamente.' : 'Cupón desactivado correctamente.';
    feedback.type = 'success';
    await loadCoupons();
  } catch (error) {
    console.error('Error actualizando cupón', error);
    feedback.message = 'No se pudo actualizar el cupón.';
    feedback.type = 'error';
  }
};

const confirmDelete = (coupon: Coupon) => {
  couponToDelete.value = coupon;
  deleteLoading.value = false;
  showDeleteConfirm.value = true;
};

const closeDelete = () => {
  showDeleteConfirm.value = false;
  deleteLoading.value = false;
};

const deleteCoupon = async () => {
  if (!couponToDelete.value) return;

  deleteLoading.value = true;
  feedback.message = '';

  try {
    await $fetch(`${config.public.apiUrl}/coupons/${couponToDelete.value.id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        ...authHeaders.value,
      },
    });
    feedback.message = 'Cupón eliminado correctamente.';
    feedback.type = 'success';
    showDeleteConfirm.value = false;
    await loadCoupons();
  } catch (error) {
    console.error('Error eliminando cupón', error);
    feedback.message = 'No se pudo eliminar el cupón.';
    feedback.type = 'error';
  } finally {
    deleteLoading.value = false;
  }
};

onMounted(() => {
  loadCoupons();
});
</script>

<style scoped lang="postcss">
.btn-primary {
  @apply px-4 py-2 bg-primary-600 hover:bg-primary-500 transition-colors rounded-lg font-semibold;
}

.btn-secondary {
  @apply px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors rounded-lg text-sm;
}

.btn-tertiary {
  @apply px-3 py-1.5 bg-transparent border border-gray-300 hover:border-primary-500 hover:text-primary-600 text-gray-700 transition-colors rounded-lg text-sm;
}

.btn-danger {
  @apply px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white transition-colors rounded-lg text-sm;
}

.checkbox {
  @apply w-4 h-4 rounded border-gray-400 text-primary-600 focus:ring-primary-500;
}

.input {
  @apply w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500;
}

.label {
  @apply block text-sm text-gray-700 mb-1;
}

.card {
  @apply bg-white border border-gray-200 rounded-xl p-6;
}

.alert-success {
  @apply bg-green-100 text-green-700 border border-green-300 rounded-lg px-4 py-3;
}

.alert-error {
  @apply bg-red-100 text-red-700 border border-red-300 rounded-lg px-4 py-3;
}

.badge-success {
  @apply inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold border border-green-300;
}

.badge-muted {
  @apply inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-300;
}

.modal-backdrop {
  @apply fixed inset-0 bg-gray-400 bg-opacity-80 flex items-center justify-center z-50 px-4;
}

.modal {
  @apply bg-white border border-gray-200 rounded-xl p-6 w-full max-h-[90vh] overflow-y-auto;
}
</style>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Categorías</h1>
        <p class="text-gray-600 text-sm">Organiza el catálogo por familias de productos.</p>
      </div>
      <button class="btn-primary" @click="openCreateModal">
        Nueva categoría
      </button>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Categorías</p>
            <p class="text-3xl font-bold text-gray-900">{{ categories.length }}</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Principales</p>
            <p class="text-3xl font-bold text-gray-900">{{ categories.filter(c => !c.parentId).length }}</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Subcategorías</p>
            <p class="text-3xl font-bold text-gray-900">{{ categories.filter(c => c.parentId).length }}</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Productos</p>
            <p class="text-3xl font-bold text-gray-900">{{ categories.reduce((sum, c) => sum + (c._count?.products || 0), 0) }}</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="card space-y-4">
      <input v-model="search" type="text" placeholder="Buscar categoría" class="input" />
    </div>

    <div class="card p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 text-left text-sm text-gray-700">
              <th class="px-4 py-3">Nombre</th>
              <th class="px-4 py-3">Slug</th>
              <th class="px-4 py-3">Superior</th>
              <th class="px-4 py-3">Productos</th>
              <th class="px-4 py-3">Actualizado</th>
              <th class="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="6" class="px-4 py-6 text-center text-gray-600">Cargando categorías...</td>
            </tr>
            <tr v-else-if="!filteredCategories.length">
              <td colspan="6" class="px-4 py-6 text-center text-gray-600">
                No se encontraron categorías con tu búsqueda.
              </td>
            </tr>
            <tr
              v-for="category in filteredCategories"
              v-else
              :key="category.id"
              class="border-t border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-4">
                <div class="flex items-center gap-3">
                  <img
                    v-if="category.image"
                    :src="category.image"
                    :alt="category.name"
                    class="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p class="font-semibold text-gray-900">{{ category.name }}</p>
                    <p class="text-xs text-gray-600">ID: {{ category.id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4 text-sm text-gray-700">{{ category.slug }}</td>
              <td class="px-4 py-4 text-sm text-gray-700">{{ category.parent?.name || 'Principal' }}</td>
              <td class="px-4 py-4 text-sm text-primary-600 font-semibold">{{ category._count?.products || 0 }}</td>
              <td class="px-4 py-4 text-sm text-gray-600">{{ formatDate(category.updatedAt) }}</td>
              <td class="px-4 py-4">
                <div class="flex items-center justify-end gap-2">
                  <button class="btn-secondary" @click="openEditModal(category)">Editar</button>
                  <button class="btn-danger" @click="confirmDelete(category)">Eliminar</button>
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
      <div class="modal max-w-xl">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          {{ editingCategory ? 'Editar categoría' : 'Nueva categoría' }}
        </h2>

        <form class="space-y-4" @submit.prevent="submitCategory">
          <div>
            <label class="label" for="name">Nombre</label>
            <input id="name" v-model="categoryForm.name" type="text" class="input" required />
          </div>

          <div>
            <label class="label" for="slug">Slug</label>
            <input id="slug" v-model="categoryForm.slug" type="text" class="input" required />
          </div>

          <div>
            <label class="label" for="parent">Categoría superior</label>
            <select id="parent" v-model="categoryForm.parentId" class="input">
              <option value="">Principal</option>
              <option
                v-for="category in parentOptions"
                :key="category.id"
                :value="category.id"
                :disabled="editingCategory?.id === category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="label" for="image">URL de imagen</label>
            <input id="image" v-model="categoryForm.image" type="url" class="input" />
          </div>

          <div>
            <label class="label" for="description">Descripción</label>
            <textarea id="description" v-model="categoryForm.description" class="input min-h-[100px]" />
          </div>

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
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Eliminar categoría</h2>
        <p class="text-gray-600 mb-6">
          ¿Seguro que deseas eliminar "{{ categoryToDelete?.name }}"? Los productos permanecerán asociados,
          pero la categoría se perderá.
        </p>
        <div class="flex items-center justify-end gap-3">
          <button class="btn-tertiary" @click="closeDelete">Cancelar</button>
          <button class="btn-danger" :disabled="deleteLoading" @click="deleteCategory">
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
  title: 'Categorías | Admin',
});

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parentId?: string | null;
  parent?: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

const config = useRuntimeConfig();
const authStore = useAuthStore();

const categories = ref<Category[]>([]);
const isLoading = ref(false);
const search = ref('');
const showForm = ref(false);
const showDeleteConfirm = ref(false);
const editingCategory = ref<Category | null>(null);
const categoryToDelete = ref<Category | null>(null);
const formLoading = ref(false);
const deleteLoading = ref(false);
const feedback = reactive({ message: '', type: 'success' as 'success' | 'error' });

const categoryForm = reactive({
  name: '',
  slug: '',
  description: '',
  image: '',
  parentId: '',
});

const authHeaders = computed((): Record<string, string> => {
  const headers: Record<string, string> = {};
  if (authStore.accessToken) {
    headers.Authorization = `Bearer ${authStore.accessToken}`;
  }
  return headers;
});

const filteredCategories = computed(() => {
  if (!search.value.trim()) {
    return categories.value;
  }
  const term = search.value.toLowerCase();
  return categories.value.filter((category) => {
    return (
      category.name.toLowerCase().includes(term) ||
      category.slug.toLowerCase().includes(term)
    );
  });
});

const parentOptions = computed(() => categories.value);

const loadCategories = async () => {
  isLoading.value = true;
  feedback.message = '';

  try {
    const response = await $fetch<Category[]>(`${config.public.apiUrl}/categories`, {
      credentials: 'include',
    });
    categories.value = response;
  } catch (error: any) {
    console.error('Error cargando categorías', error);
    feedback.message = error?.data?.error || 'No se pudieron cargar las categorías.';
    feedback.type = 'error';
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const resetForm = () => {
  editingCategory.value = null;
  Object.assign(categoryForm, {
    name: '',
    slug: '',
    description: '',
    image: '',
    parentId: '',
  });
};

const openCreateModal = () => {
  resetForm();
  showForm.value = true;
};

const openEditModal = (category: Category) => {
  editingCategory.value = category;
  Object.assign(categoryForm, {
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    image: category.image || '',
    parentId: category.parentId || '',
  });
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  formLoading.value = false;
};

const submitCategory = async () => {
  formLoading.value = true;
  feedback.message = '';

  const payload: Record<string, any> = {
    name: categoryForm.name,
    slug: categoryForm.slug,
    description: categoryForm.description || undefined,
    image: categoryForm.image || undefined,
    parentId: categoryForm.parentId || null,
  };

  try {
    if (editingCategory.value) {
      await $fetch(`${config.public.apiUrl}/categories/${editingCategory.value.id}`, {
        method: 'PUT',
        body: payload,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders.value,
        },
      });
      feedback.message = 'Categoría actualizada correctamente.';
    } else {
      await $fetch(`${config.public.apiUrl}/categories`, {
        method: 'POST',
        body: payload,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders.value,
        },
      });
      feedback.message = 'Categoría creada correctamente.';
    }

    feedback.type = 'success';
    showForm.value = false;
    await loadCategories();
  } catch (error: any) {
    console.error('Error guardando categoría', error);
    feedback.message = error?.data?.error || 'No se pudo guardar la categoría.';
    feedback.type = 'error';
  } finally {
    formLoading.value = false;
  }
};

const confirmDelete = (category: Category) => {
  categoryToDelete.value = category;
  showDeleteConfirm.value = true;
  deleteLoading.value = false;
};

const closeDelete = () => {
  showDeleteConfirm.value = false;
  deleteLoading.value = false;
};

const deleteCategory = async () => {
  if (!categoryToDelete.value) return;

  deleteLoading.value = true;
  feedback.message = '';

  try {
    await $fetch(`${config.public.apiUrl}/categories/${categoryToDelete.value.id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        ...authHeaders.value,
      },
    });
    feedback.message = 'Categoría eliminada correctamente.';
    feedback.type = 'success';
    showDeleteConfirm.value = false;
    await loadCategories();
  } catch (error) {
    console.error('Error eliminando categoría', error);
    feedback.message = 'No se pudo eliminar la categoría.';
    feedback.type = 'error';
  } finally {
    deleteLoading.value = false;
  }
};

onMounted(() => {
  loadCategories();
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

.modal-backdrop {
  @apply fixed inset-0 bg-gray-400 bg-opacity-80 flex items-center justify-center z-50 px-4;
}

.modal {
  @apply bg-white border border-gray-200 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto;
}
</style>

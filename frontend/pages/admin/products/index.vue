<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Productos</h1>
        <p class="text-gray-600 mt-1">Administra el catálogo, precios y estados de publicación</p>
      </div>
      <button class="btn-primary" @click="openCreateModal">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nuevo Producto
      </button>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Productos</p>
            <p class="text-3xl font-bold text-gray-900">{{ totalProducts }}</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Activos</p>
            <p class="text-3xl font-bold text-gray-900">{{ activeProducts }}</p>
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
            <p class="text-sm text-gray-600 mb-1">Stock Bajo</p>
            <p class="text-3xl font-bold text-gray-900">{{ lowStockProducts }}</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Destacados</p>
            <p class="text-3xl font-bold text-gray-900">{{ featuredProducts }}</p>
          </div>
          <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->

    <div class="card space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Buscar por nombre o SKU"
          class="input"
        />
        <select v-model="filters.categoryId" class="input">
          <option value="all">Todas las categorías</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        <select v-model="filters.status" class="input">
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
        <select v-model="filters.sortBy" class="input">
          <option value="createdAt">Más recientes</option>
          <option value="name">Nombre</option>
          <option value="price">Precio</option>
          <option value="stock">Stock</option>
        </select>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-3 flex items-center gap-4">
          <label class="flex items-center gap-2 text-sm text-gray-600">
            <input v-model="filters.onlyFeatured" type="checkbox" class="checkbox" />
            Solo destacados
          </label>
        </div>
        <select v-model="filters.order" class="input">
          <option value="desc">Descendente</option>
          <option value="asc">Ascendente</option>
        </select>
      </div>
    </div>

    <div class="card p-0 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 text-left text-sm text-gray-700">
              <th class="px-4 py-3">Producto</th>
              <th class="px-4 py-3">Categoría</th>
              <th class="px-4 py-3">Precio</th>
              <th class="px-4 py-3">Stock</th>
              <th class="px-4 py-3">Estado</th>
              <th class="px-4 py-3">Destacado</th>
              <th class="px-4 py-3">Actualizado</th>
              <th class="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="8" class="px-4 py-6 text-center text-gray-600">
                Cargando productos...
              </td>
            </tr>
            <tr v-else-if="!products.length">
              <td colspan="8" class="px-4 py-6 text-center text-gray-600">
                No se encontraron productos con los filtros seleccionados.
              </td>
            </tr>
            <tr
              v-for="product in products"
              v-else
              :key="product.id"
              class="border-t border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-4">
                <div class="flex items-center gap-3">
                  <img
                    v-if="product.images.length"
                    :src="product.images[0]"
                    :alt="product.name"
                    class="w-14 h-14 object-cover rounded"
                  />
                  <div>
                    <p class="font-semibold text-gray-900">{{ product.name }}</p>
                    <p class="text-xs text-gray-600">SKU: {{ product.sku }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4 text-sm">
                {{ product.category?.name || 'Sin categoría' }}
              </td>
              <td class="px-4 py-4 font-semibold text-primary-600">
                S/ {{ formatCurrency(product.price) }}
                <span v-if="product.comparePrice" class="block text-xs text-gray-500 line-through">
                  S/ {{ formatCurrency(product.comparePrice) }}
                </span>
              </td>
              <td class="px-4 py-4 text-sm">
                <span :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'">{{ product.stock }}</span>
              </td>
              <td class="px-4 py-4">
                <span :class="product.isActive ? 'badge-success' : 'badge-muted'">
                  {{ product.isActive ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-4 py-4">
                <span :class="product.isFeatured ? 'badge-primary' : 'badge-muted'">
                  {{ product.isFeatured ? 'Sí' : 'No' }}
                </span>
              </td>
              <td class="px-4 py-4 text-sm text-gray-600">
                {{ formatDate(product.updatedAt) }}
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center justify-end gap-2">
                  <button class="btn-secondary" @click="openEditModal(product)">Editar</button>
                  <button
                    class="btn-tertiary"
                    @click="toggleFeatured(product)"
                  >
                    {{ product.isFeatured ? 'Quitar destacado' : 'Destacar' }}
                  </button>
                  <button
                    class="btn-tertiary"
                    @click="toggleActive(product)"
                  >
                    {{ product.isActive ? 'Desactivar' : 'Activar' }}
                  </button>
                  <button class="btn-danger" @click="confirmDelete(product)">
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="pagination.totalPages > 1" class="flex items-center justify-between px-4 py-3 border-t border-gray-800">
        <button class="btn-tertiary" :disabled="pagination.page === 1" @click="changePage(pagination.page - 1)">
          Anterior
        </button>
        <p class="text-sm text-gray-400">
          Página {{ pagination.page }} de {{ pagination.totalPages }}
        </p>
        <button
          class="btn-tertiary"
          :disabled="pagination.page === pagination.totalPages"
          @click="changePage(pagination.page + 1)"
        >
          Siguiente
        </button>
      </div>
    </div>

    <div v-if="feedback.message" :class="feedback.type === 'success' ? 'alert-success' : 'alert-error'">
      {{ feedback.message }}
    </div>

    <div v-if="showForm" class="modal-backdrop" @click.self="closeForm">
      <div class="modal">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          {{ editingProduct ? 'Editar producto' : 'Nuevo producto' }}
        </h2>

        <form class="space-y-4" @submit.prevent="submitProduct">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label" for="name">Nombre</label>
              <input id="name" v-model="productForm.name" type="text" class="input" required />
            </div>
            <div>
              <label class="label" for="slug">Slug</label>
              <input id="slug" v-model="productForm.slug" type="text" class="input" required />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label" for="price">Precio</label>
              <input id="price" v-model.number="productForm.price" type="number" min="0" step="0.01" class="input" required />
            </div>
            <div>
              <label class="label" for="comparePrice">Precio anterior (opcional)</label>
              <input
                id="comparePrice"
                v-model.number="productForm.comparePrice"
                type="number"
                min="0"
                step="0.01"
                class="input"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label" for="sku">SKU</label>
              <input id="sku" v-model="productForm.sku" type="text" class="input" required />
            </div>
            <div>
              <label class="label" for="stock">Stock</label>
              <input id="stock" v-model.number="productForm.stock" type="number" min="0" step="1" class="input" required />
            </div>
          </div>

          <div>
            <label class="label" for="category">Categoría</label>
            <select id="category" v-model="productForm.categoryId" class="input" required>
              <option value="" disabled>Selecciona una categoría</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="label" for="description">Descripción</label>
            <textarea id="description" v-model="productForm.description" class="input min-h-[120px]" required />
          </div>

          <div>
            <label class="label" for="images">URLs de imágenes (una por línea)</label>
            <textarea id="images" v-model="productForm.images" class="input min-h-[120px]" required />
          </div>

          <div>
            <label class="label" for="specifications">Especificaciones (JSON opcional)</label>
            <textarea id="specifications" v-model="productForm.specifications" class="input min-h-[120px]" />
          </div>

          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2 text-sm text-gray-700">
              <input v-model="productForm.isActive" type="checkbox" class="checkbox" />
              Publicado
            </label>
            <label class="flex items-center gap-2 text-sm text-gray-700">
              <input v-model="productForm.isFeatured" type="checkbox" class="checkbox" />
              Producto destacado
            </label>
          </div>

          <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>

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
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Eliminar producto</h2>
        <p class="text-gray-600 mb-6">
          ¿Estás seguro de que deseas eliminar "{{ productToDelete?.name }}"? Esta acción no se puede deshacer.
        </p>
        <div class="flex items-center justify-end gap-3">
          <button class="btn-tertiary" @click="closeDelete">Cancelar</button>
          <button class="btn-danger" :disabled="deleteLoading" @click="deleteProduct">
            {{ deleteLoading ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted } from 'vue';
import { definePageMeta, useHead, useRuntimeConfig } from '#imports';
import { useDebounceFn } from '@vueuse/core';
import { useAuthStore } from '../../../stores/auth';

definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
});

useHead({
  title: 'Productos | Admin',
});

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  sku: string;
  stock: number;
  images: string[];
  specifications?: Record<string, any> | null;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const config = useRuntimeConfig();
const authStore = useAuthStore();

const products = ref<Product[]>([]);
const pagination = ref<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 1 });
const categories = ref<Category[]>([]);
const isLoading = ref(false);

const filters = reactive({
  search: '',
  categoryId: 'all',
  status: 'all',
  sortBy: 'createdAt',
  order: 'desc',
  onlyFeatured: false,
});

const showForm = ref(false);
const showDeleteConfirm = ref(false);
const editingProduct = ref<Product | null>(null);
const productToDelete = ref<Product | null>(null);
const formLoading = ref(false);
const deleteLoading = ref(false);
const formError = ref('');
const feedback = reactive({ message: '', type: 'success' as 'success' | 'error' });

const productForm = reactive({
  name: '',
  slug: '',
  description: '',
  price: 0,
  comparePrice: null as number | null,
  sku: '',
  stock: 0,
  categoryId: '',
  images: '',
  specifications: '',
  isActive: true,
  isFeatured: false,
});

const authHeaders = computed((): Record<string, string> => {
  const headers: Record<string, string> = {};
  if (authStore.accessToken) {
    headers.Authorization = `Bearer ${authStore.accessToken}`;
  }
  return headers;
});

// Statistics
const totalProducts = computed(() => pagination.value.total);
const activeProducts = computed(() => products.value.filter(p => p.isActive).length);
const lowStockProducts = computed(() => products.value.filter(p => p.stock < 10).length);
const featuredProducts = computed(() => products.value.filter(p => p.isFeatured).length);

const debouncedSearch = useDebounceFn(() => {
  loadProducts(1);
}, 400);

watch(
  () => filters.search,
  () => {
    debouncedSearch();
  }
);

watch(
  [
    () => filters.categoryId,
    () => filters.status,
    () => filters.sortBy,
    () => filters.order,
    () => filters.onlyFeatured,
  ],
  () => {
    loadProducts(1);
  }
);

const loadCategories = async () => {
  try {
    const response = await $fetch<Category[]>(`${config.public.apiUrl}/categories`);
    categories.value = response;
  } catch (error) {
    console.error('Error cargando categorías', error);
  }
};

const loadProducts = async (page = pagination.value.page) => {
  isLoading.value = true;
  feedback.message = '';

  try {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', pagination.value.limit.toString());
    params.set('sortBy', filters.sortBy);
    params.set('order', filters.order);

    if (filters.search) {
      params.set('search', filters.search);
    }

    if (filters.categoryId !== 'all') {
      params.set('categoryId', filters.categoryId);
    }

    if (filters.status !== 'all') {
      params.set('isActive', filters.status === 'active' ? 'true' : 'false');
    }

    if (filters.onlyFeatured) {
      params.set('isFeatured', 'true');
    }

    const response = await $fetch<{ products: any[]; pagination: Pagination }>(
      `${config.public.apiUrl}/products/admin?${params.toString()}`,
      {
        credentials: 'include',
        headers: {
          ...authHeaders.value,
        },
      }
    );

    products.value = response.products.map((product) => ({
      ...product,
      price: Number(product.price),
      comparePrice: product.comparePrice !== null ? Number(product.comparePrice) : null,
    }));
    pagination.value = response.pagination;
  } catch (error: any) {
    console.error('Error cargando productos', error);
    feedback.message = error?.data?.error || 'No se pudieron cargar los productos.';
    feedback.type = 'error';
  } finally {
    isLoading.value = false;
  }
};

const formatCurrency = (value: number | null) => {
  if (value === null) return '';
  return value.toFixed(2);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const resetForm = () => {
  editingProduct.value = null;
  Object.assign(productForm, {
    name: '',
    slug: '',
    description: '',
    price: 0,
    comparePrice: null,
    sku: '',
    stock: 0,
    categoryId: '',
    images: '',
    specifications: '',
    isActive: true,
    isFeatured: false,
  });
  formError.value = '';
};

const openCreateModal = () => {
  resetForm();
  showForm.value = true;
};

const openEditModal = (product: Product) => {
  editingProduct.value = product;
  Object.assign(productForm, {
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    comparePrice: product.comparePrice ?? null,
    sku: product.sku,
    stock: product.stock,
    categoryId: product.categoryId,
    images: product.images.join('\n'),
    specifications: product.specifications ? JSON.stringify(product.specifications, null, 2) : '',
    isActive: product.isActive,
    isFeatured: product.isFeatured,
  });
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  formLoading.value = false;
};

const submitProduct = async () => {
  formError.value = '';
  formLoading.value = true;

  const images = productForm.images
    .split('\n')
    .map((url) => url.trim())
    .filter(Boolean);

  let specifications: Record<string, any> | null = null;
  if (productForm.specifications) {
    try {
      specifications = JSON.parse(productForm.specifications);
    } catch (error) {
      formError.value = 'El campo de especificaciones debe ser un JSON válido.';
      formLoading.value = false;
      return;
    }
  }

  const payload: Record<string, any> = {
    name: productForm.name,
    slug: productForm.slug,
    description: productForm.description,
    price: Number(productForm.price),
    comparePrice: productForm.comparePrice ? Number(productForm.comparePrice) : undefined,
    sku: productForm.sku,
    stock: productForm.stock,
    categoryId: productForm.categoryId,
    images,
    specifications,
    isActive: productForm.isActive,
    isFeatured: productForm.isFeatured,
  };

  try {
    if (editingProduct.value) {
      await $fetch(`${config.public.apiUrl}/products/${editingProduct.value.id}`, {
        method: 'PUT',
        body: payload,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders.value,
        },
      });
      feedback.message = 'Producto actualizado correctamente.';
    } else {
      await $fetch(`${config.public.apiUrl}/products`, {
        method: 'POST',
        body: payload,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders.value,
        },
      });
      feedback.message = 'Producto creado correctamente.';
    }

    feedback.type = 'success';
    showForm.value = false;
    await loadProducts(editingProduct.value ? pagination.value.page : 1);
  } catch (error: any) {
    console.error('Error guardando producto', error);
    formError.value = error?.data?.error || 'No se pudo guardar el producto.';
  } finally {
    formLoading.value = false;
  }
};

const toggleFeatured = async (product: Product) => {
  try {
    await $fetch(`${config.public.apiUrl}/products/${product.id}`, {
      method: 'PUT',
      body: {
        isFeatured: !product.isFeatured,
      },
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders.value,
      },
    });
    feedback.message = `Producto ${!product.isFeatured ? 'marcado como destacado' : 'actualizado'}.`;
    feedback.type = 'success';
    await loadProducts(pagination.value.page);
  } catch (error) {
    console.error('Error actualizando destacado', error);
    feedback.message = 'No se pudo actualizar el estado destacado.';
    feedback.type = 'error';
  }
};

const toggleActive = async (product: Product) => {
  try {
    await $fetch(`${config.public.apiUrl}/products/${product.id}`, {
      method: 'PUT',
      body: {
        isActive: !product.isActive,
      },
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders.value,
      },
    });
    feedback.message = `Producto ${!product.isActive ? 'activado' : 'desactivado'} correctamente.`;
    feedback.type = 'success';
    const targetPage = !product.isActive ? 1 : pagination.value.page;
    await loadProducts(targetPage);
  } catch (error) {
    console.error('Error actualizando estado', error);
    feedback.message = 'No se pudo actualizar el estado del producto.';
    feedback.type = 'error';
  }
};

const confirmDelete = (product: Product) => {
  productToDelete.value = product;
  deleteLoading.value = false;
  showDeleteConfirm.value = true;
};

const closeDelete = () => {
  showDeleteConfirm.value = false;
  deleteLoading.value = false;
};

const deleteProduct = async () => {
  if (!productToDelete.value) return;

  deleteLoading.value = true;
  try {
    await $fetch(`${config.public.apiUrl}/products/${productToDelete.value.id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        ...authHeaders.value,
      },
    });
    feedback.message = 'Producto eliminado correctamente.';
    feedback.type = 'success';
    showDeleteConfirm.value = false;
    await loadProducts(1);
  } catch (error) {
    console.error('Error eliminando producto', error);
    feedback.message = 'No se pudo eliminar el producto.';
    feedback.type = 'error';
  } finally {
    deleteLoading.value = false;
  }
};

const changePage = (page: number) => {
  if (page < 1 || page > pagination.value.totalPages) return;
  loadProducts(page);
};

onMounted(async () => {
  await Promise.all([loadCategories(), loadProducts(1)]);
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
  @apply px-3 py-1.5 bg-transparent border border-gray-300 hover:border-primary-500 hover:text-primary-600 text-gray-700 transition-colors rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed;
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

.badge-success {
  @apply inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold border border-green-300;
}

.badge-primary {
  @apply inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold border border-primary-300;
}

.badge-muted {
  @apply inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-300;
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
  @apply bg-white border border-gray-200 rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto;
}
</style>

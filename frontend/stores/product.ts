import { defineStore } from 'pinia';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  stock: number;
  averageRating?: number;
  reviewCount?: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    featuredProducts: [] as Product[],
    currentProduct: null as Product | null,
    pagination: null as PaginationMeta | null,
    isLoading: false,
  }),

  actions: {
    async fetchProducts(params: {
      page?: number;
      limit?: number;
      categoryId?: string;
      search?: string;
      minPrice?: number;
      maxPrice?: number;
      sortBy?: string;
      order?: string;
    } = {}) {
      const config = useRuntimeConfig();
      this.isLoading = true;

      try {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });

        const response = await $fetch(
          `${config.public.apiUrl}/products?${queryParams.toString()}`
        );

        this.products = response.products;
        this.pagination = response.pagination;

        return response;
      } catch (error) {
        console.error('Failed to fetch products:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchProductBySlug(slug: string) {
      const config = useRuntimeConfig();
      this.isLoading = true;

      try {
        const product = await $fetch(`${config.public.apiUrl}/products/${slug}`);
        this.currentProduct = product;

        return product;
      } catch (error) {
        console.error('Failed to fetch product:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchFeaturedProducts() {
      const config = useRuntimeConfig();

      try {
        const response = await $fetch(
          `${config.public.apiUrl}/products?isFeatured=true&limit=8`
        );

        this.featuredProducts = response.products;

        return response.products;
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
        throw error;
      }
    },
  },
});

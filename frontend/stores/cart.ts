import { defineStore } from 'pinia';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  slug: string;
  stock: number;
}

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    isLoading: false,
  }),

  getters: {
    itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    
    subtotal: (state) => state.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0),

    total(state): number {
      const subtotal = this.subtotal;
      const shipping = subtotal > 100 ? 0 : 10;
      const tax = subtotal * 0.18; // IGV 18%
      return subtotal + shipping + tax;
    },

    isEmpty: (state) => state.items.length === 0,

    getItemByProductId: (state) => (productId: string) => {
      return state.items.find(item => item.productId === productId);
    },
  },

  actions: {
    async fetchCart() {
      const config = useRuntimeConfig();
      const authStore = useAuthStore();

      if (!authStore.isAuthenticated) {
        return;
      }

      this.isLoading = true;

      try {
        const response = await $fetch(`${config.public.apiUrl}/cart`, {
          credentials: 'include',
          headers: authStore.accessToken ? {
            Authorization: `Bearer ${authStore.accessToken}`,
          } : {},
        });

        this.items = response.items || [];
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async addItem(productId: string, quantity: number = 1) {
      const config = useRuntimeConfig();
      const authStore = useAuthStore();

      if (!authStore.isAuthenticated) {
        throw new Error('Please login to add items to cart');
      }

      this.isLoading = true;

      try {
        const response = await $fetch(`${config.public.apiUrl}/cart/items`, {
          method: 'POST',
          body: { productId, quantity },
          credentials: 'include',
          headers: authStore.accessToken ? {
            Authorization: `Bearer ${authStore.accessToken}`,
          } : {},
        });

        this.items = response.items || [];
      } catch (error: any) {
        throw new Error(error.data?.error || 'Failed to add item to cart');
      } finally {
        this.isLoading = false;
      }
    },

    async updateQuantity(productId: string, quantity: number) {
      const config = useRuntimeConfig();
      const authStore = useAuthStore();

      if (quantity <= 0) {
        return this.removeItem(productId);
      }

      this.isLoading = true;

      try {
        const response = await $fetch(`${config.public.apiUrl}/cart/items/${productId}`, {
          method: 'PUT',
          body: { quantity },
          credentials: 'include',
          headers: authStore.accessToken ? {
            Authorization: `Bearer ${authStore.accessToken}`,
          } : {},
        });

        this.items = response.items || [];
      } catch (error: any) {
        throw new Error(error.data?.error || 'Failed to update quantity');
      } finally {
        this.isLoading = false;
      }
    },

    async removeItem(productId: string) {
      const config = useRuntimeConfig();
      const authStore = useAuthStore();

      this.isLoading = true;

      try {
        const response = await $fetch(`${config.public.apiUrl}/cart/items/${productId}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: authStore.accessToken ? {
            Authorization: `Bearer ${authStore.accessToken}`,
          } : {},
        });

        this.items = response.items || [];
      } catch (error) {
        console.error('Failed to remove item:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async clearCart() {
      const config = useRuntimeConfig();
      const authStore = useAuthStore();

      this.isLoading = true;

      try {
        await $fetch(`${config.public.apiUrl}/cart`, {
          method: 'DELETE',
          credentials: 'include',
          headers: authStore.accessToken ? {
            Authorization: `Bearer ${authStore.accessToken}`,
          } : {},
        });

        this.items = [];
      } catch (error) {
        console.error('Failed to clear cart:', error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});

import { defineStore } from 'pinia';
import { useRequestHeaders, useRuntimeConfig } from 'nuxt/app';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    accessToken: null as string | null,
    isAuthenticated: false,
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'ADMIN',
    fullName: (state) => state.user ? `${state.user.firstName} ${state.user.lastName}` : '',
  },

  actions: {
    async register(userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
    }) {
      const config = useRuntimeConfig();
      
      try {
  const response = await $fetch<{ user: User; accessToken: string }>(`${config.public.apiUrl}/auth/register`, {
          method: 'POST',
          body: userData,
          credentials: 'include',
        });

        this.user = response.user;
        this.accessToken = response.accessToken;
        this.isAuthenticated = true;

        return response;
      } catch (error: any) {
        throw new Error(error.data?.error || 'Registration failed');
      }
    },

  async login(email: string, password: string) {
      const config = useRuntimeConfig();

      try {
        const response = await $fetch<{ user: User; accessToken: string }>(`${config.public.apiUrl}/auth/login`, {
          method: 'POST',
          body: { email, password },
          credentials: 'include',
        });

        this.user = response.user;
        this.accessToken = response.accessToken;
        this.isAuthenticated = true;

        // Mark that user just logged in for auto-redirect
        if (process.client) {
          sessionStorage.setItem('just-logged-in', 'true');
        }

        return response;
      } catch (error: any) {
        throw new Error(error.data?.error || 'Login failed');
      }
    },    async logout() {
      const config = useRuntimeConfig();

      try {
        await $fetch(`${config.public.apiUrl}/auth/logout`, {
          method: 'POST',
          credentials: 'include',
          headers: this.accessToken ? {
            Authorization: `Bearer ${this.accessToken}`,
          } : {},
        });
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.user = null;
        this.accessToken = null;
        this.isAuthenticated = false;
      }
    },

    async fetchCurrentUser() {
      const config = useRuntimeConfig();

      try {
        const headers: Record<string, string> = {};

        if (this.accessToken) {
          headers.Authorization = `Bearer ${this.accessToken}`;
        }

        if (process.server) {
          const requestHeaders = useRequestHeaders(['cookie']);
          if (requestHeaders.cookie) {
            headers.cookie = requestHeaders.cookie;
          }
        }

  const user = await $fetch<User>(`${config.public.apiUrl}/auth/me`, {
          credentials: 'include',
          headers,
        });

        this.user = user;
        this.isAuthenticated = true;

        return user;
      } catch (error) {
        this.user = null;
        this.isAuthenticated = false;
        throw error;
      }
    },

    async refreshToken() {
      const config = useRuntimeConfig();

      try {
  const response = await $fetch<{ accessToken: string }>(`${config.public.apiUrl}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        this.accessToken = response.accessToken;

        return response;
      } catch (error) {
        this.logout();
        throw error;
      }
    },
  },
});

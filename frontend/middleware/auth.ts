import { defineNuxtRouteMiddleware, navigateTo } from '#imports';
import { useAuthStore } from '../stores/auth';

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore();

  if (!authStore.user) {
    try {
      await authStore.fetchCurrentUser();
    } catch {
      return navigateTo('/auth/login');
    }
  }

  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login');
  }
});

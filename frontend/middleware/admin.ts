import { defineNuxtRouteMiddleware, navigateTo } from '#imports';
import { useAuthStore } from '../stores/auth';

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  // Si no hay usuario autenticado, redirigir al login de admin
  if (!authStore.user) {
    try {
      await authStore.fetchCurrentUser();
    } catch (error) {
      // Redirigir al login de admin
      return navigateTo('/login_admin');
    }
  }

  // Si el usuario está autenticado pero no es admin, denegar acceso
  if (!authStore.isAdmin) {
    return navigateTo('/login_admin');
  }
});

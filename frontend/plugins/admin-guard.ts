export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  const router = useRouter();

  // Protección en el cliente para rutas de admin
  router.beforeEach((to, from, next) => {
    // Si está intentando acceder a /admin
    if (to.path.startsWith('/admin')) {
      // Si no está autenticado o no es admin, redirigir a login de admin
      if (!authStore.isAuthenticated || !authStore.isAdmin) {
        // Permitir que el middleware del servidor maneje la redirección
        return next();
      }
    }

    // Si está intentando acceder a login_admin pero ya es admin autenticado
    if (to.path === '/login_admin' && authStore.isAuthenticated && authStore.isAdmin) {
      return next('/admin');
    }

    // Si es admin y está intentando acceder a áreas de cliente, redirigir al admin
    if (authStore.isAuthenticated && authStore.isAdmin) {
      const clientRoutes = ['/cart', '/checkout', '/profile', '/orders'];
      if (clientRoutes.some(route => to.path.startsWith(route))) {
        return next('/admin');
      }
    }

    next();
  });
});

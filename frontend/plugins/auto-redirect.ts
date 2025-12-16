export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  const router = useRouter();

  // Auto-redirect admin users to admin panel after login
  router.afterEach((to) => {
    if (authStore.isAuthenticated && authStore.isAdmin) {
      // If admin is on a client page and not intentionally visiting it, redirect to admin
      if (!to.path.startsWith('/admin') && !to.path.startsWith('/auth')) {
        // Check if this is the first navigation after login
        const fromLogin = sessionStorage.getItem('just-logged-in');
        if (fromLogin === 'true') {
          sessionStorage.removeItem('just-logged-in');
          router.push('/admin');
        }
      }
    }
  });
});

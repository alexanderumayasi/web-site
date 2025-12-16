<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();

// Try to fetch current user on app load
onMounted(async () => {
  if (authStore.accessToken) {
    try {
      await authStore.fetchCurrentUser();
    } catch (error) {
      // Token expired or invalid, try to refresh
      try {
        await authStore.refreshToken();
        await authStore.fetchCurrentUser();
      } catch (refreshError) {
        // Refresh failed, logout
        authStore.logout();
      }
    }
  }
});

// SEO
useHead({
  titleTemplate: '%s | Gaming Store',
  meta: [
    { name: 'description', content: 'Tienda online de componentes gaming de alta gama' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Gaming Store' },
  ],
});
</script>

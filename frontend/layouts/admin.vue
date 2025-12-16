<template>
  <div class="min-h-screen flex admin-layout bg-gray-50">
    <!-- Sidebar -->
    <AdminSidebar :collapsed="sidebarCollapsed" @toggle="sidebarCollapsed = !sidebarCollapsed" />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col transition-all duration-300">
      <!-- Top Bar -->
      <AdminTopBar @toggleSidebar="sidebarCollapsed = !sidebarCollapsed" />

      <!-- Content Area -->
      <main class="flex-1 p-8 overflow-y-auto bg-gray-50">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const sidebarCollapsed = ref(false);

onMounted(() => {
  document.body.classList.add('admin-theme');
});

onBeforeUnmount(() => {
  document.body.classList.remove('admin-theme');
});
</script>

<style scoped>
.admin-layout {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>

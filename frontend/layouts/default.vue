<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header/Navbar -->
    <Header />

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <Footer />

    <!-- Chatbot -->
    <Chatbot />

    <!-- Toast Notifications -->
    <Teleport to="body">
      <NotificationContainer />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
</script>

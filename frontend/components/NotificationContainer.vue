<template>
  <div class="fixed top-4 right-4 z-[9999] space-y-3 max-w-sm">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notificationStore.notifications"
        :key="notification.id"
        :class="[
          'notification-card rounded-xl shadow-2xl p-4 flex items-start space-x-3 backdrop-blur-sm',
          getNotificationClass(notification.type)
        ]"
      >
        <!-- Icon -->
        <div class="flex-shrink-0">
          <div :class="['w-10 h-10 rounded-full flex items-center justify-center', getIconBgClass(notification.type)]">
            <svg v-if="notification.type === 'success'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else-if="notification.type === 'error'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <svg v-else-if="notification.type === 'warning'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <svg v-else class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-bold text-gray-900 mb-1">
            {{ notification.title }}
          </h4>
          <p class="text-sm text-gray-700">
            {{ notification.message }}
          </p>
        </div>

        <!-- Close Button -->
        <button
          @click="notificationStore.remove(notification.id)"
          class="flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
const notificationStore = useNotificationStore();

const getNotificationClass = (type: string) => {
  const classes = {
    success: 'bg-white border-2 border-green-500',
    error: 'bg-white border-2 border-red-500',
    warning: 'bg-white border-2 border-yellow-500',
    info: 'bg-white border-2 border-blue-500',
  };
  return classes[type as keyof typeof classes] || classes.info;
};

const getIconBgClass = (type: string) => {
  const classes = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };
  return classes[type as keyof typeof classes] || classes.info;
};
</script>

<style scoped>
.notification-card {
  animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 0.4);
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>


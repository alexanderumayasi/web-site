import { defineStore } from 'pinia';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as Notification[],
  }),

  actions: {
    add(notification: Omit<Notification, 'id'>) {
      const id = `${Date.now()}-${Math.random()}`;
      const duration = notification.duration || 3000;

      this.notifications.push({
        ...notification,
        id,
      });

      // Auto-remove after duration
      setTimeout(() => {
        this.remove(id);
      }, duration);
    },

    remove(id: string) {
      const index = this.notifications.findIndex((n) => n.id === id);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
    },

    success(title: string, message: string, duration?: number) {
      this.add({ type: 'success', title, message, duration });
    },

    error(title: string, message: string, duration?: number) {
      this.add({ type: 'error', title, message, duration });
    },

    warning(title: string, message: string, duration?: number) {
      this.add({ type: 'warning', title, message, duration });
    },

    info(title: string, message: string, duration?: number) {
      this.add({ type: 'info', title, message, duration });
    },
  },
});

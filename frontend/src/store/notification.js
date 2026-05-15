import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])

  function addNotification(message, type = 'success', duration = 3000) {
    const id = Date.now()
    notifications.value.push({
      id,
      message,
      type,
    })

    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }

  function removeNotification(id) {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  return {
    notifications,
    addNotification,
    removeNotification,
  }
})

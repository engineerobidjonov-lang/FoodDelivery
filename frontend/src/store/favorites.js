import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useNotificationStore } from './notification'

export const useFavoriteStore = defineStore('favorites', () => {
  const notificationStore = useNotificationStore()
  
  // Load initial state from localStorage if exists
  const likedItems = ref(JSON.parse(localStorage.getItem('favorite_items')) || [])

  // Sync state to localStorage whenever it changes
  watch(likedItems, (newItems) => {
    localStorage.setItem('favorite_items', JSON.stringify(newItems))
  }, { deep: true })

  function toggleLike(product) {
    const index = likedItems.value.findIndex((i) => i.id === product.id)
    if (index > -1) {
      likedItems.value.splice(index, 1)
      notificationStore.addNotification(`${product.name} saralanganlardan olib tashlandi`, 'info')
    } else {
      likedItems.value.push(product)
      notificationStore.addNotification(`${product.name}ga ❤️ bosildi`)
    }
  }

  function isLiked(id) {
    return likedItems.value.some((i) => i.id === id)
  }

  return {
    likedItems,
    toggleLike,
    isLiked,
  }
})

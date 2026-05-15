import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useNotificationStore } from './notification'

export const useCartStore = defineStore('cart', () => {
  const notificationStore = useNotificationStore()
  
  const items = ref(JSON.parse(localStorage.getItem('cart_items')) || [])
  const address = ref('')
  const lastAddedAt = ref(0)

  watch(items, (newItems) => {
    localStorage.setItem('cart_items', JSON.stringify(newItems))
  }, { deep: true })

  const itemCount = computed(() =>
    items.value.reduce((count, item) => count + item.quantity, 0),
  )

  const totalPrice = computed(() =>
    items.value.reduce((total, item) => total + item.price * item.quantity, 0),
  )

  function addToCart(food) {
    const existingItem = items.value.find((item) => item.id === food.id)

    if (existingItem) {
      existingItem.quantity += 1
      lastAddedAt.value = Date.now()
      notificationStore.addNotification(`${food.name} soni oshirildi`)
      return
    }

    items.value.push({ ...food, quantity: 1 })
    lastAddedAt.value = Date.now()
    notificationStore.addNotification(`${food.name} savatga qo'shildi`)
  }

  function updateQuantity(id, nextQuantity) {
    const target = items.value.find((item) => item.id === id)
    if (!target) return

    if (nextQuantity <= 0) {
      removeFromCart(id)
      return
    }

    target.quantity = nextQuantity
  }

  function removeFromCart(id) {
    const item = items.value.find(i => i.id === id)
    if (item) {
      items.value = items.value.filter((i) => i.id !== id)
      notificationStore.addNotification(`${item.name} savatdan olib tashlandi`, 'info')
    }
  }

  function clearCart(options = {}) {
    items.value = []
    if (!options.silent) {
      notificationStore.addNotification(`Savat tozalandi`, 'info')
    }
  }

  return {
    items,
    address,
    itemCount,
    totalPrice,
    lastAddedAt,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  }
})

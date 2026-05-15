import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useOrderStore = defineStore('orders', () => {
  const orders = ref(JSON.parse(localStorage.getItem('order_history')) || [])
  const activeDeliveryOrderId = ref(localStorage.getItem('active_delivery_order_id') || '')

  watch(orders, (newOrders) => {
    localStorage.setItem('order_history', JSON.stringify(newOrders))

    if (activeDeliveryOrderId.value && !newOrders.some((order) => order.id === activeDeliveryOrderId.value)) {
      activeDeliveryOrderId.value = ''
      localStorage.removeItem('active_delivery_order_id')
    }
  }, { deep: true })

  watch(activeDeliveryOrderId, (orderId) => {
    if (orderId) {
      localStorage.setItem('active_delivery_order_id', orderId)
    } else {
      localStorage.removeItem('active_delivery_order_id')
    }
  })

  function createOrder(orderData) {
    const newOrder = {
      id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      createdAt: new Date().toISOString(),
      status: 'delivering',
      delivery: {
        eta: '15 min',
        distance: '2.4 km',
        courierName: 'Ali Courier',
        courierPhone: '+998 90 111 22 33',
      },
      ...orderData
    }
    
    orders.value.unshift(newOrder)
    activeDeliveryOrderId.value = newOrder.id
    return newOrder
  }

  function getOrderById(id) {
    return orders.value.find(o => o.id === id)
  }

  function getActiveDeliveryOrder() {
    return orders.value.find((order) => order.id === activeDeliveryOrderId.value) || null
  }

  function deleteOrder(id) {
    orders.value = orders.value.filter((order) => order.id !== id)

    if (activeDeliveryOrderId.value === id) {
      activeDeliveryOrderId.value = ''
    }
  }

  return {
    orders,
    activeDeliveryOrderId,
    createOrder,
    getOrderById,
    getActiveDeliveryOrder,
    deleteOrder,
  }
})

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/store/auth'
import { useOrderStore } from '@/store/orders'
import { useCartStore } from '@/store/cart'
import { useNotificationStore } from '@/store/notification'
import Modal from '@/components/Modal.vue'

const router = useRouter()
const authStore = useAuthStore()
const orderStore = useOrderStore()
const cartStore = useCartStore()
const notificationStore = useNotificationStore()

const { orders } = storeToRefs(orderStore)
const isLoading = ref(true)
const selectedOrder = ref(null)
const isDetailModalOpen = ref(false)
const fallbackImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80'

onMounted(() => {
  // Simulate initial loading
  setTimeout(() => {
    isLoading.value = false
  }, 800)
})

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm"
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('uz-UZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status) => {
  const colors = {
    'pending': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'preparing': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'delivering': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'delivered': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

const getStatusLabel = (status) => {
  const labels = {
    'pending': 'Qabul qilindi',
    'preparing': 'Tayyorlanmoqda',
    'delivering': 'Yo\'lda',
    'delivered': 'Yetkazildi'
  }
  return labels[status] || status
}

const getStatusProgress = (status) => {
  const progress = {
    'pending': 'w-1/4',
    'preparing': 'w-1/2',
    'delivering': 'w-3/4',
    'delivered': 'w-full'
  }
  return progress[status] || 'w-0'
}

const openDetails = (order) => {
  selectedOrder.value = order
  isDetailModalOpen.value = true
}

const handleReorder = (order) => {
  order.items.forEach(item => {
    // We map back to the format addToCart expects
    const product = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    }
    cartStore.addToCart(product)
  })
  notificationStore.addNotification('Taomlar savatga qayta qo\'shildi!', 'success')
  router.push('/cart')
}

const getImage = (item) => item.image || item.imageUrl || fallbackImage

const handleImageError = (event) => {
  if (event.target.src !== fallbackImage) {
    event.target.src = fallbackImage
  }
}

const handleDeleteOrder = (order) => {
  orderStore.deleteOrder(order.id)

  if (selectedOrder.value?.id === order.id) {
    selectedOrder.value = null
    isDetailModalOpen.value = false
  }

  notificationStore.addNotification('Buyurtma o‘chirildi', 'info')
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-slate-900 py-12 transition-colors">
    <div class="max-w-5xl mx-auto px-4">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-4xl font-black text-slate-900 dark:text-slate-100 leading-tight">Buyurtmalar Tarixi 📦</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-2 font-medium">Sizning barcha mazali tanlovlaringiz</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-6">
        <div v-for="i in 3" :key="i" class="bg-white dark:bg-slate-800 rounded-[40px] p-8 shadow-float animate-pulse">
          <div class="h-6 w-1/4 bg-slate-100 dark:bg-slate-700 rounded mb-4"></div>
          <div class="h-4 w-1/2 bg-slate-100 dark:bg-slate-700 rounded"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="text-center py-24 bg-white dark:bg-slate-800 rounded-[50px] shadow-float border border-gray-100 dark:border-slate-700 max-w-2xl mx-auto">
        <div class="text-[120px] mb-8 animate-bounce">🏜️</div>
        <h2 class="text-3xl font-black text-slate-900 dark:text-slate-100">Sizda hali buyurtmalar yo'q</h2>
        <p class="text-slate-500 dark:text-slate-400 mt-4 max-w-xs mx-auto text-lg leading-relaxed">
          Oshqozoningiz xursand bo'lishini xohlaysizmi? Hoziroq taom buyurtma bering!
        </p>
        <RouterLink to="/" class="inline-block mt-12 bg-orange-500 text-white px-12 py-5 rounded-[24px] font-black text-xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 active:scale-95">
          Taom tanlash
        </RouterLink>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-8">
        <div 
          v-for="order in orders" 
          :key="order.id"
          class="group bg-white dark:bg-slate-800 rounded-[40px] p-8 shadow-float border border-gray-100 dark:border-slate-700 transition-all hover:shadow-2xl hover:-translate-y-1"
        >
          <!-- Order Card Header -->
          <div class="flex flex-wrap justify-between items-start gap-6 mb-8">
            <div class="flex gap-6 items-center">
              <div class="h-16 w-16 rounded-3xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-3xl">
                🛍️
              </div>
              <div>
                <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Buyurtma ID</p>
                <p class="text-xl font-black text-slate-900 dark:text-slate-100">#{{ order.id }}</p>
              </div>
            </div>
            
            <div class="flex flex-col items-end">
              <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Sana</p>
              <p class="font-bold text-slate-700 dark:text-slate-300">{{ formatDate(order.createdAt) }}</p>
            </div>

            <div :class="getStatusColor(order.status)" class="px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-[0.1em]">
              {{ getStatusLabel(order.status) }}
            </div>
          </div>

          <!-- Status Progress Bar -->
          <div class="relative h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full mb-10 overflow-hidden">
            <div 
              class="absolute left-0 top-0 h-full bg-orange-500 transition-all duration-1000"
              :class="getStatusProgress(order.status)"
            ></div>
          </div>

          <!-- Quick Info & Actions -->
          <div class="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-gray-100 dark:border-slate-700">
            <div class="flex gap-8">
              <div>
                <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Taomlar</p>
                <p class="font-black text-slate-900 dark:text-slate-100">{{ order.items.length }} ta</p>
              </div>
              <div>
                <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Umumiy summa</p>
                <p class="text-2xl font-black text-orange-500">{{ formatPrice(order.totalPrice) }}</p>
              </div>
            </div>

            <div class="flex gap-4">
              <button 
                @click="handleReorder(order)"
                class="px-8 py-4 rounded-2xl bg-slate-900 dark:bg-orange-600 text-white font-black hover:bg-orange-500 transition-all active:scale-95 shadow-lg"
              >
                Qayta buyurtma
              </button>
              <button 
                @click="openDetails(order)"
                class="px-8 py-4 rounded-2xl bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-black hover:bg-slate-100 dark:hover:bg-slate-600 transition-all active:scale-95"
              >
                Batafsil
              </button>
              <button
                @click="handleDeleteOrder(order)"
                class="px-8 py-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 font-black hover:bg-red-100 dark:hover:bg-red-900/30 transition-all active:scale-95"
              >
                O‘chirish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <Modal :open="isDetailModalOpen" @close="isDetailModalOpen = false" maxWidth="max-w-2xl">
      <div v-if="selectedOrder" class="p-8 bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden">
        <div class="flex justify-between items-start mb-8">
          <div>
            <h2 class="text-3xl font-black text-slate-900 dark:text-slate-100">Buyurtma Ma'lumotlari</h2>
            <p class="text-slate-500 dark:text-slate-400 font-bold mt-1">#{{ selectedOrder.id }}</p>
          </div>
          <div :class="getStatusColor(selectedOrder.status)" class="px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
            {{ getStatusLabel(selectedOrder.status) }}
          </div>
        </div>

        <!-- Items -->
        <div class="space-y-4 mb-8">
          <p class="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">Tanlangan Taomlar</p>
          <div v-for="item in selectedOrder.items" :key="item.id" class="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
            <img :src="getImage(item)" :alt="item.name" @error="handleImageError" class="h-16 w-16 rounded-xl object-cover shadow-sm" />
            <div class="flex-1">
              <p class="font-bold text-slate-900 dark:text-slate-100">{{ item.name }}</p>
              <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">{{ item.quantity }} x {{ formatPrice(item.price) }}</p>
            </div>
            <p class="font-black text-slate-900 dark:text-slate-100">{{ formatPrice(item.price * item.quantity) }}</p>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-gray-100 dark:border-slate-700">
          <div>
            <p class="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Qabul qiluvchi</p>
            <p class="font-bold text-slate-900 dark:text-slate-100">{{ selectedOrder.customer.name }}</p>
            <p class="text-slate-500 dark:text-slate-400 font-medium">{{ selectedOrder.customer.phone }}</p>
          </div>
          <div>
            <p class="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Yetkazish manzili</p>
            <p class="font-bold text-slate-900 dark:text-slate-100">{{ selectedOrder.address.street }}</p>
          </div>
          <div>
            <p class="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">To'lov turi</p>
            <p class="font-bold text-slate-900 dark:text-slate-100">
              {{ selectedOrder.paymentMethod === 'cash' ? '💵 Naqd pul' : '💳 Karta orqali' }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Jami summa</p>
            <p class="text-3xl font-black text-orange-500">{{ formatPrice(selectedOrder.totalPrice) }}</p>
          </div>
        </div>

        <button 
          @click="handleReorder(selectedOrder)"
          class="w-full mt-8 bg-orange-500 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-orange-100 transition-all hover:bg-orange-600 active:scale-95 flex items-center justify-center gap-3"
        >
          <span>Qayta buyurtma berish</span>
          <span class="text-2xl">🛒</span>
        </button>
        <button
          @click="handleDeleteOrder(selectedOrder)"
          class="w-full mt-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 py-5 rounded-2xl font-black text-lg transition-all hover:bg-red-100 dark:hover:bg-red-900/30 active:scale-95"
        >
          O‘chirish
        </button>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.shadow-float {
  box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05);
}
</style>

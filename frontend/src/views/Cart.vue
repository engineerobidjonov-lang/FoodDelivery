<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useCartStore } from '@/store/cart'
import { useNotificationStore } from '@/store/notification'
import { orderService } from '@/services/orderService'
import CartItem from '@/components/CartItem.vue'

const router = useRouter()
const cartStore = useCartStore()
const notificationStore = useNotificationStore()
const { items, totalPrice, itemCount } = storeToRefs(cartStore)

const isLoading = ref(false)
const errorMessage = ref('')

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm"
}

const checkout = async () => {
  if (itemCount.value === 0) {
    notificationStore.addNotification('Savat bo‘sh. Avval ovqat tanlang.', 'error')
    return
  }

  router.push('/checkout')
}
</script>

<template>
  <div class="min-h-screen bg-[#FDFDFD] dark:bg-slate-900 py-8 transition-colors">
    <div class="max-w-5xl mx-auto px-4">
      <div class="mb-10 flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-black text-gray-900">Savat 🛒</h1>
          <p class="text-gray-500 mt-2">Siz tanlagan barcha shirinliklar va taomlar</p>
        </div>
        <button 
          @click="cartStore.clearCart" 
          v-if="items.length > 0"
          class="text-sm font-bold text-red-500 hover:text-red-700 transition-colors"
        >
          Savatni tozalash
        </button>
      </div>

      <div v-if="items.length > 0" class="grid gap-8 lg:grid-cols-[1fr_350px]">
        <!-- Items List -->
        <div class="space-y-6">
          <CartItem v-for="item in items" :key="item.id" :item="item" />
        </div>

        <!-- Summary -->
        <div class="sticky top-24 h-fit">
          <div class="rounded-[32px] bg-white p-8 shadow-float border border-gray-50">
            <h2 class="text-2xl font-black text-gray-900 mb-6">Jami</h2>
            
            <div class="space-y-4 mb-8">
              <div class="flex justify-between text-gray-500 font-medium">
                <span>Taomlar soni:</span>
                <span>{{ itemCount }} ta</span>
              </div>
              <div class="flex justify-between text-gray-500 font-medium">
                <span>Yetkazib berish:</span>
                <span class="text-green-500 font-bold">Bepul</span>
              </div>
              <div class="h-px bg-gray-100 my-4"></div>
              <div class="flex justify-between items-end">
                <span class="text-lg font-bold text-gray-900">Umumiy:</span>
                <span class="text-2xl font-black text-orange-500">{{ formatPrice(totalPrice) }}</span>
              </div>
            </div>

            <button 
              @click="checkout"
              :disabled="isLoading"
              class="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-orange-500 transition-all active:scale-95 disabled:bg-gray-400 flex items-center justify-center gap-3"
            >
              <span v-if="isLoading" class="animate-spin text-xl">⏳</span>
              {{ isLoading ? 'Yuborilmoqda...' : 'Buyurtma berish' }}
            </button>

            <p v-if="errorMessage" class="text-red-500 text-xs text-center mt-4 font-bold">
              {{ errorMessage }}
            </p>

            <p class="text-center text-xs text-gray-400 mt-6 leading-relaxed">
              Tugmani bosish orqali siz xizmat ko‘rsatish shartlariga rozilik bildirasiz.
            </p>
          </div>
        </div>
      </div>

      <!-- Empty Cart -->
      <div v-else class="text-center py-20 bg-white rounded-[40px] shadow-float border border-gray-50">
        <div class="text-8xl mb-6">🛒</div>
        <h2 class="text-3xl font-black text-gray-900">Savat bo‘sh</h2>
        <p class="text-gray-500 mt-3 max-w-sm mx-auto">Siz hali birorta ham taom tanlamadingiz. Home pagega o‘tib, mazali taomlar tanlang!</p>
        <RouterLink to="/" class="inline-block mt-8 bg-orange-500 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-orange-600 transition-all shadow-lg active:scale-95">
          Taom tanlash
        </RouterLink>
      </div>
    </div>
  </div>
</template>

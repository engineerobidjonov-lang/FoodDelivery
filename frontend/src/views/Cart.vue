<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { useCartStore } from '@/store/cart'
import { useNotificationStore } from '@/store/notification'
import CartItem from '@/components/CartItem.vue'

const router = useRouter()
const cartStore = useCartStore()
const notificationStore = useNotificationStore()
const { items, totalPrice, itemCount } = storeToRefs(cartStore)

const isLoading = ref(false)
const errorMessage = ref('')
const deliveryFee = computed(() => itemCount.value > 0 ? 0 : 0)
const promoCode = ref('')
const tax = computed(() => itemCount.value > 0 ? Math.round(totalPrice.value * 0.02) : 0)
const discount = computed(() => promoCode.value.trim().toUpperCase() === 'FOODDASH' ? Math.round(totalPrice.value * 0.1) : 0)
const grandTotal = computed(() => Math.max(0, totalPrice.value + deliveryFee.value + tax.value - discount.value))

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
      <div class="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
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
          <div class="rounded-[32px] bg-white p-8 shadow-float border border-gray-50 dark:border-slate-700 dark:bg-slate-800">
            <h2 class="text-2xl font-black text-gray-900 mb-6 dark:text-slate-100">Jami</h2>
            
            <div class="space-y-4 mb-8">
              <div class="flex justify-between text-gray-500 font-medium dark:text-slate-400">
                <span>Taomlar soni:</span>
                <span>{{ itemCount }} ta</span>
              </div>
              <div class="flex justify-between text-gray-500 font-medium dark:text-slate-400">
                <span>Subtotal:</span>
                <span>{{ formatPrice(totalPrice) }}</span>
              </div>
              <div class="flex justify-between text-gray-500 font-medium dark:text-slate-400">
                <span>Yetkazib berish:</span>
                <span class="text-green-500 font-bold">Bepul</span>
              </div>
              <div class="flex justify-between text-gray-500 font-medium dark:text-slate-400">
                <span>Service tax:</span>
                <span>{{ formatPrice(tax) }}</span>
              </div>
              <div v-if="discount" class="flex justify-between text-green-500 font-bold">
                <span>Promo chegirma:</span>
                <span>-{{ formatPrice(discount) }}</span>
              </div>
              <div class="rounded-2xl bg-slate-50 p-3 dark:bg-slate-900">
                <label class="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">Promo code</label>
                <input
                  v-model="promoCode"
                  type="text"
                  placeholder="FOODDASH"
                  class="h-11 w-full rounded-xl border border-transparent bg-white px-4 text-sm font-bold text-slate-900 outline-none transition focus:border-orange-500 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div class="h-px bg-gray-100 my-4 dark:bg-slate-700"></div>
              <div class="flex justify-between items-end">
                <span class="text-lg font-bold text-gray-900 dark:text-slate-100">Umumiy:</span>
                <span class="text-2xl font-black text-orange-500">{{ formatPrice(grandTotal) }}</span>
              </div>
            </div>

            <button 
              @click="checkout"
              :disabled="isLoading"
              class="hidden w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 py-5 text-lg font-black text-white shadow-lg transition-all hover:bg-orange-500 active:scale-95 disabled:bg-gray-400 dark:bg-orange-600 sm:flex"
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
      <div v-else class="text-center py-20 bg-white rounded-[40px] shadow-float border border-gray-50 dark:border-slate-700 dark:bg-slate-800">
        <div class="text-8xl mb-6">🛒</div>
        <h2 class="text-3xl font-black text-gray-900">Savat bo‘sh</h2>
        <p class="text-gray-500 mt-3 max-w-sm mx-auto">Siz hali birorta ham taom tanlamadingiz. Home pagega o‘tib, mazali taomlar tanlang!</p>
        <RouterLink to="/menu" class="inline-block mt-8 bg-orange-500 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-orange-600 transition-all shadow-lg active:scale-95">
          Taom tanlash
        </RouterLink>
      </div>
    </div>

    <div v-if="items.length > 0" class="fixed inset-x-0 bottom-[92px] z-40 px-4 sm:hidden">
      <button
        @click="checkout"
        class="flex w-full items-center justify-between rounded-[24px] bg-slate-950 px-5 py-4 font-black text-white shadow-2xl shadow-slate-900/20 dark:bg-orange-600"
      >
        <span>Buyurtma berish</span>
        <span>{{ formatPrice(grandTotal) }}</span>
      </button>
    </div>
  </div>
</template>

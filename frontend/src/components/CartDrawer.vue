<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/store/cart'
import { useUiStore } from '@/store/ui'
import CartItem from '@/components/CartItem.vue'

const router = useRouter()
const uiStore = useUiStore()
const cartStore = useCartStore()
const { items, totalPrice, itemCount } = storeToRefs(cartStore)

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm"
}

const goToCheckout = () => {
  uiStore.closeCart()
  router.push('/checkout')
}
</script>

<template>
  <Teleport to="body">
    <!-- Overlay -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="uiStore.isCartOpen" 
        @click="uiStore.closeCart"
        class="fixed inset-0 z-[80] bg-slate-900/60 backdrop-blur-sm"
      ></div>
    </transition>

    <!-- Drawer -->
    <transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition duration-400 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div 
        v-if="uiStore.isCartOpen"
        class="fixed right-0 top-0 z-[90] h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-gray-100 dark:border-slate-800"
      >
        <!-- Header -->
        <div class="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-slate-100">Savat 🛒</h2>
            <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">{{ itemCount }} ta mahsulot</p>
          </div>
          <button 
            @click="uiStore.closeCart"
            class="h-12 w-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors"
          >
            ✕
          </button>
        </div>

        <!-- Items List -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          <div v-if="items.length > 0" class="space-y-4">
            <CartItem v-for="item in items" :key="item.id" :item="item" />
          </div>
          <div v-else class="h-full flex flex-col items-center justify-center text-center">
            <div class="text-6xl mb-4">🛒</div>
            <h3 class="text-xl font-black text-slate-900 dark:text-slate-100">Savat bo'sh</h3>
            <p class="text-slate-500 dark:text-slate-400 mt-2 text-sm">Hali birorta ham taom tanlamadingiz</p>
            <button 
              @click="uiStore.closeCart"
              class="mt-6 text-orange-500 font-bold hover:underline"
            >
              Taomlarni ko'rish
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="items.length > 0" class="p-6 border-t border-gray-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div class="flex justify-between items-end mb-6">
            <div>
              <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Umumiy summa</p>
              <p class="text-3xl font-black text-orange-500">{{ formatPrice(totalPrice) }}</p>
            </div>
            <div class="text-right">
              <p class="text-[10px] font-bold text-green-500 uppercase tracking-widest">Yetkazib berish: Bepul</p>
            </div>
          </div>

          <button 
            @click="goToCheckout"
            class="w-full h-16 rounded-3xl bg-slate-900 dark:bg-orange-600 text-white font-black text-lg shadow-xl shadow-slate-200 dark:shadow-none transition-all hover:bg-orange-500 active:scale-95 flex items-center justify-center gap-3"
          >
            <span>Buyurtma berish</span>
            <span class="text-xl">→</span>
          </button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

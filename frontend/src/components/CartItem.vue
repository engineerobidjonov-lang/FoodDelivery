<script setup>
import { useCartStore } from '@/store/cart'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const cartStore = useCartStore()
const fallbackImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80'

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm"
}

const getImage = (item) => item.image || item.imageUrl || fallbackImage

const handleImageError = (event) => {
  if (event.target.src !== fallbackImage) {
    event.target.src = fallbackImage
  }
}
</script>

<template>
  <article class="flex flex-col gap-6 rounded-[32px] bg-white p-5 shadow-float transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl dark:border dark:border-slate-700 dark:bg-slate-800 sm:flex-row sm:items-center sm:p-6">
    <!-- Image -->
    <div class="mx-auto h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl sm:mx-0">
      <img :src="getImage(item)" :alt="item.name" @error="handleImageError" class="h-full w-full object-cover" />
    </div>

    <!-- Info -->
    <div class="min-w-0 flex-1">
      <h3 class="text-xl font-black text-slate-900 line-clamp-1 dark:text-slate-100">{{ item.name }}</h3>
      <p class="mt-1 text-sm font-bold text-orange-500">{{ formatPrice(item.price) }}</p>
    </div>

    <!-- Actions -->
    <div class="flex w-full flex-wrap items-center justify-between gap-4 sm:w-auto sm:flex-nowrap sm:gap-6">
      <div class="flex items-center gap-3 rounded-2xl bg-gray-50 p-2 dark:bg-slate-900 sm:gap-4">
        <button 
          @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl font-bold shadow-sm transition hover:bg-orange-500 hover:text-white active:scale-90 dark:bg-slate-800 dark:text-slate-100"
        >
          -
        </button>
        <span class="w-8 text-center font-black text-slate-900 dark:text-slate-100">{{ item.quantity }}</span>
        <button 
          @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl font-bold shadow-sm transition hover:bg-orange-500 hover:text-white active:scale-90 dark:bg-slate-800 dark:text-slate-100"
        >
          +
        </button>
      </div>

      <div class="flex min-w-0 flex-col items-end">
        <span class="text-xs font-bold uppercase tracking-widest text-gray-400">Jami</span>
        <p class="text-lg font-black text-slate-900 dark:text-slate-100">{{ formatPrice(item.price * item.quantity) }}</p>
      </div>

      <button 
        @click="cartStore.removeFromCart(item.id)"
        class="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white"
      >
        🗑️
      </button>
    </div>
  </article>
</template>

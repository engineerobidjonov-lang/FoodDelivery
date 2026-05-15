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
  <article class="flex flex-col gap-6 rounded-[32px] bg-white p-6 shadow-float sm:flex-row sm:items-center">
    <!-- Image -->
    <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl">
      <img :src="getImage(item)" :alt="item.name" @error="handleImageError" class="h-full w-full object-cover" />
    </div>

    <!-- Info -->
    <div class="min-w-0 flex-1">
      <h3 class="text-xl font-black text-slate-900 line-clamp-1">{{ item.name }}</h3>
      <p class="mt-1 text-sm font-bold text-orange-500">{{ formatPrice(item.price) }}</p>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-between gap-6">
      <div class="flex items-center gap-4 rounded-2xl bg-gray-50 p-2">
        <button 
          @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl font-bold shadow-sm transition hover:bg-orange-500 hover:text-white"
        >
          -
        </button>
        <span class="w-8 text-center font-black text-slate-900">{{ item.quantity }}</span>
        <button 
          @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl font-bold shadow-sm transition hover:bg-orange-500 hover:text-white"
        >
          +
        </button>
      </div>

      <div class="flex flex-col items-end min-w-[120px]">
        <span class="text-xs font-bold uppercase tracking-widest text-gray-400">Jami</span>
        <p class="text-lg font-black text-slate-900">{{ formatPrice(item.price * item.quantity) }}</p>
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

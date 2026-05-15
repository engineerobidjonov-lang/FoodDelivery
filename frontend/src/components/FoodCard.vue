<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/store/cart'
import { useFavoriteStore } from '@/store/favorites'
import Modal from '@/components/Modal.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const cartStore = useCartStore()
const favoriteStore = useFavoriteStore()

const isDetailOpen = ref(false)
const isAdding = ref(false)
const fallbackImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80'

const getImage = (item) => item.imageUrl || item.image || fallbackImage

const handleImageError = (event) => {
  if (event.target.src !== fallbackImage) {
    event.target.src = fallbackImage
  }
}

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm"
}

const openDetails = () => {
  isDetailOpen.value = true
}

const closeDetails = () => {
  isDetailOpen.value = false
}

const handleAddToCart = () => {
  cartStore.addToCart(props.item)
  isAdding.value = true
  if ('vibrate' in navigator) {
    navigator.vibrate(18)
  }
  window.setTimeout(() => {
    isAdding.value = false
  }, 600)
}
</script>

<template>
  <div class="h-full">
    <!-- Card Wrapper -->
    <div 
      @click="openDetails"
      class="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-800"
    >
      <!-- Image Section -->
      <div class="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
        <img 
          :src="getImage(item)" 
          :alt="item.name" 
          loading="lazy"
          @error="handleImageError"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-80"></div>
        <span class="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-slate-700 shadow-sm backdrop-blur dark:bg-slate-900/85 dark:text-slate-200">
          {{ item.category }}
        </span>
        <div class="absolute bottom-4 left-4 flex gap-2">
          <span class="rounded-full bg-slate-950/80 px-3 py-1 text-xs font-black text-white backdrop-blur">
            ★ 4.8
          </span>
          <span class="rounded-full bg-white/90 px-3 py-1 text-xs font-black text-slate-800 backdrop-blur dark:bg-slate-900/85 dark:text-slate-100">
            15-20 min
          </span>
        </div>
        
        <!-- Like Button -->
        <button 
          @click.stop="favoriteStore.toggleLike(item)"
          class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-md transition-all hover:scale-110 active:scale-95"
        >
          <span :class="favoriteStore.isLiked(item.id) ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'" class="text-xl">
            {{ favoriteStore.isLiked(item.id) ? '❤️' : '🤍' }}
          </span>
        </button>
      </div>

      <!-- Content Section -->
      <div class="flex flex-1 flex-col p-5">
        <div class="mb-2 flex items-start justify-between">
          <h3 class="text-lg font-black leading-tight text-slate-900 line-clamp-1 dark:text-slate-100">{{ item.name }}</h3>
        </div>
        
        <p class="mb-5 flex-1 text-sm leading-6 text-slate-500 line-clamp-2 dark:text-slate-400">
          {{ item.description }}
        </p>

        <div class="mt-auto flex items-center justify-between gap-3">
          <div class="flex flex-col">
            <span class="text-[11px] font-black uppercase tracking-wider text-slate-400">Narxi</span>
            <span class="text-lg font-black text-slate-950 dark:text-white">{{ formatPrice(item.price) }}</span>
          </div>
          
          <button 
            @click.stop="handleAddToCart"
            class="flex h-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500 px-4 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-slate-900 active:scale-95 dark:hover:bg-orange-600"
            :class="isAdding ? 'animate-cart-bounce' : ''"
          >
            <span class="text-xl">🛒</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Feature 1: Product Detail Modal -->
    <Modal :open="isDetailOpen" @close="closeDetails" maxWidth="max-w-2xl">
      <div class="flex flex-col md:flex-row h-full bg-white dark:bg-slate-900 overflow-hidden rounded-[32px]">
        <!-- Modal Image -->
        <div class="h-64 md:h-auto md:w-1/2 overflow-hidden">
          <img :src="getImage(item)" :alt="item.name" loading="lazy" @error="handleImageError" class="h-full w-full object-cover" />
        </div>
        
        <!-- Modal Details -->
        <div class="flex flex-col p-8 md:w-1/2">
          <div class="flex-1">
            <div class="flex justify-between items-start mb-2">
              <div>
                <p class="text-xs font-black uppercase tracking-widest text-orange-500">{{ item.category }}</p>
                <h2 class="text-3xl font-black text-slate-900 dark:text-white leading-tight">{{ item.name }}</h2>
              </div>
            </div>
            
            <p class="text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
              {{ item.description }}
            </p>

            <div class="mt-8">
              <span class="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 block mb-1">Narxi</span>
              <span class="text-4xl font-black text-orange-500">{{ formatPrice(item.price) }}</span>
            </div>
          </div>

          <div class="mt-8 flex flex-col gap-4 sm:flex-row">
            <button 
              @click="favoriteStore.toggleLike(item)"
              class="flex h-16 w-full items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-2xl shadow-sm transition-all hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-95 sm:w-16"
            >
              <span :class="favoriteStore.isLiked(item.id) ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'">
                {{ favoriteStore.isLiked(item.id) ? '❤️' : '🤍' }}
              </span>
            </button>
            <button 
              @click="handleAddToCart"
              class="flex h-16 flex-1 items-center justify-center gap-3 rounded-3xl bg-slate-900 dark:bg-orange-600 text-white font-black text-lg shadow-xl shadow-slate-200 dark:shadow-none transition-all hover:bg-orange-500 active:scale-95"
            >
              <span>Savatga qo'shish</span>
              <span class="text-2xl">🛒</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

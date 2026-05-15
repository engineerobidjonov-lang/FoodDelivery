<script setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, useRoute } from 'vue-router'
import { useCartStore } from '@/store/cart'

const route = useRoute()
const cartStore = useCartStore()
const { itemCount } = storeToRefs(cartStore)
const cartPulse = ref(false)

const items = [
  { label: 'Home', path: '/', icon: '⌂' },
  { label: 'Menu', path: '/menu', icon: '≡' },
  { label: 'Orders', path: '/orders', icon: '□' },
  { label: 'Map', path: '/location', icon: '⌖' },
  { label: 'Cart', path: '/cart', icon: '+' },
]

const isActive = computed(() => (path) => {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(`${path}/`)
})

watch(() => cartStore.lastAddedAt, () => {
  if (!cartStore.lastAddedAt) return
  cartPulse.value = true
  window.setTimeout(() => {
    cartPulse.value = false
  }, 650)
})
</script>

<template>
  <nav class="fixed inset-x-0 bottom-3 z-50 px-3 sm:hidden">
    <div class="mx-auto grid max-w-md grid-cols-5 rounded-[28px] border border-white/70 bg-white/85 p-2 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/85">
      <RouterLink
        v-for="item in items"
        :key="item.path"
        :to="item.path"
        class="relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-extrabold transition"
        :class="isActive(item.path)
          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
          : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'"
      >
        <span class="text-lg leading-none">{{ item.icon }}</span>
        <span class="truncate">{{ item.label }}</span>
        <span
          v-if="item.path === '/cart' && itemCount > 0"
          class="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] text-white dark:bg-orange-500"
          :class="cartPulse ? 'animate-cart-bounce' : ''"
        >
          {{ itemCount }}
        </span>
      </RouterLink>
    </div>
  </nav>
</template>

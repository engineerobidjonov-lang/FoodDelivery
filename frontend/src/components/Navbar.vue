<script setup>
import { storeToRefs } from 'pinia'
import { RouterLink, useRoute } from 'vue-router'
import { useCartStore } from '@/store/cart'
import { useUiStore } from '@/store/ui'
import { useThemeStore } from '@/store/theme'
import { useAuthStore } from '@/store/auth'

const route = useRoute()
const uiStore = useUiStore()
const themeStore = useThemeStore()
const cartStore = useCartStore()
const authStore = useAuthStore()
const { itemCount } = storeToRefs(cartStore)
const { user, isAuthenticated } = storeToRefs(authStore)

const links = [
  { name: 'Home', path: '/' },
  { name: 'Saralanganlar', path: '/favorites' },
  { name: 'Buyurtmalar', path: '/orders' },
  { name: 'Manzil', path: '/location' },
]
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-gray-100 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl transition-colors">
    <nav class="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
      
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-base font-black text-white shadow-lg">FD</div>
        <div class="hidden sm:block">
          <p class="text-base font-bold text-slate-900 dark:text-white leading-tight">FoodDash</p>
          <p class="text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Fast Delivery</p>
        </div>
      </RouterLink>

      <!-- Navigation Links -->
      <div class="flex items-center gap-1 sm:gap-2 rounded-full border border-gray-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1">
        <RouterLink
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          class="rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold transition-all"
          :class="route.path === link.path 
            ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm' 
            : 'text-slate-700 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-300'"
        >
          {{ link.name }}
        </RouterLink>
      </div>

      <!-- Right side actions -->
      <div class="flex items-center gap-2 sm:gap-3">
        
        <!-- Theme Toggle -->
        <button 
          @click="themeStore.toggleTheme"
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-xl transition-all hover:bg-orange-50 dark:hover:bg-slate-700 shadow-sm"
          aria-label="Toggle Theme"
        >
          {{ themeStore.isDark ? '☀️' : '🌙' }}
        </button>

        <!-- User Profile -->
        <div class="flex items-center">
          <template v-if="isAuthenticated">
            <RouterLink 
              to="/profile"
              class="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors"
            >
              <span class="text-lg">👤</span>
              <span class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ user.name }}</span>
            </RouterLink>
            <RouterLink 
              to="/profile"
              class="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-orange-500 shadow-sm"
              title="Profil"
            >
              👤
            </RouterLink>
          </template>
          <template v-else>
            <RouterLink 
              to="/login"
              class="flex h-10 px-4 items-center justify-center rounded-xl bg-orange-500 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95"
            >
              Kirish
            </RouterLink>
          </template>
        </div>

        <!-- Cart Button -->
        <button 
          @click="uiStore.openCart"
          class="relative group flex h-10 px-3 sm:px-4 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-800 text-white shadow-lg transition-all hover:bg-orange-500" 
          aria-label="Open Cart"
        >
          <span class="text-xl sm:mr-2">🛒</span>
          <span class="text-xs font-bold uppercase tracking-[0.1em] hidden sm:inline">Savat</span>
          <span class="absolute -right-2 -top-2 min-w-6 h-6 flex items-center justify-center rounded-full bg-orange-500 border-2 border-white dark:border-slate-900 text-[10px] font-black text-white group-hover:scale-110 transition-transform">
            {{ itemCount }}
          </span>
        </button>

      </div>
    </nav>
  </header>
</template>

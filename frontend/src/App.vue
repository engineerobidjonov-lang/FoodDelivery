<script setup>
import { onMounted, ref } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import Navbar from './components/Navbar.vue'
import CartDrawer from './components/CartDrawer.vue'
import ToastContainer from './components/ToastContainer.vue'
import { useUiStore } from '@/store/ui'
import { useAuthStore } from '@/store/auth'
import { storeToRefs } from 'pinia'
import api from '@/api'

const uiStore = useUiStore()
const authStore = useAuthStore()
const { isSidebarOpen } = storeToRefs(uiStore)
const { user } = storeToRefs(authStore)

const categories = ref([])

onMounted(async () => {
  try {
    const { data } = await api.get('/catalog/categories')
    categories.value = data
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
})

const getCategoryIcon = (name) => {
  const icons = {
    'National': '🍲',
    'Seafood': '🐟',
    'Fast Food': '🍔'
  }
  return icons[name] || '🍽️'
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
    <Navbar />

    <!-- Cart Drawer -->
    <CartDrawer />

    <!-- Toast Notifications -->
    <ToastContainer />

    <!-- Sidebar Overlay -->
    <div
      v-if="isSidebarOpen"
      @click="uiStore.closeSidebar"
      class="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity"
    ></div>

    <!-- Sidebar -->
    <aside
      class="fixed left-0 top-0 z-[70] h-full w-80 transform bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 ease-in-out border-r border-gray-100 dark:border-slate-800"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex h-full flex-col p-6">
        <div class="mb-10 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-lg font-black text-white">
              FD
            </div>

            <span class="text-xl font-bold text-slate-900 dark:text-white">FoodDash Menu</span>
          </div>

          <button
            @click="uiStore.closeSidebar"
            class="text-2xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <nav class="flex-1 space-y-2 overflow-y-auto">
          <h3 class="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Kategoriyalar
          </h3>

          <RouterLink
            v-for="cat in categories"
            :key="cat.id"
            :to="`/category/${cat.name}`"
            @click="uiStore.closeSidebar"
            class="flex items-center gap-4 rounded-2xl p-4 transition-colors hover:bg-orange-50 dark:hover:bg-slate-800"
          >
            <span class="text-2xl">{{ getCategoryIcon(cat.name) }}</span>
            <span class="font-bold text-slate-700 dark:text-slate-300">{{ cat.name }}</span>
          </RouterLink>
        </nav>

        <div class="mt-auto border-t border-gray-100 dark:border-slate-700 pt-6">
          <div class="flex items-center gap-4 rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-xl">
              👤
            </div>

            <div>
              <p class="font-bold text-slate-900 dark:text-white">{{ user?.name || 'Mehmon' }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">fooddash.uz</p>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <main class="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <RouterView />
    </main>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

body {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.shadow-float {
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.08);
}
</style>
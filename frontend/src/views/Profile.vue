<script setup>
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 transition-colors">
    <div class="max-w-2xl mx-auto px-4">
      <div class="bg-white dark:bg-slate-900 rounded-[40px] p-10 shadow-float border border-gray-50 dark:border-slate-800">
        <div class="flex flex-col items-center text-center mb-10">
          <div class="h-32 w-32 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-6xl mb-6 shadow-inner">
            👤
          </div>
          <h1 class="text-3xl font-black text-slate-900 dark:text-white">{{ authStore.user?.name || 'Mehmon' }}</h1>
          <p class="text-slate-500 dark:text-slate-400 font-medium">{{ authStore.user?.email || 'email@example.com' }}</p>
          <div class="mt-4 px-4 py-1 rounded-full bg-orange-500 text-white text-xs font-black uppercase tracking-widest">
            {{ authStore.user?.role || 'User' }}
          </div>
        </div>

        <div class="space-y-4">
          <RouterLink 
            to="/orders" 
            class="flex items-center justify-between p-6 rounded-3xl bg-gray-50 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-slate-700 transition-all group"
          >
            <div class="flex items-center gap-4">
              <span class="text-2xl">📦</span>
              <span class="font-bold text-slate-700 dark:text-slate-200">Mening buyurtmalarim</span>
            </div>
            <span class="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
          </RouterLink>

          <RouterLink 
            to="/favorites" 
            class="flex items-center justify-between p-6 rounded-3xl bg-gray-50 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-slate-700 transition-all group"
          >
            <div class="flex items-center gap-4">
              <span class="text-2xl">❤️</span>
              <span class="font-bold text-slate-700 dark:text-slate-200">Saralanganlar</span>
            </div>
            <span class="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
          </RouterLink>

          <div class="h-px bg-gray-100 dark:border-slate-800 my-6"></div>

          <button 
            @click="handleLogout"
            class="w-full flex items-center justify-center gap-3 p-6 rounded-3xl bg-red-50 dark:bg-red-900/10 text-red-500 font-black text-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-all active:scale-95"
          >
            <span>🚪</span> Chiqish
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import { useFavoriteStore } from '@/store/favorites'
import FoodCard from '@/components/FoodCard.vue'

const favoriteStore = useFavoriteStore()
const { likedItems } = storeToRefs(favoriteStore)
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-slate-900 py-8 transition-colors">
    <div class="max-w-7xl mx-auto px-4">
      <div class="mb-10">
        <h1 class="text-4xl font-black text-slate-900 dark:text-slate-100 leading-tight">Saralanganlar ❤️</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-2 font-medium">Sizga yoqqan barcha shirinliklar va taomlar shu yerda jamlangan</p>
      </div>

      <div v-if="likedItems.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <FoodCard 
          v-for="food in likedItems" 
          :key="food.id" 
          :item="food" 
        />
      </div>

      <div v-else class="text-center py-24 bg-white dark:bg-slate-800 rounded-[40px] shadow-float border border-gray-100 dark:border-slate-700 max-w-2xl mx-auto">
        <div class="text-8xl mb-6">🏜️</div>
        <h2 class="text-3xl font-black text-slate-900 dark:text-slate-100">Hozircha bo'sh</h2>
        <p class="text-slate-500 dark:text-slate-400 mt-4 max-w-xs mx-auto text-lg leading-relaxed">
          Yoqtirgan taomlaringizni ❤️ tugmasini bosib shu yerga qo'shishingiz mumkin.
        </p>
        <RouterLink to="/" class="inline-block mt-10 bg-orange-500 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 active:scale-95">
          Taomlarni kashf qilish
        </RouterLink>
      </div>
    </div>
  </div>
</template>

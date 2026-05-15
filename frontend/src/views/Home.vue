<script setup>
import { useRouter, RouterLink } from 'vue-router'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'
import FoodCard from '@/components/FoodCard.vue'
import FoodCardSkeleton from '@/components/FoodCardSkeleton.vue'
import Modal from '@/components/Modal.vue'
import { useMenuData } from '@/composables/useMenuData'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()
const { categories, foods, loading, error, reload } = useMenuData()

const searchQuery = ref('')
const isContactModalOpen = ref(false)

const restaurantContacts = computed(() => {
  return categories.value.map(cat => ({
    name: cat.name,
    phone: cat.sellerPhone || '+998 71 200 10 10',
    icon: getCategoryIcon(cat.name)
  }))
})

const getCategoryIcon = (name) => {
  const icons = {
    'National': '🍲',
    'Seafood': '🐟',
    'Fast Food': '🍔'
  }
  return icons[name] || '🍽️'
}

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value
  
  const query = searchQuery.value.toLowerCase()
  return categories.value.filter(category => {
    const hasMatchingFood = foods.value.some(food => 
      food.category.toLowerCase() === category.name.toLowerCase() &&
      food.name.toLowerCase().includes(query)
    )
    return category.name.toLowerCase().includes(query) || hasMatchingFood
  })
})

const getFilteredFoods = (categoryName) => {
  const query = searchQuery.value.toLowerCase()
  return foods.value.filter(f => 
    f.category.toLowerCase() === categoryName.toLowerCase() &&
    (!query || f.name.toLowerCase().includes(query))
  )
}

const callRestaurant = (phone) => {
  window.location.href = `tel:${phone.replace(/\s/g, '')}`
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-slate-900 pb-24 -mt-6 transition-colors">
    <!-- Sub Header with Menu and Welcome -->
    <div class="bg-white dark:bg-slate-800 px-4 py-6 border-b border-gray-100 dark:border-slate-700 rounded-b-[40px] shadow-sm">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="flex items-center gap-4">
          <button 
            @click="uiStore.openSidebar" 
            class="h-12 w-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-700 text-2xl hover:bg-orange-50 dark:hover:bg-slate-600 transition-colors"
          >
            ☰
          </button>
          <div>
            <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Xayrli kun!</p>
            <h1 class="text-xl font-black text-slate-900 dark:text-slate-100">
              Xush Keldingiz, <span class="text-orange-500">{{ authStore.user?.name || 'Mehmon' }}</span>
            </h1>
          </div>
        </div>
        <button 
          @click="isContactModalOpen = true" 
          class="h-12 w-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-700 text-2xl hover:bg-orange-50 dark:hover:bg-slate-600 transition-colors"
        >
          📞
        </button>
      </div>
    </div>

    <main class="max-w-7xl mx-auto px-4 mt-8">
      <!-- Search Bar -->
      <div class="relative mb-10 group max-w-2xl mx-auto">
        <div class="absolute left-6 top-1/2 -translate-y-1/2 text-2xl opacity-20 group-focus-within:opacity-100 transition-opacity">
          🔍
        </div>
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Qanday taomlarni hush ko‘rasiz?"
          class="w-full py-6 px-16 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-[30px] shadow-float border-2 border-transparent focus:border-orange-500 focus:ring-0 transition-all font-bold text-lg"
        />
        <button 
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-6 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          ✕
        </button>
      </div>

      <!-- Categories & Foods Grid -->
      <section v-for="category in filteredCategories" :key="category.id" class="mb-12">
        <div class="flex justify-between items-end mb-6">
          <div>
            <h2 class="text-3xl font-black text-slate-900 dark:text-slate-100">{{ category.name }}</h2>
            <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Eng sara {{ category.name.toLowerCase() }} taomlari</p>
          </div>
          <RouterLink :to="`/category/${category.name}`" class="text-orange-500 font-bold hover:underline flex items-center gap-1">
            Hammasi <span class="text-lg">→</span>
          </RouterLink>
        </div>

        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FoodCardSkeleton v-for="i in 4" :key="i" />
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FoodCard 
            v-for="food in getFilteredFoods(category.name).slice(0, 4)" 
            :key="food.id" 
            :item="food" 
          />
        </div>
      </section>

      <div v-if="error" class="text-center py-10">
        <p class="text-red-500 mb-4">{{ error }}</p>
        <button @click="reload" class="bg-orange-500 text-white px-6 py-2 rounded-full">Qayta yuklash</button>
      </div>

      <div v-if="filteredCategories.length === 0" class="text-center py-20">
        <p class="text-slate-500 dark:text-slate-400 text-lg">Hech narsa topilmadi 😕</p>
      </div>
    </main>

    <!-- Contact Selection Modal -->
    <Modal :open="isContactModalOpen" title="Bog'lanish" @close="isContactModalOpen = false">
      <div class="space-y-4">
        <button 
          v-for="contact in restaurantContacts" 
          :key="contact.name"
          @click="callRestaurant(contact.phone)"
          class="group w-full flex items-center justify-between p-5 rounded-3xl bg-slate-50 dark:bg-slate-800 hover:bg-orange-500 transition-all active:scale-95"
        >
          <div class="flex items-center gap-4">
            <span class="text-3xl bg-white dark:bg-slate-700 h-14 w-14 flex items-center justify-center rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
              {{ contact.icon }}
            </span>
            <div class="text-left">
              <p class="text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-orange-100 uppercase tracking-widest">Restoran</p>
              <p class="text-lg font-black text-slate-900 dark:text-slate-100 group-hover:text-white">{{ contact.name }}</p>
            </div>
          </div>
          <div class="h-10 w-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-700 text-orange-500 group-hover:bg-white group-hover:text-orange-500">
            📞
          </div>
        </button>
      </div>
    </Modal>
  </div>
</template>

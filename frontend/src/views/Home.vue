<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import FoodCard from '@/components/FoodCard.vue'
import FoodCardSkeleton from '@/components/FoodCardSkeleton.vue'
import { useMenuData } from '@/composables/useMenuData'

const router = useRouter()
const authStore = useAuthStore()
const { categories, foods, loading, error, reload } = useMenuData()
const searchQuery = ref('')

const featuredCategories = computed(() => {
  return categories.value.map((category) => ({
    ...category,
    items: foods.value
      .filter((food) => food.category.toLowerCase() === category.name.toLowerCase())
      .slice(0, 4),
  }))
})

const totalFoods = computed(() => foods.value.length)

const submitSearch = () => {
  const query = searchQuery.value.trim()
  router.push(query ? `/menu?search=${encodeURIComponent(query)}` : '/menu')
}
</script>

<template>
  <div class="space-y-10 overflow-x-hidden pb-8">
    <section class="relative overflow-hidden rounded-[30px] border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-white p-5 shadow-float dark:border-slate-700 dark:from-slate-800 dark:via-slate-900 dark:to-slate-900 sm:p-8 lg:p-10">
      <div class="absolute right-0 top-0 h-40 w-40 rounded-full bg-orange-200/30 blur-3xl dark:bg-orange-500/10"></div>
      <div class="relative grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
        <div>
          <p class="text-xs font-black uppercase tracking-[0.24em] text-orange-500">
            25-35 daqiqada yetkazib berish
          </p>
          <h1 class="mt-4 max-w-3xl text-3xl font-black leading-tight text-slate-950 dark:text-white sm:text-5xl">
            Salom, {{ authStore.user?.name || 'Mehmon' }}. Bugun nima buyurtma qilamiz?
          </h1>
          <p class="mt-4 max-w-xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            Milliy taomlar, dengiz mahsulotlari va fast food menyusini tez qidiring va savatga qo‘shing.
          </p>

          <form class="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]" @submit.prevent="submitSearch">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Palov, burger, sushi..."
                class="h-14 w-full rounded-2xl border border-white bg-white px-5 text-sm font-bold text-slate-900 shadow-sm outline-none transition focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <button class="h-14 rounded-2xl bg-slate-900 px-6 font-black text-white shadow-lg transition hover:bg-orange-500 active:scale-95 dark:bg-orange-500 dark:hover:bg-orange-600">
              Menu ko‘rish
            </button>
          </form>

          <div class="mt-6 grid grid-cols-3 gap-3 sm:max-w-md">
            <div class="rounded-2xl bg-white/80 p-3 text-center shadow-sm dark:bg-slate-800/80">
              <p class="text-xl font-black text-slate-950 dark:text-white">{{ categories.length }}</p>
              <p class="text-[11px] font-bold uppercase text-slate-400">kategoriya</p>
            </div>
            <div class="rounded-2xl bg-white/80 p-3 text-center shadow-sm dark:bg-slate-800/80">
              <p class="text-xl font-black text-slate-950 dark:text-white">{{ totalFoods }}</p>
              <p class="text-[11px] font-bold uppercase text-slate-400">taom</p>
            </div>
            <div class="rounded-2xl bg-white/80 p-3 text-center shadow-sm dark:bg-slate-800/80">
              <p class="text-xl font-black text-orange-500">4.8</p>
              <p class="text-[11px] font-bold uppercase text-slate-400">rating</p>
            </div>
          </div>
        </div>

        <div class="hidden overflow-hidden rounded-[28px] bg-slate-900 shadow-2xl lg:block">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80"
            alt="Food delivery"
            loading="lazy"
            class="h-80 w-full object-cover opacity-90"
          />
        </div>
      </div>
    </section>

    <div v-if="error" class="rounded-3xl border border-red-100 bg-red-50 p-8 text-center dark:border-red-900/40 dark:bg-red-950/20">
      <p class="font-bold text-red-600 dark:text-red-300">{{ error }}</p>
      <button class="mt-4 rounded-2xl bg-slate-900 px-6 py-3 font-black text-white dark:bg-orange-500" @click="reload">
        Qayta yuklash
      </button>
    </div>

    <section v-for="category in featuredCategories" :key="category.id" class="space-y-4">
      <div class="flex items-end justify-between gap-4">
        <div class="min-w-0">
          <h2 class="text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">{{ category.name }}</h2>
          <p class="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            {{ category.subtitle || `${category.name} bo‘yicha eng ko‘p tanlangan taomlar` }}
          </p>
        </div>
        <RouterLink
          :to="`/menu/${encodeURIComponent(category.name)}`"
          class="shrink-0 rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-orange-600 transition hover:bg-orange-500 hover:text-white dark:bg-orange-900/20 dark:text-orange-300"
        >
          Hammasini ko‘rish →
        </RouterLink>
      </div>

      <div v-if="loading" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <FoodCardSkeleton v-for="index in 4" :key="index" />
      </div>

      <div v-else class="-mx-3 flex snap-x gap-4 overflow-x-auto px-3 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        <FoodCard
          v-for="food in category.items"
          :key="food.id"
          :item="food"
          class="min-w-[82vw] snap-start sm:min-w-0"
        />
      </div>
    </section>

    <div v-if="!loading && featuredCategories.length === 0" class="rounded-[28px] border border-slate-100 bg-white p-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h2 class="text-2xl font-black text-slate-900 dark:text-white">Hech narsa topilmadi</h2>
      <p class="mt-2 text-slate-500 dark:text-slate-400">Menyu hozircha bo‘sh.</p>
    </div>
  </div>
</template>

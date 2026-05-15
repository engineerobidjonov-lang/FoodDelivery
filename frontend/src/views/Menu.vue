<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FoodCard from '@/components/FoodCard.vue'
import FoodCardSkeleton from '@/components/FoodCardSkeleton.vue'
import { useMenuData } from '@/composables/useMenuData'

const route = useRoute()
const router = useRouter()
const { categories, foods, loading, error, reload } = useMenuData()

const search = ref(route.query.search ? String(route.query.search) : '')
const sort = ref('popular')
const maxPrice = ref(300000)
const topRatedOnly = ref(false)
const fastDeliveryOnly = ref(false)

const activeCategory = computed(() => route.params.category ? String(route.params.category) : 'all')

watch(
  () => route.params.category,
  () => {
    search.value = ''
  },
)

watch(
  () => route.query.search,
  (query) => {
    search.value = query ? String(query) : search.value
  },
)

const setCategory = (categoryName) => {
  if (categoryName === 'all') {
    router.push('/menu')
    return
  }
  router.push(`/menu/${encodeURIComponent(categoryName)}`)
}

const filteredFoods = computed(() => {
  const query = search.value.trim().toLowerCase()
  const category = activeCategory.value.toLowerCase()

  const result = foods.value.filter((item) => {
    const matchesCategory = category === 'all' || item.category.toLowerCase() === category
    const matchesPrice = item.price <= maxPrice.value
    const matchesTopRated = !topRatedOnly.value || true
    const matchesFastDelivery = !fastDeliveryOnly.value || (item.prepTimeMinutes || 20) <= 20
    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)

    return matchesCategory && matchesSearch && matchesPrice && matchesTopRated && matchesFastDelivery
  })

  return [...result].sort((a, b) => {
    if (sort.value === 'price-asc') return a.price - b.price
    if (sort.value === 'price-desc') return b.price - a.price
    if (sort.value === 'az') return a.name.localeCompare(b.name)
    if (sort.value === 'rating') return a.name.localeCompare(b.name)
    return 0
  })
})

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + " so'm"
}
</script>

<template>
  <section class="space-y-8 pb-28 sm:pb-10">
    <div class="rounded-[28px] border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-white p-5 shadow-float dark:border-slate-700 dark:from-slate-800 dark:via-slate-900 dark:to-slate-900 sm:p-8">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <p class="text-xs font-black uppercase tracking-[0.24em] text-orange-500">FoodDash menu</p>
          <h1 class="mt-3 text-3xl font-black leading-tight text-slate-950 dark:text-white sm:text-5xl">
            Barcha taomlar bir joyda
          </h1>
          <p class="mt-3 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            Qidirish, kategoriya va narx bo‘yicha tartiblash orqali kerakli taomni tez toping.
          </p>
        </div>

        <div class="grid w-full gap-3 sm:grid-cols-[1fr_220px] lg:max-w-xl">
          <div class="relative">
            <input
              v-model="search"
              type="text"
              placeholder="Taom qidirish"
              class="h-14 w-full rounded-2xl border border-slate-100 bg-white px-5 pr-11 text-sm font-bold text-slate-900 shadow-sm outline-none transition focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <button
              v-if="search"
              class="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300"
              @click="search = ''"
            >
              x
            </button>
          </div>

          <select
            v-model="sort"
            class="h-14 rounded-2xl border border-slate-100 bg-white px-4 text-sm font-black text-slate-700 shadow-sm outline-none transition focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="popular">Tavsiya etilgan</option>
            <option value="price-asc">Narx: arzon</option>
            <option value="price-desc">Narx: qimmat</option>
            <option value="az">A-Z</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>
    </div>

    <div class="sticky top-[72px] z-30 -mx-3 border-y border-white/70 bg-white/80 px-3 py-3 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/80 sm:top-[74px] sm:mx-0 sm:rounded-[28px] sm:border sm:px-4">
      <div class="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
        <button
          class="shrink-0 rounded-2xl px-5 py-3 text-sm font-black transition"
          :class="activeCategory === 'all'
            ? 'bg-slate-900 text-white dark:bg-orange-500'
            : 'bg-white text-slate-600 shadow-sm hover:bg-orange-50 dark:bg-slate-800 dark:text-slate-300'"
          @click="setCategory('all')"
        >
          Hammasi
        </button>
        <button
          v-for="category in categories"
          :key="category.id"
          class="shrink-0 rounded-2xl px-5 py-3 text-sm font-black transition"
          :class="activeCategory.toLowerCase() === category.name.toLowerCase()
            ? 'bg-slate-900 text-white dark:bg-orange-500'
            : 'bg-white text-slate-600 shadow-sm hover:bg-orange-50 dark:bg-slate-800 dark:text-slate-300'"
          @click="setCategory(category.name)"
        >
          {{ category.name }}
        </button>
      </div>

      <div class="grid gap-3 pt-2 md:grid-cols-[1fr_auto_auto] md:items-center">
        <label class="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-800">
          <div class="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-400">
            <span>Max narx</span>
            <span class="text-orange-500">{{ formatPrice(maxPrice) }}</span>
          </div>
          <input v-model="maxPrice" type="range" min="10000" max="300000" step="5000" class="w-full accent-orange-500" />
        </label>
        <button
          class="rounded-2xl px-4 py-3 text-sm font-black transition"
          :class="topRatedOnly ? 'bg-orange-500 text-white' : 'bg-white text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-300'"
          @click="topRatedOnly = !topRatedOnly"
        >
          ★ Top rated
        </button>
        <button
          class="rounded-2xl px-4 py-3 text-sm font-black transition"
          :class="fastDeliveryOnly ? 'bg-orange-500 text-white' : 'bg-white text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-300'"
          @click="fastDeliveryOnly = !fastDeliveryOnly"
        >
          15-20 min
        </button>
      </div>
    </div>

    <div v-if="error" class="rounded-3xl border border-red-100 bg-red-50 p-8 text-center dark:border-red-900/40 dark:bg-red-950/20">
      <p class="font-bold text-red-600 dark:text-red-300">{{ error }}</p>
      <button class="mt-4 rounded-2xl bg-slate-900 px-6 py-3 font-black text-white dark:bg-orange-500" @click="reload">
        Qayta yuklash
      </button>
    </div>

    <div v-else-if="loading" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <FoodCardSkeleton v-for="index in 8" :key="index" />
    </div>

    <div v-else-if="filteredFoods.length" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <FoodCard v-for="item in filteredFoods" :key="item.id" :item="item" />
    </div>

    <div v-else class="rounded-[28px] border border-slate-100 bg-white p-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div class="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-3xl dark:bg-orange-900/20">?</div>
      <h2 class="text-2xl font-black text-slate-900 dark:text-white">Hech narsa topilmadi</h2>
      <p class="mt-2 text-slate-500 dark:text-slate-400">Qidiruv yoki filterlarni o‘zgartirib ko‘ring.</p>
    </div>
  </section>
</template>

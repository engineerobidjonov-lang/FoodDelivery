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
    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)

    return matchesCategory && matchesSearch
  })

  return [...result].sort((a, b) => {
    if (sort.value === 'price-asc') return a.price - b.price
    if (sort.value === 'price-desc') return b.price - a.price
    if (sort.value === 'az') return a.name.localeCompare(b.name)
    return 0
  })
})
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
          </select>
        </div>
      </div>
    </div>

    <div class="-mx-3 overflow-x-auto px-3 sm:mx-0 sm:px-0">
      <div class="flex min-w-max gap-2">
        <button
          class="rounded-2xl px-5 py-3 text-sm font-black transition"
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
          class="rounded-2xl px-5 py-3 text-sm font-black transition"
          :class="activeCategory.toLowerCase() === category.name.toLowerCase()
            ? 'bg-slate-900 text-white dark:bg-orange-500'
            : 'bg-white text-slate-600 shadow-sm hover:bg-orange-50 dark:bg-slate-800 dark:text-slate-300'"
          @click="setCategory(category.name)"
        >
          {{ category.name }}
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

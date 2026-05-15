<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import FoodCard from '@/components/FoodCard.vue'
import { useMenuData } from '@/composables/useMenuData'

const route = useRoute()
const search = ref('')
const maxPrice = ref(300000)
const { categories, foods, loading, error, reload } = useMenuData()

const currentCategory = computed(() =>
  categories.value.find(
    (category) => category.name.toLowerCase() === String(route.params.name).toLowerCase(),
  ),
)

const categoryItems = computed(() =>
  foods.value.filter((item) => {
    const matchesCategory =
      item.category.toLowerCase() === String(route.params.name).toLowerCase()
    const matchesSearch = item.name.toLowerCase().includes(search.value.toLowerCase())
    const matchesPrice = item.price <= maxPrice.value
    return matchesCategory && matchesSearch && matchesPrice
  }),
)

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + " so'm"
}
</script>

<template>
  <section class="space-y-12 pb-24">
    <!-- Category Hero -->
    <div class="overflow-hidden rounded-[40px] bg-white dark:bg-slate-800 shadow-float border border-gray-100 dark:border-slate-700 transition-colors">
      <div class="grid lg:grid-cols-[1fr_1fr]">
        <div class="flex flex-col justify-center p-12 lg:p-16">
          <p class="text-sm font-bold uppercase tracking-[0.3em] text-orange-500 mb-4">
            Restoran Menu
          </p>

          <h1 class="text-5xl font-black text-slate-900 dark:text-slate-100 mb-6">
            {{ currentCategory?.name || route.params.name }}
          </h1>

          <p class="max-w-md text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-10">
            {{
              currentCategory?.subtitle ||
              'Eng mazali va sifatli taomlar to‘plami.'
            }}
          </p>

          <div class="grid gap-6 md:grid-cols-2">
            <div class="relative group">
              <input
                v-model="search"
                type="text"
                placeholder="Taom qidirish..."
                class="w-full rounded-2xl border-2 border-transparent bg-slate-50 dark:bg-slate-900 dark:text-slate-100 px-12 py-4 outline-none transition-all focus:border-orange-500 focus:ring-0 font-bold"
              />

              <span
                class="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-30 group-focus-within:opacity-100 transition-opacity"
              >
                🔍
              </span>

              <button
                v-if="search"
                @click="search = ''"
                class="absolute right-4 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-full bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors shadow-sm"
              >
                ✕
              </button>
            </div>

            <div class="rounded-2xl bg-slate-50 dark:bg-slate-900 px-6 py-3">
              <div class="flex justify-between items-center mb-1">
                <span
                  class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                >
                  Max Narx
                </span>

                <span class="text-sm font-black text-orange-500">
                  {{ formatPrice(maxPrice) }}
                </span>
              </div>

              <input
                v-model="maxPrice"
                type="range"
                min="5000"
                max="300000"
                step="5000"
                class="w-full accent-orange-500 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div class="relative min-h-[400px]">
          <img
            :src="
              currentCategory?.banner ||
              'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80'
            "
            :alt="currentCategory?.name || route.params.name"
            class="absolute inset-0 h-full w-full object-cover"
          />

          <div
            class="absolute inset-0 bg-gradient-to-r from-white dark:from-slate-800 via-transparent to-transparent hidden lg:block"
          ></div>
        </div>
      </div>
    </div>

    <!-- Results Info -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-center gap-3">
        <span class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>

        <p class="text-lg font-bold text-slate-900 dark:text-slate-100">
          {{ categoryItems.length }} ta taom topildi
        </p>
      </div>

      <p class="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
        Filtrlash
      </p>
    </div>

    <!-- Error -->
    <div
      v-if="error"
      class="rounded-[32px] border border-red-100 bg-red-50 p-12 text-center"
    >
      <p class="text-red-600 font-bold mb-4">
        Ma’lumotlarni yuklab bo‘lmadi.
      </p>

      <button
        class="rounded-2xl bg-slate-900 px-8 py-3 font-black text-white transition hover:bg-orange-500"
        @click="reload"
      >
        Qayta urinish
      </button>
    </div>

    <!-- Loading -->
    <div
      v-else-if="loading"
      class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <FoodCardSkeleton
        v-for="index in 8"
        :key="index"
      />
    </div>

    <!-- Food Items -->
    <div
      v-else-if="categoryItems.length > 0"
      class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <FoodCard
        v-for="item in categoryItems"
        :key="item.id"
        :item="item"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-20 bg-white dark:bg-slate-800 rounded-[40px] shadow-sm border border-gray-100 dark:border-slate-700"
    >
      <div class="text-6xl mb-6">🏜️</div>

      <h2 class="text-2xl font-black text-slate-900 dark:text-slate-100">
        Hech narsa topilmadi
      </h2>

      <p class="text-slate-500 dark:text-slate-400 mt-2">
        Qidiruv parametrlarini o‘zgartirib ko‘ring.
      </p>

     <button
  @click="search = ''; maxPrice = 300000"
  class="mt-6 text-orange-500 font-bold hover:underline"
>
  Filtrlarni tozalash
</button>
    </div>
  </section>
</template>
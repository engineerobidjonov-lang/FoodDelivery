import { onMounted, ref } from 'vue'
import api from '@/api'

export function useMenuData() {
  const categories = ref([])
  const foods = ref([])
  const loading = ref(true)
  const error = ref('')

  async function loadMenu() {
    loading.value = true
    error.value = ''

    try {
      const [categoryRes, foodRes] = await Promise.all([
        api.get('/catalog/categories'),
        api.get('/catalog/foods'),
      ])

      categories.value = categoryRes.data
      foods.value = foodRes.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Menyuni yuklashda xatolik yuz berdi.'
    } finally {
      loading.value = false
    }
  }

  onMounted(loadMenu)

  return {
    categories,
    foods,
    loading,
    error,
    reload: loadMenu,
  }
}

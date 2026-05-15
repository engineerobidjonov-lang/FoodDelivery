import { categories, foods } from './mockData'

export async function fetchCategories() {
  return Promise.resolve(categories)
}

export async function fetchFoods(filters = {}) {
  let filteredFoods = [...foods]

  if (filters.category) {
    filteredFoods = filteredFoods.filter(
      (f) => f.category.toLowerCase() === filters.category.toLowerCase()
    )
  }

  if (filters.search) {
    filteredFoods = filteredFoods.filter((f) =>
      f.name.toLowerCase().includes(filters.search.toLowerCase())
    )
  }

  return Promise.resolve(filteredFoods)
}

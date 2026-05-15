<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useNotificationStore } from '@/store/notification'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

const isLoading = ref(false)

const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
  return regex.test(email)
}

const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,18}$/
  return regex.test(password)
}

const handleSignup = async () => {
  errors.value = { email: '', password: '', confirmPassword: '' }
  let hasError = false

  if (!formData.value.name) {
    notificationStore.addNotification('Ismingizni kiriting', 'error')
    return
  }

  if (!validateEmail(formData.value.email)) {
    errors.value.email = 'Email faqat @gmail.com bilan tugashi shart!'
    hasError = true
  }

  if (!validatePassword(formData.value.password)) {
    errors.value.password = 'Parol 8-18 ta belgidan iborat bo\'lishi, kamida 1 ta katta harf, 1 ta kichik harf va 1 ta raqam qatnashishi shart!'
    hasError = true
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Parollar mos kelmadi!'
    hasError = true
  }

  if (hasError) return

  isLoading.value = true
  
  // Simulate network delay
  setTimeout(() => {
    authStore.login({
      name: formData.value.name,
      email: formData.value.email,
    })
    notificationStore.addNotification('Hisobingiz muvaffaqiyatli yaratildi!', 'success')
    router.push('/')
    isLoading.value = false
  }, 1000)
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-white dark:bg-slate-900 rounded-[40px] p-10 shadow-float border border-gray-50 dark:border-slate-800">
      <div class="text-center mb-10">
        <div class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-3xl font-black text-white shadow-lg shadow-orange-100 mb-6">FD</div>
        <h1 class="text-3xl font-black text-slate-900 dark:text-white">Ro'yxatdan o'tish</h1>
        <p class="text-slate-500 mt-2 font-medium">FoodDash oilasiga qo'shiling</p>
      </div>

      <form @submit.prevent="handleSignup" class="space-y-6">
        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-widest text-gray-400 ml-2">Ismingiz</label>
          <div class="relative">
            <input 
              v-model="formData.name"
              type="text" 
              placeholder="Ismingizni kiriting"
              class="w-full py-4 px-6 bg-gray-50 dark:bg-slate-800 dark:text-white rounded-2xl border-2 border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-slate-700 transition-all font-bold"
            />
            <span class="absolute right-6 top-1/2 -translate-y-1/2 text-xl opacity-30">👤</span>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-widest text-gray-400 ml-2">Email</label>
          <div class="relative">
            <input 
              v-model="formData.email"
              type="email" 
              placeholder="example@mail.com"
              class="w-full py-4 px-6 bg-gray-50 dark:bg-slate-800 dark:text-white rounded-2xl border-2 border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-slate-700 transition-all font-bold"
              :class="errors.email ? 'border-red-500' : ''"
            />
            <span class="absolute right-6 top-1/2 -translate-y-1/2 text-xl opacity-30">📧</span>
          </div>
          <p v-if="errors.email" class="text-[10px] text-red-500 font-bold ml-2">{{ errors.email }}</p>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-widest text-gray-400 ml-2">Parol</label>
          <div class="relative">
            <input 
              v-model="formData.password"
              type="password" 
              placeholder="••••••••"
              class="w-full py-4 px-6 bg-gray-50 dark:bg-slate-800 dark:text-white rounded-2xl border-2 border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-slate-700 transition-all font-bold"
              :class="errors.password ? 'border-red-500' : ''"
            />
            <span class="absolute right-6 top-1/2 -translate-y-1/2 text-xl opacity-30">🔒</span>
          </div>
          <p v-if="errors.password" class="text-[10px] text-red-500 font-bold ml-2 leading-tight">{{ errors.password }}</p>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-widest text-gray-400 ml-2">Parolni tasdiqlang</label>
          <div class="relative">
            <input 
              v-model="formData.confirmPassword"
              type="password" 
              placeholder="••••••••"
              class="w-full py-4 px-6 bg-gray-50 dark:bg-slate-800 dark:text-white rounded-2xl border-2 border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-slate-700 transition-all font-bold"
              :class="errors.confirmPassword ? 'border-red-500' : ''"
            />
            <span class="absolute right-6 top-1/2 -translate-y-1/2 text-xl opacity-30">🛡️</span>
          </div>
          <p v-if="errors.confirmPassword" class="text-[10px] text-red-500 font-bold ml-2">{{ errors.confirmPassword }}</p>
        </div>

        <button 
          type="submit"
          :disabled="isLoading"
          class="w-full bg-slate-900 dark:bg-orange-500 text-white py-5 rounded-3xl font-black text-xl shadow-xl transition-all hover:bg-orange-500 dark:hover:bg-orange-600 active:scale-95 disabled:bg-gray-200 dark:disabled:bg-slate-800 flex items-center justify-center gap-3"
        >
          <span v-if="isLoading" class="animate-spin text-2xl">⏳</span>
          {{ isLoading ? 'Yuborilmoqda...' : 'Ro\'yxatdan o\'tish' }}
        </button>
      </form>

      <div class="mt-10 text-center">
        <p class="text-slate-500 font-medium">
          Hisobingiz bormi? 
          <RouterLink to="/login" class="text-orange-500 font-black hover:underline ml-1">Kirish</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

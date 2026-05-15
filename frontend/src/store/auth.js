import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // Load state from localStorage on initialization
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const isAuthenticated = ref(!!localStorage.getItem('token'))

  function login(userData) {
    // In this universal mode, we simulate a token
    const mockToken = 'jwt_' + Math.random().toString(36).substr(2)
    
    user.value = userData
    isAuthenticated.value = true
    
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', mockToken)
  }

  function logout() {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
  }
})

import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Category from '@/views/Category.vue'
import Cart from '@/views/Cart.vue'
import Location from '@/views/Location.vue'
import Favorites from '@/views/Favorites.vue'
import Checkout from '@/views/Checkout.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import Orders from '@/views/Orders.vue'
import Profile from '@/views/Profile.vue'
import { useAuthStore } from '@/store/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/category/:name', name: 'category', component: Category, props: true },
    { path: '/cart', name: 'cart', component: Cart },
    { path: '/checkout', name: 'checkout', component: Checkout, meta: { requiresAuth: true } },
    { path: '/favorites', name: 'favorites', component: Favorites },
    { path: '/location', name: 'location', component: Location },
    { path: '/login', name: 'login', component: Login, meta: { guestOnly: true } },
    { path: '/signup', name: 'signup', component: Signup, meta: { guestOnly: true } },
    { path: '/orders', name: 'orders', component: Orders, meta: { requiresAuth: true } },
    { path: '/profile', name: 'profile', component: Profile, meta: { requiresAuth: true } },
  ],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else if (to.meta.guestOnly && isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router

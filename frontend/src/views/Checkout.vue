<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/store/cart'
import { useNotificationStore } from '@/store/notification'
import { useOrderStore } from '@/store/orders'

const router = useRouter()
const cartStore = useCartStore()
const orderStore = useOrderStore()
const notificationStore = useNotificationStore()
const { items, totalPrice, itemCount } = storeToRefs(cartStore)

localStorage.removeItem('user_name')
localStorage.removeItem('user_phone')
localStorage.removeItem('user_address')

const isLoading = ref(false)
const formData = ref({
  name: '',
  phone: '',
  address: '',
  paymentMethod: 'cash'
})
const isCartEmpty = computed(() => itemCount.value === 0)

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm"
}

const handleSubmit = async () => {
  if (isCartEmpty.value) {
    notificationStore.addNotification('Savat bo‘sh. Avval ovqat tanlang.', 'error')
    return
  }

  if (!formData.value.name || !formData.value.phone || !formData.value.address) {
    notificationStore.addNotification('Iltimos, barcha maydonlarni to\'ldiring', 'error')
    return
  }

  isLoading.value = true

  setTimeout(() => {
    try {
      const orderData = {
        items: items.value.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.imageUrl || item.image
        })),
        customer: {
          name: formData.value.name,
          phone: formData.value.phone
        },
        address: {
          street: formData.value.address
        },
        paymentMethod: formData.value.paymentMethod,
        totalPrice: totalPrice.value
      }

      const result = orderStore.createOrder(orderData)
      
      notificationStore.addNotification('Buyurtmangiz qabul qilindi!', 'success')
      cartStore.clearCart({ silent: true })
      router.push(`/location?status=delivering&orderId=${result.id}`)
    } catch (error) {
      notificationStore.addNotification('Xatolik yuz berdi', 'error')
    } finally {
      isLoading.value = false
    }
  }, 1500)
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-slate-900 py-12 transition-colors duration-300">
    <div class="max-w-4xl mx-auto px-4">
      <div class="mb-10">
        <button @click="router.back()" class="mb-4 text-orange-500 font-bold flex items-center gap-2 hover:underline">
          <span>←</span> Savatga qaytish
        </button>
        <h1 class="text-4xl font-black text-slate-900 dark:text-slate-100">Rasmiylashtirish 🧾</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-2">Buyurtmangizni yakunlash uchun ma'lumotlarni kiriting</p>
      </div>

      <div class="grid gap-8 lg:grid-cols-[1fr_350px]">
        <!-- Form Section -->
        <div class="space-y-6">
          <div class="bg-white dark:bg-slate-800 rounded-[40px] p-8 shadow-float border border-gray-100 dark:border-slate-700 space-y-8">
            <!-- Personal Info -->
            <section>
              <h2 class="text-xl font-black text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3">
                <span class="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center text-sm">1</span>
                Shaxsiy ma'lumotlar
              </h2>
              <div class="grid gap-6 md:grid-cols-2">
                <div class="space-y-2">
                  <label class="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Ismingiz</label>
                  <input 
                    v-model="formData.name"
                    type="text" 
                    placeholder="Ismingizni kiriting"
                    class="w-full py-4 px-6 bg-slate-50 dark:bg-slate-900 dark:text-slate-100 rounded-2xl border-2 border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-bold"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Telefon raqam</label>
                  <input 
                    v-model="formData.phone"
                    type="tel" 
                    placeholder="+998 90 123 45 67"
                    class="w-full py-4 px-6 bg-slate-50 dark:bg-slate-900 dark:text-slate-100 rounded-2xl border-2 border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-bold"
                  />
                </div>
              </div>
            </section>

            <!-- Delivery Address -->
            <section>
              <h2 class="text-xl font-black text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3">
                <span class="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center text-sm">2</span>
                Yetkazib berish manzili
              </h2>
              <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">To'liq manzil</label>
                <textarea 
                  v-model="formData.address"
                  placeholder="Masalan: Chilonzor 9-kvartal, 12-uy, 45-xonadon"
                  rows="3"
                  class="w-full py-4 px-6 bg-slate-50 dark:bg-slate-900 dark:text-slate-100 rounded-2xl border-2 border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-bold resize-none"
                ></textarea>
              </div>
            </section>

            <!-- Payment Method -->
            <section>
              <h2 class="text-xl font-black text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3">
                <span class="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center text-sm">3</span>
                To'lov turi
              </h2>
              <div class="grid gap-4 md:grid-cols-2">
                <label 
                  class="relative flex items-center gap-4 p-5 rounded-3xl border-2 cursor-pointer transition-all"
                  :class="formData.paymentMethod === 'cash' ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-900/20' : 'border-gray-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'"
                >
                  <input type="radio" v-model="formData.paymentMethod" value="cash" class="hidden" />
                  <span class="text-3xl">💵</span>
                  <div>
                    <p class="font-black text-slate-900 dark:text-slate-100">Naqd pul</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Qabul qilganda</p>
                  </div>
                  <div v-if="formData.paymentMethod === 'cash'" class="absolute right-4 text-orange-500 text-xl">✓</div>
                </label>

                <label 
                  class="relative flex items-center gap-4 p-5 rounded-3xl border-2 cursor-pointer transition-all"
                  :class="formData.paymentMethod === 'card' ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-900/20' : 'border-gray-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'"
                >
                  <input type="radio" v-model="formData.paymentMethod" value="card" class="hidden" />
                  <span class="text-3xl">💳</span>
                  <div>
                    <p class="font-black text-slate-900 dark:text-slate-100">Karta orqali</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Payme / Click</p>
                  </div>
                  <div v-if="formData.paymentMethod === 'card'" class="absolute right-4 text-orange-500 text-xl">✓</div>
                </label>
              </div>
            </section>
          </div>
        </div>

        <!-- Summary Section -->
        <div class="sticky top-24 h-fit">
          <div class="rounded-[40px] bg-slate-900 dark:bg-slate-800 p-8 text-white shadow-2xl">
            <h2 class="text-2xl font-black mb-6">Buyurtma xulosasi</h2>
            
            <div class="space-y-4 mb-8">
              <div v-if="isCartEmpty" class="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
                <div class="text-5xl mb-3">🛒</div>
                <p class="font-black">Savat bo‘sh</p>
                <p class="text-sm text-white/50 mt-1">Avval ovqat tanlang.</p>
              </div>
              <div v-for="item in items" :key="item.id" class="flex justify-between text-sm opacity-80">
                <span>{{ item.quantity }}x {{ item.name }}</span>
                <span>{{ formatPrice(item.price * item.quantity) }}</span>
              </div>
              <div class="h-px bg-white/10 my-6"></div>
              <div class="flex justify-between items-end">
                <span class="text-slate-400 dark:text-slate-300 font-bold uppercase tracking-widest text-xs">Jami summa</span>
                <span class="text-3xl font-black text-orange-500">{{ formatPrice(totalPrice) }}</span>
              </div>
            </div>

            <button 
              @click="handleSubmit"
              :disabled="isLoading || isCartEmpty"
              class="w-full bg-orange-500 text-white py-6 rounded-3xl font-black text-xl transition-all hover:bg-orange-600 active:scale-95 disabled:bg-slate-700 disabled:text-slate-500 flex items-center justify-center gap-3"
            >
              <span v-if="isLoading" class="animate-spin">⏳</span>
              {{ isLoading ? 'Yuborilmoqda...' : isCartEmpty ? 'Savat bo‘sh' : 'Buyurtma berish' }}
            </button>
            
            <p class="text-center text-[10px] text-white/30 mt-6 font-bold uppercase tracking-[0.2em] leading-relaxed">
              Xavfsiz to'lov tizimi 🔒
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

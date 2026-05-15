<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/store/orders'
import { useNotificationStore } from '@/store/notification'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()
const notificationStore = useNotificationStore()
const demoAddress = ref('')
const activeOrderId = ref(route.query.orderId || orderStore.activeDeliveryOrderId)

const activeOrder = computed(() => {
  const routeOrder = activeOrderId.value ? orderStore.getOrderById(activeOrderId.value) : null
  return routeOrder || orderStore.getActiveDeliveryOrder()
})

const hasActiveDelivery = computed(() => Boolean(activeOrder.value))

watch(() => route.query.orderId, (orderId) => {
  activeOrderId.value = orderId || orderStore.activeDeliveryOrderId
})

watch(activeOrder, (order) => {
  if (order) {
    orderStore.activeDeliveryOrderId = order.id
  }
})

const saveDemoAddress = () => {
  if (!demoAddress.value.trim()) {
    notificationStore.addNotification('Iltimos, manzilni kiriting.', 'error')
    return
  }

  notificationStore.addNotification('Manzil qabul qilindi. Yetkazish buyurtmadan keyin boshlanadi.', 'info')
}

const callCourier = () => {
  const phone = activeOrder.value?.delivery?.courierPhone || '+998901112233'
  window.location.href = `tel:${phone.replace(/\s/g, '')}`
}

const backToHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="max-w-xl mx-auto p-4 text-center min-h-screen flex flex-col pb-20 transition-colors">
    <!-- Address Input Form -->
    <div v-if="!hasActiveDelivery" class="mt-10 flex-1">
      <div class="mb-8">
        <div class="text-6xl mb-4">📍</div>
        <h1 class="text-4xl font-black text-slate-900 dark:text-white mb-2 leading-tight">Yetkazib berish manzili</h1>
        <p class="text-slate-500 dark:text-slate-400">Buyurtmangizni qayerga yetkazaylik?</p>
      </div>
      
      <div class="space-y-6">
        <div class="relative group">
          <input 
            v-model="demoAddress"
            type="text"
            placeholder="Masalan: Chilonzor 9-kvartal, 12-uy"
            class="w-full py-5 px-8 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-float rounded-[30px] border-2 border-transparent focus:border-orange-500 focus:ring-0 transition-all font-bold text-lg"
          />
          <span class="absolute right-6 top-1/2 -translate-y-1/2 text-2xl opacity-30">🏠</span>
        </div>

        <!-- Fake Map UI -->
        <div class="h-72 bg-slate-50 dark:bg-slate-800 rounded-[40px] shadow-inner flex flex-col items-center justify-center border border-gray-100 dark:border-slate-700 overflow-hidden relative">
          <!-- Background Grid / Streets -->
          <div class="absolute inset-0 opacity-20 dark:opacity-10" style="background-image: radial-gradient(circle, #94a3b8 1px, transparent 1px); background-size: 30px 30px;"></div>
          <svg class="absolute inset-0 h-full w-full opacity-30 dark:opacity-20" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50h600M0 150h600M0 250h600M100 0v400M300 0v400M500 0v400" stroke="currentColor" stroke-width="2" class="text-slate-400" fill="none" />
          </svg>

          <!-- Markers -->
          <div class="absolute top-16 left-16 group pointer-events-none">
            <div class="bg-white dark:bg-slate-900 h-10 w-10 rounded-2xl shadow-lg flex items-center justify-center text-xl border-2 border-orange-500 transform -translate-x-1/2 -translate-y-1/2">🍔</div>
            <div class="absolute top-6 left-0 text-[10px] font-black text-orange-600 bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap -translate-x-1/2 uppercase tracking-tighter">Restoran</div>
          </div>

          <div class="absolute bottom-16 right-16 pointer-events-none">
            <div class="bg-white dark:bg-slate-900 h-12 w-12 rounded-2xl shadow-xl flex items-center justify-center text-2xl border-2 border-slate-900 dark:border-white transform -translate-x-1/2 -translate-y-1/2">🏠</div>
            <div class="absolute top-8 left-0 text-[10px] font-black text-slate-900 dark:text-white bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap -translate-x-1/2 uppercase tracking-tighter">Manzil</div>
          </div>


          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <p class="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">Toshkent, O'zbekiston</p>
          </div>
        </div>

        <button 
          @click="saveDemoAddress"
          :disabled="!demoAddress"
          class="w-full bg-slate-900 dark:bg-orange-600 text-white py-5 rounded-[24px] font-black text-xl shadow-xl transition-all active:scale-95 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:shadow-none hover:bg-orange-500"
        >
          Manzilni saqlash
        </button>
      </div>
    </div>

    <!-- Order Status / Delivery View -->
    <div v-else class="mt-16 space-y-8 animate-in fade-in zoom-in duration-500">
      <div class="relative inline-block">
        <div class="text-9xl animate-bounce">🛵</div>
        <div class="absolute -right-4 -bottom-2 text-4xl animate-pulse">💨</div>
      </div>
      
      <div>
        <h2 class="text-4xl font-black text-slate-900 dark:text-white">Yo‘lga chiqdik!</h2>
        <p class="text-slate-500 dark:text-slate-400 mt-2 font-medium">Kuryerimiz buyurtmangizni olib kelmoqda</p>
      </div>

      <div class="h-72 bg-slate-50 dark:bg-slate-800 rounded-[40px] shadow-inner border border-gray-100 dark:border-slate-700 overflow-hidden relative">
        <div class="absolute inset-0 opacity-20 dark:opacity-10" style="background-image: radial-gradient(circle, #94a3b8 1px, transparent 1px); background-size: 30px 30px;"></div>
        <svg class="absolute inset-0 h-full w-full opacity-40 dark:opacity-30" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 50h600M0 150h600M0 250h600M100 0v400M300 0v400M500 0v400" stroke="currentColor" stroke-width="2" class="text-slate-400" fill="none" />
          <path d="M80 80 L150 80 L150 180 L350 180 L350 250 L420 250" stroke="#f97316" stroke-width="4" stroke-dasharray="8 6" fill="none" class="animate-[dash_20s_linear_infinite]" />
        </svg>
        <div class="absolute top-16 left-16 pointer-events-none">
          <div class="bg-white dark:bg-slate-900 h-10 w-10 rounded-2xl shadow-lg flex items-center justify-center text-xl border-2 border-orange-500 transform -translate-x-1/2 -translate-y-1/2">🍔</div>
          <div class="absolute top-6 left-0 text-[10px] font-black text-orange-600 bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap -translate-x-1/2 uppercase tracking-tighter">Restoran</div>
        </div>
        <div class="absolute bottom-16 right-16 pointer-events-none">
          <div class="bg-white dark:bg-slate-900 h-12 w-12 rounded-2xl shadow-xl flex items-center justify-center text-2xl border-2 border-slate-900 dark:border-white transform -translate-x-1/2 -translate-y-1/2">🏠</div>
          <div class="absolute top-8 left-0 text-[10px] font-black text-slate-900 dark:text-white bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap -translate-x-1/2 uppercase tracking-tighter">Manzil</div>
        </div>
        <div class="absolute top-[180px] left-[250px] animate-[pulse_2s_infinite] pointer-events-none">
          <div class="bg-orange-500 h-10 w-10 rounded-full shadow-orange-500/50 shadow-xl flex items-center justify-center text-xl border-2 border-white transform -translate-x-1/2 -translate-y-1/2">🛵</div>
          <div class="absolute -top-10 left-0 bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-xl shadow-lg whitespace-nowrap -translate-x-1/2 flex items-center gap-1">
            <span>{{ activeOrder.delivery?.eta || '15 min' }}</span>
            <span class="opacity-40">|</span>
            <span>{{ activeOrder.delivery?.distance || '2.4 km' }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 p-8 rounded-[40px] shadow-float border border-gray-100 dark:border-slate-700 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-2 bg-slate-100 dark:bg-slate-700">
          <div class="h-full bg-orange-500 animate-[progress_15s_infinite_linear]"></div>
        </div>
        
        <div class="flex justify-between items-center mb-6">
          <div class="text-left">
            <p class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Kutilayotgan vaqt</p>
            <p class="text-3xl font-black text-orange-500">{{ activeOrder.delivery?.eta || '15 min' }}</p>
          </div>
          <div class="h-14 w-14 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-3xl">⏳</div>
        </div>

        <div class="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl text-left">
          <div class="h-10 w-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-xl shadow-sm">📍</div>
          <div class="min-w-0 flex-1">
            <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Yetkazish manzili</p>
            <p class="font-bold text-slate-700 dark:text-slate-200 truncate">{{ activeOrder.address?.street }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button 
          @click="callCourier"
          class="bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 text-slate-900 dark:text-white py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
        >
          <span>📞</span> Bog'lanish
        </button>
        <button 
          @click="backToHome"
          class="bg-slate-900 dark:bg-orange-600 text-white py-5 rounded-[24px] font-black text-lg hover:bg-orange-500 transition-all shadow-lg active:scale-95"
        >
          Asosiyga qaytish
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes progress {
  0% { width: 0%; }
  100% { width: 100%; }
}

@keyframes dash {
  from { stroke-dashoffset: 200; }
  to { stroke-dashoffset: 0; }
}

.animate-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

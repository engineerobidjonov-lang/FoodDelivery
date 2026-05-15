<script setup>
import { useNotificationStore } from '@/store/notification'
import { storeToRefs } from 'pinia'

const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-8 left-1/2 z-[200] flex w-full -translate-x-1/2 flex-col items-center gap-3 px-4 pointer-events-none">
      <transition-group 
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-90"
      >
        <div 
          v-for="notif in notifications" 
          :key="notif.id"
          class="pointer-events-auto flex w-full max-w-[calc(100vw-2rem)] items-center gap-3 rounded-[20px] border px-5 py-4 shadow-2xl backdrop-blur-md sm:w-auto sm:min-w-[300px] sm:px-6"
          :class="{
            'bg-slate-900/90 text-white border-white/10': notif.type === 'success',
            'bg-red-500/90 text-white border-red-400/20': notif.type === 'error',
            'bg-orange-500/90 text-white border-orange-400/20': notif.type === 'info'
          }"
        >
          <span class="text-xl">
            {{ notif.type === 'success' ? '✅' : notif.type === 'error' ? '❌' : '🔔' }}
          </span>
          <p class="font-bold text-sm tracking-wide">{{ notif.message }}</p>
          <button 
            @click="notificationStore.removeNotification(notif.id)"
            class="ml-auto opacity-50 hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
        </div>
      </transition-group>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  maxWidth: {
    type: String,
    default: 'max-w-md',
  },
  subtitle: {
    type: String,
    default: '',
  }
})

const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <transition 
      enter-active-class="transition duration-300 ease-out" 
      enter-from-class="opacity-0 scale-95" 
      enter-to-class="opacity-100 scale-100" 
      leave-active-class="transition duration-200 ease-in" 
      leave-from-class="opacity-100 scale-100" 
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="props.open" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="emit('close')"></div>
        
        <!-- Modal Content -->
        <div :class="['relative w-full overflow-hidden rounded-[40px] bg-white p-0 shadow-2xl', props.maxWidth]">
          <!-- Close Button (Absolute) -->
          <button 
            @click="emit('close')"
            class="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm"
          >
            ✕
          </button>

          <div v-if="props.title" class="p-8 pb-0">
            <p v-if="props.subtitle" class="text-xs font-black uppercase tracking-[0.2em] text-orange-500">{{ props.subtitle }}</p>
            <h3 class="mt-1 text-2xl font-black text-slate-900">{{ props.title }}</h3>
          </div>
          
          <div class="p-0">
            <slot />
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

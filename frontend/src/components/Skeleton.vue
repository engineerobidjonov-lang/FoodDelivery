<script setup>
defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '20px'
  },
  borderRadius: {
    type: String,
    default: '12px'
  },
  customClass: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div 
    class="animate-pulse bg-gray-200 dark:bg-slate-800"
    :class="customClass"
    :style="{ width, height, borderRadius }"
  ></div>
</template>

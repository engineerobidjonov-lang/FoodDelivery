<script setup>
import Skeleton from './Skeleton.vue'
</script>

<template>
  <div class="flex flex-col overflow-hidden rounded-[32px] bg-white dark:bg-slate-900 shadow-float border border-gray-50 dark:border-slate-800">
    <!-- Image Skeleton -->
    <Skeleton height="224px" borderRadius="0" />

    <div class="flex flex-col p-6 space-y-4">
      <!-- Title -->
      <Skeleton width="70%" height="24px" />
      
      <!-- Description lines -->
      <div class="space-y-2">
        <Skeleton width="100%" height="16px" />
        <Skeleton width="90%" height="16px" />
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between mt-4">
        <div class="space-y-2">
          <Skeleton width="40px" height="12px" />
          <Skeleton width="80px" height="20px" />
        </div>
        <Skeleton width="48px" height="48px" borderRadius="16px" />
      </div>
    </div>
  </div>
</template>

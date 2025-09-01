<template>
  <span class="ps-1">
    <i v-if="current === field && direction === 'asc'" class="bi bi-chevron-up fs12 text-muted"></i>
    <i v-else-if="current === field && direction === 'desc'" class="bi bi-chevron-down fs12 text-muted"></i>
    <i v-else class="bi bi-chevron-expand text-muted fs13"></i>
  </span>
</template>

<script setup>
defineProps({
  field: String,
  current: String,
  direction: String
});
</script>

<template>
    <div class="text-center">
      <button class="btn btn-outline-tertiary w-100" :disabled="disabled">
        <span v-if="disabled">
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> &nbsp;
          Loading...
        </span>
        <span v-else>
          <slot />
        </span>
      </button>
    </div>
  </template>
  
  <script setup>  
  const props = defineProps({
    disabled: {
      type: Boolean,
      default: false,
    },
  });
  </script>
  
  <style scoped></style>
  
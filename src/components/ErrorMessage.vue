<template>
    <div v-if="message">
        <span class="text-danger fs12">
            {{ message }}
        </span>
    </div>
</template>

<script setup>
const props = defineProps({
    message: String,
});
</script>

<style scoped></style>


<template>
    <div class="text-center">
        <img src="/image/no-data.png" alt="No Data" :style="{ width: typeof width === 'number' ? width + 'px' : width }"
            class="img-fluid no-data" />
    </div>
</template>

<script setup>
defineProps({
    width: {
        type: [String, Number],
        default: '70%'
    }
});
</script>

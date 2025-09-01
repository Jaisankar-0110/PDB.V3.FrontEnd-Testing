<template>
    <div class="pagination-container mb-2">
    <nav class="d-flex justify-content-sm-center mt-3 mb-3">
        <ul class="pagination mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="goToPage(currentPage - 1)">Previous</button>
            </li>

            <li v-if="showStartEllipsis" class="page-item">
                <button class="page-link" @click="goToPage(1)">1</button>
            </li>
            <li v-if="showStartEllipsis" class="page-item disabled">
                <span class="page-link">…</span>
            </li>

            <li v-for="page in pagesToShow" :key="page" class="page-item" :class="{ active: page === currentPage }">
                <button class="page-link" @click="goToPage(page)">{{ page }}</button>
            </li>

            <li v-if="showEndEllipsis" class="page-item disabled">
                <span class="page-link">…</span>
            </li>
            <li v-if="showEndEllipsis" class="page-item">
                <button class="page-link" @click="goToPage(totalPages)">{{ totalPages }}</button>
            </li>

            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="goToPage(currentPage + 1)">Next</button>
            </li>
        </ul>
    </nav>
</div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
    totalPages: {
        type: Number,
        required: true
    },
    modelValue: {
        type: Number,
        required: true
    }
});

const emit = defineEmits(['update:modelValue']);
const currentPage = ref(props.modelValue);

watch(() => props.modelValue, val => currentPage.value = val);

function goToPage(page) {
    if (page >= 1 && page <= props.totalPages) {
        emit('update:modelValue', page);
    }
}

const pagesToShow = computed(() => {
    const total = props.totalPages;
    const current = currentPage.value;
    const pages = [];

    if (total <= 6) {
        for (let i = 1; i <= total; i++) pages.push(i);
    } else {
        if (current <= 3) {
            pages.push(...[1, 2, 3, 4]);
        } else if (current >= total - 2) {
            pages.push(...[total - 3, total - 2, total - 1, total]);
        } else {
            pages.push(...[current - 1, current, current + 1]);
        }
    }

    return [...new Set(pages)].filter(p => p >= 1 && p <= total);
});

const showStartEllipsis = computed(() => {
    const min = Math.min(...pagesToShow.value);
    return min > 2 && currentPage.value !== 1;
});

const showEndEllipsis = computed(() => {
    const max = Math.max(...pagesToShow.value);
    return max < props.totalPages - 1 && currentPage.value !== props.totalPages;
});

</script>

<style scoped>
.pagination[data-v-039dc986] {
    flex-wrap: nowrap;
    gap: 0.8rem !important;
}

.page-item .page-link{
    font-size: 14px !important;
    border-radius: 4px !important;
    color: var(--pagination) !important;
    border-color: var(--pagination) !important;
}

.page-item.active .page-link {
    background-color: var(--pagination) !important;
    color: var(--light) !important;
    border-color: var(--pagination) !important;
}

.page-item.disabled  .page-link {
    background-color: transparent !important;
    color: var(--border) !important;
    border-color: var(--border) !important;
}

.page-link {
    min-width: 40px;
    text-align: center;
}

.pagination {
    flex-wrap: nowrap;
    gap: 0.25rem;
}

@media(max-width:992px) {
.pagination[data-v-039dc986] {
    gap: 0.2rem !important;
}

.page-link {
    min-width: 10px;
    text-align: center;
}

.page-item .page-link{
    font-size: 12px !important;
    border-radius: 3px !important;
}

.pagination-container{
  overflow-x:scroll;
}
}

</style>
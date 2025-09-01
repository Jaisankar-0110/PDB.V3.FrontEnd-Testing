<template>
    <div class="px-2 pb-3 fs14 d-flex">
        <RouterLink to="/dashboard" class="text-tertiary-color text-decoration-none"> <i
                class=" bi bi-house-fill fs16 pe-1"></i>
            Dashboard</RouterLink>
        <span class="px-2">/</span>
        <div class="text-muted">Revenue Prediction</div>
    </div>
    <div class="card">
        <div class="card-header py-3 bg-transparent">
            <div class="row">
                <div class="col-md-6">
                    <div class="text-quaternary-color fs16 ps-2 pt-2 fw500">Revenue Prediction</div>
                </div>
                <div class="col-md-6 text-end">
                    <div class="alert fs14 d-inline alert-primary" role="alert">
                        {{ currentYear }}
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body p-4">
            <GraphView />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import GraphView from './components/GraphView.vue';

const currentDate = new Date();
const currentYear = currentDate.getFullYear();

</script>

<style scoped lang="scss">
.toggle-switch {
    border: 1px solid var(--border);
    border-radius: 999px;
    display: inline-flex;
    overflow: hidden;
    background-color: var(--light);
}

.toggle-switch .toggle-btn {
    padding: 0.6rem 1rem;
    border: none;
    background: none;
    color: var(--secondary);
    transition: all 0.3s ease;
}

.toggle-switch .active {
    background-color: var(--tertiary);
    color: var(--light);
}

.alert{
    padding: 4px 12px !important;
}
</style>
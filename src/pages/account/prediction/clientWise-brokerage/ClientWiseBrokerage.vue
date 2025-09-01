<template>
    <div class="px-2 pb-3 fs14 d-flex">
        <RouterLink to="/dashboard" class="text-tertiary-color text-decoration-none"> <i
                class=" bi bi-house-fill fs16 pe-1"></i>
            Dashboard</RouterLink>
        <span class="px-2">/</span>
        <div class="text-muted">Client Wise Brokerage Generated</div>
    </div>
    <div class="card">
        <div class="card-header py-3 bg-transparent">
            <div class="row">
                <div class="col-md-4">
                    <div class="text-quaternary-color fs16 ps-2 pt-2 fw500">Client Wise Brokerage Generated</div>
                </div>
                <div class="col-md-4">
                    <button class="btn btn-primary fs14 px-md-4 me-md-3">Prediction for the upcomming months</button>
                </div>
                <div class="col-md-4 text-end">
                    <div class="toggle-switch fs14">
                        <button :class="['toggle-btn', { active: currentView === 'graph' }]" @click="setView('graph')">
                            Graph view
                        </button>
                        <button :class="['toggle-btn', { active: currentView === 'table' }]" @click="setView('table')">
                            Table view
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body p-4">
            <TableView  v-if="currentView === 'table'" />
            <GraphView v-else-if="currentView === 'graph'" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import TableView from './components/TableView.vue';
import GraphView from './components/GraphView.vue';

const currentView = ref('graph')

function setView(view) {
    currentView.value = view
}

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
</style>
<template>
    <div class="card">

        <div class="card-header py-3 bg-transparent">
            <p class="mb-0 text-quaternary-color fw500 fs16">Alerts</p>
        </div>
        <div class="card-body m-0 p-0">
            <div v-if="alerts.length > 0">
                <div class="d-flex justify-content-start align-items-center py-3 px-4">
                <img src="/image/warning.png" alt="graph-up-arrow" class="pe-4" />
                <span class="text-quaternary-color fs14">Under performance waiting</span>
            </div>
            <div class="d-flex justify-content-start align-items-center py-3 bg-primary-light px-4">
                <img src="/image/milestone-reminder.png" alt="graph-up-arrow" class=" pe-4" />
                <span class="text-quaternary-color fs14">Milestone reminder</span>
            </div>
             <div class="d-flex justify-content-start align-items-center py-3 px-4">
                <img src="/image/milestone.png" alt="graph-up-arrow" class="pe-4" />
                <span class="text-quaternary-color fs14">Achivement badge</span>
            </div>
            <!--<div class="d-flex justify-content-start align-items-center py-3 bg-primary-light px-4">
                <img src="/image/chart.png" alt="graph-up-arrow" class=" pe-4" />
                <span class="text-quaternary-color fs14">Increase UCC activated to retain 60%</span>
            </div>
            <div class="d-flex justify-content-start align-items-center py-3 px-4">
                <img src="/image/achived.png" alt="graph-up-arrow" class="pe-4" />
                <span class="text-quaternary-color fs14">Achived 2 more trade UCC in 10 days</span>
            </div>
            <div class="d-flex justify-content-start align-items-center py-3  bg-primary-light px-4">
                <img src="/image/group.png" alt="graph-up-arrow" class="pe-4" />
                <span class="text-quaternary-color fs14">Your revenue growth 15% this quater</span>
            </div> -->
            </div>
            <div v-else >
                <div class="d-flex flex-column justify-content-center align-items-center py-5">
       <i class="bi bi-bell fs32"></i>
        <p class="text-secondary fs14 mb-0">No alerts found</p>
      </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const alerts = ref([])


</script>

<style scoped lang="scss">
// .card {
//     height: 394px !important;
// }

// @media(max-width:1400px) {
//     .card {
//         height: auto !important;
//     }
// }
</style>
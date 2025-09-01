<template>
    <div class="card">
        <div class="card-header py-3 bg-transparent">
            <div class="d-flex justify-content-between">
                <div class="text-quaternary-color fs16 fw500">Client-Wise Brokerage Generated</div>

                <div class="d-flex">
                    <RouterLink to="/prediction-client-wise-brokerage">
                        <button class="btn btn-primary border-0 fs14 pe-3 mx-3">Predict</button>
                    </RouterLink>
                    <select class="text-quaternary-color fs12 fw500 form-select me-3" v-model="filter"
                        @change="getClientWiseBrokerage">
                        <option v-for="year in [2025, 2024, 2023, 2022, 2021, 2020]" :key="year" :value="year">
                        {{ year }}
                        </option>
                    </select>
                    <i class="bi bi-download fs22 text-quaternary-color cursor-pointer"></i>
                </div>
            </div>
        </div>
        <div class="card-body">
            <figure class="highcharts-figure" v-if="data.length > 0">
                <div ref="chartContainer" id="container"></div>
            </figure>
        </div>
    </div>

</template>

<script setup>
import { onMounted, watch, ref, nextTick } from 'vue'
import Highcharts from 'highcharts'
import { useAuthStore } from '@/stores/authStore';
import { dashboardService } from '../../../../services/account/dashboard.service';

const chartContainer = ref(null)
const adminDetails = ref({});
const authStore = useAuthStore();

const filter = ref();
const errorMsg = ref("");

const data = ref([]);

onMounted(() => {
    adminDetails.value = authStore.adminDetails;
    filter.value = new Date().getFullYear().toString();
    getClientWiseBrokerage();
})

const getClientWiseBrokerage = async () => {
    try {
        const response = await dashboardService.getClientWiseBrokerage(adminDetails.value.RemCode, filter.value);
        if (response.data.isSuccess) {
            data.value = response.data.data;
            await nextTick();
            renderChart();
        } else {
            data.value = response.data.data;
            renderChart();
            errorMsg.value = response.data?.message || 'Something went wrong, please try again later.';
        }
    } catch (err) {
        console.error(err);
        errorMsg.value = 'Something went wrong, please try again later.';
    }
};

const renderChart = () => {
    if (!chartContainer.value) return;
    Highcharts.chart(chartContainer.value, {
        title: {
            text: null,
        },
        credits: {
            enabled: false
        },
        xAxis: {
            lineWidth: 0,
            categories: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ],

        },
        yAxis: {
            gridLineWidth: 0,
            title: {
                text: null
            },
            // plotLines: [{
            //     value: 850,
            //     color: '#cd88c6',
            //     dashStyle: 'Dot',
            //     width: 2,
            //     label: {
            //         text: '80% threshold',
            //         align: 'right',
            //         style: {
            //             color: '#cd88c6'
            //         }
            //     }
            // }]
        },
        legend: {
            align: 'right',
            verticalAlign: 'top',
            layout: 'horizontal',
            x: 0,
            y: 0
        },

        series: [{
            name: 'Total Client-Wise brokerage',
            borderRadius: 5,
            type: 'column',
            color: '#cd88c6 ',
            data: data.value,
            grouping: true,
            pointPadding: 0,
        },
            // {
            //     name: 'Cumulative %',
            //     type: 'line',
            //     color: '#374151',
            //     data: [
            //         550, 350, 450, 750, 350, 650, 450, 450,
            //         150, 550, 350, 450
            //     ],
            //     grouping: true,
            //     pointPadding: 0,

            // }
        ]
    })
}
</script>

<style scoped lang="scss">
.btn{
    height: 34px !important;
}
</style>
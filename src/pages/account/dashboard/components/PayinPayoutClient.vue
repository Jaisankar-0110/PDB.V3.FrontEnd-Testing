<template>
    <div class="card h-100">
        <div class="card-header py-3 bg-transparent">
            <div class="d-flex justify-content-between">
                <div class="text-quaternary-color fs16 fw500">Payin & Payout Client</div>
                <div class="d-flex">
                    <!-- <RouterLink to="/">
                        <button class="btn btn-primary border-0 fs14 pe-3 mx-3">Predict</button>
                    </RouterLink> -->
                    <select class="text-quaternary-color fs12 fw500 form-select ps-2" v-model="filter"
                        @change="getPayinPayout">
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                    </select>
                    <!-- <b class="bi bi-download fs22 text-quaternary-color"></b> -->
                </div>
            </div>
        </div>
        <div class="card-body">
            <div class="form-check form-check-inline mx-2">
                <input class="form-check-input" type="checkbox" id="payinCheckbox" v-model="showPayin"
                    @change="handlePayinChange">
                <label class="form-check-label text-quaternary-color fs14" for="payinCheckbox">Pay in</label>
            </div>
            <div class="form-check form-check-inline mx-2">
                <input class="form-check-input" type="checkbox" id="payoutCheckbox" v-model="showPayout"
                    @change="handlePayoutChange">
                <label class="form-check-label  text-quaternary-color fs14" for="payoutCheckbox">Pay out</label>
            </div>
            <div v-if="isNoData">
                <NoDataFound class="py-5 my-4" width="360px" />
            </div>
            <div v-else>
                <figure class="highcharts-figure">
                    <div ref="chartContainer" id="container"></div>
                </figure>
            </div>
        </div>
    </div>

</template>

<script setup>
import { onMounted, watch, ref, nextTick, computed } from 'vue'
import Highcharts from 'highcharts'
import { useAuthStore } from '@/stores/authStore';
import { dashboardService } from '../../../../services/account/dashboard.service';
import NoDataFound from "../../../../components/NoDataFound.vue";

const chartContainer = ref(null)
const adminDetails = ref({});
const authStore = useAuthStore();

const filter = ref();
const errorMsg = ref("");

const payInData = ref([]);
const payOutData = ref([]);

const showPayin = ref(true);
const showPayout = ref(false);

watch([showPayin, showPayout], () => {
    renderChart();
});

const handlePayinChange = () => {
    if (!showPayin.value && !showPayout.value) {
        showPayin.value = true;
    }
};

const handlePayoutChange = () => {
    if (!showPayin.value && !showPayout.value) {
        showPayout.value = true;
    }
};

const isNoData = computed(() => {
    const allPayInZero = payInData.value.every(val => val === 0);
    const allPayOutZero = payOutData.value.every(val => val === 0);
    return allPayInZero && allPayOutZero;
});

onMounted(() => {
    adminDetails.value = authStore.adminDetails;
    filter.value = new Date().getFullYear().toString();
    getPayinPayout();
})

const getPayinPayout = async () => {
    try {
        const response = await dashboardService.getPayinPayout(adminDetails.value.RemCode, filter.value);
        if (response.data.isSuccess) {
            payInData.value = response.data.data[0].payin_amount;
            payOutData.value = response.data.data[0].payout_amount;
            await nextTick();
            renderChart();
        } else {
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

    const series = [];

    if (showPayin.value) {
        series.push({
            name: 'Pay in',
            borderRadius: 5,
            type: 'column',
            color: '#379B7F',
            data: payInData.value,
            grouping: true,
            pointPadding: 0,
        });
    }

    if (showPayout.value) {
        series.push({
            name: 'Pay out',
            type: 'column',
            color: '#F59E0B',
            data: payOutData.value,
            grouping: true,
            pointPadding: 0,
        });
    }

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
            }
        },
        legend: {
            align: 'right',
            verticalAlign: 'top',
            layout: 'horizontal',
            x: 0,
            y: 0
        },
        series
    });
};

</script>

<style scoped lang="scss">

.btn {
    height: 34px !important;
}

.highcharts-figure {
    overflow-x: scroll;
}

.highcharts-figure div {
    min-width: 450px !important;
}

.form-select {
    width: 80px !important;
    height: 36px !important;
}

</style>
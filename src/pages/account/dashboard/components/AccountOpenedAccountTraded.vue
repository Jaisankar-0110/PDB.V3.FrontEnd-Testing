<template>
    <div class="card h-100">
        <div class="card-header py-3 bg-transparent">
            <div class="d-flex justify-content-between">
                <div class="text-quaternary-color fs16 fw500">Account Opened vs Account Traded</div>
                <div class="d-flex">
                    <select class="text-quaternary-color fs12 fw500 form-select ps-2" v-model="filter"
                        @change="getAccountOpenedAccountTraded">
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
                <input class="form-check-input" type="checkbox" id="AOCheckbox" v-model="showAccountOpened"
                    @change="handleAOChange">
                <label class="form-check-label text-quaternary-color fs14" for="AOCheckbox">Account Derivative Opened</label>
            </div>
            <div class="form-check form-check-inline mx-2">
                <input class="form-check-input" type="checkbox" id="ATCheckbox" v-model="showAccountTraded"
                    @change="handleATChange">
                <label class="form-check-label text-quaternary-color fs14" for="ATCheckbox">Account Derivative Traded</label>
            </div>
            <div v-if="isNoData">
                <NoDataFound class="py-5 my-4" width="360px" />
            </div>
            <div v-else>
                <figure class="highcharts-figure">
                    <div ref="accountOpenedAccountTraded" id="accountOpenedAccountTraded"></div>
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

const accountOpenedAccountTraded = ref(null)
const adminDetails = ref({});
const authStore = useAuthStore();

const filter = ref();
const errorMsg = ref("");

const openedCounts = ref([]);
const tradedCounts = ref([]);

const showAccountOpened = ref(true);
const showAccountTraded = ref(false);

watch([showAccountOpened, showAccountTraded], () => {
    renderChart();
});

const handleAOChange = () => {
    if (!showAccountOpened.value && !showAccountTraded.value) {
        showAccountOpened.value = true;
    }
};

const handleATChange = () => {
    if (!showAccountOpened.value && !showAccountTraded.value) {
        showAccountTraded.value = true;
    }
};

const isNoData = computed(() => {
    const allPayInZero = openedCounts.value.every(val => val === 0);
    const allPayOutZero = tradedCounts.value.every(val => val === 0);
    return allPayInZero && allPayOutZero;
});

onMounted(() => {
    adminDetails.value = authStore.adminDetails;
    filter.value = new Date().getFullYear().toString();
    getAccountOpenedAccountTraded();
})

const getAccountOpenedAccountTraded = async () => {
    try {
        const response = await dashboardService.getAccountOpenedAccountTraded(adminDetails.value.RemCode, filter.value);
        if (response.data.isSuccess) {
            openedCounts.value = response.data.data.openedCounts;
            tradedCounts.value = response.data.data.tradedCounts;
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
    if (!accountOpenedAccountTraded.value) return;

    const series = [];

    if (showAccountOpened.value) {
        series.push({
            name: 'Account Opened',
            borderRadius: 5,
            type: 'column',
            color: '#cd88c6',
            data: openedCounts.value,
            grouping: true,
            pointPadding: 0,
        });
    }

    if (showAccountTraded.value) {
        series.push({
            name: 'Account Traded',
            type: 'column',
            color: '#1D9BF0',
            data: tradedCounts.value,
            grouping: true,
            pointPadding: 0,
        });
    }

    Highcharts.chart(accountOpenedAccountTraded.value, {
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
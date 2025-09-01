<template>
    <div v-if="nodata">
        <TableNoDataFound class="py-5 my-md-3 my-xxl-4" />
    </div>
    <figure class="highcharts-figure py-4" v-else>
        <div ref="revenuePrediction" id="revenuePrediction"></div>
    </figure>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Highcharts from 'highcharts'
import { useAuthStore } from '@/stores/authStore';
import { accountService } from '../../../../../services/account/account.service';
import TableNoDataFound from '../../../../../components/TableNoDataFound.vue';

const revenuePrediction = ref(null);

const authStore = useAuthStore();
const adminDetails = ref({});
const errorMsg = ref('');
const nodata = ref(false);
const data = ref({});

onMounted(() => {
    adminDetails.value = authStore.adminDetails;
    getRevenuePrediction();
});

const getRevenuePrediction = async () => {
    data.value = {};
    try {
        const response = await accountService.getRevenuePrediction(adminDetails.value.RemCode);
        if (response.data?.isSuccess) {
            data.value = response.data.data || {};
            renderChart();
            nodata.value = false;
        } else {
            nodata.value = true;
            errorMsg.message = response.data?.message || 'Something went wrong, please try again later.';
        }
    } catch (err) {
        console.error(err);
        nodata.value = true;
        errorMsg.message = 'Something went wrong, please try again later.';
    }
};

const renderChart = () => {
    Highcharts.chart(revenuePrediction.value, {
        chart: {
            type: 'line',
            spacing: [10, 10, 15, 10]
        },

        title: {
            text: null
        },

        exporting: {
            enabled: false
        },

        credits: {
            enabled: false
        },

        xAxis: {
            categories: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May',
                'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ],
            lineColor: '#ccc',
            tickColor: '#ccc'
        },

        yAxis: {
            title: {
                text: null
            },
            gridLineColor: '#eee',
            labels: {
                formatter: function () {
                    return this.value.toLocaleString();
                }
            }
        },

        tooltip: {
            shared: true,
            valueSuffix: ''
        },

        legend: {
            align: 'right',
            verticalAlign: 'top',
            layout: 'vertical',
            itemStyle: {
                fontWeight: 'normal',
                color: '#666'
            }
        },

        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
        },

        series: [
            {
                name: 'Past data',
                // data: [500, 3000, 2500, 3400, 4000, 4000, 5000],
                data: data.value.revenue_bar[0].actual_revenue,
                color: '#333',
                lineWidth: 2,
                dashStyle: 'Solid'
            },
            {
                name: 'Prediction',
                // data: [null, null, null, null, null, null, 5000, 6000, 7000, 8000, 9000, 10000],
                data: data.value.revenue_bar[1].predicted_revenue,
                color: 'red',
                lineWidth: 2,
                dashStyle: 'Dash'
            }
        ]
    })
}
</script>

<style scoped></style>
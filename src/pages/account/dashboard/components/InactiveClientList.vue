<template>
    <div class="card h-100">
        <div class="card-header py-3 bg-transparent">
            <div class="d-flex justify-content-between">
                <div class="text-quaternary-color fs16 fw500">Inactive Client List</div>
            </div>
        </div>
     
        <div class="card-body">
               <div v-if="isNoData">
                <NoDataFound class="py-5 my-4" width="360px" />
            </div>
          <div v-else>
              <figure class="highcharts-figure px-3">
                <div ref="inactiveClient" id="inactiveClient"></div>
            </figure>
          </div>
            <div class="px-3 py-3">
                <div class="d-flex align-items-center mb-2 px-2 py-2">
                    <div class="icon" style="background-color: #99D6F7;"></div>
                    <span class="ps-4 text-quaternary-color fs12">Inactive for more than 30 days</span>
                </div>
                <div class="d-flex align-items-center mb-2 px-2 py-2">
                    <div class="icon" style="background-color: #3BAEF2;"></div>
                    <span class=" ps-4 text-quaternary-color fs12">Inactive for more than 90 days</span>
                </div>
                <div class="d-flex align-items-center mb-2 px-2 py-2">
                    <div class="icon" style="background-color: #4177C2;"></div>
                    <span class="ps-4 text-quaternary-color fs12">Dormant clients</span>
                </div>
                <div class="d-flex align-items-center mb-2 px-2 py-2">
                    <div class="icon" style="background-color: #FFC5C5;"></div>
                    <span class=" ps-4 text-quaternary-color fs12">Closed accounts</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, nextTick,computed  } from 'vue'
import Highcharts from 'highcharts';
import { useAuthStore } from '@/stores/authStore';
import { dashboardService } from '../../../../services/account/dashboard.service';
import NoDataFound from '@/components/NoDataFound.vue';

const inactiveClient = ref(null);
const authStore = useAuthStore();
const adminDetails = ref({});
const errorMsg = ref({
    message: '',
    type: ''
});
const inactiveFor30Days = ref(0);
const inactiveFor90Days = ref(0);
const dormant = ref(0);
const closed = ref(0);

onMounted(() => {
    adminDetails.value = authStore.adminDetails;
    getInactiveClient();
})

const isNoData = computed(() => {
    return inactiveFor30Days.value === 0 &&
           inactiveFor90Days.value === 0 &&
           dormant.value === 0 &&
           closed.value === 0;
});


const getInactiveClient = async () => {
    try {
        const response = await dashboardService.getInactiveClientList(adminDetails.value.RemCode);
        if (response.data.isSuccess) {
            inactiveFor30Days.value = Math.round(response.data.data.inactiveThirty);
            inactiveFor90Days.value = Math.round(response.data.data.inactiveNinty);
            dormant.value = Math.round(response.data.data.dormant);
            closed.value = Math.round(response.data.data.closed);
            await nextTick();
            renderChart();
        } else {
            errorMsg.message = response.data?.message || 'Something went wrong, please try again later.';
        }
    } catch (err) {
        // console.error(err);
        errorMsg.message = 'Something went wrong, please try again later.';
    }
};

const renderChart = () => {
    if (!inactiveClient.value) return;
    Highcharts.chart(inactiveClient.value, {
        title: {
            text: null
        },
        credits: {
            enabled: false
        },

        xAxis: {
            title: {
                text: null
            },
            labels: {
                enabled: false
            },
            categories: [
                'Inactive for more than 30 days', 'Inactive for more than 90 days', 'Dormant clients', 'Closed accounts'
            ],
        },
        yAxis: {
            gridLineWidth: 0,
            title: {
                text: null
            },
            labels: {
                enabled: false
            },
        },
        legend: {
            enabled: false
        },

        series: [{
            type: 'column',
            name: 'Percentage',
            borderRadius: 1,
            colorByPoint: true,
            groupPadding: 0,
            grouping: true,
            pointPadding: 0,

            data: [{
                y: inactiveFor30Days.value,
                color: '#99D6F7'
            }, {
                y: inactiveFor90Days.value,
                color: '#3BAEF2'
            }, {
                y: dormant.value,
                color: '#4177C2'
            }, {
                y: closed.value,
                color: '#FFC5C5'
            }],
            showInLegend: false,
            dataLabels: {
                enabled: true,
                color: '#374151',
                style: {
                    fontWeight: 'bold',
                    fontSize: '12px',
                },
                formatter: function () {
                    return this.y + '%';
                }
            }
        }]
    })
};


</script>

<style scoped>
.icon {
    width: 25px;
    height: 6px;
    border-radius: 3px !important;
    display: inline-block;
}

/* .card {
    height: auto !important;
}

@media(max-width:1400px) {
    .card {
        height: 100vh !important;
    }
} */
</style>
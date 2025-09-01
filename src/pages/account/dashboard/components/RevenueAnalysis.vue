<template>
  <div class="card">
    <div class="card-header py-3 bg-transparent">
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="text-quaternary-color fs16 fw500 mb-0">Revenue Analysis</h5>
        <div class="d-flex">
          <!-- <RouterLink to="/revenue-prediction">
            <button class="btn btn-primary border-0 fs14 pe-3 mx-3">Predict</button>
          </RouterLink> -->
          <select class="text-quaternary-color fs12 fw500 form-select ps-2" v-model="filter"
            @change="getRevenueAnalysis">
            <option v-for="year in [2025, 2024, 2023, 2022, 2021, 2020]" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
          <!-- <i class="bi bi-download fs22 text-quaternary-color cursor-pointer"></i> -->
        </div>
      </div>
    </div>

    <div class="card-body">
      <figure class="highcharts-figure" v-if="data.length">
        <div ref="chartContainer" id="container"></div>
      </figure>
      <div v-else>
        <NoDataFound class="py-5 my-5" width="360px" />
      </div>

      <div class="row mt-4">
        <div class="col-12 col-sm-6 col-lg-4 mb-3">
          <div class="bg-primary-light card">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between">
                <div class="text-start">
                  <div class="text-quaternary-color fs18 fw500">₹{{ revenueOverview.day_revenue?.toFixed(2) || '0.00' }}
                  </div>
                  <div class="text-quaternary-color fs14">Yesterday</div>
                </div>
                <div class="align-self-center">
                  <span>
                    <img :src="revenueOverview.day_percent >= 0 ? '/image/up-arrow.png' : '/image/down-arrow.png'" class="pe-2" />
                  </span>
                  <span class="fs14"  :class="revenueOverview.day_percent >= 0 ? 'text-success-color' : 'text-danger'" >{{ revenueOverview.day_percent || 0 }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-4 mb-3">
          <div class="card bg-primary-light">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between">
                <div class="text-start">
                  <div class="text-quaternary-color fs18 fw500">₹{{ revenueOverview.week_revenue?.toFixed(2) || '0.00'
                  }}</div>
                  <div class="text-quaternary-color fs14">This week</div>
                </div>
                <div class="align-self-center">
                  <span>
                    <img :src="revenueOverview.week_percent >= 0 ? '/image/up-arrow.png' : '/image/down-arrow.png'" class="pe-2" />
                  </span>
                  <span class="fs14"
                    :class="revenueOverview.week_percent >= 0 ? 'text-success-color' : 'text-danger'"> {{
                      revenueOverview.week_percent || 0 }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6 col-lg-4 mb-3">
          <div class="card bg-primary-light">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between">
                <div class="text-start">
                  <div class="text-quaternary-color fs18 fw500">₹ {{ (bdrPercent.revenueCurrentMonthSum ||
                    0).toLocaleString('en-IN') }}</div>
                  <div class="text-quaternary-color fs14">Revenue per sharing</div>
                </div>
                <div class="align-self-center">
                  <!-- <span>
                    <img src="/image/up-arrow.png" alt="Revenue growth" class="pe-2" />
                  </span>
                  <span class="text-success-color fs14">1.8%</span> -->
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from "vue";
import Highcharts from "highcharts";
import { useAuthStore } from '@/stores/authStore';
import { dashboardService } from '../../../../services/account/dashboard.service';
import NoDataFound from "../../../../components/NoDataFound.vue";


defineProps({
  bdrPercent: {
    type: Object,
    default: () => ({}),
  },
});

const chartContainer = ref(null)
const adminDetails = ref({});
const authStore = useAuthStore();
const filter = ref();
const errorMsg = ref("");
const data = ref([]);
const revenueOverview = ref({});

onMounted(() => {
  adminDetails.value = authStore.adminDetails;
  filter.value = new Date().getFullYear().toString();
  getRevenueAnalysis();
  getRevenueAnalysisAccounts();
})

const renderChart = () => {
  if (!chartContainer.value) return;

  Highcharts.chart(chartContainer.value, {
    chart: {
      type: 'column'
    },
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
      ]
    },
    yAxis: {
      gridLineWidth: 0,
      title: {
        text: null
      },
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      column: {
        pointWidth: 20,
      },
      series: {
        point: {
          events: {
            click: function () {
              const month = this.category;
              const monthIndex = this.x + 1; 
              const year = filter.value; 
              const url = `/revenue?month=${monthIndex}&year=${year}`;
              window.location.href = url;
            }
          }
        }
      }
    },
    series: [{
      name: 'Revenue Analysis',
      borderRadius: 20,
      type: 'column',
      color: '#1D9BF0',
      data: data.value,
    }]
  });
}

const getRevenueAnalysis = async () => {
  try {
    const response = await dashboardService.getRevenueBarChart(adminDetails.value.RemCode, filter.value);
    if (response.data.isSuccess && response.data.data !== null) {
      data.value = response.data.data[0]?.total_sharing || [];
      await nextTick();
      renderChart();
    } else {
      data.value = [];
      renderChart();
      errorMsg.value = response.data?.message || 'Something went wrong, please try again later.';
    }
  } catch (err) {
    console.error(err);
    data.value = [];
    renderChart();
    errorMsg.value = 'Something went wrong, please try again later.';
  }
};



const getRevenueAnalysisAccounts = async () => {
  try {
    const response = await dashboardService.getRevenueAnalyticsOverview(adminDetails.value.RemCode);
    if (response.data.isSuccess && response.data.data !== null && response.data.data.length > 0) {
      revenueOverview.value = response.data.data[0];
    } else {
      // revenueOverview.value = {
      //   day_revenue: 0,
      //   week_revenue: 0,
      //   month_revenue: 0,
      //   day_percent: 0,
      //   week_percent: 0
      // };
      errorMsg.value = response.data?.message || 'Something went wrong, please try again later.';
    }
  } catch (err) {
    console.error(err);
    // revenueOverview.value = {
    //   day_revenue: 0,
    //   week_revenue: 0,
    //   month_revenue: 0,
    //   day_percent: 0,
    //   week_percent: 0
    // };
    errorMsg.value = 'Something went wrong, please try again later.';
  }
};



</script>

<style scoped>
.highcharts-figure{
  overflow-x:scroll;
}

.highcharts-figure div{
  min-width:450px !important;
}

.form-select{
width:80px !important;
}
</style>

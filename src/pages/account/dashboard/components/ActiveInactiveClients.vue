<template>
  <div class="card bg-secondary-light">
    <div class="card-header py-3 bg-transparent">
      <div class="d-flex justify-content-between">
        <div class="text-quaternary-color fs16 fw500">Active & Inactive Clients</div>
      </div>
    </div>

    <div class="card-body">
      <div class="px-3 py-3">
        <div class="d-flex align-items-center mb-2 px-2">
          <div class="icon bg-success-light"></div>
          <span class="ps-2 text-quaternary-color fs12">Active</span>
        </div>
        <div class="d-flex align-items-center mb-2 px-2">
          <div class="icon bg-tertiary-light"></div>
          <span class="ps-2 text-quaternary-color fs12">Inactive</span>
        </div>
      </div>

      <figure class="highcharts-figure px-4" v-if="active !== null && inactive !== null">
        <div ref="chartContainer" id="container"></div>
      </figure>
      <div v-else>
        <NoDataFound class="py-5" width="'50%'" />
      </div>

      <div class="bg-quaternary-color py-2 row">
        <div class="col-8 text-light fs12">
          Prediction of active clients likely to chrun
        </div>
        <div class="col-4 text-end">
          <RouterLink to="/client-prediction" class="text-decoration-none">
            <span class="fs12 bg-light text-dark cursor-pointer py-1 px-1 rounded-pill">
              <i class="bi eye fs16"></i> View More
            </span>
          </RouterLink>
        </div>
      </div>
   

    <div v-show="showPrediction" class="pt-5 px-3 bg-secondary-light">
      <div class="d-flex align-items-center pb-4">
        <span class="text-quaternary-color fs12 me-3 label-width">High</span>
        <div class="progress flex-grow-1 bar-height me-2">
          <div class="progress-bar bg-danger rounded-progress" :style="{ width: high + '%' }"></div>
        </div>
        <span class="fs14 text-secondary-color fw500">{{ high }}</span>
      </div>

      <div class="d-flex align-items-center pb-4">
        <span class="text-quaternary-color fs12 me-3 label-width">Moderate</span>
        <div class="progress flex-grow-1 bar-height me-2">
          <div class="progress-bar bg-primary rounded-progress" :style="{ width: moderate + '%' }"></div>
        </div>
        <span class="fs14 text-secondary-color fw500">{{ moderate }}</span>
      </div>

      <div class="d-flex align-items-center pb-4">
        <span class="text-quaternary-color fs12 me-3 label-width">Low</span>
        <div class="progress flex-grow-1 bar-height me-2">
          <div class="progress-bar bg-info rounded-progress" :style="{ width: low + '%' }"></div>
        </div>
        <span class="fs14 text-secondary-color fw500">{{ low }}</span>
      </div>

    </div> </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import Highcharts from 'highcharts'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore';
import { dashboardService } from '../../../../services/account/dashboard.service';
import NoDataFound from '../../../../components/NoDataFound.vue';

const chartContainer = ref(null);
const showPrediction = ref(true);
const errorMsg = ref("");
const authStore = useAuthStore();
const adminDetails = ref({});
const active = ref(0);
const inactive = ref(0);
const high = ref(0);
const moderate = ref(0);
const low = ref(0);

const renderChart = () => {
  if (!chartContainer.value) return;
  Highcharts.chart(chartContainer.value, {
    chart: {
      type: "pie",
      backgroundColor: "transparent"
    },
    title: {
      text: null
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.2f}%</b>"
    },
    credits: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: "pointer",
        borderRadius: 6,
        dataLabels: [
          {
            enabled: true,
            distance: -40,
            format: "{point.percentage:.2f}%",
            style: {
              fontSize: "1em"
            }
          }
        ],
        showInLegend: true
      }
    },
    series: [
      {
        name: "Clients",
        colorByPoint: true,
        innerSize: "40%",
        data: [
          {
            name: "Active",
            y: active.value,
            color: "#10B981"
          },
          {
            name: "In Active",
            y: inactive.value,
            color: "#4177C2"
          }
        ]
      }
    ]
  });
};

const getInactiveAndActive = async () => {
  try {
    const response = await dashboardService.getActiveInactive(
      adminDetails.value.RemCode
    );
    if (response.data.isSuccess) {
      active.value = response.data.data.active;
      inactive.value = response.data.data.inactive;
      await nextTick();
      renderChart();
    } else {
      errorMsg.message =
        response.data?.message ||
        "Something went wrong, please try again later.";
    }
  } catch (err) {
    console.error(err);
    errorMsg.message = "Something went wrong, please try again later.";
  }
};

const getInactiveAndActiveClientList = async () => {
  try {
    const response = await dashboardService.getActiveInactiveClientList(
      adminDetails.value.RemCode
    );
    if (response.data.isSuccess) {
      high.value = response.data.data.high;
      moderate.value = response.data.data.moderate;
      low.value = response.data.data.low;
      await nextTick();
      renderChart();
    } else {
      errorMsg.message =
        response.data?.message ||
        "Something went wrong, please try again later.";
    }
  } catch (err) {
    console.error(err);
    errorMsg.message = "Something went wrong, please try again later.";
  }
};


onMounted(() => {
  renderChart();
  adminDetails.value = authStore.adminDetails;
  getInactiveAndActive();
  getInactiveAndActiveClientList();
});

</script>

<style scoped>
.label-width {
  width: 60px;
}

.bar-height {
  height: 10px;
}

.progress-bar {
  transition: width 0.8s ease;
}

.rounded-progress {
  border-radius: 999px;
}

.icon {
  width: 30px;
  height: 20px;
  border-radius: 4px !important;
  display: inline-block;
}
</style>
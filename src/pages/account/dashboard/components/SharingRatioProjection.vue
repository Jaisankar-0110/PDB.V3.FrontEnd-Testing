<template>
  <div class="card h-100">
    <div class="card-header py-3 bg-transparent d-flex justify-content-between">

        <div class="text-quaternary-color fs16 fw500">Sharing Ratio Projection</div>

       <div class="d-flex">
          <select class="text-quaternary-color fs12 fw500 form-select ps-2" v-model="filter">
            <option v-for="period in ['Monthly', 'Quarterly']" :key="period" :value="period">
              {{ period }}
            </option>
          </select>
        </div>
    </div>
    <div class="card-body">
      <div class="row pt-3">
        <div class="col-md-3 text-center col-6 mb-2 px-2">
          <span class="icon" style="background-color: #FF4B4B;"></span>
          <span class="ps-2 text-quaternary-color fs12">Less than 30 %</span>
        </div>
        <div class="col-md-3 text-center col-6 mb-2 px-2">
          <span class="icon" style="background-color: #FFA500;"></span>
          <span class="ps-2 text-quaternary-color fs12">30 % to 50 %</span>
        </div>
        <div class="col-md-3 text-center col-6 mb-2 px-2">
          <span class="icon" style="background-color: #9ACD32;"></span>
          <span class="ps-2 text-quaternary-color fs12">50 % to 70 %&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </div>
        <div class="col-md-3 text-center col-6 mb-2 px-2">
          <span class="icon" style="background-color: #228A22;"></span>
          <span class="ps-2 text-quaternary-color fs12">70 % above&nbsp;</span>
        </div>
      </div>

      <div class="highcharts-figure px-md-0 px-2">
        <div id="SharingRatioProjection"></div>
      </div>

      <div>
        <div class="row text-quaternary-color fs14 bg-purple px-3 pt-3">
          <div class="col-4 px-2">
            <p class="py-2">Current Position ({{ filter }}) </p>
          </div>
          <div class="col-4 px-2">
            <p class="py-2">Target Position</p>
          </div>
          <div class="col-4">
            <p class="py-2">What you need to do</p>
          </div>
        </div>
        <div class="row text-quaternary-color fs14 pt-4 pb-2 px-3 bg-white">
          <div class="col-4">
            <p class="pt-3">{{ currentPosition }}</p>
          </div>
          <div class="col-4 pt-3">
            <span>
              <img src="/image/up-arrow.png" alt="Revenue growth" class="pe-2" />
            </span>
            <span class="text-success-color">{{ targetPosition }}</span>
          </div>
          <div class="col-4">
            <p class="pt-3">{{ currentStatus }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { useAuthStore } from "@/stores/authStore";

const props = defineProps({
  bdrPercent: Object
});

const authStore = useAuthStore();
const adminDetails = ref({});
const filter = ref('Monthly');

const amtReleasePercent = computed(() =>
  Number(props.bdrPercent?.amtReleasePercent ?? 20)
);
const currentPosition = ref("20 %");
const targetPosition = ref("30 % (3UCCs)");
const currentStatus = ref(props.bdrPercent?.monthly30Status);

let chartInstance = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

watch(
  [filter, () => props.bdrPercent],
  ([currentFilter, data]) => {
    if (!data) return;

    amtReleasePercent.value = Number(data?.amtReleasePercent ?? 20);

    let levels = [];

    if (currentFilter === 'Monthly') {
      levels = [
        { percent: 20, current: "20 % (2UCCs)", target: "30 % (3UCCs)", status: data.monthly30Status },
        { percent: 30, current: "30 % (3UCCs)", target: "40 % (4UCCs)", status: data.monthly40Status },
        { percent: 40, current: "40 % (4UCCs)", target: "50 % (5UCCs)", status: data.monthly50Status },
        { percent: 50, current: "50 % (5UCCs)", target: "60 % (6UCCs)", status: data.monthly60Status },
        { percent: 60, current: "60 % (6UCCs)", target: "Achieved", status: "You have achieved your target" },
        { percent: 70, current: "70 %", target: "Achieved", status: "You have achieved your target" },
        { percent: 100, current: "100 %", target: "Achieved", status: "You have achieved your target" },
      ];
    } else if (currentFilter === 'Quarterly') {
      levels = [
        { percent: 20, current: "20 % (2UCCs)", target: "30 % (3UCCs)", status: data.quarterly30Status },
        { percent: 30, current: "30 % (3UCCs)", target: "40 % (4UCCs)", status: data.quarterly40Status },
        { percent: 40, current: "40 % (4UCCs)", target: "50 % (5UCCs)", status: data.quarterly50Status },
        { percent: 50, current: "50 % (5UCCs)", target: "60 % (6UCCs)", status: data.quarterly60Status },
        { percent: 60, current: "60 % (6UCCs)", target: "Achieved", status: "You have achieved your target" },
        { percent: 70, current: "70 %", target: "Achieved", status: "You have achieved your target" },
        { percent: 100, current: "100 %", target: "Achieved", status: "You have achieved your target" },
      ];
    }

    const level = levels.find(l => l.percent === amtReleasePercent.value);
    if (level) {
      currentPosition.value = level.current;
      targetPosition.value = level.target;
      currentStatus.value = level.status;
    }
  },
  { immediate: true }
);



const initializeChart = () => {
  chartInstance = Highcharts.chart("SharingRatioProjection", {
    chart: {
      type: "gauge",
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false,
      height: 400
    },
    credits: { enabled: false },
    title: { text: null },
    pane: {
      startAngle: -90,
      endAngle: 89.9,
      background: null,
      center: ["50%", "75%"],
      size: "100%"
    },
    yAxis: {
      min: 0,
      max: 100,
      tickInterval: 0,
      tickLength: 80,
      tickWidth: 2,
      tickColor: "#FFFFFF",
      labels: { enabled: false },
      lineWidth: 0,
      plotBands: [
        { from: 0, to: 30, color: "#FF4B4B", thickness: 80, borderRadius: 0 },
        { from: 30, to: 50, color: "#FFA500", thickness: 80, borderRadius: 0 },
        { from: 50, to: 70, color: "#9ACD32", thickness: 80, borderRadius: 0 },
        { from: 70, to: 100, color: "#228A22", thickness: 80, borderRadius: 0 }
      ]
    },
    series: [
      {
        name: "Sharing Ratio Projection",
        data: [amtReleasePercent.value],
        dataLabels: {
          format: "Sharing Ratio Projection",
          borderWidth: 0,
          color: "#0A1931",
          style: { fontSize: "14px", fontWeight: 400 }
        },
        dial: {
          radius: "80%",
          backgroundColor: "#0A1931",
          baseWidth: 12,
          baseLength: "0%",
          rearLength: "0%"
        },
        pivot: {
          backgroundColor: "#0A1931",
          borderColor: "#0A1931",
          borderWidth: 2,
          radius: 14
        }
      }
    ]
  });
};

onMounted(async () => {
  adminDetails.value = authStore.adminDetails;
  await loadScript("https://code.highcharts.com/highcharts.js");
  await loadScript("https://code.highcharts.com/highcharts-more.js");
  initializeChart();
});

// Update chart dynamically if amtReleasePercent changes
// watch(amtReleasePercent, newVal => {
//   if (chartInstance && typeof newVal === "number") {
//     chartInstance.series[0].setData([newVal]);
//   }
// });

watch(
  [amtReleasePercent, currentPosition, targetPosition, currentStatus],
  ([amtVal, currPos, targPos, currStat]) => {
    const numericAmt = Number(amtVal);
    if (chartInstance && !isNaN(numericAmt)) {
      chartInstance.series[0].setData([numericAmt]);
    }
  }
);

</script>

<style scoped>
.bg-purple {
  background-color: #aa96e4 !important;
}
.icon {
  width: 16px !important;
  height: 16px !important;
  border-radius: 3px !important;
  display: inline-block;
  position:relative;
  top:4px;
}
</style>
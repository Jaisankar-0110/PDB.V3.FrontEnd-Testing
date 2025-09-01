<template>
    <div class="card">
        <div class="card-header py-3 bg-transparent">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex justify-content-between">
                <div class="text-quaternary-color fs16 fw500">Lead Funnel</div>
            </div>
               <div class="d-flex justify-content-between">
          <RouterLink to="/ekyc-status" class="text-decoration-none">
            <span class="fs14 bg-primary  text-light px-1 cursor-pointer py-1 px-1 rounded-pill">
              <i class="bi eye fs16"></i> View More
            </span>
          </RouterLink>
        </div>
            </div>
        </div>
        <div class="card-body">
            <!-- <div class="my-2 position-relative" v-if="hasData"> -->
            <div class="d-flex justify-content-center align-items-center">
                <div class="my-2 position-relative">
                    <CanvasJSChart :options="options" class="leadFunnelChart" />
                    <div class="remove-watermark"></div>
                </div>
            </div>
            <!-- <div v-else>
                <NoDataFound class="py-3" width="260px" />
            </div> -->
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { dashboardService } from '../../../../services/account/dashboard.service';
import NoDataFound from "../../../../components/NoDataFound.vue";

const authStore = useAuthStore();
const adminDetails = ref({});
const data = ref({});
const pan = ref(0);
const bank = ref(0);
const ipv = ref(0);
const errorMsg = ref({
    message: ""
});

const hasData = computed(() => {
    return (
        Number(pan.value) > 0 ||
        Number(bank.value) > 0 ||
        Number(ipv.value) > 0
    );
});

const dataPoints = computed(() => {
    if (hasData.value) {
        return [
            { y: pan.value, label: "PAN", color: '#8E44AD', indexLabel: `PAN - ${pan.value}` },
            { y: bank.value, label: "Bank", color: '#F39C12', indexLabel: `Bank - ${bank.value}` },
            { y: ipv.value, label: "IPV", color: '#3498DB', indexLabel: `IPV - ${ipv.value}` },
        ];
    } else {
        return [
            { y: 1, label: "PAN", color: '#8E44AD', indexLabel: `PAN - ${pan.value}` },
            { y: 1, label: "Bank", color: '#F39C12', indexLabel: `Bank - ${bank.value}` },
            { y: 1, label: "IPV", color: '#3498DB', indexLabel: `IPV - ${ipv.value}` },
        ];
    }
});

const options = ref({
    animationEnabled: true,
    title: {
        text: null
    },
    toolTip: {
        enabled: false
    },
    data: [{
        type: "funnel",
        neckHeight: 0,
        neckWidth: 0,
        dataPoints: dataPoints.value

    }]
})

onMounted(() => {
    adminDetails.value = authStore.adminDetails;
    getLeadFunnelList();
});

const getLeadFunnelList = async () => {
    try {
        const response = await dashboardService.getLeadFunnel(
            adminDetails.value.RemCode
        );
        if (response.data.isSuccess) {
            pan.value = response.data.data.pan;
            ipv.value = response.data.data.ipv;
            bank.value = response.data.data.bank;
            options.value = {
                ...options.value,
                data: [{
                    type: "funnel",
                    neckHeight: 0,
                    neckWidth: 0,
                    dataPoints: dataPoints.value
                }]
            };
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


</script>

<style scoped lang="scss">
.remove-watermark {
    background: var(--light) !important;
    height: 10px;
    width: 100%;
    position: absolute;
    bottom: 1px;
    right: 0px;
}

.leadFunnelChart {
    width: 340px !important;
    height: 300px !important;
}

@media(max-width:767px) {
    .leadFunnelChart {
         width: 290px !important;
         height: 300px !important;
    }
}

.card {
    height: 390px !important;
}

@media(max-width:1399px) {
    .card {
        height: auto !important;
    }
}
</style>

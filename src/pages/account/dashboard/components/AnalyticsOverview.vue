<template>
    <div>
        <div class="row">
            <div class="col-7">
                <p class="text-quaternary-color fw500 fs16">Analytics overview</p>
            </div>
            <div class="col-5 text-end">
                <span class="bg-quaternary-color text-light rounded px-sm-3 px-1 py-1 py-sm-2 fs12-10">Partner since : {{
                    formatDate(accountDetails.AgreementDate) || '-' }}</span>
            </div>
        </div>

        <div class="position-relative">
            <!-- Left arrow -->
            <div v-if="showLeftArrow" class="scroll-arrow left" @click="scrollLeft">
                <i class="bi bi-arrow-left-circle-fill bg-light text-quaternary-color fs22 cursor-pointer"></i>
            </div>
            <!-- cards -->
            <div ref="scrollContainer" class="records-card d-flex">
                <div class="card">
                    <RouterLink to="/revenue" class="text-decoration-none">
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between">
                                <div class="text-start">
                                    <div class="text-quaternary-color fs14">Total revenue per sharing </div>
                                    <div class="text-quaternary-color fs18 fw500 mt-1">₹
                                        {{ (bdrPercent.revenueCurrentMonthSum || 0).toLocaleString('en-IN') }}</div>
                                </div>
                                <div>
                                    <img src="/image/analytics-overview-1.png" alt="Total revenue per sharing" />
                                </div>
                            </div>
                            <!-- <div class="mt-2 pt-1">
                            <img src="/image/graph-up.png" alt="graph-up-arrow" class="pe-2" />
                            <span class="text-quaternary-color fs11">30.00 % | 30 days</span>
                        </div> -->
                        </div>
                    </RouterLink>
                </div>
                <div class="card">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between">
                            <div class="text-start">
                                <div class="text-quaternary-color fs14">Active traded UCC's </div>
                                <div class="text-quaternary-color fs18 fw500 mt-1">{{ bdrPercent.activeTradedCount ||
                                    '0' }}
                                </div>
                            </div>
                            <div>
                                <img src="/image/analytics-overview-2.png" alt="Active traded UCC's" />
                            </div>
                        </div>
                        <!-- <div class="mt-2 pt-1">
                            <img src="/image/graph-up.png" alt="graph-up-arrow" class="pe-2" />
                            <span class="text-quaternary-color fs11">30.00 % | 30 days</span>
                        </div> -->
                    </div>
                </div>
                <!-- <div class="card">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between">
                            <div class="text-start">
                                <div class="text-quaternary-color fs14">Top revenue clients</div>
                                <div class="text-quaternary-color fs18 fw500 mt-1">-</div>
                            </div>
                            <div>
                                <img src="/image/analytics-overview-3.png" alt="Top revenue clients" />
                            </div>
                        </div> -->
                <!-- <div class="mt-2 pt-1">
                            <img src="/image/graph-up.png" alt="graph-up-arrow" class="pe-2" />
                            <span class="text-quaternary-color fs11">30.00 % | 30 days</span>
                        </div> -->
                <!-- </div>
                </div> -->
                <div class="card">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between">
                            <div class="text-start">
                                <div class="text-quaternary-color fs14">Revenue growth</div>
                                <div class="fs18 fw500 mt-1"
                                    :class="bdrPercent.revenueGrowthPercentage >= 1 ? 'text-quaternary-color' : 'text-danger'">
                                    {{ bdrPercent.revenueGrowthPercentage || '0' }} %
                                    <i class="bi"
                                        :class="bdrPercent.revenueTrendDirection === 'down' ? 'bi-caret-down-fill' : 'bi-caret-up-fill'"></i>
                                </div>
                            </div>
                            <div>
                                <img src="/image/analytics-overview-4.png" alt="Revenue growth" />
                            </div>
                        </div>
                        <!-- <div class="mt-2 pt-1">
                            <img src="/image/graph-up.png" alt="graph-up-arrow" class="pe-2" />
                            <span class="text-quaternary-color fs11">30.00 % | 30 days</span>
                        </div> -->
                    </div>
                </div>
                <div class="card">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between">
                            <div class="text-start">
                                <div class="text-quaternary-color fs14">Top traded segment </div>
                                <div class="text-quaternary-color fs14">Equilty - {{topTradedsegment.equityPercentage}}%</div>
                                <div class="text-quaternary-color fs14">Derivatives - {{topTradedsegment.derivativesPercentage}}%</div>
                            </div>
                            <div>
                                <img src="/image/analytics-overview-5.png" alt="Revenue growth" />
                            </div>
                        </div>
                        <!-- <div class="mt-2 pt-1">
                            <img src="/image/graph-up.png" alt="graph-up-arrow" class="pe-2" />
                            <span class="text-quaternary-color fs11">30.00 % | 30 days</span>
                        </div> -->
                    </div>
                </div>
            </div>
            <!-- Right arrow -->
            <div v-if="showRightArrow" class="scroll-arrow right" @click="scrollRight">
                <i class="bi bi-arrow-right-circle-fill bg-light text-quaternary-color fs22 cursor-pointer"></i>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { accountService } from '../../../../services/account/account.service';
import { format, addMinutes } from 'date-fns';
import { RouterLink } from 'vue-router';
import { dashboardService } from '../../../../services/account/dashboard.service';


defineProps({
    bdrPercent: {
        type: Object,
        default: () => ({}),
    },
});

const authStore = useAuthStore();
const adminDetails = ref({});

const scrollContainer = ref(null);
const showLeftArrow = ref(false);
const showRightArrow = ref(false);
const accountDetails = ref({});
const errorMsg = ref('');
const topTradedsegment = ref({});

const updateArrows = () => {
    const el = scrollContainer.value;
    if (!el) return;

    showLeftArrow.value = el.scrollLeft > 0;
    showRightArrow.value = el.scrollLeft + el.clientWidth < el.scrollWidth;
};

const scrollLeft = () => {
    scrollContainer.value.scrollBy({ left: -350, behavior: 'smooth' });
};

const scrollRight = () => {
    scrollContainer.value.scrollBy({ left: 350, behavior: 'smooth' });
};

const handleScroll = () => updateArrows();

onMounted(() => {
    adminDetails.value = authStore.adminDetails;
    getAccountDetails();
    getTradeSegmentPage();
    updateArrows();
    scrollContainer.value.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateArrows);
});

onBeforeUnmount(() => {
    scrollContainer.value.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', updateArrows);
});

const getAccountDetails = async () => {
    try {
        const response = await accountService.getAccountDetails(adminDetails.value.RemCode);
        if (response.data?.isSuccess) {
            const rawData = response.data.data[0];
            accountDetails.value = rawData;
        } else {
            errorMsg.message = response.data?.message || 'Something went wrong, please try again later.';
        }
    } catch (err) {
        console.error(err);
        errorMsg.message = 'Something went wrong, please try again later.';
    }
};

function formatDate(dateString) {
    if (!dateString) return null;
    const date = addMinutes(new Date(dateString), 5);
    return format(date, "dd-MM-yyyy");
}

const getTradeSegmentPage = async () => {
    try {
        const response = await dashboardService.getTradeSegment(adminDetails.value.RemCode);
        if (response.data.isSuccess) {
           topTradedsegment.value = response.data.data;
            
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

<style scoped>
.records-card {
    gap: 20px;
    scroll-behavior: smooth;
    padding: 10px 0px;
    overflow-x: scroll;
}

.records-card .card {
    width: 320px;
    min-width: 272px;
    /* Updated by Karthik */
}

.records-card::-webkit-scrollbar {
  height: 3px;
}

.records-card::-webkit-scrollbar-track {
  /* background: var(--scrollbar); */
  background: none;
}

.records-card::-webkit-scrollbar-thumb {
  /* background-color: var(--tertiary); */
  background: none;
  border-radius: 2px;
}

.scroll-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
}

.scroll-arrow.left {
    left: 0;
}

.scroll-arrow.right {
    right: 0;
}

.icon-blue {
    background-color: #0D4593;
    color: #ffffff;
    border-radius: 50%;
    padding: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    font-size: 16px;
}
</style>
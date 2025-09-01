<template>
    <div>
        <div class="row justify-content-end  mt-3">
            <div class="col-md-6 d-flex justify-content-end align-items-center">
                <div class="mb-2 me-2 d-inline-block  ">
                    <select
                        class="fs14 fw400 form-select py-2 border border-primary fw-medium rounded text-primary fw-medium">
                        <option value="">Monthly</option>
                        <option value="1">Weekly</option>
                        <option value="2">Daily</option>

                    </select>
                </div>
                <div class="mb-2 d-inline-block">
                    <input type="date"
                        class="form-control border border-primary text-primary fw-medium rounded px-3 py-2"
                        v-model="fromDate" :max="format(new Date(), 'yyyy-MM-dd')" />
                </div>
            </div>
        </div>

        <div class="position-relative">

            <div ref="scrollContainer" class="records-card d-flex">
                <div>
                    <div class="fs14 fw400 my-1 text-quaternary-color">Total Leads</div>
                    <div class="card ">
                        <div class="card-body p-0">
                            <div class="row g-0">
                                <div  class="col-6 bg-lead-icon d-flex justify-content-center align-items-center p-4">
                                    <div class=" rounded-circle d-flex justify-content-center align-items-center">
                                        <!-- <i class="bi bi-person-fill fs22 "></i> -->
                                           <img src="/image/total-count-1.png" alt="">
                                    </div>
                                </div>
                                <div class="col-6 d-flex justify-content-center align-items-center p-4   bg-lead">
                                    <div class="text-center">
                                        <div class="fs22 fw600 ">
                                            3
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                     <div class="">
                    <div class="fs14 fw400 my-1 text-quaternary-color">Account Processing</div>
                    <div class="card rounded ">
                        <div class="card-body p-0">
                            <div class="row g-0">
                                <div
                                    class="col-6 bg-account-icon d-flex justify-content-center align-items-center p-4">
                                    <div class=" rounded-circle d-flex justify-content-center align-items-center ">
                                        <img src="/image/total-count-2.png" alt="">
                                    </div>
                                </div>
                                <div
                                    class="col-6 d-flex justify-content-center align-items-center p-4  bg-account">
                                    <div class="text-center">
                                        <div class="fs22 fw600">
                                            6
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                   <div>
                    <div class="fs14 fw400 my-1 text-quaternary-color">Account Opened</div>
                    <div class="card ">
                        <div class="card-body p-0">
                            <div class="row g-0">
                                <div
                                    class="col-6 bg-opened-icon d-flex justify-content-center align-items-center p-4">
                                    <div class=" rounded-circle d-flex justify-content-center align-items-center ">
                                        <img src="/image/total-count-3.png" alt="">
                                    </div>
                                </div>
                                <div
                                    class="col-6 d-flex justify-content-center align-items-center p-4  bg-opened">
                                    <div class="text-center">
                                        <div class="fs22 fw600">
                                            0
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                   <div>
                    <div class="fs14 fw400 my-1 text-quaternary-color">Account Traded</div>
                    <div class="card rounded">
                        <div class="card-body p-0">
                            <div class="row g-0">
                                <div
                                    class="col-6 bg-traded-icon d-flex justify-content-center align-items-center p-4">
                                    <div class=" rounded-circle d-flex justify-content-center align-items-center ">
                                        <img src="/image/total-count-4.png" alt="">
                                    </div>
                                </div>
                                <div
                                    class="col-6 d-flex justify-content-center align-items-center p-4  bg-traded">
                                    <div class="text-center">
                                        <div class="fs22 fw600">
                                            6
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                   <div>
                    <div class="fs14 fw400 my-1 text-quaternary-color">Derivated Account Opened</div>
                    <div class="card rounded">
                        <div class="card-body p-0">
                            <div class="row g-0">
                                <div
                                    class="col-6 bg-derivated-account-icon d-flex justify-content-center align-items-center p-4">
                                    <div class=" rounded-circle d-flex justify-content-center align-items-center ">
                                        <img src="/image/total-count-5.png" alt="">
                                    </div>
                                </div>
                                <div
                                    class="col-6 d-flex justify-content-center align-items-center p-4  bg-derivated-account">
                                    <div class="text-center">
                                        <div class="fs22 fw600">
                                            3
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                   <div>
                    <div class="fs14 fw400 my-1 text-quaternary-color">Derivated Account Traded</div>
                    <div class="card rounded">
                        <div class="card-body p-0">
                            <div class="row g-0">
                                <div
                                    class="col-6 bg-derivated-trade-icon d-flex justify-content-center align-items-center p-4">
                                    <div class=" rounded-circle d-flex justify-content-center align-items-center ">
                                        <img src="/image/total-count-6.png" alt="">
                                    </div>
                                </div>
                                <div
                                    class="col-6 d-flex justify-content-center align-items-center p-4  bg-derivated-trade">
                                    <div class="text-center">
                                        <div class="fs22 fw600">
                                            0
                                        </div>
                                    </div>
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

const fromDate = ref('')

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
    gap: 14px;
    scroll-behavior: smooth;
    padding: 10px 0px;
    overflow-x: scroll;
}

.records-card .card {
    width: 220px;
    min-width: 122px !important;
    border-radius: 14px !important;
    overflow: hidden !important;
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

.form-select,
.form-control {
    height: 36px !important;
}

.bg-lead {
  background-color: #8de9d5 !important;
  border: #76e6cb solid 2px !important;
  border-left: none !important; 
  border-radius: 0 14px 14px 0 !important;
  color: #2db698 !important;
}

.bg-lead-icon {
  background-color: #ffffff !important;
  border: #76e6cb solid 2px !important;
  border-right: none !important; 
  border-radius: 14px 0 0 14px !important;
}
.bg-account-icon {
  background-color: #ffffff !important;
  border: #e7b4a7 solid 2px !important;
  border-right: none !important;
  border-radius: 14px 0 0 14px !important;
}

.bg-account {
  background-color: #e7b4a7 !important;
  border: #e7b4a7 solid 2px !important;
  border-left: none !important;
  border-radius: 0 14px 14px 0 !important;
  color: #db6547 !important;
}


.bg-opened-icon {
  background-color: #ffffff !important;
  border: #a8eec5 solid 2px !important;
  border-right: none !important;
  border-radius: 14px 0 0 14px !important;
}

.bg-opened {
  background-color: #a8eec5 !important;
  border: #a8eec5 solid 2px !important;
  border-left: none !important;
  border-radius: 0 14px 14px 0 !important;
  color: #2acaa7 !important;
}

.bg-traded-icon {
  background-color: #ffffff !important;
  border: #d89fee solid 2px !important;
  border-right: none !important;
  border-radius: 14px 0 0 14px !important;
}

.bg-traded {
  background-color: #d89fee !important;
  border: #d89fee solid 2px !important;
  border-left: none !important;
  border-radius: 0 14px 14px 0 !important;
  color: rgb(187, 84, 228) !important;
}

.bg-derivated-account-icon {
  background-color: #ffffff !important;
  border: #eec789 solid 2px !important;
  border-right: none !important;
  border-radius: 14px 0 0 14px !important;
}

.bg-derivated-account {
  background-color: #eec789 !important;
  border: #eec789 solid 2px !important;
  border-left: none !important;
  border-radius: 0 14px 14px 0 !important;
  color: #daa146 !important;
}


.bg-derivated-trade-icon {
  background-color: #ffffff !important;
  border: #b3dafa solid 2px !important;
  border-right: none !important;
  border-radius: 14px 0 0 14px !important;
}

.bg-derivated-trade {
  background-color: #b3dafa !important;
  border: #b3dafa solid 2px !important;
  border-left: none !important;
  border-radius: 0 14px 14px 0 !important;
  color: #56a4e4 !important;
}




</style>
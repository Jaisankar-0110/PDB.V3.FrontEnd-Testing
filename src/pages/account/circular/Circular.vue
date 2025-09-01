<template>
    <div class="px-2 pb-3 fs14 d-flex align-items-end">
        <RouterLink to="/dashboard" class="text-tertiary-color text-decoration-none"> <i
                class=" bi bi-house-fill fs16 pe-1"></i>
            Dashboard</RouterLink>
        <span class="px-2">/</span>
        <div class="text-muted">Circular Announcements</div>
    </div>
    <div class="card">
        <div class="card-header py-3 bg-transparent">
            <div class="d-flex justify-content-between align-items-center">
                <div class="text-quaternary-color fs16 fw500">Circular Announcements</div>
            </div>
        </div>
        <div class="card-body p-xl-5 p-4">
            <div class="row">
                <div class="col-md-6 col-12 col-xl-4 col-xxl-3 mb-3 pb-2 d-flex">
                    <div class="card border h-100 w-100 d-flex w-100 d-flex flex-column">
                        <div class="card-header pt-4 text-success text-center bg-light-color fs18 fw600 border-0">
                            Circular - 1
                        </div>
                        <div class="card-body p-4 pt-0">
                            <img src="/circular/circular-1.png" class="w-100 mt-2">
                            <div class="mt-2 pt-2">
                                <div class="text-dark fs16 fw500 title mt-2 mb-3">
                                    Ad safety policy
                                </div>
                                <div class="text-muted fs14">Prohibition of AB subdomains and spoofed
                                    websites for ads.</div>
                            </div>
                            <div class="pt-3">
                                <a href="https://aliceblueonline.com/circulars/partner/aliceblue-ad-safety-policy/" class="btn btn-primary w-100 pt-2" target="_blank">
                                    More Info...
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-12 col-xl-4 col-xxl-3 mb-3 pb-2 d-flex">
                    <div class="card border h-100 w-100 d-flex d-flex flex-column">
                        <div class="card-header pt-4 bg-light-color text-success text-center fs18 fw600 border-0">
                            Circular- 2
                        </div>
                        <div class="card-body  p-4 pt-0">
                            <img src="/circular/circular-2.png" class="w-100 mt-2">
                            <div class="mt-2 pt-2">
                                <div class="text-dark fs16 fw500 title mt-2 mb-3">
                                    Circular
                                </div>
                                <div class="text-muted fs14">Key updates on partner roles and process
                                    changes.</div>
                            </div>
                            <div class="pt-3">
                                <a href="/circular/circular.pdf" class="btn btn-primary w-100 pt-2" target="_blank">
                                    More Info...
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-12 col-xl-4 col-xxl-3 mb-3 pb-2 d-flex">
                    <div class="card border h-100 w-100 d-flex d-flex flex-column">
                        <div class="card-header pt-4 text-success bg-light-color text-center fs18 fw600 border-0">
                            Circular- 3
                        </div>
                        <div class="card-body p-4 pt-0">
                            <img src="/circular/circular-3.png" class="w-100 mt-2">
                            <div class="mt-2 pt-2">
                                <div class="text-dark fs16 fw500 title mt-2 mb-3">
                                    Terms and conditions for APs.
                                </div>
                                <div class="text-muted fs14">Latest terms, rules, and partner obligations.
                                </div>
                            </div>
                            <div class="pt-3">
                                <a href="/circular/terms_and_conditions_for_AP.pdf"  class="btn btn-primary w-100 pt-2" target="_blank">
                                    More Info...
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-12 col-xl-4 col-xxl-3 mb-3 pb-2 d-flex">
                    <div class="card border h-100 w-100 d-flex d-flex flex-column">
                        <div class="card-header pt-4 bg-light-color text-success text-center fs18 fw600 border-0">
                            Circular- 4
                        </div>

                        <div class="card-body p-4 pt-0">
                            <img src="/circular/circular-4.png" class="w-100 mt-2">
                            <div class="mt-2 pt-2">
                                <div class="text-dark fs16 fw500 title mt-2 mb-3">
                                    Referral partner onboarding policy
                                </div>
                                <div class="text-muted fs14">Steps and rules for onboarding referral
                                    partners.</div>
                            </div>
                             <div class="pt-3">
                                <a href="/circular/referral_partner_onboarding_policy.pdf"  class="btn btn-primary w-100 pt-2" target="_blank">
                                    More Info...
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Pagination from '../../../components/Pagination.vue';
import { format, addMinutes } from 'date-fns';
import { useAuthStore } from '@/stores/authStore';
import { tableService } from '../../../services/account/table.service';
import ButtonOutlineTertiary from '../../../components/button/ButtonOutlineTertiary.vue';
import TableNoData from '../../../components/TableNoDataFound.vue';
import { showErrorToast } from '../../../js/toast';

const currentPage = ref(1);
const totalPages = ref(1);
const filter = ref('active');
const clients = ref([]);
const authStore = useAuthStore();
const adminDetails = ref({});
const errorMsg = ref('');
const totalClients = ref(0);


</script>

<style scoped>
.title{
    /* height: 30px !important; */
}
</style>

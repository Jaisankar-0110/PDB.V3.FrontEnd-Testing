<template>
  <div class="dashboard mb-4">
    <AnalyticsOverview :bdrPercent="bdrPercent" />
    <div>
      <!-- <div class="row">
        <div class="col-12">
          <TotalCounts :bdrPercent="bdrPercent" />
        </div>
      </div> -->
    </div>

    <div class="row mt-3">
      <div class="col-xl-8 col-12">
        <RevenueAnalysis :bdrPercent="bdrPercent" />
        <div class="row mt-4">
          <div class="col-xxl-6 col-12">
            <LeadFunnel />
          </div>
          <div class="col-xxl-6 col-12 mt-xxl-0 mt-4">
            <!-- <Alerts /> -->
            <ProfileSummary :bdrPercent="bdrPercent" />
          </div>
        </div>

      </div>
      <div class="col-xl-4 col-12 mt-xl-0 mt-4">
        <!-- <ProfileSummary :bdrPercent="bdrPercent" /> -->
        <Alerts />
        <ActiveInactiveClients class="mt-4" />
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-xl-6 col-12">
        <SharingRatioProjection :bdrPercent="bdrPercent" />
      </div>
      <div class="col-xl-6 col-12 mt-xl-0 mt-4">
        <InactiveClientList />
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-xl-6 col-12">
        <!-- <ClientWiseBrokerageGenerated /> -->
        <AccountOpenedAccountTraded />
      </div>
      <div class="col-xl-6 col-12 mt-xl-0 mt-4">
        <PayinPayoutClient />
      </div>
    </div>
    <!-- <div class="row mt-4">
      <div class="col-lg-6 col-12">
        <ClientDebitTracker />
      </div>
      <div class="col-lg-6 col-12 mt-lg-0 mt-4">
        <SummaryStatistics />
      </div>
    </div> -->
  </div>
  <Banner />
  <!-- <Ratings /> -->
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

import AnalyticsOverview from './components/AnalyticsOverview.vue';
import RevenueAnalysis from './components/RevenueAnalysis.vue';
import LeadFunnel from './components/LeadFunnel.vue';
import Alerts from './components/Alerts.vue';
import ClientWiseBrokerageGenerated from './components/ClientWiseBrokerageGenerated.vue';
import PayinPayoutClient from './components/PayinPayoutClient.vue';
import ClientDebitTracker from './components/ClientDebitTracker.vue';
import ProfileSummary from './components/ProfileSummary.vue';
import ActiveInactiveClients from './components/ActiveInactiveClients.vue';
import SharingRatioProjection from './components/SharingRatioProjection.vue';
import InactiveClientList from './components/InactiveClientList.vue';
import SummaryStatistics from './components/SummaryStatistics.vue';
import AccountOpenedAccountTraded from './components/AccountOpenedAccountTraded.vue';
import { dashboardService } from '../../../services/account/dashboard.service';
import { useAuthStore } from '@/stores/authStore';
import { Modal } from 'bootstrap';
import Banner from './Banner.vue';
import Ratings from './Ratings.vue';
import TotalCounts from './components/TotalCounts.vue';


const authStore = useAuthStore();
const adminDetails = ref({});

const errorMsg = ref('');
const bdrPercent = ref({});

onMounted(() => {
  adminDetails.value = authStore.adminDetails;
  getBDRPercent();
  if (!sessionStorage.getItem('bannerShown')) {
    if (localStorage.getItem('banners')) openBannerModal();
    sessionStorage.setItem('bannerShown', 'true');
  }
  openRatingModal();
});

const getBDRPercent = async () => {
  const params = {
    remCode: adminDetails.value.RemCode,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  };
  try {

    const response = await dashboardService.getBDRPercent(params);

    if (response.data?.isSuccess) {
      bdrPercent.value = response.data?.data[0] || [];
    } else {
      errorMsg.message = response.data?.message || 'Something went wrong, please try again later.';
    }
  } catch (err) {
    console.error(err);
    errorMsg.message = 'Something went wrong, please try again later.';
  }
};

const openBannerModal = () => {
  nextTick(() => {
    const modal = document.getElementById('banner');
    const modalInstance = new Modal(modal);
    modalInstance.show();
  });
};
const openRatingModal = () => {
  nextTick(() => {
    const modal = document.getElementById('starRatingModal');
    const modalInstance = new Modal(modal);
    modalInstance.show();
  });
};

</script>

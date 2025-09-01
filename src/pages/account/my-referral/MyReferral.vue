<template>
  <div class="px-2 pb-3 fs14 d-flex align-items-end">
    <RouterLink to="/dashboard" class="text-tertiary-color text-decoration-none"> <i
        class=" bi bi-house-fill fs16 pe-1"></i>
      Dashboard</RouterLink>
    <span class="px-2">/</span>
    <div class="text-muted">My Client Referral</div>
  </div>
  <div class="card">
    <div class="card-header py-3 bg-transparent">
      <div class="d-flex justify-content-between align-items-center">
        <div class="text-quaternary-color fs16 fw500">My Client Referral</div>
        <div class="d-flex align-items-center" v-if="role !== 'ADMIN'">
          <ButtonOutlineTertiary @click="clients.length && exportAllReferralDataToCSV()" v-if="clients.length > 0" :disabled="exportLoading">
            <span class="px-1">
              Export <b class="bi bi-download ps-2 fs16"></b>
            </span>
          </ButtonOutlineTertiary>
        </div>
      </div>
    </div>
    <div class="card-body p-3">
      <div class="row mb-1">
        <div class="col-md-6 col-lg-4 col-xl-2">
          <input type="date" class="form-control fs14 w-100" v-model="fromDate" @change="getMyReferralPage"
            :max="format(new Date(), 'yyyy-MM-dd')">
        </div>
        <div class="col-md-6 col-lg-4 col-xl-2 pt-3 pt-md-0">
          <input type="date" class="form-control fs14 w-100" v-model="toDate" @change="getMyReferralPage"
            :max="format(new Date(), 'yyyy-MM-dd')">
        </div>
        <div class="col-md-6 col-lg-4 col-xl-2 pt-3 pt-lg-0">
          <select class="text-secondary-color fs14 fw500 w-100 form-select" v-model="filter"
            @change="getMyReferralPage">
            <option value="">All</option>
            <option value="request received">Request received</option>
            <option value="kyc processing">KYC Processing</option>
            <option value="account opened">Account Opened</option>
            <option value="first trade done">First Trade</option>
            <option value="derivative first trade done">Derivative First Trade</option>
            <option value="not interested">Non-Interested</option>
          </select>
        </div>
      </div>
      <div class="row mt-3 mb-3">
        <div class="col-md-6 col-12">
          <div class="text-quaternary-color fs14 fw500 mt-2">Total Clients: {{ totalClients }}</div>
        </div>
        <div class="col-md-6 col-12 text-end">
          <div class="d-flex align-items-center justify-content-end">
            <span class="text-secondary-color fs14 fw500 px-2">Entries Per Page</span>
            <select class="text-secondary-color fs14 w-auto fw500 form-select" v-model="entriesPerPage"
              @change="getMyReferralPage">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>           
          </div>
        </div>
      </div>
      <div v-if="!loading">
        <div v-if="clients.length > 0">
          <div class="table-responsive pt-1">
            <table class="table" style="width:auto">
            <thead>
  <tr>
    <th @click="sortBy('leadname')" class="sortable position-relative text-center">
      Lead Name
      <SortIcon field="leadname" :current="sortField" :direction="sortDirection" />
    </th>
    <th @click="sortBy('leademail')" class="sortable position-relative text-center">
      Lead Email
      <SortIcon field="leademail" :current="sortField" :direction="sortDirection" />
    </th>
    <th @click="sortBy('leadadmin')" class="sortable position-relative text-center">
      Branch Code
      <SortIcon field="leadadmin" :current="sortField" :direction="sortDirection" />
    </th>
    <th @click="sortBy('leadmobile')" class="sortable position-relative text-center">
      Lead Mobile
      <SortIcon field="leadmobile" :current="sortField" :direction="sortDirection" />
    </th>
    <th @click="sortBy('leadgenerateddate')" class="sortable position-relative text-center">
      Lead Generated Date
      <SortIcon field="leadgenerateddate" :current="sortField" :direction="sortDirection" />
    </th>
    <th @click="sortBy('leadstatus')" class="sortable position-relative text-center">
      Lead Status
      <SortIcon field="leadstatus" :current="sortField" :direction="sortDirection" />
    </th>
  </tr>
</thead>

              <tbody>
                <tr v-for="(client, index) in clients" :key="index">
                  <td>{{ client.leadname || '-' }}</td>
                  <td>{{ client.leademail || '-' }}</td>
                  <td>{{ client.leadadmin || '-' }}</td>
                  <td>{{ client.leadmobile || '-' }}</td>
                  <td>{{ formatDate(client.leadgenerateddate) || '-' }}</td>
                  <td>{{ client.leadstatus || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Pagination v-model="currentPage" :total-pages="totalPages" />
        </div>
        <div v-else>
          <TableNoData class="py-5 my-md-3 my-xxl-4" />
        </div>
      </div>
      <div class="text-center my-5 py-5" v-else>
        <Loading class="my-5 py-4" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Pagination from '../../../components/Pagination.vue';
import { useAuthStore } from '@/stores/authStore';
import { tableService } from '../../../services/account/table.service';
import ButtonOutlineTertiary from '../../../components/button/ButtonOutlineTertiary.vue';
import TableNoData from '../../../components/TableNoDataFound.vue';
import { showErrorToast, showSuccessToast } from '../../../js/toast';
import Loading from '../../../components/Loading.vue';
import { format, addMinutes, subDays } from 'date-fns';
import SortIcon from '../../../components/SortIcon.vue';

const currentPage = ref(1);
const totalPages = ref(1);
const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
const currentYear = currentDate.getFullYear();
const monthfilter = ref(String(currentMonth));
const yearfilter = ref(String(currentYear));
const clients = ref([]);
const authStore = useAuthStore();
const adminDetails = ref({});
const filter = ref('');
const errorMsg = ref('');
const totalClients = ref(0);
const loading = ref(false);
const toDate = ref(format(new Date(), 'yyyy-MM-dd'));
const fromDate = ref(format(subDays(new Date(), 5), 'yyyy-MM-dd'));
const exportLoading = ref(false);
const role = ref(localStorage.getItem('role'));

const entriesPerPage = ref(10);

const sortField = ref('');
const sortDirection = ref('');
const originalClients = ref([]);


onMounted(() => {
  adminDetails.value = authStore.adminDetails;
  getMyReferralPage();
});

watch(currentPage, (newVal) => {
  getMyReferralPage();
});

function formatDate(dateString) {
  if (!dateString) return null;
  const date = addMinutes(new Date(dateString), 5);
  return format(date, "dd-MM-yyyy");
}

const getMyReferralPage = async () => {
  loading.value = true;
  const params = {
    remCode: adminDetails.value.RemCode,
    page: currentPage.value,
    fromDate: fromDate.value,
    toDate: toDate.value,
    filter: filter.value,
    size: entriesPerPage.value
  };
  try {
    const response = await tableService.getMyReferral(params);
    if (response.data?.isSuccess) {
      clients.value = response.data?.data.result || [];
      originalClients.value = [...clients.value];
      totalPages.value = response.data?.data.noOfPages || 1;
      totalClients.value = response.data?.data.count;
    } else {
      clients.value = [];
      totalClients.value = 0;
      errorMsg.message = response.data?.message || 'Something went wrong, please try again later.';
    }
  } catch (err) {
    clients.value = [];
    totalClients.value = 0;
    console.error(err);
    errorMsg.message = 'Something went wrong, please try again later.';
  } finally {
    loading.value = false;
  }
};

const exportAllReferralDataToCSV = async () => {
  exportLoading.value = true;
  try {
    const params = {
      remCode: adminDetails.value.RemCode,
      fromDate: fromDate.value,
      toDate: toDate.value,
      filter: filter.value,
      page: 1,
      size: totalClients.value
    };
    const response = await tableService.getMyReferral(params);
    if (response.data?.isSuccess && Array.isArray(response.data.data.result) && response.data.data.result.length > 0) {
      const allClients = response.data.data.result;

      const headers = ["Lead Name", "Lead Email", "Branch Code", "Lead Mobile", "Lead Generated Date", "Lead Status"];

      const rows = allClients.map(client => [
        client.leadname || '-',
        client.leademail || '-',
        client.leadadmin || '-',
        client.leadmobile || '-',
        formatDate(client.leadgenerateddate) || '-',
        client.leadstatus || '-'
      ]);

      let csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "My_Client_Referral_All.csv");

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSuccessToast("CSV Exported Successfully");
    } else {
      showErrorToast("No data available to export.");
    }
  } catch (error) {
    console.error(error);
    showErrorToast("Error while exporting data.");
  } finally {
    exportLoading.value = false;
  }
};

function sortBy(field) {
  if (sortField.value === field) {
    if (sortDirection.value === '') {
      sortDirection.value = 'asc';
    } else if (sortDirection.value === 'asc') {
      sortDirection.value = 'desc';
    } else {
      // Reset sorting
      sortField.value = '';
      sortDirection.value = '';
      clients.value = [...originalClients.value];
      return;
    }
  } else {
    sortField.value = field;
    sortDirection.value = 'asc';
  }

  clients.value.sort((a, b) => {
    const valA = a[field] || '';
    const valB = b[field] || '';

    if (typeof valA === 'string') {
      return sortDirection.value === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return sortDirection.value === 'asc' ? valA - valB : valB - valA;
  });
}


</script>

<style scoped lang="scss">
.no-data {
  width: 400px !important;
}

@media(max-width:1400px) {
  .no-data {
    width: 360px !important;
  }
}

@media(max-width:767px) {
  .no-data {
    width: 300px !important;
  }
}

@media(max-width:992px) {
  .table {
    width: 900px !important;
  }
}

.form-control,
.form-select {
  height: 40PX !important;
}
</style>
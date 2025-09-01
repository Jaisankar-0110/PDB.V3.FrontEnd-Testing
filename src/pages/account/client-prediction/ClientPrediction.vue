<template>
  <div class="px-2 pb-3 fs14 d-flex align-items-end">
    <RouterLink to="/dashboard" class="text-tertiary-color text-decoration-none"> <i
        class=" bi bi-house-fill fs16 pe-1"></i>
      Dashboard</RouterLink>
    <span class="px-2">/</span>
    <div class="text-muted">Client Prediction</div>
  </div>
  <div class="card">
    <div class="card-header py-3 bg-transparent">
      <div class="d-flex justify-content-between align-items-center">
        <div class="text-quaternary-color fs16 fw500">
          Client Prediction
          <a href="/pdf/Churn-Information.pdf" target="_blank">
            <i class="bi bi-info-circle-fill ps-2 text-tertiary-color cursor-pointer"></i>
          </a>
        </div>
        <div class="d-flex align-items-center" v-if="role !== 'ADMIN'">
          <ButtonOutlineTertiary @click="clients.length && exportAllClientPredictionToCSV()" v-if="clients.length > 0"
            :disabled="exportLoading">
            <span class="px-1">
              Export <b class="bi bi-download ps-2 fs16"></b>
            </span>
          </ButtonOutlineTertiary>
        </div>
      </div>
    </div>
    <div class="card-body p-3">
      <!-- <div class="row mb-1 align-middle">

        <div class="   text-end">
          <div class="text-quaternary-color fs14 fw500">Total Clients: {{ totalClients }}</div>
        </div>

      </div> -->
      <div class="row mt-3 mb-3">
        <div class="col-md-6 col-12">
          <div class="text-quaternary-color fs14 fw500 mt-2">Total Rows: {{ totalClients }}</div>
        </div>
        <div class="col-md-6 col-12 text-end">
          <div class="d-flex align-items-center justify-content-end">
            <span class="text-secondary-color fs14 fw500 px-2">Entries Per Page</span>
            <select class="text-secondary-color fs14 w-auto fw500 form-select" v-model="entriesPerPage"
              @change="getClientPredictionData">
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
                  <th @click="sortBy('clientId')" class="sortable position-relative text-center">
                    Client ID
                    <SortIcon field="clientId" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('tenure')" class="sortable position-relative text-center">
                    Tenure (days)
                    <SortIcon field="tenure" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('riskBucket')" class="sortable position-relative text-center">
                    Risk Bucket
                    <SortIcon field="riskBucket" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('loginCnt')" class="sortable position-relative text-center">
                    ANT Login Count
                    <SortIcon field="loginCnt" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('trdCnt')" class="sortable position-relative text-center">
                    Trade Count
                    <SortIcon field="trdCnt" :current="sortField" :direction="sortDirection" />
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(client, index) in clients" :key="index">
                  <td>{{ client.clientId || '-' }}</td>
                  <!-- <td>{{ client.remeshireGroup || '-' }}</td> -->
                  <td>{{ client.tenure || '-' }}</td>
                  <td>{{ client.riskBucket || '-' }}</td>
                  <td>{{ client.loginCnt || '-' }}</td>
                  <td>{{ client.trdCnt || '-' }}</td>
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
import { format, addMinutes } from 'date-fns';
import { useAuthStore } from '@/stores/authStore';
import { tableService } from '../../../services/account/table.service';
import ButtonOutlineTertiary from '../../../components/button/ButtonOutlineTertiary.vue';
import TableNoData from '../../../components/TableNoDataFound.vue';
import { showErrorToast, showSuccessToast } from '../../../js/toast';
import Loading from '../../../components/Loading.vue';
import SortIcon from '../../../components/SortIcon.vue';

const currentPage = ref(1);
const totalPages = ref(1);
const filter = ref('active');
const clients = ref([]);
const authStore = useAuthStore();
const adminDetails = ref({});
const errorMsg = ref('');
const totalClients = ref(0);
const loading = ref(false);
const entriesPerPage = ref(10);
const exportLoading = ref(false);
const role = ref(localStorage.getItem('role'));

const sortField = ref('');
const sortDirection = ref('');
const originalClients = ref([]);


onMounted(() => {
  adminDetails.value = authStore.adminDetails;
  getClientPredictionData();
});

watch(currentPage, (newVal) => {
  getClientPredictionData();
});

function formatDate(dateString) {
  if (!dateString) return null;
  const date = addMinutes(new Date(dateString), 5);
  return format(date, "dd-MM-yyyy");
}

const getClientPredictionData = async () => {
  loading.value = true;
  const params = {
    remCode: adminDetails.value.RemCode,
    page: currentPage.value,
    size: entriesPerPage.value
  };
  try {
    const response = await tableService.getClientPrediction(params);
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
  }
  finally {
    loading.value = false;
  }
};

const exportAllClientPredictionToCSV = async () => {
  exportLoading.value = true;
  try {
    const params = {
      remCode: adminDetails.value.RemCode,
      page: 1,
      size: totalClients.value
    };
    const response = await tableService.getClientPrediction(params);
    if (response.data?.isSuccess && response.data.data.result.length > 0) {
      const allClients = response.data.data.result;

      const headers = ["Client ID", "Tenure", "Risk Bucket", "ANT Login Count", "Trade Count"];

      const rows = allClients.map(client => [
        client.clientId || '-',
        client.tenure || '-',
        client.riskBucket || '-',
        client.loginCnt || '-',
        client.trdCnt || '-'
      ]);

      let csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "Client Prediction - All Data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSuccessToast("All Client Prediction Data Exported Successfully");
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


@media(max-width:1400px) {
  .table {
    width: 1600px !important;
  }
}
</style>

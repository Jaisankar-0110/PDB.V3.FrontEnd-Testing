<template>
  <div class="px-2 pb-3 fs14 d-flex align-items-end">
    <RouterLink to="/dashboard" class="text-tertiary-color text-decoration-none"> <i
        class=" bi bi-house-fill fs16 pe-1"></i>
      Dashboard</RouterLink>
    <span class="px-2">/</span>
    <div class="text-muted">Client Summary</div>
  </div>
  <div class="card">
    <div class="card-header py-3 bg-transparent">
      <div class="d-flex justify-content-between align-items-center">
        <div class="text-quaternary-color fs16 fw500">Client Summary</div>
        <div class="d-flex align-items-center">

          <ButtonOutlineTertiary @click="clients.length && exportToCSV()" v-if="clients.length > 0">
            <span class="px-1">
              Export <b class="bi bi-download ps-2 fs16"></b>
            </span>
          </ButtonOutlineTertiary>
        </div>
      </div>
    </div>
    <div class="card-body p-3">
      <div class="row mb-1 align-middle">
        <div class="col-md-6 d-flex align-items-center">
          <div class="mb-2 d-inline-block">
            <select class="text-secondary-color fs14 fw500 form-select py-2" v-model="filter" @change="getBDRPercent">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="cash">Cash</option>
            </select>
          </div>
        </div>
        <div class="col-md-6 text-end">
          <div class="text-quaternary-color mt-2 fs14 fw500">Total Clients: {{ totalClients }}</div>
        </div>
      </div>
      <div v-if="!loading">
        <div v-if="clients.length > 0">
          <div class="table-responsive pt-1">
            <table class="table" style="width:auto">
              <thead>
                <tr>
                  <th>Client ID</th>
                  <th>Client Name</th>
                  <th>Mobile No</th>
                  <th>Branch Code</th>
                  <th>UCC Response Date</th>
                  <th>First Trade Date</th>
                  <th>Last Trade Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(client, index) in clients" :key="index">
                  <td>{{ client.CLIENT_ID || '-' }}</td>
                  <td>{{ client.CLIENT_NAME || '-' }}</td>
                  <td>{{ client.MOBILE_NO || '-' }}</td>
                  <td>{{ client.BRANCH_CODE_NEW || '-' }}</td>
                  <td>{{ client.ACC_OPEN_DATE || '-' }}</td>
                  <td>{{ formatDate(client.first_trade_date) || '-' }}</td>
                  <td>{{ formatDate(client.Last_trade_date) || '-' }}</td>
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
import { showErrorToast } from '../../../js/toast';
import Loading from '../../../components/Loading.vue';

const currentPage = ref(1);
const totalPages = ref(1);
const filter = ref('active');
const clients = ref([]);
const authStore = useAuthStore();
const adminDetails = ref({});
const errorMsg = ref('');
const totalClients = ref(0);
const loading = ref(false);

onMounted(() => {
  adminDetails.value = authStore.adminDetails;
  getBDRPercent();
});

watch(currentPage, (newVal) => {
  getBDRPercent();
});

function formatDate(dateString) {
  if (!dateString) return null;
  const date = addMinutes(new Date(dateString), 5);
  return format(date, "dd-MM-yyyy");
}

const getBDRPercent = async () => {
  loading.value = true;
  const params = {
    remCode: adminDetails.value.RemCode,
    page: currentPage.value,
    filter: filter.value,
  };
  try {
    const response = await tableService.getClientSummary(params);
    if (response.data?.isSuccess) {
      clients.value = response.data?.data.result || [];
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

const exportToCSV = () => {
  if (!clients.value.length) {
    showErrorToast("No data available to export.");
    return;
  }

  const headers = ["Client ID", "Client Name", "Mobile No", "Branch Code", "UCC Response Date", "First Trade Date", "Last Trade Date"];

  const rows = clients.value.map(client => [
    client.CLIENT_ID || '-',
    client.CLIENT_NAME || '-',
    client.MOBILE_NO || '-',
    client.BRANCH_CODE_NEW || '-',
    client.ACC_OPEN_DATE || 'N/A',
    formatDate(client.first_trade_date) || '-',
    formatDate(client.Last_trade_date) || '-',
  ]);

  let csvContent = "data:text/csv;charset=utf-8,"
    + [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Client Summary.csv");

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  
  showSuccessToast("CSV Exported Successfully");
};

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
    width: 1500px !important;
  }
}
</style>
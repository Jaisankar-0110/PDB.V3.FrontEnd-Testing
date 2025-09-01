<template>
  <div class="px-2 pb-3 fs14 d-flex">
    <RouterLink to="/dashboard" class="text-tertiary-color text-decoration-none"> <i
        class=" bi bi-house-fill fs16 pe-1"></i>
      Dashboard</RouterLink>
    <span class="px-2">/</span>
    <div class="text-muted">Revenue</div>
  </div>
  <div class="card">
    <div class="card-header py-3 bg-transparent">
      <div class="d-flex justify-content-between align-items-center">
        <div class="text-quaternary-color fs16 fw500">Revenue</div>
        <div class="d-flex align-items-center">
          <ButtonOutlineTertiary v-if="clients.length" @click="clients.length && exportToCSV()">
            <span class="px-1">
              Export <b class="bi bi-download ps-2 fs16"></b>
            </span>
          </ButtonOutlineTertiary>
        </div>
      </div>
    </div>
    <div class="card-body p-3">
      <div class="row mb-1">
        <div class="col-md-6 d-flex align-items-center ">
          <div class="mb-2 me-2 d-inline-block">
            <select class="text-secondary-color fs14 fw500 form-select py-2" v-model="monthfilter"
              @change="getRevenuePage">
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          <div class="mb-2 d-inline-block">
            <select class="text-secondary-color fs14 fw500 form-select py-2" v-model="yearfilter"
              @change="getRevenuePage">
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
            </select>
          </div>
        </div>
        <div class="col-md-6 text-end">
          <div class="text-quaternary-color fs14 fw500 mt-2">Total Clients: {{ totalClients }}</div>
        </div>
      </div>

      <div v-if="clients.length > 0">
        <div class="table-responsive pt-1">
          <table class="table" style="width:auto">
            <thead>
              <tr>
                <th>Derivative Trade Count</th>
                <th>Amount Release Percent</th>
                <th>IBT Sharing</th>
                <th>BRK Sharing</th>
                <th>Total Sharing</th>
                <th>Month</th>
                <th>Year</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(client, index) in clients" :key="index">
                <td>{{ client.Derivative_trade_count || '-' }}</td>
                <td>{{ client.Amt_release_percent || '-' }}</td>
                <td>{{ client.IBT_ACT_SHARING || '-' }}</td>
                <td>{{ client.BRK_ACT_SHARING || '-' }}</td>
                <td>{{ client.total_sharing ? client.total_sharing.toFixed(2) : '-' }}</td>
                <td>{{ client.month || '-' }}</td>
                <td>{{ client.year || '-' }}</td>
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
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import Pagination from '../../../components/Pagination.vue';
import { format, addMinutes } from 'date-fns';
import { useAuthStore } from '@/stores/authStore';
import { tableService } from '../../../services/account/table.service';
import ButtonOutlineTertiary from '../../../components/button/ButtonOutlineTertiary.vue';
import TableNoData from '../../../components/TableNoDataFound.vue';
import { showErrorToast } from '../../../js/toast';

const route = useRoute();

const currentPage = ref(1);
const totalPages = ref(1);
const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
const currentYear = currentDate.getFullYear();
const monthfilter = ref(route.query.month ? String(route.query.month) : String(currentMonth));
const yearfilter = ref(route.query.year ? String(route.query.year) : String(currentYear));
const clients = ref([]);
const authStore = useAuthStore();
const adminDetails = ref({});
const errorMsg = ref('');
const totalClients = ref(0);

onMounted(() => {
  adminDetails.value = authStore.adminDetails;
  getRevenuePage();
});

watch(currentPage, (newVal) => {
  getRevenuePage();
});

function formatDate(dateString) {
  if (!dateString) return null;
  const date = addMinutes(new Date(dateString), 5);
  return format(date, "dd-MM-yyyy");
}

const getRevenuePage = async () => {
  const params = {
    rem_code: adminDetails.value.RemCode,
    page: currentPage.value,
    month: monthfilter.value,
    year: yearfilter.value,
  };
  try {
    const response = await tableService.getRevenue(params);
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
};

const exportToCSV = () => {
  if (!clients.value.length) {
    showErrorToast("No data available to export.");
    return;
  }

  const headers = ["Derivative Trade Count", "Amount Release Percent", "IBT Sharing", "BRK Sharing", "Total Sharing", "Month", "Year"];

  const rows = clients.value.map(client => [
    client.Derivative_trade_count || '-',
    client.Amt_release_percent || '-',
    client.IBT_ACT_SHARING || '-',
    client.BRK_ACT_SHARING || '-',
    client.total_sharing.toFixed(2) || '-',
    client.month || '-',
    client.year || '-',
  ]);

  let csvContent = "data:text/csv;charset=utf-8,"
    + [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Revenue.csv");

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
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

@media(max-width:992px) {
  .table {
    width: 900px !important;
  }
}
</style>

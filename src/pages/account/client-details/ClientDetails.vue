<template>
  <div class="px-2 pb-3 fs14 d-flex align-items-end">
    <RouterLink to="/dashboard" class="text-tertiary-color text-decoration-none"> <i
        class=" bi bi-house-fill fs16 pe-1"></i>
      Dashboard</RouterLink>
    <span class="px-2">/</span>
    <div class="text-muted">Client Details</div>
  </div>
  <div class="card">
    <div class="card-header py-3 bg-transparent">
      <div class="d-flex justify-content-between align-items-center">
        <div class="text-quaternary-color fs16 fw500">Client Details</div>
        <div class="d-flex align-items-center" v-if="role !== 'ADMIN'">
          <ButtonOutlineTertiary @click="clients.length && exportAllDataToCSV()" v-if="clients.length > 0"
            :disabled="exportLoading">
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
              <option value="dormant">Dormant</option>
              <option value="cash">Only Cash</option>
              <option value="tpro">T-Pro</option>
              <option value="ibt">IBT</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div class="ps-3 p-0 mb-2">
            <input type="text" class="form-control fs14 " placeholder="Search" v-model="searchItem"
              @input="getBDRPercent">
          </div>
        </div>

      </div>
      <div class="row mt-3 mb-3">
        <!-- <div class="col-md-6 col-12">
          <div class="text-quaternary-color fs14 fw500 mt-2">Total Clients: {{ totalClients }}</div>
        </div> -->
        <div class=" text-end">
          <div class="d-flex align-items-center justify-content-end">
            <span class="text-secondary-color fs14 fw500 px-2">Entries Per Page</span>
            <select class="text-secondary-color fs14 w-auto fw500 form-select" v-model="entriesPerPage"
              @change="getBDRPercent">
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
                  <th @click="sortBy('clientName')" class="sortable position-relative text-center">
                    Client Name
                    <SortIcon field="clientName" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('uccResponseDate')" class="sortable position-relative text-center">
                    Account Open Date
                    <SortIcon field="uccResponseDate" :current="sortField" :direction="sortDirection"
                      />
                  </th>
                  <th @click="sortBy('branchCodeNew')" class="sortable position-relative text-center">
                    Branch Code
                    <SortIcon field="branchCodeNew" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('firstTradeDate')" class="sortable position-relative text-center">
                    First Trade Date
                    <SortIcon field="firstTradeDate" :current="sortField" :direction="sortDirection"
                      />
                  </th>
                  <th @click="sortBy('lastTradeDate')" class="sortable position-relative text-center">
                    Last Trade Date
                    <SortIcon field="lastTradeDate" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('derivativeFirstTradeDate')" class="sortable position-relative text-center">
                    Derivative First Trade Date
                    <SortIcon field="derivativeFirstTradeDate" :current="sortField" :direction="sortDirection"
                      />
                  </th>
                  <th @click="sortBy('ibtModule')" class="sortable position-relative text-center">
                    IBT Module
                    <SortIcon field="ibtModule" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('mcx')" class="sortable position-relative text-center">
                    MCX
                    <SortIcon field="mcx" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('nseCash')" class="sortable position-relative text-center">
                    NSE Cash
                    <SortIcon field="nseCash" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('nseFno')" class="sortable position-relative text-center">
                    NSE F&O
                    <SortIcon field="nseFno" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('mobileNo')" class="sortable position-relative text-center">
                    Mobile No
                    <SortIcon field="mobileNo" :current="sortField" :direction="sortDirection" />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(client, index) in clients" :key="index">
                  <td>{{ client.clientId || '-' }}</td>
                  <td>{{ client.clientName || '-' }}</td>
                  <td>{{ formatDate(client.uccResponseDate) || '-' }}</td>
                  <td>{{ client.branchCodeNew || '-' }}</td>
                  <td>{{ formatDate(client.firstTradeDate) || '-' }}</td>
                  <td>{{ formatDate(client.lastTradeDate) || '-' }}</td>
                  <td>{{ formatDate(client.derivativeFirstTradeDate) || '-' }}</td>
                  <td>{{ client.ibtModule || '-' }}</td>
                  <td>{{ client.mcx || '-' }}</td>
                  <td>{{ client.nseCash || '-' }}</td>
                  <td>{{ client.nseFno || '-' }}</td>
                  <td>{{ client.mobileNo || '-' }}</td>
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
const searchItem = ref('');
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
  getBDRPercent();
});

watch(currentPage, (newVal) => {
  getBDRPercent();
});

function formatDate(dateString) {
  if (!dateString) return null;
  const date = addMinutes(new Date(dateString), 5);
  //return format(date, "dd-MM-yyyy hh:mm a");
  return format(date, "dd-MM-yyyy");
}

const getBDRPercent = async () => {
  loading.value = true;
  const params = {
    remCode: adminDetails.value.RemCode,
    page: currentPage.value,
    filter: filter.value,
    searchItem: searchItem.value || '',
    size: entriesPerPage.value
  };
  try {
    const response = await tableService.getClientDetails(params);
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
    console.error(err);
    clients.value = [];
    totalClients.value = 0;
    errorMsg.message = 'Something went wrong, please try again later.';
  } finally {
    loading.value = false;
  }
};

const exportAllDataToCSV = async () => {
  exportLoading.value = true;
  try {
    const params = {
      remCode: adminDetails.value.RemCode,
      page: 1,
      filter: filter.value,
      searchItem: searchItem.value || '',
      size: totalClients.value,
    };
    const response = await tableService.getClientDetails(params);
    if (response.data?.isSuccess && response.data.data.result.length > 0) {
      const allClients = response.data.data.result;

      const headers = ["Client ID", "Client Name", "Account Open Date", "Branch Code", "First Trade Date", "Last Trade Date", "Derivative First Trade Date", "IBT Module", "MCX", "NSE Cash", "NSE F&O", "Mobile No"];

      const rows = allClients.map(client => [
        client.clientId || '-',
        client.clientName || '-',
        formatDate(client.uccResponseDate) || '-',
        client.branchCodeNew || '-',
        formatDate(client.firstTradeDate) || '-',
        formatDate(client.lastTradeDate) || '-',
        formatDate(client.derivativeFirstTradeDate) || '-',
        client.ibtModule || '-',
        client.mcx || '-',
        client.nseCash || '-',
        client.nseFno || '-',
        client.mobileNo || '-',
      ]);

      let csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "Client Details - All Data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSuccessToast("All Client Data Exported Successfully");
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

.table {
  width: 1700px !important;
}

// @media(max-width:1400px) {
//   .table {
//     width: 1600px !important;
//   }
// }

.form-control,
.form-select {
  height: 40PX !important;
}
</style>
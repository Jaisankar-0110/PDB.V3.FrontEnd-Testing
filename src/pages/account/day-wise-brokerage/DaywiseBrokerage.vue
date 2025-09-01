<template>
  <div class="px-2 pb-3 fs14 d-flex align-items-end">
    <RouterLink to="/dashboard" class="text-tertiary-color text-decoration-none"> <i
        class=" bi bi-house-fill fs16 pe-1"></i>
      Dashboard</RouterLink>
    <span class="px-2">/</span>
    <div class="text-muted">Day-wise Brokerage</div>
  </div>
  <div class="card">
    <div class="card-header py-3 bg-transparent">
      <div class="d-flex justify-content-between align-items-center">
        <div class="text-quaternary-color fs16 fw500">Day-wise Brokerage</div>
        <div class="d-flex align-items-center" v-if="role !== 'ADMIN'">
          <ButtonOutlineTertiary @click="onExportClick" v-if="clients.length > 0" :disabled="exportLoading">
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
          <div class="mb-2 me-3 d-inline-block">
            <input type="date" class="form-control fs14" v-model="fromDate" @change="getDayWiseBrokerage"
              :max="format(new Date(), 'yyyy-MM-dd')">
          </div>
          <div class="mb-2 me-3 d-inline-block">
            <input type="date" class="form-control fs14" v-model="toDate" @change="getDayWiseBrokerage"
              :max="format(new Date(), 'yyyy-MM-dd')">
          </div>
        </div>
        <!-- <div class="col-md-6 text-end">
          <div class="text-quaternary-color fs14 fw500 mt-2">Total Clients: {{ totalClients }}</div>
        </div> -->
      </div>
      <div class="row mt-3 mb-3">
        <div class="col-md-6 col-12">
          <div class="text-quaternary-color fs14 fw500 mt-2">Total Rows: {{ totalClients }}</div>
        </div>
        <div class="col-md-6 col-12 text-end">
          <div class="d-flex align-items-center justify-content-end">
            <span class="text-secondary-color fs14 fw500 px-2">Entries Per Page</span>
            <select class="text-secondary-color fs14 w-auto fw500 form-select" v-model="entriesPerPage"
              @change="getDayWiseBrokerage">
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
                  <th @click="sortBy('company_code')" class="sortable position-relative text-center">
                    Company Code
                    <SortIcon field="company_code" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('R_BRANCH_CODE')" class="sortable position-relative text-center">
                    Branch Code
                    <SortIcon field="R_BRANCH_CODE" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('Trade_Date')" class="sortable position-relative text-center">
                    Trade Date
                    <SortIcon field="Trade_Date" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('Act_rem_shr')" class="sortable position-relative text-center">
                    Brokerage Sharing
                    <SortIcon field="Act_rem_shr" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(client, index) in clients" :key="index">
                  <!-- <td>{{ client.remeshire_code || '-' }}</td> -->
                  <td>{{ client.company_code || '-' }}</td>
                  <td>{{ client.R_BRANCH_CODE || '-' }}</td>
                  <td>{{ formatDate(client.Trade_Date) || '-' }}</td>
                  <td>{{ client.Act_rem_shr || '-' }}</td>
                  <td>
                    <div @click="openModal(client)" class="d-inline alert alert-info cursor-pointer" role="alert">
                      <i class="bi bi-eye-fill"></i> View
                    </div>
                  </td>
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
  <DaywiseBrokerageBreakdown :remCode="breakdownModalData.remCode" :date="breakdownModalData.date" />
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import Pagination from '../../../components/Pagination.vue';
import { format, addMinutes, subDays } from 'date-fns';
import { useAuthStore } from '@/stores/authStore';
import { tableService } from '../../../services/account/table.service';
import ButtonOutlineTertiary from '../../../components/button/ButtonOutlineTertiary.vue';
import TableNoData from '../../../components/TableNoDataFound.vue';
import { showErrorToast, showSuccessToast } from '../../../js/toast';
import DaywiseBrokerageBreakdown from './DaywiseBrokerageBreakdown.vue';
import { Modal } from 'bootstrap';
import Loading from '../../../components/Loading.vue';
import SortIcon from '../../../components/SortIcon.vue';

const toDate = ref(format(new Date(), 'yyyy-MM-dd'));
const fromDate = ref(format(subDays(new Date(), 5), 'yyyy-MM-dd'));

const currentPage = ref(1);
const totalPages = ref(1);
const exportLoading = ref(false);
const clients = ref([]);
const authStore = useAuthStore();
const adminDetails = ref({});
const errorMsg = ref('');
const totalClients = ref(0);
const loading = ref(false);

const sortField = ref('');
const sortDirection = ref('');
const originalClients = ref([]);


const breakdownModalData = ref({});
const entriesPerPage = ref(10);
const role = ref(localStorage.getItem('role'));

onMounted(() => {
  adminDetails.value = authStore.adminDetails;
  getDayWiseBrokerage();
});

watch(currentPage, (newVal) => {
  getDayWiseBrokerage();
});

const onExportClick = () => {
  if (!exportLoading.value && clients.value.length > 0) {
    exportAllDayWiseBrokerageToCSV();
  }
};


const getDayWiseBrokerage = async () => {
  loading.value = true;
  const params = {
    remCode: adminDetails.value.RemCode,
    page: currentPage.value,
    fromDate: fromDate.value,
    toDate: toDate.value,
    size: entriesPerPage.value
  };
  try {
    const response = await tableService.getDayWiseBrokerage(params);
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

function formatDate(dateString) {
  if (!dateString) return null;
  const date = addMinutes(new Date(dateString), 5);
  return format(date, "dd-MM-yyyy");
}

// const exportToCSV = () => {
//   if (!clients.value.length) {
//     showErrorToast("No data available to export.");
//     return;
//   }

//   const headers = ["Company Code", "Branch Code", "Trade Date", "Brokerage sharing"];

//   const rows = clients.value.map(client => [
//     // client.remeshire_code || '-',
//     client.company_code || '-',
//     client.R_BRANCH_CODE || '-',
//     formatDate(client.Trade_Date) || '-',
//     client.Act_rem_shr || '-',

//   ]);

//   let csvContent = "data:text/csv;charset=utf-8,"
//     + [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

//   const encodedUri = encodeURI(csvContent);
//   const link = document.createElement("a");
//   link.setAttribute("href", encodedUri);
//   link.setAttribute("download", "Day-wise Brokerage.csv");

//   document.body.appendChild(link);
//   link.click();

//   document.body.removeChild(link);
//   showSuccessToast("CSV Exported Successfully");

// };

const exportAllDayWiseBrokerageToCSV = async () => {
  exportLoading.value = true;
  try {
    const params = {
      remCode: adminDetails.value.RemCode,
      page: 1,
      fromDate: fromDate.value,
      toDate: toDate.value,
      size: totalClients.value
    };
    const response = await tableService.getDayWiseBrokerage(params);
    if (response.data?.isSuccess && response.data.data.result.length > 0) {
      const allClients = response.data.data.result;

      const headers = ["Company Code", "Branch Code", "Trade Date", "Brokerage Sharing"];

      const rows = allClients.map(client => [
        client.company_code || '-',
        client.R_BRANCH_CODE || '-',
        formatDate(client.Trade_Date) || '-',
        client.Act_rem_shr || '-',
      ]);

      let csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "Day-wise Brokerage - All Data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSuccessToast("All Day-wise Brokerage Exported Successfully");
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


const openModal = (client) => {
  breakdownModalData.value = {
    remCode: adminDetails.value.RemCode,
    date: client.Trade_Date,
  };

  nextTick(() => {
    const modalEl = document.getElementById('DaywiseBrokerageBreakdown');
    const modalInstance = new Modal(modalEl);
    modalInstance.show();
  });
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
@media(max-width:992px) {
  .table {
    width: 900px !important;
  }
}

.alert {
  padding: 4px 10px;
}
</style>

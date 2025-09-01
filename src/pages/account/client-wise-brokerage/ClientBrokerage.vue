<template>
  <div class="px-2 pb-3 fs14 d-flex align-items-end">
    <RouterLink to="/dashboard" class="text-tertiary-color text-decoration-none"> <i
        class=" bi bi-house-fill fs16 pe-1"></i>
      Dashboard</RouterLink>
    <span class="px-2">/</span>
    <div class="text-muted">Client-wise Brokerage</div>
  </div>
  <div class="card">
    <div class="card-header py-3 bg-transparent">
      <div class="d-flex justify-content-between align-items-center">
        <div class="text-quaternary-color fs16 fw500">Client-wise Brokerage</div>
        <div class="d-flex align-items-center" v-if="role !== 'ADMIN'">
          <ButtonOutlineTertiary @click="clients.length && exportAllClientBrokerageToCSV()" v-if="clients.length > 0"
            :disabled="exportLoading">
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
              @change="getClientBrokerage">
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
              @change="getClientBrokerage">
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
            </select>
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
              @change="getClientBrokerage">
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
                  <th @click="sortBy('CLIENT_ID')" class="sortable position-relative text-center">
                    Client ID
                    <SortIcon field="CLIENT_ID" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('BRANCH_CODE_NEW')" class="sortable position-relative text-center">
                    Branch Code
                    <SortIcon field="BRANCH_CODE_NEW" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('CHARGE_IBT')" class="sortable position-relative text-center">
                    IBT Brokerage
                    <SortIcon field="CHARGE_IBT" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('BROKERAGE')" class="sortable position-relative text-center">
                    T Pro Brokerage
                    <SortIcon field="BROKERAGE" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('month')" class="sortable position-relative text-center">
                    Month
                    <SortIcon field="month" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('year')" class="sortable position-relative text-center">
                    Year
                    <SortIcon field="year" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(client, index) in clients" :key="index">
                  <td>{{ client.CLIENT_ID }}</td>
                  <td>{{ client.BRANCH_CODE_NEW }}</td>
                  <td>{{ parseFloat(client.CHARGE_IBT).toFixed(2) }}</td>
                  <td>{{ client.BROKERAGE }}</td>
                  <td>{{ client.month || 'N/A' }}</td>
                  <td>{{ client.year }}</td>
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
  <ClientsBreakdown :client-code="breakdownModalData.clientCode" :month="breakdownModalData.month"
    :year="breakdownModalData.year" />
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import Pagination from '../../../components/Pagination.vue';
import { format, addMinutes } from 'date-fns';
import { useAuthStore } from '@/stores/authStore';
import { tableService } from '../../../services/account/table.service';
import ButtonOutlineTertiary from '../../../components/button/ButtonOutlineTertiary.vue';
import TableNoData from '../../../components/TableNoDataFound.vue';
import { showErrorToast, showSuccessToast } from '../../../js/toast';
import ClientsBreakdown from './ClientsBreakdown.vue';
import { Modal } from 'bootstrap';
import Loading from '../../../components/Loading.vue';
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
const errorMsg = ref('');
const totalClients = ref(0);
const loading = ref(false);
const exportLoading = ref(false);
const entriesPerPage = ref(10);

const sortField = ref('');
const sortDirection = ref('');
const originalClients = ref([]);


const role = ref(localStorage.getItem('role'));

const breakdownModalData = ref({
  clientCode: '',
  month: '',
  year: '',
});

onMounted(() => {
  adminDetails.value = authStore.adminDetails;
  getClientBrokerage();
});

watch(currentPage, (newVal) => {
  getClientBrokerage();
});

function formatDate(dateString) {
  if (!dateString) return null;
  const date = addMinutes(new Date(dateString), 5);
  return format(date, "dd-MM-yyyy");
}

const getClientBrokerage = async () => {
  loading.value = true;
  const params = {
    remCode: adminDetails.value.RemCode,
    page: currentPage.value,
    month: monthfilter.value,
    year: yearfilter.value,
    size: entriesPerPage.value
  };
  try {
    const response = await tableService.getClientWiseBrokerage(params);
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

const exportAllClientBrokerageToCSV = async () => {
  exportLoading.value = true;
  try {
    const params = {
      remCode: adminDetails.value.RemCode,
      page: 1,
      month: monthfilter.value,
      year: yearfilter.value,
      size: totalClients.value,
    };
    const response = await tableService.getClientWiseBrokerage(params);
    if (response.data?.isSuccess && response.data.data.result.length > 0) {
      const allClients = response.data.data.result;

      const headers = ["Client ID", "Branch Code", "T Pro Brokerage", "IBT Brokerage", "Month", "Year"];

      const rows = allClients.map(client => [
        client.CLIENT_ID || '-',
        client.BRANCH_CODE_NEW || '-',
        parseFloat(client.CHARGE_IBT || 0).toFixed(2),
        client.BROKERAGE || '-',
        client.month || '-',
        client.year || '-',
      ]);

      let csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "Client-wise Brokerage - All Data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSuccessToast("All Client-wise Brokerage Exported Successfully");
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
    clientCode: client.CLIENT_ID,
    month: client.month,
    year: client.year,
  };

  nextTick(() => {
    const modalEl = document.getElementById('ClientsBreakdown');
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
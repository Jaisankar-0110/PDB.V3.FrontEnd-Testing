<template>
  <div class="d-flex justify-content-between align-items-center mb-2">
    <div>
      <p class="text-quaternary-color fs16 fw500 ps-2">Ledger</p>
    </div>
    <div>
      <div class="d-flex justify-content-end">
        <button v-if="role !== 'ADMIN'" class="btn btn-primary px-4 me-md-3 me-2"
          @click="clients.length && exportAllLedgerDataToCSV()" :disabled="exportLoading">
          Export</button>
        <button class="btn btn-light border text-primary-color px-4 me-md-3 me-0" @click="reset()">
          Reset <i class="bi bi-arrow-clockwise"></i></button>
      </div>
    </div>
  </div>
  <div class="row mb-4 pt-3">
    <!-- <div class="col-xl-4 col-md-6 col-12 mb-md-2 mb-3">
      <div class="position-relative search-field-container">
        <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ps-3 text-muted"></i>
        <input type="text" class="form-control search-input ps-5 rounded-pill fs14" placeholder="Search" />
      </div>
    </div> -->
    <div class="col-md-6 col-12">
      <div class="d-flex justify-content-start">
        <div class="d-flex mb-3">
          <select v-model="fromYear" @change="getLedgerTransactionDetails"
            class="text-quaternary-color fs14 py-2 form-select me-3">
            <option value="" disabled>Select From</option>
            <option v-for="year in years" :key="'from-' + year" :value="year">{{ year }} </option>
          </select>
        </div>
        <div class="d-flex mb-3">
          <select v-model="toYear" @change="getLedgerTransactionDetails"
            class="text-quaternary-color fs14 py-2 form-select me-3">
            <option value="" disabled>Select To</option>
            <option v-for="year in filteredToYears" :key="'to-' + year" :value="year"> {{ year }} </option>
          </select>
        </div>
      </div>
    </div>
    <!-- <div class="col-md-6 text-end">
      <div class="text-quaternary-color mt-2 fs14 fw500 pe-md-3">Total Ledgers : {{ totalClients }}</div>
    </div> -->

  </div>

  <div class="row mt-3 mb-3">
    <div class="col-md-6 col-12">
      <div class="text-quaternary-color fs14 fw500 mt-2">Total Clients: {{ totalClients }}</div>
    </div>
    <div class="col-md-6 col-12 text-end">
      <div class="d-flex align-items-center justify-content-end">
        <span class="text-secondary-color fs14 fw500 px-2">Entries Per Page</span>
        <select class="text-secondary-color fs14 w-auto fw500 form-select" v-model="entriesPerPage"
          @change="getLedgerTransactionDetails">
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
              <th @click="sortBy('AccountCode')" class="sortable position-relative text-center">
                Account Code
                <SortIcon field="AccountCode" :current="sortField" :direction="sortDirection" />
              </th>
              <th @click="sortBy('VoucherDate')" class="sortable position-relative text-center">
                Voucher Date
                <SortIcon field="VoucherDate" :current="sortField" :direction="sortDirection" />
              </th>
              <th @click="sortBy('BillDate')" class="sortable position-relative text-center">
                Bill Date
                <SortIcon field="BillDate" :current="sortField" :direction="sortDirection" />
              </th>
              <th @click="sortBy('BillNo')" class="sortable position-relative text-center">
                Bill No.
                <SortIcon field="BillNo" :current="sortField" :direction="sortDirection" />
              </th>
              <th @click="sortBy('COCD')" class="sortable position-relative text-center">
                COCD
                <SortIcon field="COCD" :current="sortField" :direction="sortDirection" />
              </th>
              <th @click="sortBy('Settlement_No')" class="sortable position-relative text-center">
                Settlement No.
                <SortIcon field="Settlement_No" :current="sortField" :direction="sortDirection" />
              </th>
              <th @click="sortBy('Narration')" class="sortable position-relative text-center">
                Narration
                <SortIcon field="Narration" :current="sortField" :direction="sortDirection" />
              </th>
              <th @click="sortBy('VoucherNo')" class="sortable position-relative text-center">
                Voucher No.
                <SortIcon field="VoucherNo" :current="sortField" :direction="sortDirection" />
              </th>
              <th @click="sortBy('ChqNo')" class="sortable position-relative text-center">
                Cheque No.
                <SortIcon field="ChqNo" :current="sortField" :direction="sortDirection" />
              </th>
              <th @click="sortBy('Dr_Amt')" class="sortable position-relative text-center">
                Debit
                <SortIcon field="Dr_Amt" :current="sortField" :direction="sortDirection" />
              </th>
              <th @click="sortBy('CR_Amt')" class="sortable position-relative text-center">
                Credit
                <SortIcon field="CR_Amt" :current="sortField" :direction="sortDirection" />
              </th>
              <th @click="sortBy('FINSTYR')" class="sortable position-relative text-center">
                Financial Year
                <SortIcon field="FINSTYR" :current="sortField" :direction="sortDirection" />
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) in clients" :key="index">
              <td>{{ item.AccountCode || '-' }}</td>
              <td>{{ formatDate(item.VoucherDate) || '-' }}</td>
              <td>{{ formatDate(item.BillDate) || '-' }}</td>
              <td>{{ item.BillNo || '-' }}</td>
              <td>{{ item.COCD || '-' }}</td>
              <td>{{ item.Settlement_No || '-' }}</td>
              <td class="narration">{{ item.Narration || '-' }}</td>
              <td>{{ item.VoucherNo || '-' }}</td>
              <td>{{ item.ChqNo || '-' }}</td>
              <td>{{ item.Dr_Amt || '-' }}</td>
              <td>{{ item.CR_Amt || '-' }}</td>
              <td>{{ item.FINSTYR && item.FINENDYR ? item.FINSTYR + '-' + item.FINENDYR : '-' }}</td>
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


</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import ButtonOutlineTertiary from '../../../components/button/ButtonOutlineTertiary.vue';
import Pagination from '../../../components/Pagination.vue';
import ButtonTertiary from '../../../components/button/ButtonTertiary.vue';
import { useAuthStore } from '@/stores/authStore';
import TableNoData from '../../../components/TableNoDataFound.vue';
import { format, addMinutes } from 'date-fns';
import { tableService } from '../../../services/account/table.service';
import { showErrorToast } from '../../../js/toast';
import Loading from '../../../components/Loading.vue';
import SortIcon from '../../../components/SortIcon.vue';

const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020]
const authStore = useAuthStore();
const adminDetails = ref({});

// const currentDate = new Date();
// const currentYear = currentDate.getFullYear();
// const fromYear = ref(String(currentYear) - 1);
// const toYear = ref(String(currentYear));

const fromYear = ref('2025');
const toYear = ref('2026');
const exportLoading = ref(false);
const errorMsg = ref('');
const totalPages = ref(1)
const currentPage = ref(1)
const clients = ref([]);
const totalClients = ref(0);
const loading = ref(false);
const entriesPerPage = ref(10);
const role = ref(localStorage.getItem('role'));

const sortField = ref('');
const sortDirection = ref('');
const originalClients = ref([]);


const filteredToYears = computed(() => {
  if (!fromYear.value) return []
  return years.filter((year) => year > parseInt(fromYear.value))
})

watch(fromYear, (newVal) => {
  if (toYear.value && parseInt(toYear.value) <= parseInt(newVal)) {
    toYear.value = ''
  }
})

function formatDate(dateString) {
  if (!dateString) return null;
  const date = addMinutes(new Date(dateString), 5);
  return format(date, "dd-MM-yyyy");
}

const reset = () => {
  fromYear.value = currentYear - 1;
  toYear.value = currentYear;
  getLedgerTransactionDetails();
}

onMounted(() => {
  adminDetails.value = authStore.adminDetails;
  getLedgerTransactionDetails();
});

watch(currentPage, (newVal) => {
  getLedgerTransactionDetails();
});

const getLedgerTransactionDetails = async () => {
  loading.value = true;
  const params = {
    rem_code: adminDetails.value.RemCode,
    from_yr: fromYear.value,
    to_yr: toYear.value,
    page: currentPage.value,
    size: entriesPerPage.value
  };
  console.log('Calling API with params:', params);
  try {
    const response = await tableService.getLedgerTransaction(params);
    if (response.data?.isSuccess) {
      totalPages.value = response.data?.data.noOfPages || 1;
      clients.value = response.data?.data.result || [];
      originalClients.value = [...clients.value];
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

const exportAllLedgerDataToCSV = async () => {
  exportLoading.value = true;
  try {
    const params = {
      rem_code: adminDetails.value.RemCode,
      from_yr: fromYear.value,
      to_yr: toYear.value,
      page: 1,
      size: totalClients.value
    };
    const response = await tableService.getLedgerTransaction(params);
    if (response.data?.isSuccess && Array.isArray(response.data.data.result) && response.data.data.result.length > 0) {
      const allClients = response.data.data.result;

      const headers = ["Account Code", "Voucher Date", "Bill Date", "Bill No.", "COCD", "Settlement No.", "Narration", "Voucher No.", "Cheque No.", "Debit", "Credit", "Financial Year"];

      const rows = allClients.map(client => [
        client.AccountCode || '-',
        formatDate(client.VoucherDate) || '-',
        formatDate(client.BillDate) || '-',
        client.BillNo || '-',
        client.COCD || '-',
        client.Settlement_No || '-',
        client.Narration || '-',
        client.VoucherNo || '-',
        client.ChqNo || '-',
        client.Dr_Amt || '-',
        client.CR_Amt || '-',
        client.FINSTYR && client.FINENDYR ? client.FINSTYR + '-' + client.FINENDYR : '-'
      ]);

      let csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "Ledger-All.csv");

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
.form-select {
  line-height: 1.5 !important;
}

.table {
  width: 1800px !important;
}

// .narration {
//   width: 300px !important;
// }
</style>
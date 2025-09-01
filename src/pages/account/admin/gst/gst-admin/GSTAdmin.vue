<template>
  <div class="card-0 p-2">
    <div class="card-header pb-3 px-0 bg-transparent">
      <div class="d-flex justify-content-between align-items-center">
        <div class="text-quaternary-color fs18 pb-2 fw500">GST Admin</div>
        <div class="d-flex align-items-center">
          <ButtonOutlineTertiary @click="clients.length && exportAllGSTAdminToCSV()" :disabled="exportLoading"
            v-if="clients.length > 0">
            <span class="px-1">
              Export <b class="bi bi-download ps-2 fs16"></b>
            </span>
          </ButtonOutlineTertiary>
        </div>
      </div>
    </div>
    <div class="card-body pt-4  px-0">
      <div class="row pb-2">
        <div class="col-md-6">
          <div class="d-flex align-items-center gap-3 mb-2">
            <div class="d-inline-block">
              <select class="text-secondary-color fs14 fw500 form-select py-2" v-model="filter_type"
                @change="onFilterTypeChange">
                <option value="" selected>Select</option>
                <option value="RemeshireCode">Remeshire Code</option>
                <option value="MonthYear">Month Year</option>
                <option value="AdminStatus">Admin Status</option>
              </select>
            </div>
            <div v-if="filter_type !== 'AdminStatus'">
              <input type="text" class="form-control fs14 py-2" placeholder="Search" v-model="filter"
                @input="getGSTClients">
            </div>
            <div v-if="filter_type === 'AdminStatus'" class="">
              <select class="text-secondary-color fs14 fw500 form-select py-2" v-model="filter" @change="getGSTClients">
                <option value="">All</option>
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
                <option value="PENDING">PENDING</option>
                <option value="RE-INITIATED">RE-INITIATED</option>
              </select>
            </div>
          </div>
        </div>
        <!-- <div class="col-md-6 text-end">
          <div class="text-quaternary-color fs14 fw500 mt-2 mb-2">Total Clients: {{ totalClients }}</div>
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
              @change="getGSTClients">
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
    <th @click="sortBy('ID')" class="sortable position-relative text-center">
      ID
      <SortIcon field="ID" :current="sortField" :direction="sortDirection" />
    </th>

    <th @click="sortBy('RemeshireCode')" class="sortable position-relative text-center">
      Remeshire Code
      <SortIcon field="RemeshireCode" :current="sortField" :direction="sortDirection" />
    </th>

    <th @click="sortBy('MonthYear')" class="sortable position-relative text-center">
      Month Year
      <SortIcon field="MonthYear" :current="sortField" :direction="sortDirection" />
    </th>

    <th @click="sortBy('TotalAMount')" class="sortable position-relative text-center">
      Total Amount
      <SortIcon field="TotalAMount" :current="sortField" :direction="sortDirection" />
    </th>

    <th @click="sortBy('GSTNumber')" class="sortable position-relative text-center">
      GST Number
      <SortIcon field="GSTNumber" :current="sortField" :direction="sortDirection" />
    </th>

    <th>GST File</th>

    <th @click="sortBy('Status')" class="sortable position-relative text-center">
      Upload Status
      <SortIcon field="Status" :current="sortField" :direction="sortDirection" />
    </th>

    <th @click="sortBy('AdminStatus')" class="sortable position-relative text-center">
      Admin Status
      <SortIcon field="AdminStatus" :current="sortField" :direction="sortDirection" />
    </th>

    <th @click="sortBy('AdminRemark')" class="sortable position-relative text-center">
      Admin Remark
      <SortIcon field="AdminRemark" :current="sortField" :direction="sortDirection" />
    </th>

    <th v-if="action">Action</th>
  </tr>
</thead>

              <tbody>
                <tr v-for="(client, index) in clients" :key="index">
                  <td>{{ client.ID || '-' }}</td>
                  <td>{{ client.RemeshireCode || '-' }}</td>
                  <td>{{ client.MonthYear || '-' }}</td>
                  <!-- <td>{{ client.Amount || '-' }}</td> -->
                  <td>{{ client.TotalAMount || '-' }}</td>
                  <!-- <td>{{ client.GSTAmount || '-' }}</td> -->
                  <td>{{ client.GSTNumber || '-' }}</td>
                  <td>
                    <div v-if="client.GSTFile" @click="viewDocument(client.GSTFile)"
                      class="d-inline alert alert-info cursor-pointer" role="alert">
                      <i class="bi bi-eye-fill"></i> View
                    </div>
                    <div v-else class="text-muted">-</div>
                  </td>
                  <!-- <td>{{ formatDate(client.UploadedDT) || '-' }}</td> -->
                  <!-- <td>{{ client.InvoiceNumber || '-' }}</td> -->
                  <!-- <td>{{ formatDate(client.Invoicedate) || '-' }}</td> -->
                  <td>{{ client.Status || '-' }}</td>
                  <td>{{ client.AdminStatus || '-' }}</td>
                  <td>
                    <span v-if="client.AdminRemark && client.AdminRemark.length > 16">
                      {{ client.AdminRemark.slice(0, 16) + '..' }}
                      <i class="bi bi-eye-fill text-primary cursor-pointer ms-2" data-bs-toggle="modal"
                        data-bs-target="#remarks" title="View full remark" @click="viewRemarks(client.AdminRemark)"></i>
                    </span>
                    <span v-else>{{ client.AdminRemark || '-' }}</span>
                  </td>

                  <!-- <td>{{ formatDate(client.AdminStatusDT) || '-' }}</td> -->
                  <td v-if="action">
                    <div @click="openModal(client)" class="d-inline fs13 alert custom-alert cursor-pointer"
                      role="alert">
                      Update
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

  <UpdateGST :gstDetails="gstDetails" @update-gst-details="getGSTClients" />
  <Remarks :remarks="remarks" />
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import Pagination from '../../../../../components/Pagination.vue';
import { format, addMinutes } from 'date-fns';
import { useAuthStore } from '@/stores/authStore';
import { tableService } from '../../../../../services/account/table.service';
import ButtonOutlineTertiary from '../../../../../components/button/ButtonOutlineTertiary.vue';
import TableNoData from '../../../../../components/TableNoDataFound.vue';
import { showErrorToast } from '../../../../../js/toast';
import { Modal } from 'bootstrap';
import UpdateGST from './modal/UpdateGST.vue';
import Loading from '../../../../../components/Loading.vue';
import Remarks from './modal/Remarks.vue';
import SortIcon from '../../../../../components/SortIcon.vue';

const currentPage = ref(1);
const totalPages = ref(1);
const gstDetails = ref({});
const loading = ref(false);
const filter_type = ref('MonthYear');
const filter = ref('');
const action = ref(false);
const client = ref({});

const sortField = ref('');
const sortDirection = ref('');
const originalClients = ref([]);


const exportLoading = ref(false);
const today = new Date();
const previousMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
const formattedMonthYear = computed(() => {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const month = monthNames[previousMonthDate.getMonth()]
  const year = previousMonthDate.getFullYear()
  return `${month.toUpperCase()}-${year}`
})

const currentDocumentSrc = ref('');

const clients = ref([]);
const remarks = ref('');

const authStore = useAuthStore();
const adminDetails = ref({});
const errorMsg = ref('');
const entriesPerPage = ref(10);
const totalClients = ref(0);

onMounted(() => {
  adminDetails.value = authStore.adminDetails;

  if (filter_type.value === 'MonthYear') {
    filter.value = formattedMonthYear.value;
  } else {
    filter.value = '';
  }

  getGSTClients();
});

watch(currentPage, (newVal) => {
  getGSTClients();
});

const onFilterTypeChange = () => {
  if (filter_type.value === 'MonthYear') {
    filter.value = formattedMonthYear.value;
  } else {
    filter.value = '';
  }

  getGSTClients();
};

function formatDate(dateString) {
  if (!dateString) return null;
  const date = addMinutes(new Date(dateString), 5);
  return format(date, "dd-MM-yyyy");
}

const getGSTClients = async () => {
  const params = {
    branch: "",
    from_date: "",
    to_date: "",
    page: currentPage.value,
    filter_type: filter_type.value,
    filter: filter.value.toUpperCase() || '',
    size: entriesPerPage.value,
  };
  try {
    const response = await tableService.getGSTAdmin(params);
    if (response.data?.isSuccess) {
      clients.value = response.data?.data.result || [];
      originalClients.value = [...clients.value];
      totalPages.value = response.data?.data.noOfPages || 1;
      totalClients.value = response.data?.data.count;
      action.value = response.data?.data.action || false;
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

const exportAllGSTAdminToCSV = async () => {
  exportLoading.value = true;
  try {
    const params = {
      branch: "",
      from_date: "",
      to_date: "",
      page: 1,
      filter_type: filter_type.value,
      filter: filter.value.toUpperCase() || '',
      size: 100000, // Large enough to fetch all records
    };

    const response = await tableService.getGSTAdmin(params);

    if (response.data?.isSuccess && Array.isArray(response.data.data.result) && response.data.data.result.length > 0) {
      const allRecords = response.data.data.result;

      const headers = ["Remeshire Code", "Month Year", "Amount", "Total Amount", "GST Amount", "GST Number", "Uploaded Date", "Invoice Number", "Invoice Date", "Upload Status", "Admin Status", "Admin Remark", "Admin Status Date"];

      const rows = allRecords.map(client => [
        client.RemeshireCode || '-',
        client.MonthYear || '-',
        client.Amount || '-',
        client.TotalAMount || '-',
        client.GSTAmount || '-',
        client.GSTNumber || '-',
        formatDate(client.UploadedDT) || '-',
        client.InvoiceNumber || '-',
        formatDate(client.Invoicedate) || '-',
        client.Status || '-',
        client.AdminStatus || '-',
        client.AdminRemark || '-',
        formatDate(client.AdminStatusDT) || '-',
      ]);

      let csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "GST_Admin_All.csv");

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      showErrorToast("No data available to export.");
    }
  } catch (err) {
    console.error(err);
    showErrorToast("Error while exporting data.");
  } finally {
    exportLoading.value = false;
  }
};


const openModal = (client) => {
  gstDetails.value = {
    remCode: client.RemeshireCode,
    status: client.AdminStatus,
    remark: client.AdminRemark,
    monthyear: client.MonthYear,
  };
  nextTick(() => {
    const proofModal = new Modal(document.getElementById('updateGST'));
    proofModal.show();
  });
};

const viewDocument = (documentSrc) => {
  if (!documentSrc.startsWith('data:application/pdf;base64,')) {
    documentSrc = `data:application/pdf;base64,${documentSrc}`;
  }
  currentDocumentSrc.value = documentSrc;
  const base64PDF = currentDocumentSrc.value;
  const base64String = base64PDF.split(',')[1];
  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' });
  const blobURL = URL.createObjectURL(blob);

  window.open(blobURL, '_blank');

};

const viewRemarks = (remark) => {
  remarks.value = remark;
  nextTick(() => {
    const remarkModal = new Modal(document.getElementById('remarksModal'));
    remarkModal.show();
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

/*
.table {
  width: 1800px !important;
} */

.custom-alert {
  padding: 4px 10px;
  background-color: var(--tertiary) !important;
  color: var(--light) !important;
}

.alert {
  padding: 4px 10px;
}

.form-control,
.form-select {
  height: 40PX !important;
}
</style>
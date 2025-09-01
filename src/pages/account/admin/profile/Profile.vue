<template>
  <div class="card-0 p-2">
    <div class="card-header pb-3 px-0 bg-transparent">
      <div class="d-flex justify-content-between align-items-center">
        <div class="text-quaternary-color fs18 pb-2 fw500">Manage Profile</div>
        <!-- <div class="d-flex align-items-center">
          <ButtonOutlineTertiary @click="clients.length && exportToCSV()" :disabled="!clients.length"
            v-if="clients.length > 0">
            <span class="px-1">
              Export <b class="bi bi-download ps-2 fs16"></b>
            </span>
          </ButtonOutlineTertiary>
        </div> -->
      </div>
    </div>
    <div class="card-body pt-4  px-0">
      <div class="row pb-2">
        <div class="col-md-6">
          <div class="d-flex align-items-center gap-3 mb-2">
            <div class="d-inline-block">
              <select class="text-secondary-color fs14 fw500 form-select py-2" v-model="filter_type"
                @change="getProfileModClients">
                <option value="" selected>Select</option>
                <option value="RemeshireCode">Remeshire Code</option>
                <option value="AdminStatus">Admin Status</option>
              </select>
            </div>
            <div>
              <input type="text" class="form-control fs14 py-2" placeholder="Search" v-model="filter"
                @input="getProfileModClients">
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
              @change="getProfileModClients">
              <option value="10">10</option>
              <option value="20">10</option>
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
                  <th @click="sortBy('RemeshireCode')" class="sortable position-relative text-center">
                    Remeshire Code
                    <SortIcon field="RemeshireCode" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('RequestType')" class="sortable position-relative text-center">
                    Request Type
                    <SortIcon field="RequestType" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('OldValue')" class="sortable position-relative text-center">
                    Current Details
                    <SortIcon field="OldValue" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('NewValue')" class="sortable position-relative text-center">
                    Requested Details
                    <SortIcon field="NewValue" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('DataProof')" class="sortable position-relative text-center">
                    Document
                    <SortIcon field="DataProof" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('AdminStatus')" class="sortable position-relative text-center">
                    Admin Status
                    <SortIcon field="AdminStatus" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('RequestDate')" class="sortable position-relative text-center">
                    Requested Date
                    <SortIcon field="RequestDate" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('AdminStatusUpdatedOn')" class="sortable position-relative text-center">
                    Status Updated (Admin)
                    <SortIcon field="AdminStatusUpdatedOn" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th v-if="action">Action</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(client, index) in clients" :key="index">
                  <!-- <td>{{ client.Id || '-' }}</td> -->
                  <td>{{ client.RemeshireCode || '-' }}</td>
                  <td> {{ client.RequestType || '-' }}</td>
                  <td>
                    <span v-if="client.OldValue && client.OldValue.length > 16">
                      {{ client.OldValue.slice(0, 16) + '..' }}
                      <i class="bi bi-eye-fill text-primary cursor-pointer ms-2"
                        @click="viewDetails(client.OldValue, 'Current Details', client.RequestType)"
                        title="View full value"></i>
                    </span>
                    <span v-else>{{ client.OldValue || '-' }}</span>
                  </td>

                  <td>
                    <span v-if="client.NewValue && client.NewValue.length > 16">
                      {{ client.NewValue.slice(0, 16) + '..' }}
                      <i class="bi bi-eye-fill text-primary cursor-pointer ms-2"
                        @click="viewDetails(client.NewValue, 'Requested Details', client.RequestType)"
                        title="View full value"></i>
                    </span>
                    <span v-else>{{ client.NewValue || '-' }}</span>
                  </td>
                  <!-- <td>{{ client.NewValue || '-' }}</td> -->
                  <td>
                    <div v-if="client.DataProof === 'PENNYDROP VERIFIED'">
                      <span class="fs14">{{ client.DataProof }}</span>
                    </div>
                    <div v-if="client.DataProof !== 'PENNYDROP VERIFIED' && client.DataProof"
                      @click="viewDocument(client.DataProof)" class="d-inline alert alert-info cursor-pointer"
                      role="alert">
                      <i class="bi bi-eye-fill"></i> View
                    </div>
                    <div v-else class="text-muted">-</div>
                  </td>
                  <!-- <td>{{ client.Status || '-' }}</td> -->
                  <td>{{ client.AdminStatus || '-' }}</td>
                  <td>{{ formatDate(client.RequestDate) || '-' }}</td>
                  <td>{{ formatDate(client.AdminStatusUpdatedOn) || '-' }}</td>
                  <!-- <td>{{ client.GSTNumber || '-' }}</td> -->
                  <!-- <td>{{ formatDate(client.RequestDate) || '-' }}</td> -->


                  <!-- <td>{{ formatDate(client.UploadedDT) || '-' }}</td> -->
                  <!-- <td>{{ client.InvoiceNumber || '-' }}</td> -->
                  <!-- <td>{{ formatDate(client.Invoicedate) || '-' }}</td> -->
                  <!-- <td>{{ client.AdminStatus || '-' }}</td> -->
                  <!-- <td>{{ client.AdminRemark || '-' }}</td> -->

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

  <UpdateProfile :gstDetails="gstDetails" @update-profile-details="getProfileModClients" />
  <ViewDetails :partner="partner" />
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { tableService } from '../../../../services/account/table.service';
import ButtonOutlineTertiary from '../../../../components/button/ButtonOutlineTertiary.vue';
import Pagination from '../../../../components/Pagination.vue';
import { format, addMinutes } from 'date-fns';
import { useAuthStore } from '@/stores/authStore';
import UpdateProfile from './modal/UpdateProfile.vue';
// import { showErrorToast } from '../../../utils/toast';
// import TableNoData from '../../../components/TableNoData.vue';
import { Modal } from 'bootstrap';
import Loading from '../../../../components/Loading.vue';
import ViewDetails from './components/ViewDetails.vue';
import SortIcon from '../../../../components/SortIcon.vue';

const currentPage = ref(1);
const totalPages = ref(1);
const gstDetails = ref({});
const loading = ref(false);
const filter_type = ref('');
const filter = ref('');
const action = ref(false);
const entriesPerPage = ref(10);
const currentDocumentSrc = ref('');

const clients = ref([]);

const authStore = useAuthStore();
const adminDetails = ref({});
const errorMsg = ref('');

const totalClients = ref(0);

const partner = ref({});
const sortField = ref('');
const sortDirection = ref('');
const originalClients = ref([]);


const viewDetails = (value, title, requestType) => {
  partner.value = {
    title: title,
    value: value,
    RequestType: requestType,
  };
  nextTick(() => {
    const oldValueModal = new Modal(document.getElementById('viewModal'));
    oldValueModal.show();
  });
};


onMounted(() => {
  adminDetails.value = authStore.adminDetails;
  getProfileModClients();
});

watch(currentPage, (newVal) => {
  getProfileModClients();
});

function formatDate(dateString) {
  if (!dateString) return null;
  const date = addMinutes(new Date(dateString), 5);
  return format(date, "dd-MM-yyyy");
}

const getProfileModClients = async () => {
  const params = {
    branch: "",
    from_date: "",
    to_date: "",
    page: currentPage.value,
    filter_type: filter_type.value.trim() || '',
    filter: filter.value.toUpperCase().trim() || '',
    size: entriesPerPage.value
  };
  try {
    const response = await tableService.getProfile(params);
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

const exportToCSV = () => {
  if (!clients.value.length) {
    showErrorToast("No data available to export.");
    return;
  }

  const headers = ["Remeshire Code", "Request Type", "Current Details", "Requested Details", "Admin Status"];

  const rows = clients.value.map(client => [
    client.RemeshireCode || '-',
    client.RequestType || '-',
    client.OldValue || '-',
    client.NewValue || '-',
    client.AdminStatus || '-',

  ]);

  let csvContent = "data:text/csv;charset=utf-8,"
    + [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Profile.csv");

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
};

const openModal = (client) => {
  gstDetails.value = {
    remCode: client.RemeshireCode,
    status: client.AdminStatus,
    remark: client.AdminRemark,
    type: client.RequestType,
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
    width: 100px !important;
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
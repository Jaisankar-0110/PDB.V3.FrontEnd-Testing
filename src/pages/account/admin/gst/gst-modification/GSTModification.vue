<template>
  <div class="card-0 p-2">
    <div class="card-header pb-3 px-0 bg-transparent">
      <div class="d-flex justify-content-between align-items-center">
        <div class="text-quaternary-color fs18 pb-2 fw500">GST Modification</div>
        <div class="d-flex align-items-center">
          <ButtonOutlineTertiary @click="clients.length && exportToCSV()" :disabled="!clients.length"
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

            <div>
              <input type="text" class="form-control fs14 py-2" placeholder="Search" v-model="filter"
                @input="getGSTModification">
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
              @change="getGSTModification">
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
                  <th @click="sortBy('RemeshireCode')" class="sortable position-relative text-center">
                    Remeshire Code
                    <SortIcon field="RemeshireCode" :current="sortField" :direction="sortDirection" />
                  </th>

                  <th @click="sortBy('RequestDate')" class="sortable position-relative text-center">
                    Requested Date
                    <SortIcon field="RequestDate" :current="sortField" :direction="sortDirection" />
                  </th>

                  <th @click="sortBy('OldGSTNumber')" class="sortable position-relative text-center">
                    Old GST Number
                    <SortIcon field="OldGSTNumber" :current="sortField" :direction="sortDirection" />
                  </th>

                  <th @click="sortBy('NewGSTNumber')" class="sortable position-relative text-center">
                    New GST Number
                    <SortIcon field="NewGSTNumber" :current="sortField" :direction="sortDirection" />
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(client, index) in clients" :key="index">
                  <td>{{ client.RemeshireCode || '-' }}</td>
                  <td>{{ formatDate(client.RequestDate) || '-' }}</td>
                  <td>{{ client.OldGSTNumber || '-' }}</td>
                  <td>{{ client.NewGSTNumber || '-' }}</td>

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
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import Pagination from '../../../../../components/Pagination.vue';
import { format, addMinutes } from 'date-fns';
import { useAuthStore } from '@/stores/authStore';
import { tableService } from '../../../../../services/account/table.service';
import ButtonOutlineTertiary from '../../../../../components/button/ButtonOutlineTertiary.vue';
import TableNoData from '../../../../../components/TableNoDataFound.vue';
import { showErrorToast } from '../../../../../js/toast';
import SortIcon from '../../../../../components/SortIcon.vue';
import Loading from '../../../../../components/Loading.vue';

const currentPage = ref(1);
const totalPages = ref(1);
const loading = ref(false);
const filter = ref('');
const clients = ref([]);

const authStore = useAuthStore();
const adminDetails = ref({});
const errorMsg = ref('');
const totalClients = ref(0);
const entriesPerPage = ref(10);
const sortField = ref('');
const sortDirection = ref('');
const originalClients = ref([]);


onMounted(() => {
  adminDetails.value = authStore.adminDetails;
  getGSTModification();
});

watch(currentPage, (newVal) => {
  getGSTModification();
});


function formatDate(dateString) {
  if (!dateString) return null;
  const date = addMinutes(new Date(dateString), 5);
  return format(date, "dd-MM-yyyy");
}

const getGSTModification = async () => {
  const params = {
    page: currentPage.value,
    filter_type: 'RemeshireCode',
    filter: filter.value,
    fetchAll: true,
    size: entriesPerPage.value,
  };
  try {
    const response = await tableService.getGSTModification(params);
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
};

const exportToCSV = async () => {
  try {
    const allClients = [];
    let page = 1;
    let totalPages = 1;

    do {
      const params = {
        page,
        filter_type: 'RemeshireCode',
        filter: filter.value
      };

      const response = await tableService.getGSTModification(params);

      if (response.data?.isSuccess) {
        const data = response.data.data;
        allClients.push(...(data.result || []));
        totalPages = data.noOfPages || 1;
      } else {
        break;
      }

      page++;
    } while (page <= totalPages);

    if (!allClients.length) {
      showErrorToast("No data available to export.");
      return;
    }

    const headers = ["Remeshire Code", "Requested Date", "Old GST Number", "New GST Number"];
    const rows = allClients.map(client => [
      client.RemeshireCode || '-',
      formatDate(client.RequestDate) || '-',
      client.OldGSTNumber || '-',
      client.NewGSTNumber || '-',
    ]);

    let csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "GST_Modification.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("Export failed", err);
    showErrorToast("Export failed. Try again later.");
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
    width: 160px !important;
  }
}

@media(max-width:767px) {
  .no-data {
    width: 100px !important;
  }
}

@media(max-width:1400px) {
  .table {
    width: 1100px !important;
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
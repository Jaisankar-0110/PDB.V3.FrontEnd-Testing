<template>
  <div class="px-2 pb-3 fs14 d-flex align-items-end">
    <RouterLink to="/dashboard" class="text-tertiary-color text-decoration-none"> <i
        class=" bi bi-house-fill fs16 pe-1"></i>
      Dashboard</RouterLink>
    <span class="px-2">/</span>
    <div class="text-muted">My Partner Referral</div>
  </div>
  <div class="card">
    <div class="card-header py-3 bg-transparent">
      <div class="d-flex justify-content-between align-items-center">
        <div class="text-quaternary-color fs16 fw500">My Partner Referral</div>
        <div class="d-flex align-items-center" v-if="role !== 'ADMIN'">
          <ButtonOutlineTertiary @click="clients.length && exportAllPartnerReferralToCSV()" v-if="clients.length > 0"
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

        <div class="   text-end">
          <div class="text-quaternary-color fs14 fw500">Total Clients: {{ totalClients }}</div>
        </div>
      </div>
      <div v-if="!loading">
        <div v-if="clients.length > 0">
          <div class="table-responsive pt-1">
            <table class="table" style="width:auto">
              <thead>
                <tr>
                  <th @click="sortBy('leadname')" class="sortable position-relative text-center">
                    Lead Name
                    <SortIcon field="leadname" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('leademail')" class="sortable position-relative text-center">
                    Lead Email
                    <SortIcon field="leademail" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('leadadmin')" class="sortable position-relative text-center">
                    Branch Code
                    <SortIcon field="leadadmin" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('leadmobile')" class="sortable position-relative text-center">
                    Lead Mobile
                    <SortIcon field="leadmobile" :current="sortField" :direction="sortDirection" />
                  </th>
                  <th @click="sortBy('leadstatus')" class="sortable position-relative text-center">
                    Lead Status
                    <SortIcon field="leadstatus" :current="sortField" :direction="sortDirection" />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(client, index) in clients" :key="index">
                  <td>{{ client.leadname || '-' }}</td>
                  <td>{{ client.leademail || '-' }}</td>
                  <td>{{ client.leadadmin || '-' }}</td>
                  <td>{{ client.leadmobile || '-' }}</td>
                  <td>{{ client.leadstatus || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- <Pagination v-model="currentPage" :total-pages="totalPages" /> -->
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
const exportLoading = ref(false);
const role = ref(localStorage.getItem('role'));

const sortField = ref('');
const sortDirection = ref('');
const originalClients = ref([]);


onMounted(() => {
  adminDetails.value = authStore.adminDetails;
  getMyPartnerReferralPage();
});

watch(currentPage, (newVal) => {
  getMyPartnerReferralPage();
});

function formatDate(dateString) {
  if (!dateString) return null;
  const date = addMinutes(new Date(dateString), 5);
  return format(date, "dd-MM-yyyy hh:mm a");
}

const getMyPartnerReferralPage = async () => {
  loading.value = true;
  const params = {
    remCode: adminDetails.value.RemCode,

  };
  try {
    const response = await tableService.getMyPartnerReferral(params);
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
  } finally {
    loading.value = false;
  }
};

const exportAllPartnerReferralToCSV = async () => {
  exportLoading.value = true;
  try {
    const params = {
      remCode: adminDetails.value.RemCode,
      page: 1,
      size: totalClients.value
    };
    const response = await tableService.getMyPartnerReferral(params);
    if (response.data?.isSuccess && Array.isArray(response.data.data.result) && response.data.data.result.length > 0) {
      const allClients = response.data.data.result;

      const headers = ["Lead Name", "Lead Email", "Branch Code", "Lead Mobile", "Lead Status"];

      const rows = allClients.map(client => [
        client.leadname || '-',
        client.leademail || '-',
        client.leadadmin || '-',
        client.leadmobile || '-',
        client.leadstatus || '-'
      ]);

      let csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "My_Partner_Referral_All.csv");

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSuccessToast("CSV Exported Successfully");
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

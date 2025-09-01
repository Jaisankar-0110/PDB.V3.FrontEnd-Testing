<template>
    <div class="card">
        <div class="card-header py-3 px-0 bg-transparent">
            <div class="d-flex justify-content-between align-items-center">
                <div class="text-quaternary-color fs18 pb-2 fw500 px-3">GST History</div>
                <div class="d-flex align-items-center">
                    <ButtonOutlineTertiary @click="clients.length && exportAllGSTHistoryToCSV()" :disabled="exportLoading"
                        v-if="clients.length > 0" >
                        <span class="px-1">
                            Export <b class="bi bi-download ps-2 fs16"></b>
                        </span>
                    </ButtonOutlineTertiary>
                </div>
            </div>
        </div>
        <div class="card-body pt-4">
            <!-- <div class="row mb-1 align-middle">

                <div class="text-end">
                    <div class="text-quaternary-color fs14 fw500">Total Records: {{ totalRecords }}</div>
                </div>
            </div> -->

            <div class="row mt-3 mb-3">
        <div class="col-md-6 col-12">
          <div class="text-quaternary-color fs14 fw500 mt-2">Total Clients: {{ totalClients }}</div>
        </div>
        <div class="col-md-6 col-12 text-end">
          <div class="d-flex align-items-center justify-content-end">
            <span class="text-secondary-color fs14 fw500 px-2">Entries Per Page</span>
            <select class="text-secondary-color fs14 w-auto fw500 form-select" v-model="entriesPerPage"
              @change="getGSTHistory">
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
                                    <th>Month Year</th>
                                    <th>Total Amount</th>
                                    <th>GST Amount </th>
                                    <th>Admin Status</th>
                                    <th>Admin Updated Date</th>
                                    <th>GST File</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(client, index) in clients" :key="index">
                                    <td>{{ client.MonthYear || '-' }}</td>
                                    <td>{{ client.TotalAMount || '-' }}</td>
                                    <td>{{ client.GSTAmount || '-' }}</td>
                                    <td>{{ client.AdminStatus || '-' }}</td>
                                    <td>{{ formatDate(client.AdminStatusDT) || '-' }}</td>
                                    <td>
                                        <div v-if="client.GSTFile" @click="viewDocument(client.GSTFile)"
                                            class="d-inline alert alert-info cursor-pointer" role="alert">
                                            <i class="bi bi-eye-fill"></i> View
                                        </div>
                                        <div v-else class="text-muted">-</div>
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
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import Pagination from '../../../../components/Pagination.vue';
import { format, addMinutes } from 'date-fns';
import { useAuthStore } from '@/stores/authStore';
import { tableService } from '../../../../services/account/table.service';
import ButtonOutlineTertiary from '../../../../components/button/ButtonOutlineTertiary.vue';
import TableNoData from '../../../../components/TableNoDataFound.vue';
import { showErrorToast } from '../../../../js/toast';
import { Modal } from 'bootstrap';
import Loading from '../../../../components/Loading.vue';

const currentPage = ref(1);
const totalPages = ref(1);
const gstDetails = ref({});
const loading = ref(false);
const action = ref(false);
const exportLoading = ref(false);
const entriesPerPage = ref(10);
const currentDocumentSrc = ref('');

const clients = ref([]);

const authStore = useAuthStore();
const adminDetails = ref({});
const errorMsg = ref('');

const totalRecords = ref(0);

onMounted(() => {
    adminDetails.value = authStore.adminDetails;
    getGSTHistory();
});

watch(currentPage, (newVal) => {
    getGSTHistory();
});

function formatDate(dateString) {
    if (!dateString) return null;
    const date = addMinutes(new Date(dateString), 5);
    return format(date, "dd-MM-yyyy");
}

const getGSTHistory = async () => {
    const params = {
        rem_code: adminDetails.value.RemCode,
        size: entriesPerPage.value,
    };
    try {
        const response = await tableService.getGSTHistory(params);
        if (response.data?.isSuccess) {
            clients.value = response.data?.data.result || [];
            totalPages.value = response.data?.data.noOfPages || 1;
            totalRecords.value = response.data?.data.count;
            action.value = response.data?.data.action || false;
        } else {
            clients.value = [];
            totalRecords.value = 0;
            errorMsg.message = response.data?.message || 'Something went wrong, please try again later.';
        }
    } catch (err) {
        clients.value = [];
        totalRecords.value = 0;
        console.error(err);
        errorMsg.message = 'Something went wrong, please try again later.';
    }
};

const exportAllGSTHistoryToCSV = async () => {
   exportLoading.value = true;
    try {
        const params = {
            rem_code: adminDetails.value.RemCode,
            size: totalClients.value,
        };
        const response = await tableService.getGSTHistory(params);
        if (response.data?.isSuccess && Array.isArray(response.data.data.result) && response.data.data.result.length > 0) {
            const allRecords = response.data.data.result;

            const headers = ["Remeshire Code", "Month Year", "Total Amount", "GST Amount", "Admin Status", "Admin Updated Date"];

            const rows = allRecords.map(client => [
                client.RemeshireCode || '-',
                client.MonthYear || '-',
                client.TotalAMount || '-',
                client.GSTAmount || '-',
                client.AdminStatus || '-',
                formatDate(client.AdminStatusDT) || '-',
            ]);

            let csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "GST_History_All.csv");

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
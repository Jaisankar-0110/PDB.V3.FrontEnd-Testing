<template>
  <div class="card-0 p-2">
    <div class="card-header pb-3 px-0 bg-transparent">
      <div class="d-flex justify-content-between align-items-center">
        <div class="text-quaternary-color fs18 pb-2 fw500">Manage Banner</div>
        <div @click="openModal" class="cursor-pointer pe-3">
          <p class="text-primary fs14 fw500"> <span><i class="bi bi-plus-lg  text-primary"></i></span> New
            Banner</p>
        </div>
      </div>
    </div>
    <div class="card-body pt-0 px-0">
      <div v-if="!loading">
        <div v-if="banners.length" class="table-responsive ">
          <table class="table" style="width:auto">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Name</th>
                <th>Redirection Link</th>
                <th>Image</th>
                <th>Global</th>
                <th>Remeshire Code</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(banner, index) in banners" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ banner.Name }}</td>
                <td>
                  <a :href="banner.Link" class="text-primary text-decoration-none fs14" target="_blank">
                    <i class="bi fs18 bi-link-45deg"></i> click here
                  </a>
                </td>
                <td>
                  <div v-if="banner.Image" class="d-inline text-primary cursor-pointer"
                    @click="viewDocument(banner.Image)">
                    <i class="bi bi-eye-fill"></i> View
                  </div>
                  <div v-else class="text-secondary">-</div>
                </td>
                <td>{{ banner.IsGlobal ? 'Yes' : 'No' }}</td>
                <td>
                  <div class="d-flex flex-column">
                    <button v-if="banner.RemeshireCode" class="border-0 bg-transparent text-primary cursor-pointer fs14"
                      @click="exportRemeshireRow(banner.RemeshireCode, banner.Id)">
                      <i class="bi bi-eye-fill"></i> View
                    </button>
                    <div v-else class="text-secondary">-</div>
                  </div>
                </td>
                <td>
                  <span :class="banner.IsActive ? 'text-success' : 'text-danger'">
                    <i class="bi bi-circle-fill me-1"></i>
                    {{ banner.IsActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="align-middle">
                  <div class=" form-switch m-0">
                    <input class="form-check-input" @change="updateBannerStatus(banner)" type="checkbox"
                      :id="'checkbox' + index" :checked="banner.IsActive">
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
  <AddBanner @update-details="getNewBanner" />
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { tableService } from '../../../../services/account/table.service';
import { useAuthStore } from '@/stores/authStore';
import { Modal } from 'bootstrap';
import AddBanner from './modal/AddBanner.vue';
import { accountService } from '../../../../services/account/account.service';
import { showSuccessToast, showErrorToast } from '@/js/toast';
import Loading from '../../../../components/Loading.vue';
import TableNoData from '../../../../components/TableNoDataFound.vue';

const currentPage = ref(1);
const loading = ref(false);

const currentDocumentSrc = ref('');

const banners = ref([]);

const authStore = useAuthStore();
const adminDetails = ref({});
const errorMsg = ref('');

onMounted(() => {
  adminDetails.value = authStore.adminDetails;
  getNewBanner();
});

watch(currentPage, (newVal) => {
  getNewBanner();
});

const getNewBanner = async () => {
  loading.value = true;
  try {
    const response = await tableService.getNewBanner();
    if (response.data?.isSuccess) {
      banners.value = response.data?.data || [];
    } else {
      banners.value = [];
      errorMsg.message = response.data?.message || 'Something went wrong, please try again later.';
    }
  } catch (err) {
    banners.value = [];
    errorMsg.message = 'Something went wrong, please try again later.';
  } finally {
    loading.value = false;
  }
};

const updateBannerStatus = async (banner) => {
  banner.IsActive = !banner.IsActive;

  const data = {
    BannerId: banner.Id,
    IsActive: banner.IsActive,
    Name: banner.Name
  }

  try {
    const response = await accountService.updateBanner(data);
    if (!response.data?.isSuccess) {
      banner.IsActive = !banner.IsActive;
      showErrorToast(response.data.message);
    } else {
      showSuccessToast(response.data.message);
    }
  } catch (error) {
    banner.IsActive = !banner.IsActive;
    showErrorToast(error.response?.data?.message || 'Something went wrong, please try again later.');
  }
}

const openModal = () => {
  nextTick(() => {
    const modalEl = document.getElementById('addBanner');
    if (!modalEl) {
      console.error("Modal element with ID 'addBanner' not found.");
      return;
    }
    const proofModal = new Modal(modalEl);
    proofModal.show();
  });
};

const viewDocument = (documentSrc) => {
  currentDocumentSrc.value = documentSrc;
  const base64PDF = currentDocumentSrc.value;

  const mimeMatch = base64PDF.match(/^data:(.*);base64,/);
  const mimeType = mimeMatch ? mimeMatch[1] : null;

  if (!mimeType || !["image/jpeg", "image/jpg", "image/png"].includes(mimeType)) {
    alert("Unsupported file type. Only JPG and PNG images are allowed.");
    return;
  }

  const base64String = base64PDF.split(',')[1];
  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  const blobURL = URL.createObjectURL(blob);

  window.open(blobURL, '_blank');
};

// 👇 Export a single RemeshireCode string as CSV
const exportRemeshireRow = (codeString, id) => {
  if (!codeString) {
    alert("No Remeshire Code to export.");
    return;
  }

  // Split comma-separated string into array
  const codes = codeString.split(',').map(code => code.trim()).filter(Boolean);

  // Prepare CSV content
  const headers = ['Remeshire Code'];
  const csvContent = [headers.join(','), ...codes.map(c => `${c}`)].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `remeshire_code_${id || 'row'}.csv`;
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

<template>
  <div class="px-2 pb-3 fs14 d-flex align-items-end">
    <RouterLink to="/dashboard" class="text-tertiary-color text-decoration-none">
      <i class="bi bi-house-fill fs16 pe-1"></i> Dashboard
    </RouterLink>
    <span class="px-2">/</span>
    <div class="text-muted">TDS</div>
  </div>

  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="text-quaternary-color fs16 fw500 mb-0">TDS</h5>
    </div>
    <div class="row mb-3">
      <div class="col-12 text-end">
        <select class="text-secondary-color fs14 fw500 form-select d-inline-block w-auto py-2" v-model="selectedYear">
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
    </div>


    <div class="row g-3">
      <div class="col-md-6 col-sm-6  col-lg-3" v-for="quarter in quarters" :key="quarter.id">
        <div class="card-box card h-100">
          <div class="card-body text-center d-flex flex-column justify-content-between">
            <div>
              <p class="fw-semibold fs20 mb-1">{{ quarter.name }}</p>
              <p class="text-muted mb-3">{{ quarter.period }}</p>
            </div>
            <button class="btn btn-primary w-100" :disabled="downloading[quarter.name]"
              @click="tdsDocuments(quarter.name)">
              <i v-if="!downloading[quarter.name]" class="bi bi-download me-2"></i>
              <span v-if="downloading[quarter.name]" class="spinner-border spinner-border-sm me-2" role="status"></span>
              {{ downloading[quarter.name] ? 'Downloading...' : 'Download' }}
            </button>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue';
import { watch } from 'vue';
import { accountService } from '../../../services/account/account.service';
import { showErrorToast, showSuccessToast } from '../../../js/toast';
import { useAuthStore } from '@/stores/authStore';


const downloading = ref({});
const selectedYear = ref('2025-26');



const years = [
  '2025-26',
  // '2024-2025',
  // '2023-2024',
  // '2022-2023',
];



const quarters = [
  { id: 1, name: 'Q1', period: 'January - March' },
  { id: 2, name: 'Q2', period: 'April - June' },
  { id: 3, name: 'Q3', period: 'July - September' },
  { id: 4, name: 'Q4', period: 'October - December' },
];


const authStore = useAuthStore();


const adminDetails = ref({
  RemCode: authStore.adminDetails?.RemCode || '',
});


watch(selectedYear, async (newYear) => {
  console.log('Year changed to:', newYear);
});


const tdsDocuments = async (qtr) => {
  downloading.value[qtr] = true;

  try {
    const fccode = adminDetails.value?.RemCode;
   const year = selectedYear.value;

    if (!fccode) {
      showErrorToast('FCCODE is missing');
      return;
    }

    const response = await accountService.tdsDocuments(fccode, qtr, year);

    if (
      response.data?.isSuccess &&
      typeof response.data.data?.base64 === 'string' &&
      response.data.data.base64.trim()
    ) {
      const base64PDF = response.data.data.base64;
      const byteCharacters = atob(base64PDF);
      const byteArray = new Uint8Array([...byteCharacters].map(c => c.charCodeAt(0)));
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;

      const fileName = response.data.data.file_name || `TDS-${qtr}-${year}.pdf`;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);

      showSuccessToast(`TDS document for ${qtr} downloaded successfully!`);
    } else {
      const msg = response.data?.message || `Failed to download TDS for ${qtr}.`;
      showErrorToast(msg);
    }
  } catch (err) {
    const errMsg =
      err?.response?.data?.message ||
      err?.message ||
      `Something went wrong while downloading TDS for ${qtr}.`;
    showErrorToast(errMsg);
  } finally {
    downloading.value[qtr] = false;
  }
};




</script>

<style scoped lang="scss">
.card-body p {
  margin: 0;
}

button.btn {
  height: 40px;
  font-weight: 500;
  font-size: 14px;
}

@media (max-width: 576px) {
  button.btn {
    font-size: 13px;
  }
}

.card-box {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.card-box:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
</style>

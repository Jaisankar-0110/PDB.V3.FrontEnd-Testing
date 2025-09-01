<template>
  <div class="px-2 pb-3 fs14 d-flex align-items-end">
    <RouterLink to="/dashboard" class="text-tertiary-color text-decoration-none">
      <i class="bi bi-house-fill fs16 pe-1"></i> Dashboard
    </RouterLink>
    <span class="px-2">/</span>
    <div class="text-muted">Documents</div>
  </div>

  <div class="card">
    <div class="card-header py-3 bg-transparent">
      <div class="d-flex justify-content-between align-items-center">
        <div class="text-quaternary-color fs16 fw500">Non Mandatory</div>
      </div>
    </div>

    <div class="card-body p-xl-5 p-4">
      <div v-if="hideUploadForm" class="d-flex justify-content-center align-items-center">
        <div class="w-100 alert alert-info fs14 my-5 ">
          <i class="bi bi-info-circle me-1"></i> Documents under review.
        </div>
      </div>

      <div v-else class="row">
        <div v-for="(label, key) in fileLabels" :key="key" class="col-lg-3 col-md-6  mb-4">
          <label class="form-label fs14 text-muted" :for="`fileInput-${key}`">{{ label }}</label>
          <div class="border border-2 border-dashed rounded p-4 text-center position-relative"
            style="border-style: dashed; background-color: #f9f9ff;">
            <input ref="fileInputs" type="file" class="position-absolute w-100 h-100" :id="`fileInput-${key}`"
              accept="application/pdf" style="opacity: 0; top: 0; left: 0; cursor: pointer;"
              @change="handleFileChange($event, key)" />
            <div>
              <i class="bi bi-cloud-upload text-muted fs18"></i>
              <div class="fw-semibold fs14 mt-2">Choose File</div>
              <div class="text-muted small fs12" v-if="!fileNames[key]">
                Upload: PDF (5 KB – 500 KB)
              </div>
              <div v-else class="text-muted small fs12 text-truncate">
                {{ fileNames[key] }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="errorMsg" class="text-danger text-center fs14 mb-3">{{ errorMsg }}</div>

        <div class="text-center">
          <button class="btn btn-primary px-5" @click="handleUploadDocuments">Submit</button>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { accountService } from '../../../services/account/account.service';
import { showSuccessToast, showErrorToast } from '../../../js/toast';

const authStore = useAuthStore();
const adminDetails = ref({});
const fileInputs = ref([])
const fileNames = ref({});
const files = ref({});
const errorMsg = ref('');
const docStatus = ref('');

const fileLabels = {
  AttendanceRegister: 'Attendance Register',
  SalaryRegister: 'Salary Register',
  Others: 'Others',
  BankStatement1: 'Bank Statement 1',
  BankStatement2: 'Bank Statement 2',
  BankStatement3: 'Bank Statement 3',
  DPHolding: 'DP Holding',
  NISMCertificate: 'NISM Certificate',
  BankDeclaration: 'Bank Declaration'
};

onMounted(() => {
  adminDetails.value = authStore.adminDetails;
  getNonMandatoryDocuments();
});

const hideUploadForm = computed(() => {
  const blockedStatuses = ['BRANCH PENDING', 'HO PENDING', 'RE INITIATED', 'VERIFIED'];
  return blockedStatuses.includes(docStatus.value);
});

const currentDate = new Date();
const Month = currentDate.toLocaleString('default', { month: 'short' }).toUpperCase(); // e.g., 'JUN'
const year = currentDate.getFullYear();

function handleFileChange(event, key) {
  const file = event.target.files[0];
  errorMsg.value = '';

  if (!file) return;

  const isPDF = file.type === 'application/pdf';
  const fileSize = file.size;
  const minSize = 5120; // 5 KB
  const maxSize = 512000; // 500 KB

  if (!isPDF) {
    errorMsg.value = 'Only PDF files are allowed.';
    return;
  }
  if (fileSize < minSize) {
    errorMsg.value = 'File must be at least 5 KB.';
    return;
  }
  if (fileSize > maxSize) {
    errorMsg.value = 'File must be less than 500 KB.';
    return;
  }

  files.value[key] = file;
  fileNames.value[key] = file.name;
}

async function handleUploadDocuments() {
  errorMsg.value = '';

  if (!adminDetails.value?.RemCode) {
    errorMsg.value = 'RemeshireCode is missing.';
    return;
  }

  const formData = new FormData();
  formData.append('RemeshireCode', adminDetails.value.RemCode);

  for (const key in files.value) {
    formData.append(key, files.value[key]);
  }

  try {
    const response = await accountService.updateDocuments(formData);
    if (response.data?.isSuccess) {
      showSuccessToast(response?.data?.message);
      fileNames.value = {};
      files.value = {};
      fileInputs.value.forEach(input => {
        if (input) input.value = '';
      });
    } else {
      showErrorToast(response?.data?.message)
      // errorMsg.value = response.data?.message[0] || 'Something went wrong. Please try again.';
    }
  } catch (err) {
    console.error(err);
    errorMsg.value = 'Something went wrong. Please try again.';
  }
}



const getNonMandatoryDocuments = async () => {
  try {
    const response = await accountService.getNonMandatoryDocuments(adminDetails.value.RemCode, Month, year);
    if (response.data?.isSuccess) {
      const data = response.data.result;
      if (Array.isArray(data) && data.length > 0 && data[0].status) {
        docStatus.value = data[0].status.toUpperCase();
        console.log('Non-Mandatory Status:', docStatus.value);
      }
    }
  } catch (err) {
    console.error(err);
  }
};


</script>

<style scoped>
.text-truncate {
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

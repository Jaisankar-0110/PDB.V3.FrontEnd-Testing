<template>
  <div class="text-quaternary-color fs16 fw500 p-2">GST Upload</div>
  <div class="d-flex justify-content-center align-items-center upload-gst-container">
    <div class="card upload-gst-card p-4 mt-3">
      <div class="row">
        <div class="col-lg-12">
          <div class="mb-3">
            <label class="form-label fs14 text-muted">Upload GST CSV</label>
            <div class="border border-2 border-dashed rounded p-4 text-center position-relative"
              style="border-style: dashed; background-color: #f9f9ff;">
              <input type="file" id="fileInput" accept=".csv" class="position-absolute w-100 h-100"
                style="opacity: 0; top: 0; left: 0; cursor: pointer;" @change="handleFileChange" />
              <div>
                <i class="bi bi-cloud-upload text-muted fs18 "></i>
                <div class="fw-semibold fs14 mt-2">Choose File</div>
                <div class="text-muted small fs12" v-if="!fileName">Upload: CSV (0 KB – 500 KB)</div>
                <div v-if="fileName" class="text-muted small fs12 text-truncate">
                  {{ fileName }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ErrorMessage class="text-center mb-1 pt-1" :message="errorMsg" />
      <div class="text-center pt-3">
        <button class="btn btn-primary px-5" @click="handleUploadGST">Submit</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import ErrorMessage from '../../../../../components/ErrorMessage.vue';
import { accountService } from '../../../../../services/account/account.service';
import { showSuccessToast, showErrorToast } from '../../../../../js/toast';

const authStore = useAuthStore();
const adminDetails = ref({});
const fileName = ref('');
const errorMsg = ref('');
const selectedFile = ref(null);
const loading = ref(false);

onMounted(() => {
  adminDetails.value = authStore.adminDetails;
});

function handleFileChange(event) {
  const file = event.target.files[0];
  errorMsg.value = '';
  fileName.value = '';
  selectedFile.value = null;

  if (!file) return;

  const isCSV =
    file.type === 'text/csv' ||
    file.name.toLowerCase().endsWith('.csv');

  const fileSize = file.size;
  const minSize = 0;    // 5KB
  const maxSize = 512000;  // 500KB

  if (!isCSV) {
    errorMsg.value = 'Only CSV files are allowed.';
    event.target.value = '';
    return;
  }

  if (fileSize < minSize) {
    errorMsg.value = 'File must be at least 5 KB.';
    event.target.value = '';
    return;
  }

  if (fileSize > maxSize) {
    errorMsg.value = 'File must be less than 500 KB.';
    event.target.value = '';
    return;
  }

  fileName.value = file.name;
  selectedFile.value = file;
}

const handleUploadGST = async () => {
  errorMsg.value = '';

  if (!selectedFile.value) {
    errorMsg.value = 'Please upload the CSV file.';
    return;
  }

  const data = new FormData();
  data.append('file', selectedFile.value);

  loading.value = true;

  try {
    const response = await accountService.GSTUpload(data);

    if (response.data?.isSuccess || response.status === 200) {
      showSuccessToast(response.data.message);
      fileName.value = '';
      selectedFile.value = null;
      document.getElementById('fileInput').value = '';
    } else {
      errorMsg.value = response.data?.message || 'Something went wrong.';
    }
  } catch (error) {
    console.error(error);
    const errorMessage = error?.response?.data?.message || 'Upload failed. Please try again.';
    showErrorToast(errorMessage);
    //   errorMsg.value = errorMessage;
  } finally {
    loading.value = false;
  }
};

</script>


<style scoped>
.upload-gst-container {
  background-color: var(--light);
}

.upload-gst-card {
  width: 100%;
  max-width: 600px;
  border-radius: 8px;
}

.border-dashed {
  border-style: dashed !important;
}

.text-truncate {
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

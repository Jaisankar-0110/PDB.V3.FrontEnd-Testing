<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8">
        <div class="text-quaternary-color fs16 fw500 mb-3">GST</div>

        <div class="row g-4 align-items-start">
          <!-- Upload Section -->
          <div class="col-12 col-lg-6">
            <div class="card p-4 h-100">
              <div class="text-secondary-color fw700 fs16 mb-1">
                Month : {{ formattedMonthYear }}
              </div>
              <div class="fs14 text-secondary-color pb-3">
                Invoice For the Month
              </div>

              <!-- Upload Input -->
              <div class="mb-3">
                <label class="form-label fs14 text-muted">Upload Proof</label>
                <div class="upload-box position-relative text-center">
                  <input
                    type="file"
                    class="position-absolute top-0 start-0 w-100 h-100"
                    accept="application/pdf"
                    style="opacity: 0; cursor: pointer;"
                    @change="handleFileChange"
                  />
                  <div>
                    <i class="bi bi-cloud-upload text-muted fs18"></i>
                    <div class="fw-semibold fs14 mt-2">Choose File</div>
                    <div class="text-muted small fs12" v-if="!fileName">
                      Upload: PDF (5 KB – 500 KB)
                    </div>
                    <div
                      v-if="fileName"
                      class="text-muted small fs12 text-truncate"
                    >
                      {{ fileName }}
                    </div>
                  </div>
                </div>
              </div>

              <ErrorMessage :class="'text-center mb-1 pt-1'" :message="errorMsg" />

              <div class="text-center pt-3">
                <button class="btn btn-primary px-4" @click="handleUploadGST">
                  Submit Request
                </button>
              </div>
            </div>
          </div>

          <!-- Guidelines Section -->
          <div class="col-12 col-lg-6">
            <div class="card p-3 h-100">
              <h6 class="fw-bold fs14 mb-2">INVOICE FORMAT GUIDELINES</h6>

              <div >
                <ul class="ps-3 fs12 mb-0">
                  <li>GST registration must match the partner’s name.</li>
                  <li>Invoices with mismatched trade names will not be accepted.</li>
                  <li>Upload GST certificate (PDF, max 500KB).</li>
                  <li>SAC/HSN code is mandatory.</li>
                  <li>If invoice uses company template, partner signature is mandatory.</li>
                  <li>Computer-generated invoices must state it clearly.</li>
                  <li>Invoice numbers must be unique and not repeated.</li>
                  <li>Invoice date must be last day of billing month or next month.</li>
                  <li><strong>Example:</strong> January revenue → Jan 31 or Feb date.</li>
                  <li>Backdated invoices need Saravanan Sir’s approval.</li>
                  <li>Upload by 12th of every month for current payout.</li>
                  <li>After 12th → processed next month.</li>
                  <li>Missed upload = GST debited, marked as defaulter.</li>
                </ul>
              </div>

              <button class="btn btn-primary btn-sm mt-3 w-100" @click="openModal">F&Q</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <GSTRegsitration />
</template>

<script setup>
import { ref, computed, onMounted,nextTick  } from 'vue';
import { Modal } from 'bootstrap';
import { useAuthStore } from '@/stores/authStore';
import ErrorMessage from '../../../../components/ErrorMessage.vue';
import { accountService } from '../../../../services/account/account.service';
import { showSuccessToast } from '../../../../js/toast';
import GSTRegsitration from '../modal/GSTRegsitration.vue';

const authStore = useAuthStore();
const adminDetails = ref({});

const fileName = ref('');
const errorMsg = ref('');
const fileBase64 = ref('');

onMounted(() => {
  adminDetails.value = authStore.adminDetails;
});

function handleFileChange(event) {
  const file = event.target.files[0];
  errorMsg.value = '';
  fileName.value = '';
  fileBase64.value = '';

  if (!file) return;

  const isPDF = file.type === 'application/pdf';
  const fileSize = file.size;
  const minSize = 5120;
  const maxSize = 512000;

  if (!isPDF) {
    errorMsg.value = "Only PDF files are allowed.";
    event.target.value = '';
    return;
  }

  if (fileSize < minSize) {
    errorMsg.value = "File must be at least 5 KB.";
    event.target.value = '';
    return;
  }

  if (fileSize > maxSize) {
    errorMsg.value = "File must be less than 500 KB.";
    event.target.value = '';
    return;
  }

  fileName.value = file.name;

  const reader = new FileReader();
  reader.onload = () => {
    fileBase64.value = reader.result.split(',')[1];
  };
  reader.onerror = () => {
    errorMsg.value = "Failed to read file. Please try again.";
  };
  reader.readAsDataURL(file);
}

const today = new Date();
const previousMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
const formattedMonthYear = computed(() => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const month = monthNames[previousMonthDate.getMonth()];
  const year = previousMonthDate.getFullYear();
  return `${month.toUpperCase()}-${year}`;
});

const handleUploadGST = async () => {
  errorMsg.value = '';
  if (!fileBase64.value) {
    errorMsg.value = "Please upload the proof.";
    return;
  }

  const data = {
    RemCode: adminDetails.value.RemCode,
    MonthYear: formattedMonthYear.value,
    PDFFile: fileBase64.value,
  };

  try {
    const response = await accountService.uploadGST(data);
    if (response.data?.isSuccess) {
      showSuccessToast("GST proof uploaded successfully.");
      fileName.value = '';
      fileBase64.value = '';
    } else {
      errorMsg.value = response.data?.message || 'Something went wrong.';
    }
  } catch (err) {
    console.error(err);
    errorMsg.value = 'Something went wrong.';
  }
};

const openModal = () => {
    nextTick(() => {
        const proofModal = new Modal(document.getElementById('faqModal'));
        proofModal.show();
    });
};
</script>
<style scoped>
.upload-box {
  border: 2px dashed var(--bs-secondary);
  background-color: #f9f9ff;
  border-radius: 0.5rem;
  padding: 1.5rem;
}



</style>
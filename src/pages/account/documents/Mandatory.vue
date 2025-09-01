<template>
  <div class="px-2 pb-3 fs14 d-flex align-items-end">
    <RouterLink to="/dashboard" class="text-tertiary-color text-decoration-none">
      <i class="bi bi-house-fill fs16 pe-1"></i> Dashboard
    </RouterLink>
    <span class="px-2">/</span>
    <div class="text-muted">Mandatory Documents</div>
  </div>



  <div class="card">
    <div class="card-header py-3 bg-transparent">
      <div class="d-flex justify-content-between align-items-center">
        <div class="text-quaternary-color fs16 fw500">Mandatory Documents</div>
      </div>
    </div>


    <div class="card-body">

      <div class="mt-2 p-2">
        <div class="text-primary-color fs16 fw500">Certificates : </div>
        <div class="mt-4">
          <div class="row">
            <div class="col-lg-6 col-sm-12  col-xxl-4 col-md-6 col-12 mb-4">
              <div class="row">
                <div class="col-6">
                  <span class="text-muted fs14">Sebi Registration</span>
                </div>
                <div class="col-6 text-start">
                  <a href="/mandatory/SEBI-REGISTRATION-CERTIFICATE.pdf" target="_blank">
                    <button class="btn btn-primary btn-sm fs12">
                      <i class="bi bi-download"></i> Download
                    </button>
                  </a>
                </div>
              </div>
            </div>

            <div class="col-lg-6 col-sm-12  col-xxl-4 col-md-6 col-12 mb-4">
              <div class="row">
                <div class="col-6">
                  <span class="text-muted fs14">Final Do and Don'ts</span>
                </div>
                <div class="col-6 text-start">
                  <a href="/mandatory/Final-Do-and-Donts.pdf" target="_blank">
                    <button class="btn btn-primary btn-sm fs12">
                      <i class="bi bi-download"></i> Download
                    </button>
                  </a>
                </div>
              </div>
            </div>

            <div class="col-lg-6  col-sm-12 col-xxl-4 col-md-6 col-12 mb-4">
              <div class="row">
                <div class="col-6">
                  <span class="text-muted fs14">AP Letter</span>
                </div>
                <div class="col-6 text-start">
                  <a :href="`/mandatory/ap-letter/${authStore.adminDetails?.RemCode}.pdf`" target="_blank">
                    <button class="btn btn-primary btn-sm fs12">
                      <i class="bi bi-download"></i> Download
                    </button>
                  </a>
                </div>
              </div>
            </div>

            <div class="col-lg-6 col-sm-12  col-xxl-4 col-md-6 col-12 mb-4">
              <div class="row">
                <div class="col-6">
                  <span class="text-muted fs14">Notice Board Branch</span>
                </div>
                <div class="col-6 text-start">
                  <a :href="`/mandatory/notice-board/${authStore.adminDetails?.RemCode}.pdf`" target="_blank">
                    <button class="btn btn-primary btn-sm fs12">
                      <i class="bi bi-download"></i> Download
                    </button>
                  </a>
                </div>
              </div>
            </div>

            <div class="col-lg-6 col-sm-12 col-xxl-4 col-md-6 col-12 mb-4">
              <div class="row">
                <div class="col-6">
                  <span class="text-muted fs14">AP Code of Conduct</span>
                </div>
                <div class="col-6 text-start">
                  <a href="/mandatory/AP-Code-of-conduct.pdf" target="_blank">
                    <button class="btn btn-primary btn-sm fs12">
                      <i class="bi bi-download"></i> Download
                    </button> </a>
                </div>
              </div>
            </div>

            <div class="col-lg-6 col-sm-12 col-xxl-4 col-md-6 col-12 mb-4">
              <div class="row">
                <div class="col-6">
                  <span class="text-muted fs14">Digitally Signed</span>
                </div>
                <div class="col-6 text-start">
                  <button class="btn btn-primary btn-sm fs12" @click="getMandatoryDocuments">
                    <i class="bi bi-download"></i> Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5">

        <div class="card mt-5">
          <div class="card-header py-3">
            <div class="d-flex justify-content-between align-items-center">
              <div class="text-quaternary-color fs16 fw500">Verification</div>
            </div>
          </div>


          <div class="card-body p-xl-5 p-4">
            <div v-if="hideUploadForm" class="w-100 alert alert-info fs14 my-5">
              <i class="bi bi-info-circle me-1"></i> Documents under review.
            </div>
            <div v-else class="row">
              <div class="col-lg-4" v-for="(label, key) in allDocuments" :key="key">
                <div class="mb-3">
                  <div class="rounded p-4 text-center position-relative" style="
        border: 2px dotted var(--bg-tertiary-light);
        background-color: #f9f9ff;
        width: 100%;
      ">
                    <div class="position-absolute w-100 h-100" style="top: 0; left: 0; cursor: pointer;"
                      @click="openCameraPopup(key)"></div>

                    <div>
                      <i class="bi bi-camera text-primary fs18"></i>
                      <div class="text-primary fs12 mt-2">{{ label }}</div>

                      <div v-if="imagePreviews[key]" class="mt-2">
                        <img :src="imagePreviews[key]" class="img-thumbnail" style="max-height: 80px;" />
                      </div>
                      <div v-else-if="fileNames[key]" class="text-muted small fs12 text-truncate mt-2">
                        {{ fileNames[key] }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <!-- CAMERA MODAL -->
              <div v-if="cameraPopup"
                class="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center"
                style="z-index: 1050;">
                <div class="bg-white rounded shadow p-4" style="width: 400px; max-width: 90%;">
                  <video ref="videoRef" autoplay playsinline muted
                    style="width: 100%; height: auto; background: black; border-radius: 10px;" />
                  <div class="d-flex justify-content-between mt-3">
                    <button class="btn btn-primary" @click="captureImage">Capture</button>
                    <button class="btn btn-secondary" @click="closeCameraPopup">Close</button>
                  </div>
                </div>
              </div>

              <div class="text-center mt-4">
                <button class="btn btn-primary px-5" @click="handleUploadDocuments">Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { accountService } from '../../../services/account/account.service';
import { useAuthStore } from '@/stores/authStore';
import { showSuccessToast, showErrorToast } from '../../../js/toast';

const authStore = useAuthStore();
const adminDetails = ref({});
const fileNames = ref({})
const formFiles = ref({})
const currentCaptureKey = ref('')
const fileInput = ref(null);
const fileName = ref('');
const cameraInput = ref(null);
const docStatus = ref('');


const allDocuments = {
  NoticeBoard: 'Notice Board',
  DosAndDonts: "Do's and Don'ts",
  SebiCertificate: 'SEBI Certificate',
  ComplaintsRegister: 'Complaints Register',
  VisitorsRegister: 'Visitor Register'
}

const hideUploadForm = computed(() => {
  const blockedStatuses = ['BRANCH PENDING', 'HO PENDING', 'RE INITIATED', 'VERIFIED'];
  return blockedStatuses.includes(docStatus.value);
});

const triggerCamera = () => {
  cameraInput.value?.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    fileName.value = file.name;
  }
};

onMounted(() => {
  adminDetails.value = authStore.adminDetails;
  closeCameraPopup();
  getMandatoryDoc();
});


const currentDocumentSrc = ref('');

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

const getMandatoryDocuments = async () => {
  try {
    const fccode = adminDetails.value?.RemCode;

    if (!fccode) {
      showErrorToast('FCCODE is missing');
      return;
    }

    const response = await accountService.mandatoryDocuments(fccode);

    console.log('API Response:', response.data);

    if (response.data?.succes && typeof response.data.data === 'string' && response.data.data.trim()) {
      const base64PDF = response.data.data;

      const byteCharacters = atob(base64PDF);
      const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'Digitally-Signed.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);

      showSuccessToast('Document downloaded successfully!');
    } else {
      const msg = response.data?.message || 'Failed to download document.';
      showErrorToast(msg);
      console.error('Download failed:', msg);
    }
  } catch (err) {
    const errMsg =
      err?.response?.data?.message ||
      err?.message ||
      'Something went wrong while downloading.';
    showErrorToast(errMsg);
    console.error('Download Error:', err);
  }
};

const imagePreviews = ref({})
const cameraPopup = ref(false)
const videoRef = ref(null)
const capturedImage = ref(null)

const currentDate = new Date();
const Month = currentDate.toLocaleString('default', { month: 'short' }).toUpperCase();
const year = currentDate.getFullYear();


const openCameraPopup = async (key) => {
  currentCaptureKey.value = key
  cameraPopup.value = true
  await nextTick()
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false
    })
    if (videoRef.value) {
      videoRef.value.srcObject = stream
      videoRef.value.onloadedmetadata = () => {
        videoRef.value.play()
      }
    }
  } catch (err) {
    console.error('Camera access error:', err)
    closeCameraPopup()
  }
}

const captureImage = () => {
  const video = videoRef.value
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

  canvas.toBlob((blob) => {
    if (blob) {
      const file = new File([blob], `${currentCaptureKey.value}.jpg`, { type: 'image/jpeg' })
      formFiles.value[currentCaptureKey.value] = file
      fileNames.value[currentCaptureKey.value] = file.name
      imagePreviews.value[currentCaptureKey.value] = URL.createObjectURL(file)
    }
    closeCameraPopup()
  }, 'image/jpeg')
}

const closeCameraPopup = () => {
  const video = videoRef.value
  if (video?.srcObject) {
    video.srcObject.getTracks().forEach((track) => track.stop())
    video.srcObject = null
  }
  cameraPopup.value = false
}


const handleUploadDocuments = async () => {
  const formData = new FormData()

  formData.append('RemeshireCode', adminDetails.value.RemCode)

  for (const key in formFiles.value) {
    formData.append(key, formFiles.value[key])
  }

  if (Object.keys(formFiles.value).length === 0) {
    showErrorToast('Please capture at least one document.')
    return
  }

  try {
    const response = await accountService.updateNonMadndatoryDocuments(formData)

    if (response.data?.isSuccess) {
      showSuccessToast(response.data?.message)
    } else {
      showErrorToast(response.data?.message || 'Upload failed.')
    }
  } catch (err) {
    console.error(err)
    showErrorToast(err.response.data?.message || 'Error uploading documents.')
  }
}


const getMandatoryDoc = async () => {
  try {
    const response = await accountService.getMandatoryDoc(adminDetails.value.RemCode, Month, year);
    if (response.data?.isSuccess) {
      const data = response.data.result;
      if (Array.isArray(data) && data.length > 0 && data[0].status) {
        docStatus.value = data[0].status;
        console.log('Status:', docStatus.value);
      }
    }
  } catch (err) {
    console.error(err);
  }
};


</script>


<style scoped>
.view-pdf {
  padding: 4px 14px !important;
  height: 34px !important;

}

.btn-sm {
  height: 32px !important;
  font-size: 12px !important;
}

.card {
  box-shadow: none !important;
}
</style>

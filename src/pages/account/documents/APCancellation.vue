<template>
    <div class="px-2 pb-3 fs14 d-flex align-items-end">
        <RouterLink to="/dashboard" class="text-tertiary-color text-decoration-none">
            <i class="bi bi-house-fill fs16 pe-1"></i> Dashboard
        </RouterLink>
        <span class="px-2">/</span>
        <div class="text-muted">Documents</div>
    </div>


    <div class="container py-4">
        <div v-if="docStatus === 'HO VERIFIED'" class="card inside-card mx-auto shadow-sm">
            <div class="card-header text-start p-5 px-4">
                <h1 class="text-center">Closure Marked</h1>
                <p class="text-center fs-3">
                    Your AP Cancellation Process will be completed after the completion of a 30-day notice.
                </p>
            </div>
        </div>
        <div v-else-if="docStatus === 'HO PENDING' || docStatus === 'RE-INITIATED'" class="text-center text-muted py-5">
             <div class="w-100 alert alert-info fs14 my-5 ">
          <i class="bi bi-info-circle me-1"></i> Documents under review.
        </div>
        </div>
        <div v-else-if="docStatus === 'HO REJECTED' || !docStatus" class="card inside-card mx-auto shadow-sm">
            <div class="card-header bg-light fw500 fs16 py-3">
                Upload Cancellation Form
            </div>

            <div class="card-body text-center">
                <p class="text-secondary mb-3 fs16">
                    Download the AP Cancellation Form, sign it, and upload the signed form below.
                </p>
                <div>
                    <button class="btn btn-danger btn-sm mb-4 fs12" @click="getAPcancellationDoc">
                        <i class="bi bi-download fs12 pe-1"></i> Download
                    </button>
                </div>
                <div class="row mt-3">
                    <div class="col-lg-6">
                        <div class="mb-3">
                            <div class="border border-2 border-dashed rounded p-4 text-center position-relative"
                                style="border-style: dashed; background-color: #f9f9ff;">
                                <input type="file" accept=".pdf,application/pdf" class="position-absolute w-100 h-100"
                                    style="opacity: 0; top: 0; left: 0; cursor: pointer;"
                                    @change="(e) => handleFileChange(e, 'form')" />
                                <div>
                                    <i class="bi bi-cloud-upload text-muted fs18"></i>
                                    <div class="fw-semibold fs14 mt-2">Signed Form</div>
                                    <div class="text-muted small fs12" v-if="!formFileName">Upload: PDF (5 KB – 500 KB)
                                    </div>
                                    <div v-if="formFileName" class="text-muted small fs12 text-truncate">{{ formFileName
                                    }}</div>
                                    <div v-if="formFileError" class="text-danger fs12 mt-1">{{ formFileError }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="mb-3">
                            <div class="border border-2 border-dashed rounded p-4 text-center position-relative"
                                style="border-style: dashed; background-color: #f9f9ff;">
                                <input type="file" accept=".pdf,application/pdf" class="position-absolute w-100 h-100"
                                    style="opacity: 0; top: 0; left: 0; cursor: pointer;"
                                    @change="(e) => handleFileChange(e, 'pan')" />
                                <div>
                                    <i class="bi bi-cloud-upload text-muted fs18"></i>
                                    <div class="fw-semibold fs14 mt-2">PAN</div>
                                    <div class="text-muted small fs12" v-if="!panFileName">Upload: PDF (5 KB – 500 KB)
                                    </div>
                                    <div v-if="panFileName" class="text-muted small fs12 text-truncate">{{ panFileName}}</div>
                                    <div v-if="panFileError" class="text-danger fs12 mt-1">{{ panFileError }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button class="btn btn-primary mt-4 px-5" @click="DocumentUploadTrigger">Submit</button>
            </div>
        </div>

    </div>
    <Confirmation @confirm="handleConfirm" @cancel="handleCancel" />
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import ErrorMessage from '../../../components/ErrorMessage.vue';
import { accountService } from '../../../services/account/account.service';
import { showSuccessToast, showErrorToast } from '../../../js/toast';
import Confirmation from './modals/Confirmation.vue';
import { Modal } from 'bootstrap';

const authStore = useAuthStore();
const docStatus = ref('');
const errorMsg = ref('');
const selectedFile = ref(null);
const adminDetails = ref({});
const isBDR = ref(false);
const formFile = ref(null)
const formFileName = ref('')
const formFileError = ref('')

const panFile = ref(null)
const panFileName = ref('')
const panFileError = ref('');

onMounted(() => {
    adminDetails.value = authStore.adminDetails;
    if (adminDetails.value?.RemCode) {
        getAPcancellation(adminDetails.value.RemCode);


    }
});

function handleFileChange(event, type) {
    const file = event.target.files[0];

    const fileSize = file?.size || 0;
    const isPDF = file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'));
    const minSize = 5 * 1024;
    const maxSize = 500 * 1024;

    if (!file) return;

    if (!isPDF) {
        setError(type, 'Only PDF files are allowed.');
        event.target.value = '';
        return;
    }

    if (fileSize < minSize) {
        setError(type, 'File must be at least 5 KB.');
        event.target.value = '';
        return;
    }

    if (fileSize > maxSize) {
        setError(type, 'File must be less than 500 KB.');
        event.target.value = '';
        return;
    }

    if (type === 'form') {
        formFile.value = file;
        formFileName.value = file.name;
        formFileError.value = '';
    } else if (type === 'pan') {
        panFile.value = file;
        panFileName.value = file.name;
        panFileError.value = '';
    }
}

const setError = (type, message) => {
    if (type === 'form') {
        formFileError.value = message;
        formFile.value = null;
        formFileName.value = '';
    } else if (type === 'pan') {
        panFileError.value = message;
        panFile.value = null;
        panFileName.value = '';
    }
};


const getAPcancellation = async () => {
    try {
        const response = await accountService.getAPcancellation(adminDetails.value.RemCode);
        if (response.data?.isSuccess) {
            const data = response.data.result;
            if (Array.isArray(data) && data.length > 0 && data[0].status) {
                docStatus.value = data[0].status.toUpperCase();
                // console.log('AP CANCELLATION:', docStatus.value);
            }
        }
    } catch (err) {
        console.error(err);
    }
};



const handleConfirm = async () => {
    isBDR.value = true;
    await DocumentUpload();
    hideModal();
};

const handleCancel = async () => {
    isBDR.value = false;
    await DocumentUpload();
    hideModal();
};

const hideModal = () => {
    const modalElement = document.getElementById("confirmation");
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    modal.hide();
};




const DocumentUpload = async () => {
    formFileError.value = '';
    panFileError.value = '';

    if (!formFile.value) {
        formFileError.value = 'Please upload the signed cancellation form.';
        return;
    }

    if (!panFile.value) {
        panFileError.value = 'Please upload the PAN PDF.';
        return;
    }

    const formData = new FormData();
    formData.append('Fccode', adminDetails.value?.RemCode || '');
    formData.append('ApcancellationForm', formFile.value);
    formData.append('PAN', panFile.value);
    formData.append('ISBDR', isBDR.value);

    try {
        const response = await accountService.DocumentUpload(formData);

        if (response.data?.isSuccess) {
            showSuccessToast(response.data.message?.[0] || 'Uploaded successfully');
            formFileName.value = '';
            formFile.value = null;
            panFileName.value = '';
            panFile.value = null;
            // modal already handled in confirm/closeModal
        } else {
            showErrorToast(response.data?.message || 'Something went wrong.');
        }
    } catch (error) {
        const errMsg = error?.response?.data?.message || 'Upload failed. Please try again.';
        showErrorToast(errMsg);
    }
};


const getAPcancellationDoc = async () => {
    try {
        const fccode = adminDetails.value?.RemCode;

        if (!fccode) {
            showErrorToast('FCCODE is missing');
            return;
        }

        const response = await accountService.getAPcancellationDoc(fccode);

        console.log('API Response:', response.data);

        const result = response.data?.result;
        if (
            response.data?.isSuccess &&
            typeof result?.fileContents === 'string' &&
            result.fileContents.trim()
        ) {
            const base64PDF = result.fileContents;

            const byteCharacters = atob(base64PDF);
            const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: result.contentType || 'application/pdf' });

            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = result.fileDownloadName || 'Digitally-Signed.pdf';
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(blobUrl);

            showSuccessToast('Document downloaded successfully!');
        } else {
            const msg = (response.data?.message?.[0]) || 'Failed to download document.';
            showErrorToast(msg);
            console.error('Download failed:', msg);
        }
    } catch (err) {
        const errMsg =
            err?.response?.data?.message?.[0] ||
            err?.message ||
            'Something went wrong while downloading.';
        showErrorToast(errMsg);
        console.error('Download Error:', err);
    }
};

const DocumentUploadTrigger = () => {

    formFileError.value = '';
    panFileError.value = '';

    if (!formFile.value) {
        formFileError.value = 'Please upload the signed cancellation form.';
        return;
    }

    if (!panFile.value) {
        panFileError.value = 'Please upload the PAN PDF.';
        return;
    }

    openModal();
};

const openModal = () => {
    nextTick(() => {
        const proofModal = new Modal(document.getElementById('confirmation'));
        proofModal.show();
    });
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

.inside-card {
    max-width: 650px;
    margin: auto;
}
</style>

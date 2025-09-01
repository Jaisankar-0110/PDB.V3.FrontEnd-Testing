<template>
    <div class="text-quaternary-color pb-3 fs16 fw500 p-3">Marketing Images</div>
    <div class="d-flex justify-content-center align-items-center upload-gst-container">
        <div class=" upload-gst-card p-2 mt-3">
            <div class="row">
                <div class="col-lg-12">
                    <div class="mb-1">
                        <div class="border border-2 border-dashed rounded p-4 text-center position-relative"
                            style="border-style: dashed; background-color: #f9f9ff;">
                            <input type="file" id="fileInput" accept="image/png, image/jpeg, image/jpg, image/webp"
                                class="position-absolute w-100 h-100"
                                style="opacity: 0; top: 0; left: 0; cursor: pointer;" @change="handleFileChange" />
                            <div>
                                <i class="bi bi-cloud-upload text-muted fs18 "></i>
                                <div class="fw-semibold fs14 mt-2">Choose File</div>
                                <div class="text-muted small fs12" v-if="!fileName">Upload: JPG, PNG, JPEG, WEBP (0 KB –
                                    500 KB)</div>
                                <div v-if="fileName" class="text-muted small fs12 text-truncate">
                                    {{ fileName }}
                                </div>
                            </div>

                        </div>
                        <ErrorMessage class=" mb-1 pt-1" :message="errorMsg" />
                        <div class="text-center pt-1">
                            <button class="btn btn-primary px-5 mt-4" @click="handleUploadGST">Submit</button>
                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>
    <div class="mt-4 mb-5 pb-5">
        <div class="text-quaternary-color fs16 fw500 mb-3 p-3">Uploaded Images</div>
        <div class="row g-4 uploaded-images-grid p-3">
            <div class="col-md-4 col-sm-6 col-12" v-for="(image, index) in staticImages" :key="index">
                <div class="position-relative image-wrapper">
                    <img :src="image" alt="Uploaded Image" class="uploaded-img img-fluid rounded shadow" />
                    <i class="bi bi-trash-fill delete-icon text-danger fs18 p-1 cursor-pointer"
                        @click="removeImage(index)"></i>
                </div>
            </div>
        </div>
    </div>



</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import ErrorMessage from '../../../../components/ErrorMessage.vue';
import { accountService } from '../../../../services/account/account.service';
import { showSuccessToast, showErrorToast } from '../../../../js/toast';

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

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const fileSize = file.size;
    const minSize = 0;
    const maxSize = 512000;

    if (!allowedTypes.includes(file.type)) {
        errorMsg.value = 'Only JPG, PNG, JPEG, or WEBP image files are allowed.';
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

const staticImages = ref([
    'https://www.shutterstock.com/shutterstock/photos/2557773529/display_1500/stock-photo-global-business-logistics-and-transportation-import-export-container-cargo-freight-ship-freight-2557773529.jpg',
    'https://www.shutterstock.com/image-photo/save-money-investment-concept-stack-260nw-2476383337.jpg',
    'https://www.shareindia.com/wp-content/uploads/2023/01/Futures-in-Stock-Market.webp',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTexbcuTMhhQC6wK7Tje7nO14A_hHLcx50LrQ&s',
    'https://img.freepik.com/free-photo/corporate-management-strategy-solution-branding-concept_53876-167088.jpg?semt=ais_hybrid&w=740',
    'https://media.istockphoto.com/id/1385970223/photo/great-idea-of-a-marketing-strategy-plan-at-a-creative-office.jpg?s=612x612&w=0&k=20&c=6up_J8ekhYIbF3qiUEo9t28u8X-UrFNqwryyRhBl35w='
]);

function removeImage(index) {
    staticImages.value.splice(index, 1);
}


// const handleUploadGST = async () => {
//     errorMsg.value = '';

//     if (!selectedFile.value) {
//         errorMsg.value = 'Please upload the Image';
//         return;
//     }

//     const data = new FormData();
//     data.append('file', selectedFile.value);

//     loading.value = true;

//     try {
//         const response = await accountService.GSTUpload(data);

//         if (response.data?.isSuccess || response.status === 200) {
//             showSuccessToast(response.data.message);
//             fileName.value = '';
//             selectedFile.value = null;
//             document.getElementById('fileInput').value = '';
//         } else {
//             errorMsg.value = response.data?.message || 'Something went wrong.';
//         }
//     } catch (error) {
//         console.error(error);
//         const errorMessage = error?.response?.data?.message || 'Upload failed. Please try again.';
//         showErrorToast(errorMessage);
//         //   errorMsg.value = errorMessage;
//     } finally {
//         loading.value = false;
//     }
//};

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

/* .uploaded-images-grid {
  max-width: 900px;
  margin: 0 auto;
} */

.image-wrapper {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: visible; 
  border-radius: 8px;
}

.uploaded-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.delete-icon {
  position: absolute;
  top: -10px;
  right: -8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: red;
  background-color: white;
  border-radius:58%;
  /* box-shadow: 0 0 6px rgba(0, 0, 0, 0.2); */
  cursor: pointer;
  z-index: 10;
  transition: transform 0.2s ease;
}

.delete-icon:hover {
  transform: scale(1.15);
  color: rgb(194, 5, 5);
}


</style>

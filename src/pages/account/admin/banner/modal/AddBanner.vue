<template>
    <div class="modal fade" id="addBanner" tabindex="-1" aria-labelledby="addBanner" aria-hidden="true"
        data-bs-backdrop="static">
        <div class="modal-dialog modal-md modal-dialog-centered">
            <div class="modal-content p-md-5 p-3">
                <div class="modal-header border-bottom-0 w-100">
                    <div class="text-center fs18 fw500">Add New Banner</div>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="uploadBanner">
                        <div class="position-relative">
                            <div class="form-control-text">
                                <label class="fs14 text-muted">Name</label>
                                <input type="text" maxlength="50" v-model="form.Name"
                                    class="fs14 mt-1 custom-input" placeholder="Enter the Name" />
                                <ErrorMessage class="text-start form-text fs12 text-danger"
                                    :message="errors.Name" />
                            </div>
                        </div>
                        <div class="mb-3 mt-3">
                                <div class="position-relative">
                            <div class="form-control-text">
                                <label class="fs14 text-muted">Redirection Link</label>
                                <input type="text" v-model="form.Link" class="fs14 mt-1 custom-input" placeholder="Enter the Redirection Link" />
                                <ErrorMessage class="text-start form-text fs12 text-danger"
                                    :message="errors.Link" />
                            </div>
                        </div>

                        </div>

                        <div class="mb-3 mt-3">
                            <label class="fs14 text-muted">Upload Image (JPG/PNG)</label>
                            <input type="file" class="form-control fs14 mt-1" accept=".jpg,.jpeg,.png" 
                                @change="handleImageChange" />
                            <ErrorMessage class="text-start form-text fs12 text-danger" :message="errors.Image" />
                        </div>

                        <div class="form-check my-2">
                            <input type="checkbox" class="form-check-input" id="isGlobalCheck" v-model="form.IsGlobal">
                            <label class="form-check-label fs14" for="isGlobalCheck">
                                Is Global Banner
                            </label>
                        </div>

                        <div class="mb-3 mt-3" v-if="!form.IsGlobal">
                            <label class="fs14 text-muted">Upload RemCode File (CSV)</label>
                            <input type="file" class="form-control fs14 mt-1" accept=".csv" @change="handleCSVFileChange" />
                            <ErrorMessage class="text-start form-text fs12 text-danger" :message="errors.csvFile" />
                        </div>

                        <ErrorMessage class="text-center mb-2 pt-2 text-danger" :message="errors.message" />

                        <div class="d-flex justify-content-between pt-3">
                            <div class="btn btn-outline-tertiary w-50 pt-2" @click="closeModal">Cancel</div>
                            <ButtonTertiary label="Update" class="w-50 ps-3" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import ButtonTertiary from "../../../../../components/button/ButtonTertiary.vue";
import ErrorMessage from "../../../../../components/ErrorMessage.vue";
import { Modal } from "bootstrap";
import { useAuthStore } from "@/stores/authStore";
import { showErrorToast, showSuccessToast } from "@/js/toast";
import { accountService } from "../../../../../services/account/account.service";

const authStore = useAuthStore();
const adminDetails = ref({});
const fileInputKey = ref(0);
const loading = ref(false);
const fileName = ref('');

const emit = defineEmits(['update-details']);

const form = reactive({
    Name: "",
    Image: null,
    IsGlobal: true,
    RemCode:null,
    Link: ""
});

const errors = reactive({
    Name: "",
    Image: "",
    csvFile: "",
    Link: "",
    message: ""
});

onMounted(() => {
    adminDetails.value = authStore.adminDetails;
});

const handleCSVFileChange = (event) => {
    const file = event.target.files[0];
    errors.csvFile = '';
    fileName.value = '';
    form.RemCode = null;

    if (!file) return;

    const isCSV = file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv');
    const fileSize = file.size;
    const minSize = 0;
    const maxSize = 512000;

    if (!isCSV) {
        errors.csvFile = 'Only CSV files are allowed.';
        return;
    }

    if (fileSize < minSize) {
        errors.csvFile = 'File must be at least 5 KB.';
        return;
    }

    if (fileSize > maxSize) {
        errors.csvFile = 'File must be less than 500 KB.';
        return;
    }

    fileName.value = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        const rows = content.split(/\r?\n/).map(row => row.trim()).filter(row => row); 
        rows.shift(); 

        const values = rows.join(','); 
        form.RemCode = values;
    };
    reader.readAsText(file);
};

const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file && ["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        const reader = new FileReader();

        reader.onload = () => {
            form.Image = reader.result;
            errors.Image = "";
        };

        reader.onerror = () => {
            form.Image = null;
            errors.Image = "Error reading the file.";
        };

        reader.readAsDataURL(file); 
    } else {
        form.Image = null;
        errors.Image = "Only JPG and PNG images are allowed.";
    }
};


const validateForm = () => {
    errors.Name = !form.Name ? "Name is required." : "";
    errors.Image = !form.Image ? "Image is required." : "";
    errors.Link = !form.Link ? "Redirection Link is required." : "";
    errors.csvFile = !form.IsGlobal && !form.RemCode  ? "CSV file is required." : "";
    return !errors.Name && !errors.Image && !errors.Link && (!(!form.IsGlobal && errors.csvFile));
};

const uploadBanner = async () => {
    if (!validateForm()) return;

    loading.value = true;
    
    const data = {
        Name: form.Name,
        Image: form.Image,
        IsGlobal: form.IsGlobal,
        RemCode: !form.IsGlobal ? form.RemCode  : "",
        Link: form.Link,
          // RemCode: !form.IsGlobal ? '' : ""
    };

    try {
        const response = await accountService.uploadBanner(data);
        if (response.data?.isSuccess) {
            showSuccessToast(response.data.message);
            closeModal();
        } else {
            errors.message = response.data.message;
            showErrorToast(response.data.message);
        }
    } catch (error) {
        errors.message = error?.response?.data?.message || "Something went wrong.";
        showErrorToast(errors.message);
    } finally {
        loading.value = false;
    }
};

const closeModal = () => {
    form.Name = "";
    form.Image = null;
    form.IsGlobal = true;
    form.Link = "";
    form.RemCode  = null;
    fileInputKey.value++;
    Object.keys(errors).forEach(key => errors[key] = "");
    loading.value = false;
    emit('update-details');
    const modalElement = document.getElementById("addBanner");
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    modal.hide();
};
</script>

<style scoped></style>

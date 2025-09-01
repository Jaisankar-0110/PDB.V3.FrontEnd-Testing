<template>
    <div class="modal fade" id="updateGST" tabindex="-1" aria-labelledby="updateGST" aria-hidden="true"
        data-bs-backdrop="static">
        <div class="modal-dialog modal-md modal-dialog-centered">
            <div class="modal-content p-md-5 p-3">
                <div class="modal-header border-bottom-0 w-100">
                    <div class="text-center fs18 fw500">
                        Update GST Status
                    </div>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="handleSubmit">
                        <div >
                            <div class="position-relative">
                                <div class="form-control-select">
                                    <label class="fs14 text-dark">Status </label>
                                    <select class="fs14 mt-1 custom-select text-dark" v-model="form.status"
                                        @change="validateStatus">
                                        <option value="" disabled selected>Select</option>
                                        <option v-for="option in statusOptions" :key="option" :value="option">
                                            {{ option }}
                                        </option>
                                    </select>
                                    <ErrorMessage :class="'text-start form-text fs12 text-danger'"
                                        :message="errors.status" />
                                </div>
                            </div>
                        </div>

                        <div class="mb-3 mt-3">
                            <div class="position-relative">
                                <div class="form-control-text">
                                    <label class="fs14 text-dark">Remarks </label>
                                    <textarea class="fs14 mt-1 custom-input" rowspan="5" @input="validateRemarks"
                                        v-model="form.remark"></textarea>
                                    <ErrorMessage :class="'text-start form-text fs12 text-danger'"
                                        :message="errors.remark" />
                                </div>
                            </div>
                        </div>

                        <ErrorMessage :class="'text-center mb-2 pt-2'" :message="errors.message" />

                        <div class="d-flex justify-content-between pt-3">
                            <div class="btn btn-outline-tertiary w-50 pt-2 me-3" @click="closeModal">
                                Cancel
                            </div>
                            <ButtonTertiary label="Update" class="w-50 " :loading="loading" />
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick, computed } from "vue";
import ButtonTertiary from "../../../../../components/button/ButtonTertiary.vue";
import { Modal } from "bootstrap";
import { useAuthStore } from '@/stores/authStore';
import { showErrorToast, showSuccessToast } from "../../../../../js/toast";
import ErrorMessage from "../../../../../components/ErrorMessage.vue";
import { accountService } from "../../../../../services/account/account.service";

const authStore = useAuthStore();
const adminDetails = ref({});

const loading = ref(false);

const props = defineProps({
    gstDetails: Object,
});

const statusOptions = ref(["APPROVED", "REJECTED"]);

const emit = defineEmits(['update-profile-details']);

const form = reactive({
    remCode: "",
    status: "",
    remark: "",
    type: ""

});

const errors = reactive({
    status: "",
    remark: "",
    message: "",
    type: ""
});

watch(
    () => props.gstDetails,
    (newValue) => {
        form.remCode = newValue.remCode || "";
        form.status = newValue.status || "";
        form.remark = newValue.remark || "";
        form.type = newValue.type || "";

        errors.remark = "";
        errors.status = "";
        errors.message = "";
    }
);

const validateStatus = () => {
    errors.status = form.status && form.status !== "Select" ? "" : "Select the status.";
};

const validateRemarks = () => {
    errors.remark = form.remark && form.remark.trim() ? "" : "Remarks is required.";
};

const handleSubmit = async () => {
    validateStatus();
    validateRemarks();
    if (!errors.status && !errors.remark) {
        loading.value = true;
        try {
            const response = await accountService.updateProfile(form);
            if (response.data?.isSuccess) {
                showSuccessToast(response.data.message);
                closeModal();
            } else {
                showErrorToast(response.data.message);
                errors.message = response.data?.message;
                loading.value = true;
            }
        } catch (error) {
            errors.message = error.response.data?.message || 'Something went wrong, please try again later.';
            loading.value = false;
        }
    } else {
        loading.value = false;
    }
};

const closeModal = () => {
    form.status = "";
    form.remark = "";
    form.remCode = "";
    errors.remark = "";
    errors.status = "";
    errors.message = "";
    loading.value = false;
    emit('update-profile-details');
    const modalElement = document.getElementById("updateGST");
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    modal.hide();
};

</script>

<style scoped></style>
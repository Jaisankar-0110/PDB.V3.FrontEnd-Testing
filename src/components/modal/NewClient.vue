<template>
    <div class="modal fade" id="NewClient" tabindex="-1" aria-labelledby="NewClient" aria-hidden="true"
        data-bs-backdrop="static">
        <div class="modal-dialog modal-md modal-dialog-centered">
            <div class="modal-content p-md-5 p-3">
                <div class="modal-header border-bottom-0 w-100">
                    <div class="text-center fs18 fw500">
                        New Client
                    </div>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="handleNewClient">
                        <div >
                            <div class="position-relative">
                                <div class="form-control-text">
                                    <label class="fs14 text-muted">Full name</label>
                                    <input type="text" maxlength="30" @blur="validateName" @input="sanitizeName"
                                        v-model="form.name" class="fs14 mt-1 custom-input" placeholder="Enter the Full Name">
                                    <ErrorMessage :class="'text-start form-text fs12 text-danger'"
                                        :message="errors.name" />
                                </div>
                            </div>
                        </div>

                        <div class="mb-3 mt-3">
                            <div class="position-relative">
                                <div class="form-control-text">
                                    <label class="fs14  text-muted">Email ID</label>
                                    <input type="email" maxlength="50" @blur="validateEmail" @input="sanitizeEmail"
                                        v-model="form.email" class="fs14 mt-1 custom-input" placeholder="Enter the Email ID">
                                    <ErrorMessage :class="'text-start form-text fs12 text-danger'"
                                        :message="errors.email" />
                                </div>
                            </div>
                        </div>
                        <div class="mb-3 mt-3">
                            <div class="position-relative">
                                <div class="form-control-text">
                                    <label class="fs14  text-muted ">Mobile Number</label>
                                    <input type="text" maxlength="10" @blur="validatePhone" v-model="form.mobile"
                                        oninput="this.value = this.value.replace(/[^0-9]/g, '');"
                                        class="fs14 mt-1 custom-input" placeholder="Enter the Mobile Number">
                                    <ErrorMessage :class="'text-start form-text fs12 text-danger'"
                                        :message="errors.mobile" />
                                </div>
                            </div>
                        </div>

                        <ErrorMessage :class="'text-center mb-2 pt-2'" :message="errors.message" />

                        <div class="d-flex justify-content-between pt-3">
                            <ButtonTertiary label="Add" class="w-50 pe-3" :disabled="loading"  />
                            <div class="btn btn-outline-tertiary w-50 pt-2" @click="closeModal">
                                Cancel
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick, computed } from "vue";
import ButtonTertiary from '../button/ButtonTertiary.vue';
import ErrorMessage from "../ErrorMessage.vue";
import { accountService } from "../../services/account/account.service";
import { Modal } from "bootstrap";
import { useAuthStore } from '@/stores/authStore';
import { showErrorToast, showSuccessToast } from "../../js/toast";

const authStore = useAuthStore();
const adminDetails = ref({});

const loading = ref(false);

const form = reactive({
    name: "",
    email: "",
    mobile: "",
});

const errors = reactive({
    name: "",
    email: "",
    mobile: "",
    message: ""
});

onMounted(() => {
    adminDetails.value = authStore.adminDetails;
});

const validatePhone = () => {
    const mobileRegex = /^[6-9]\d{9}$/;
    const repeatRegex = /(.)\1{7,}/;
    if (!form.mobile) {
        errors.mobile = "Mobile number is required.";
        loading.value = false;
    } else if (!mobileRegex.test(form.mobile)) {
        errors.mobile = "Mobile number must start with 6, 7, 8, or 9 and be 10 digits.";
        loading.value = false;
    } else if (repeatRegex.test(form.mobile)) {
        errors.mobile = "Mobile number must not have the same digit repeated more than 7 times.";
        loading.value = false;
    } else {
        errors.mobile = "";
    }
};

const sanitizeEmail = (event) => {
    const clean = event.target.value.replace(/[^a-zA-Z0-9@._-]/g, '');
    form.email = clean;
};

const validateEmail = () => {
    if (!form.email) {
        errors.email = "Email ID is required.";
        loading.value = false;
    } else {
        errors.email = "";
    }
};

const sanitizeName = (event) => {
    const clean = event.target.value.replace(/[^a-zA-Z ]/g, '');
    form.name = clean;
};

const validateName = () => {
    if (!form.name) {
        errors.name = "Full name is required.";
        loading.value = false;
    } else {
        errors.name = "";
    }
};

const handleNewClient = async () => {
    validateName();
    validateEmail();
    validatePhone();
    if (!errors.name && !errors.email && !errors.mobile) {
        loading.value = true;
        const data = {
            leademail: form.email.toUpperCase(),
            leadmobile: form.mobile,
            Apid: adminDetails.value.RemCode,
            LeadName: form.name.toUpperCase(),
        }
        try {
            const response = await accountService.newClient(data);
            if (response.data?.isSuccess) {
                if (response.data.data.isCreated) {
                    showSuccessToast(response.data.message);
                    closeModal();
                    loading.value = false;
                } else {
                    showErrorToast(response.data.message);
                    errors.message = response.data.message;
                    loading.value = false;
                }
            } else {
                errors.message = response.data?.message ;
                loading.value = false;
            }
        } catch (error) {
            errors.message = err.response.data?.message || 'Something went wrong, please try again later.';
            loading.value = false;
        }
    } else {
        loading.value = false;
    }
};

const closeModal = () => {
    form.name = "";
    form.email = "";
    form.mobile = "";
    errors.name = "";
    errors.email = "";
    errors.mobile = "";
    errors.message = "";
    loading.value = false;
    const modalElement = document.getElementById("NewClient");
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    modal.hide();
};

</script>

<style scoped></style>
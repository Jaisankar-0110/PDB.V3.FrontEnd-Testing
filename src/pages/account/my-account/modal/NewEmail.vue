<template>
    <div class="modal fade" id="NewEmail" tabindex="-1" aria-labelledby="NewEmail" aria-hidden="true"
        data-bs-backdrop="static">
        <div class="modal-dialog modal-md modal-dialog-centered">
            <div class="modal-content p-md-5 p-3">
                <div class="modal-header border-bottom-0 w-100" v-if="!isOTPSection">
                    <div class="text-center">
                        <div class="modal-title fs18 fw-semibold">New Email Address</div>
                        <p class="fs14 text-muted mt-2 mb-0">
                            Please enter your new email address. We'll send a verification code to confirm your changes.
                        </p>
                    </div>
                </div>
                <div class="modal-body">
                    <div v-if="!isOTPSection">
                        <form @submit.prevent="sendEmailOTP">
                            <div class="mb-3">
                                <div class="position-relative">
                                    <div class="form-control-text">
                                        <label class="fs14  text-muted">New Email Address</label>
                                        <input type="email" maxlength="50" @blur="validateEmail" @input="sanitizeEmail"
                                            v-model="form.email" class="fs14 mt-1 custom-input"
                                            placeholder="example@domain.com">
                                        <ErrorMessage :class="'text-start form-text fs12 text-danger'"
                                            :message="errors.email" />
                                    </div>
                                </div>
                            </div>
                            <ErrorMessage :class="'text-center mb-2 pt-2'" :message="errors.message" />
                            <div class="d-flex justify-content-between pt-3">
                                <div class="btn btn-outline-tertiary pt-2 w-50" @click="closeModal">
                                    Cancel
                                </div>
                                <ButtonTertiary label="Send OTP" class="w-50 ps-3" :disabled="loading" />
                            </div>
                        </form>
                    </div>

                    <div v-else>
                        <VerifyOTP :data="emailModDetails"  @update-details="updateDetails" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick, computed } from "vue";
import ErrorMessage from "../../../../components/ErrorMessage.vue";
import { useAuthStore } from '@/stores/authStore';
import ButtonTertiary from "../../../../components/button/ButtonTertiary.vue";
import VerifyOTP from "../modal/VerifyOTP.vue";
import { Modal } from 'bootstrap';
import { accountService } from "../../../../services/account/account.service";

const authStore = useAuthStore();
const adminDetails = ref({});

const loading = ref(false);
const isOTPSection = ref(false);

const emailModDetails = ref({})

const form = reactive({
    email: "",
});

const errors = reactive({
    email: "",
    message: ""
});

onMounted(() => {
    adminDetails.value = authStore.adminDetails;
});

const sanitizeEmail = (event) => {
    const clean = event.target.value.replace(/[^a-zA-Z0-9@._-]/g, '');
    form.email = clean;
};

const validateEmail = () => {
    if (!form.email) {
        errors.email = "New Email ID is required.";
        loading.value = false;
    } else {
        errors.email = "";
    }
};

const validateForm = () => {
    errors.message = '';
    validateEmail();
    return !errors.email;
};

const sendEmailOTP = async () => {
    if (!validateForm()) return;
    loading.value = true;
    try {
        const response = await accountService.sendEmailOTP({
            identifier: form.email,
        });

        if (response.data?.isSuccess) {
            emailModDetails.value = {
                RemeshireCode: adminDetails.value.RemCode,
                Type: "email",
                Identifier: form.email
            }
            isOTPSection.value = true;
        } else {
            errors.message = response.data?.message || 'Something went wrong, please try again later.';
        }
         loading.value = false;
    } catch (err) {
        console.error(err);
        errors.message = err.response.data?.message || 'Something went wrong, please try again later.';
        loading.value = false;
    }

};

const updateDetails = () => {
    closeModal();
};

const closeModal = () => {
    form.email = "";
    errors.email = "";
    errors.message = "";
    loading.value = false;
    isOTPSection.value = false;
    const modalElement = document.getElementById("NewEmail");
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    modal.hide();
};

</script>

<style scoped></style>
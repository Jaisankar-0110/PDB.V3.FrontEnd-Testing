<template>
    <div class="modal fade" id="NewMobile" tabindex="-1" aria-labelledby="NewMobile" aria-hidden="true"
        data-bs-backdrop="static">
        <div class="modal-dialog modal-md modal-dialog-centered">
            <div class="modal-content p-md-5 p-3">
                <div class="modal-header border-bottom-0 w-100" v-if="!isOTPSection">
                    <div class="text-center">
                        <div class="modal-title fs18 fw-semibold">New Mobile Number</div>
                        <p class="fs14 text-muted mt-2 mb-0">
                            Please enter your new mobile number. We'll send a verification code to confirm your changes.
                        </p>
                    </div>
                </div>
                <div class="modal-body">
                    <div v-if="!isOTPSection">
                        <form @submit.prevent="sendMobileOTP">
                            <div class="mb-3 mt-1">
                                <div class="position-relative">
                                    <div class="form-control-text">
                                        <label class="fs14 text-muted">Mobile Number</label>
                                        <input type="text" maxlength="10" @blur="validatePhone" v-model="form.mobile"
                                            oninput="this.value = this.value.replace(/[^0-9]/g, '');"
                                            class="fs14 mt-1 custom-input" placeholder="Enter the mobile number" />
                                        <ErrorMessage :class="'text-start form-text fs12 text-danger'"
                                            :message="errors.mobile" />
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
                        <VerifyOTP :data="mobileModDetails"  @update-details="updateDetails" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, reactive, onMounted, watch, nextTick, computed } from "vue";
import ErrorMessage from "../../../../components/ErrorMessage.vue";
import { Modal } from "bootstrap";
import { useAuthStore } from '@/stores/authStore';
import ButtonTertiary from "../../../../components/button/ButtonTertiary.vue";
import VerifyOTP from "../modal/VerifyOTP.vue";
import { authService } from "../../../../services/auth/auth.service";

const authStore = useAuthStore();
const adminDetails = ref({});

const loading = ref(false);
const isOTPSection = ref(false);

const mobileModDetails = ref({})

const form = reactive({
    mobile: "",
});

const errors = reactive({
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


const validateForm = () => {
    errors.message = '';
    validatePhone();
    return !errors.mobile;
};

const sendMobileOTP = async () => {
    if (!validateForm()) return;
    loading.value = true;
    try {
        const response = await authService.sendOTP({
            identifier: form.mobile,
        });

        if (response.data?.isSuccess) {
            mobileModDetails.value = {
                RemeshireCode: adminDetails.value.RemCode,
                Type: "mobile",
                Identifier: form.mobile
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
    form.mobile = "";
    errors.mobile = "";
    errors.message = "";
    loading.value = false;
    isOTPSection.value = false;
    const modalElement = document.getElementById("NewMobile");
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    modal.hide();
};

</script>

<style scoped></style>
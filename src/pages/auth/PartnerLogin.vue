<template>
    <div>
        <h4 class="card-title fs20 text-dark text-center mb-3 mt-4">Login to partner portal</h4>
        <div class="mt-4">
            <form @submit.prevent="handleSubmit" class="mt-4 pt-2">

                <div class="mb-3">
                    <div class="position-relative">
                        <div class="form-control-text">
                            <label class="fs14 text-muted">Franchise Code</label>
                            <input type="text" class="fs14 mt-1 custom-input" v-model="form.username"
                                @blur="validateUsername" maxlength="12" @input="sanitizeUsername">
                            <ErrorMessage :class="'text-start form-text fs12 text-danger'" :message="errors.username" />
                        </div>
                    </div>
                </div>

                <div v-if="isPasswordReset === false">
                    <div class="mb-3 mt-3">
                        <div class="position-relative">
                            <div class="form-control-text">
                                <label class="fs14 text-muted">Password</label>
                                <div class="input-group mt-1 position-relative">
                                    <input :type="showPassword ? 'text' : 'password'"
                                        class="form-control-text passoword fs14 custom-input" v-model="form.password"
                                        @blur="validatePassword" maxlength="20">
                                    <span class="eye-icon bg-white cursor-pointer" @click="togglePassword">
                                        <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                    </span>
                                </div>
                                <ErrorMessage :class="'text-start form-text fs12 text-danger'"
                                    :message="errors.password" />
                            </div>
                        </div>
                    </div>
                    <div class="form-check d-flex justify-content-end fs14 mt-1">
                        <div @click="forgotPassword">
                            <label class="text-tertiary-color cursor-pointer">
                                Forgot Password
                            </label>
                        </div>
                    </div>
                </div>

                <ErrorMessage :class="'text-center mb-2 pt-2'" :message="errors.message" />

                <div class="text-center pt-3">
                    <PrimaryButton label="Continue" :loading="loading" />
                </div>
            </form>
        </div>
    </div>
    <InductionVideo id="InductionVideo" />
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/auth/auth.service';
import ErrorMessage from '@/components/ErrorMessage.vue';
import PrimaryButton from '@/components/button/ButtonPrimary.vue';
import { Modal } from "bootstrap";
import InductionVideo from './modal/InductionVideo.vue';

const router = useRouter();
const authStore = useAuthStore();

const showPassword = ref(false);

const isPasswordReset = ref(null);

const form = reactive({
    username: '',
    password: '',
    role: 'REMESHIRE',
});

const errors = reactive({
    username: '',
    password: '',
    message: '',
});

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

const sanitizeUsername = (event) => {
    const clean = event.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    form.username = clean;
};

const validateUsername = () => {
    const trimmed = form.username.trim();
    if (!trimmed) {
        errors.username = 'Franchise code is required.';
    } else if (trimmed.length < 3) {
        errors.username = 'Franchise code must be at least 3 characters.';
    } else if (!/^[A-Z0-9]+$/.test(trimmed)) {
        errors.username = 'Franchise code must be in capital letters only.';
    } else {
        errors.username = '';
    }
};

const validatePassword = () => {
    if (!form.password) {
        errors.password = 'Password is required.';
    } else if (form.password.length < 5) {
        errors.password = 'Password must be at least 5 characters.';
    } else {
        errors.password = '';
    }
};

const validateFCCode = () => {
    errors.message = '';
    validateUsername();
    return !errors.username;
};

const validateForm = () => {
    errors.message = '';
    validateUsername();
    validatePassword();
    return !errors.username && !errors.password;
};

const forgotPassword = () => {
    localStorage.removeItem('role');
    localStorage.setItem('role', form.role);
    localStorage.setItem('isPasswordReset', true);
    router.push('/forgot-password');
};

const handleSubmit = async () => {
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('identifier');
    localStorage.removeItem('otpSend');
    localStorage.removeItem('isPasswordReset');
    sessionStorage.removeItem('token');
    localStorage.removeItem('otp_expiry');
    sessionStorage.removeItem('tokenExpiry');
    localStorage.removeItem('identifierMail');
    localStorage.removeItem('identifierMobile');
    if (isPasswordReset.value === true || isPasswordReset.value === null) {
        handlePasswordCheck();
    } else {
        handleLogin();
    }
}

const handlePasswordCheck = async () => {
    errors.message = '';
    if (!validateFCCode()) return;
    try {

        const response = await authService.partnerPasswordCheck(form.username.trim());

        if (response.data?.isSuccess) {
            isPasswordReset.value = response.data.data.isPasswordReset;
            // isPasswordReset.value = true;
            localStorage.setItem('identifier', response.data.data.mobile);
            localStorage.setItem('identifierMobile', response.data.data.mobile);
            localStorage.setItem('identifierMail', response.data.data.Email);
            localStorage.setItem('otpSend', false);
            localStorage.setItem('isPasswordReset', isPasswordReset.value);
            if (isPasswordReset.value === true) {
            localStorage.setItem('username',  form.username);
            localStorage.setItem('role', form.role);
                openInductionVideo();
            }
        } else {
            errors.message = response.data?.message || 'Something went wrong, please try again later.';
        }
    } catch (err) {
        console.error(err);
        errors.message = err.response.data?.message || 'Something went wrong, please try again later.';
    }
}

const handleLogin = async () => {
    errors.message = '';

    if (!validateForm()) return;

    try {
        authStore.clearAdminDetails();

        const response = await authService.login({
            username: form.username.trim(),
            password: form.password,
            role: form.role,
        });

        if (response.data?.isSuccess) {
            localStorage.setItem('role', form.role);
            localStorage.setItem('identifier', response.data.data.identifier);
            localStorage.setItem('otpSend', false);
            localStorage.setItem('isPasswordReset', isPasswordReset.value);
            await router.push('/verify-otp');
        } else {
            errors.message = response.data?.message || 'Something went wrong, please try again later.';
        }
    } catch (err) {
        console.error(err);
        errors.message = err.response.data?.message || 'Something went wrong, please try again later.';
    }
};

const openInductionVideo = () => {
     nextTick(() => {
        const proofModal = new Modal(document.getElementById('InductionVideo'));
        proofModal.show();
    });
};

</script>

<style scoped>
.eye-icon {
    position: absolute;
    top: 10px;
    right: 10px;
}
</style>

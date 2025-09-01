<template>
    <div>
        <h4 class="card-title fs20 text-dark text-center mb-3 mt-4">Login to admin portal</h4>
        <div class="mt-4">
            <form @submit.prevent="handleSubmit" class="mt-4 pt-2">
                <div class="mb-3">
                    <div class="position-relative">
                        <div class="form-control-text">
                            <label class="fs14 text-muted">Email ID</label>
                            <input type="text" class="fs14 mt-1 custom-input" v-model="form.username"
                                @blur="validateUsername" @input="sanitizeEmail" maxlength="50">
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
                                        class="form-control-text fs14 custom-input" v-model="form.password"
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
                    <PrimaryButton label="Continue" :disabled="loading" />
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/auth/auth.service';
import ErrorMessage from '@/components/ErrorMessage.vue';
import PrimaryButton from '@/components/button/ButtonPrimary.vue';

const router = useRouter();
const authStore = useAuthStore();

const isPasswordReset = ref(null);

const loading = ref(false);

const showPassword = ref(false);

const form = reactive({
    username: '',
    password: '',
    role: 'ADMIN',
});

const errors = reactive({
    username: '',
    password: '',
    message: '',
});

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

const validateUsername = () => {
    errors.username = form.username.trim()
        ? ''
        : 'Email ID is required.';
};

const sanitizeEmail = (event) => {
    const clean = event.target.value.replace(/[^a-zA-Z0-9@._-]/g, '');
    form.username = clean;
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

const validateEmail = () => {
    errors.message = '';
    validateUsername();
    return !errors.username;
};

const validateForm = () => {
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
    loading.value = true;
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('identifier');
    localStorage.removeItem('otpSend');
    localStorage.removeItem('isPasswordReset');
    sessionStorage.removeItem('token');
    localStorage.removeItem('otp_expiry');
    sessionStorage.removeItem('tokenExpiry');
    if (isPasswordReset.value === true || isPasswordReset.value === null) {
        handlePasswordCheck();
    } else {
        handleLogin();
    }
}

const handlePasswordCheck = async () => {
    errors.message = '';
    if (!validateEmail()) return;

    try {

        const response = await authService.adminPasswordCheck(form.username.trim());

        if (response.data?.isSuccess) {
            isPasswordReset.value = response.data.data.isPasswordReset;
            // isPasswordReset.value = true;
            localStorage.setItem('identifier', response.data.data.Email);
            localStorage.setItem('otpSend', false);
            localStorage.setItem('isPasswordReset', isPasswordReset.value);
            if (isPasswordReset.value === true) {
                localStorage.setItem('username', form.username);
                localStorage.setItem('role', form.role);
                localStorage.setItem('isPasswordReset', isPasswordReset.value);
                await router.push('/verify-otp');
            }
        } else {
            errors.message = response.data?.message || 'Something went wrong, please try again later.';
        }
    } catch (err) {
        console.error(err);
        errors.message = err.response.data?.message || 'Something went wrong, please try again later.';
    } finally {
        loading.value = false;
    }
}

const handleLogin = async () => {
    errors.message = '';

    if (!validateForm()) return;

    try {
        authStore.clearAdminDetails();
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('tokenExpiry');
        localStorage.removeItem('role');
        localStorage.removeItem('identifier');
        localStorage.removeItem('otpSend');

        const response = await authService.login({
            username: form.username.trim(),
            password: form.password,
            role: form.role,
        });

        if (response.data?.isSuccess) {
            localStorage.setItem('role', form.role);
            localStorage.setItem('identifier', response.data.data.identifier);
            localStorage.setItem('otpSend', false);
            await router.push('/verify-otp');

        } else {
            errors.message = response.data?.message || 'Something went wrong, please try again later.';
        }
    } catch (err) {
        console.error(err);
        errors.message = err.response.data?.message || 'Something went wrong, please try again later.';
    } finally {
        loading.value = false;
    }
};
</script>
<style scoped>
.eye-icon {
    position: absolute;
    top: 10px;
    right: 15px;
}
</style>
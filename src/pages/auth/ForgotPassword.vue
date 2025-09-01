<template>
    <div class="border-0">
        <h4 class="card-title fs20 text-dark text-center mb-3 mt-4">Forgot Password</h4>
        <div class="mt-4">
            <form @submit.prevent="handleLogin" class="mt-4 pt-2">
                <div class="mb-3">
                    <div class="position-relative">
                        <div class="form-control-text">
                            <label class="fs14 text-muted">{{ role === 'REMESHIRE' ? 'Franchise Code' : 'Email ID' }}</label>
                            <input type="text" :maxlength="role === 'REMESHIRE' ? '12':'50'" class="fs14 mt-1 custom-input" v-model="form.username"
                                @blur="validateUsername" @input="sanitizeUsername">
                                <ErrorMessage :class="'text-start mb-2 pt-2'" :message="errors.username" />
                        </div>
                    </div>
                </div>
                <ErrorMessage :class="'text-center mb-2 pt-2'" :message="errors.message" />
                <div class="text-center pt-3">
                    <PrimaryButton label="Continue"  />
                </div>
                <div class="text-center mt-3">
                    <RouterLink :to="role === 'REMESHIRE' ? '/' : '/admin'"
                        class="fs14 text-decoration-none text-dark">
                        Remembered your password? <span class="text-primary-color">Login</span>
                    </RouterLink>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/auth/auth.service';
import ErrorMessage from '@/components/ErrorMessage.vue';
import PrimaryButton from '@/components/button/ButtonPrimary.vue';

const router = useRouter();
const route = useRoute();
const role = localStorage.getItem('role');
const authStore = useAuthStore();

const form = reactive({
    username: '',
    role: role,
});

const errors = reactive({
    username: '',
    message: '',
});

const sanitizeUsername = (event) => {
    const clean = role === 'REMESHIRE' ? event.target.value.replace(/[^a-zA-Z0-9]/g, '') : event.target.value.replace(/[^a-zA-Z0-9@._-]/g, '');
    form.username = clean;
};

const validateUsername = () => {
    errors.username = form.username.trim()
        ? ''
        : role === 'REMESHIRE'
            ? 'Franchise Code is required.'
            : 'Email is required.';
};

const validateForm = () => {
    validateUsername();
    return !errors.username;
};

const handleLogin = async () => {
    errors.message = '';

    if (!validateForm()) return;
    localStorage.removeItem('identifier');
    localStorage.removeItem('identifierMail');
    localStorage.removeItem('username');
    localStorage.removeItem('otp_expiry');
    localStorage.removeItem('otpSend');
    try {
        const response = await authService.forgotPassword(form);

        if (response.data?.isSuccess) {
            localStorage.setItem('identifierMobile', role === 'REMESHIRE' ? response.data.data.mobile : form.username.toUpperCase());
            localStorage.setItem('identifierMail', role === 'REMESHIRE' ? response.data.data.email : form.username.toUpperCase());
            localStorage.setItem('username',  form.username);
            localStorage.setItem('otpSend',  false);
            await router.push('/verify-otp');
        } else {
            errors.message = response.data?.message || 'Something went wrong, please try again later.';
        }
    } catch (err) {
        console.error(err);
        errors.message = err.response.data?.message || 'Something went wrong, please try again later.';
    }
};
</script>

<style scoped></style>
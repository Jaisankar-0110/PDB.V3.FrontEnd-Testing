<template>
    <div class="card-0 p-2">
        <div class="card-header pb-3 px-0 bg-transparent">
            <div class="d-flex justify-content-between align-items-center">
                <div class="text-quaternary-color fs18 pb-2 fw500">Connect to Your Partner Portal</div>
            </div>
        </div>
        <div class="card-body pt-4 px-0">
            <div class="mt-1">
                <div class="row">
                    <div class="col-lg-6 text-center">
                        <div class="d-flex align-items-center justify-content-center mt-4">
                            <img src="/image/ps-3.png" alt="Auth Image" class="ps-img" />
                        </div>
                    </div>
                    <div class="col-lg-6 p-md-5 p-2">
                        <div class="d-flex align-items-center justify-content-center">
                            <div class="ps-form-card card p-md-3 p-2">
                                <div class="card-body">
                                    <div class="mt-1">
                                        <form @submit.prevent="handleCheck">
                                            <div class="mb-3">
                                                <div class="position-relative">
                                                    <div class="form-control-text">
                                                        <label class="fs14 text-dark">Franchise Code</label>
                                                        <input type="text" class="fs14 mt-1 custom-input"
                                                            v-model="form.username" @blur="validateUsername"
                                                            maxlength="12" @input="sanitizeUsername">
                                                        <ErrorMessage :class="'text-start form-text fs12 text-danger'"
                                                            :message="errors.username" />
                                                    </div>
                                                </div>
                                            </div>
                                            <ErrorMessage :class="'text-center mb-2 pt-2'" :message="errors.message" />
                                            <div class="text-center pt-2">
                                                <PrimaryButton label="Continue to Dashboard" :disabled="loading" />
                                            </div>
                                        </form>
                                    </div>
                                    <div class="text-center mt-4">
                                        <p class="text-muted small mb-2">Need help with your franchise code?</p>
                                        <a href="mailto:partnersupport@aliceblueindia.com"
                                            class="text-decoration-none small">Contact Partner Support</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import ErrorMessage from '@/components/ErrorMessage.vue';
import PrimaryButton from '@/components/button/ButtonPrimary.vue';
import { authService } from '../../../../services/auth/auth.service';

const router = useRouter();
const authStore = useAuthStore();
const adminDetails = ref({});

const loading = ref(false);

const form = reactive({
    username: '',
    role: 'ADMIN',
});

const errors = reactive({
    username: '',
    message: '',
});

onMounted(() => {
    adminDetails.value = authStore.adminDetails;
});

// const sanitizeUsername = (event) => {
//     const clean = event.target.value.replace(/[^a-zA-Z0-9]/g, '');
//     form.username = clean;
// };

const sanitizeUsername = (event) => {
    const clean = event.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    form.username = clean;
};

const validateUsername = () => {
    const trimmed = form.username.trim();
    if (!trimmed) {
        errors.username = 'Franchise code is required.';
    }  else {
        errors.username = '';
    }
};

const validateForm = () => {
    errors.message = '';
    validateUsername();
    return !errors.username;
};

const handleCheck = async () => {
    loading.value = true;
    errors.message = '';
    if (!validateForm()) return;
    try {
        const response = await authService.remcheck(form.username);
        if (response.data?.isSuccess) {
            const updatedDetails = {
                ...adminDetails.value,
                RemCode: form.username.toUpperCase()
            };
            authStore.setAdminDetails(updatedDetails);
            adminDetails.value = updatedDetails;
            getBanner();
        } else {
            loading.value = false;
            errors.message = response.data?.message || 'Something went wrong, please try again later.';
        }
    } catch (err) {
        console.error(err);
         loading.value = false;
        errors.message = err.response.data?.message || 'Something went wrong, please try again later.';
    }
};

const getBanner = async () => {
    sessionStorage.removeItem('bannerShown');
    localStorage.removeItem('banners');
    const remCode = form.username.toUpperCase();
    errors.message = '';
    try {
        const response = await authService.getBanners(remCode);
        if (response.data?.isSuccess) {
            const banners = response.data.data;
            if (banners.length > 0) {
                localStorage.setItem('banners', JSON.stringify(banners));
                router.push('/dashboard');
            } else {
                router.push('/dashboard');
            }
        } else {
            router.push('/dashboard');
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
.logo {
    width: 100px;
}

.ps-img {
    width: 70% !important;
}

.ps-form-card {
    width: 100% !important;
    max-width: 420px !important;
    box-shadow: none !important;
}
</style>

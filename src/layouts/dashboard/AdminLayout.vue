<template>
    <div class="container">
        <header class="py-md-4 py-3">
            <div class="d-flex justify-content-between">
                <img src="/image/logo.png" class="logo" />
                <div class="profile">
                    <div class="position-relative">
                        <img src="/image/user.png"
                            class="user-icon d-inline-block rounded-circle border align-top cursor-pointer" alt="Logo"
                            @click="toggleInfo" />
                        <div v-if="showInfo" class="position-absolute bg-white shadow rounded info-box p-3">
                            <div class="d-flex mb-2">
                                <div>
                                    <img src="/image/user.png"
                                        class="user-icon1 d-inline-block rounded-circle border cursor-pointer me-3"
                                        alt="Logo" />
                                </div>
                                <div>
                                    <p class="text-dark fw500 fs16 mb-0">{{ adminDetails.Name || '-' }}</p>
                                    <p class="text-muted fs12">{{ adminDetails.Role || '-' }}</p>
                                </div>
                            </div>
                            <table class="w-100">
                                <tbody>
                                    <tr>
                                        <td class="label-cell fs12 text-quaternary-color py-2">
                                            <i class="bi text-danger bi-envelope-fill me-1"></i> Email
                                        </td>
                                        <td class="text-muted fs12 px-1"> : {{ adminDetails.Email &&
                                            adminDetails.Email.length > 20
                                            ? adminDetails.Email.slice(0, 20).toLowerCase() + '...'
                                            : adminDetails.Email.toLowerCase() || '-' }} </td>
                                    </tr>
                                    <tr>
                                        <td class="label-cell fs12 text-quaternary-color py-2">
                                            <i class="bi text-primary bi-telephone-fill me-1"></i> Mobile
                                        </td>
                                        <td class="text-muted fs12  px-1"> :
                                            {{ adminDetails.MobileNo ? '******' +
                                                adminDetails.MobileNo.toString().slice(-4)
                                            : '-' }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" class="pt-3">
                                            <button class="btn btn-outline-danger w-100 fs14" @click="signOut">
                                                <i class="bi bi-box-arrow-right fs16 me-1"></i> Logout
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <div class="container">
            <router-view />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, useRoute } from "vue-router";

const authStore = useAuthStore();
const adminDetails = ref({});
const router = useRouter();

const showInfo = ref(false);

const toggleInfo = () => {
    showInfo.value = !showInfo.value;
};

onMounted(() => {
    adminDetails.value = authStore.adminDetails;
    document.addEventListener('click', (e) => {
        const profile = document.querySelector('.user-icon');
        const infoBox = document.querySelector('.position-absolute.bg-white');
        if (
            showInfo.value &&
            infoBox &&
            !infoBox.contains(e.target) &&
            !profile.contains(e.target)
        ) {
            showInfo.value = false;
        }
    });
});

const signOut = async () => {
    showInfo.value = false
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('tokenExpiry');
    localStorage.removeItem('role');
    localStorage.removeItem('identifier');
    localStorage.removeItem('username');
    localStorage.removeItem('otpSend');
    localStorage.removeItem('otp_expiry');
    localStorage.removeItem('adminDetails');
    localStorage.removeItem('isPasswordReset');
    localStorage.removeItem('banners');
    localStorage.removeItem('announcement');

    const role = authStore.adminDetails?.Role;

    try {
        const data = authStore.adminDetails?.Role === 'REMESHIRE' ? authStore.adminDetails?.RemCode : authStore.adminDetails?.Email;
        const response = await authService.logout(data);
        if (response.data?.isSuccess) {

        } else {
            console.log(response.data?.message);
        }
    } catch (err) {
        console.error(err);
    }

    authStore.clearAdminDetails();

    router.push('/admin');

};
</script>

<style scoped>
.logo {
    width: 120px;
}

.user-icon1 {
    width: 45px !important;
}

.user-icon {
    width: 40px;
}

@media (max-width: 768px) {
    .user-icon {
        width: 30px;
    }

    .logo {
        width: 100px;
    }
}

.info-box {
    top: 58px;
    right: 0px;
    width: 260px !important;
    z-index: 1000;
}

.btn {
    border: 1px solid var(--error) !important;
}

.label-cell {
    white-space: nowrap;
    width: 50px !important;
}
</style>
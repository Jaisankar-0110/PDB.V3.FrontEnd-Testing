<template>
    <nav class="navbar px-2" :class="isAnnouncement ? 'pt-3' : null">
        <div class="d-flex justify-content-between align-items-center w-100 gap-md-3 gap-3 py-1">
            <div class="position-relative">
                <img src="/image/user.png"
                    class="user-icon d-inline-block rounded-circle border align-top cursor-pointer" alt="Logo"
                    @click="toggleInfo" />
                <div v-if="showInfo" class="position-absolute bg-white shadow rounded info-box p-3">
                    <p class="text-quaternary-color fs12"> Partner code : <b> {{ adminDetails.RemCode }} </b> </p>
                    <p class="text-quaternary-color fs12"> Data Last updated : <b> {{ formattedDate }} 09:00 AM </b>
                    </p>
                    <RouterLink to="/my-account" @click="showInfo = false">
                        <button class="btn btn-primary w-100"><i class="bi bi-person-fill-gear fs16 me-1"></i> My
                            Account</button>
                    </RouterLink>
                </div>
            </div>
            <!-- <div class="position-relative search-field-container">
                <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ps-3 text-muted"></i>
                <input type="text" class="form-control .search-input ps-5 rounded-pill fs14" placeholder="Search" />
            </div> -->
            <div>
                 <!--<a :href="jadeUrl" target="_blank" class="text-decoration-none text-white me-3 fs14">
                    <i class="bi bi-box-arrow-up-right fs16 me-1"></i> JADE
                </a> -->
                <button class="btn btn-primary fs14 px-md-4 me-md-3" @click="openModal">New Client</button>
            </div>
        </div>
    </nav>
    <NewClient />
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import NewClient from '../../components/modal/NewClient.vue';
import { useAuthStore } from '@/stores/authStore';
import { RouterLink } from 'vue-router';

defineProps({
    isAnnouncement: Boolean
})

const authStore = useAuthStore();
const adminDetails = ref({});
const showInfo = ref(false);
const formattedDate = ref('');

const now = new Date();
now.setDate(now.getDate() - 1);
const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    //   hour: 'numeric',
    //   minute: '2-digit',
    //   hour12: true
};

formattedDate.value = now.toLocaleString('en-GB', options).replace(/\//g, '-');

const toggleInfo = () => {
    showInfo.value = !showInfo.value;
};

const jadeUrl = ref('');

onMounted(() => {
    adminDetails.value = authStore.adminDetails;
    jadeUrl.value = 'https://partneruat.aliceblueonline.com/tp?token=' + sessionStorage.getItem('token') + '&remCode=' + authStore.adminDetails.RemCode;
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

const openModal = () => {
    nextTick(() => {
        const proofModal = new Modal(document.getElementById('NewClient'));
        proofModal.show();
    });
};
</script>

<style scoped>
.navbar {
    background-color: var(--secondary) !important;
}

.user-icon {
    width: 44px;
    height: auto;
}

.search-field-container {
    flex: 1;
    max-width: 450px;
}

.search-input {
    border-radius: 50%;
    height: 34px;
}

@media (max-width: 768px) {
    .user-icon {
        width: 38px;
        height: auto;
    }
}

.info-box {
    top: 58px;
    left: -8px;
    min-width: 250px;
    width: 290px;
    z-index: 100;
}
</style>

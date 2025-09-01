<template>
    <div class="row">
        <div class="col-md-12 col-lg-6 col-xxl-4 col-xl-6  pb-3">
            <div class="mb-3 mt-3">
                <div class="position-relative">
                    <div class="form-control-text">
                        <label class="fs14 text-muted ">Email ID
                            <i class="bi bi-pencil-square text-primary-color fs14 ps-2 cursor-pointer"
                                @click="openModal" v-if="role === 'REMESHIRE'"></i>
                        </label>
                        <div class="input-group mt-1 position-relative">
                            <input readonly type="text" class="form-control-text fs14 custom-input" maxlength="20"
                                :value="accountDetails.EmailId ? accountDetails.EmailId.replace(/^(.{4})([^@]*)@/, (_, a) => a + '*'.repeat(6) + '@') : '-'">
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-12 col-lg-6 col-xxl-4 col-xl-6 pb-3">
            <div class="mb-3 mt-3">
                <div class="position-relative">
                    <div class="form-control-text">
                        <label class="fs14 text-muted">Mobile No
                            <i class="bi bi-pencil-square text-primary-color fs14 ps-2 cursor-pointer"
                                @click="openMobileModal" v-if="role === 'REMESHIRE'"></i>
                        </label>
                        <div class="input-group mt-1 position-relative">
                            <input readonly type="text" class="form-control-text fs14 custom-input" maxlength="20"
                                :value="accountDetails.MobileNo ? '******' + accountDetails.MobileNo.slice(-4) : '-'">
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-12 col-lg-6 col-xxl-4 col-xl-6 pb-3">
            <div class="mb-3 mt-3">
                <div class="position-relative">
                    <div class="form-control-text">
                        <label class="fs14 text-muted">GST No 
                            <i class="bi bi-pencil-square text-primary-color fs14 ps-2 cursor-pointer"
                                @click="openGSTModal" v-if="role === 'REMESHIRE'"></i>
                        </label>
                        <div class="input-group mt-1 position-relative">
                            <input readonly type="text" class="form-control-text fs14 custom-input" maxlength="20"
                                :value="accountDetails.GSTNumber ? '******' + accountDetails.GSTNumber.slice(-5) : '-'">
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-12 col-lg-6 col-xxl-4 col-xl-6 pb-3">
            <div class="mb-3 mt-3">
                <div class="position-relative">
                    <div class="form-control-text">
                        <label class="fs14 text-muted">Address 
                            <i class="bi bi-pencil-square text-primary-color fs14 ps-2 cursor-pointer" @click="openAddrModal" v-if="role === 'REMESHIRE'"></i>
                        </label>
                        <div class="input-group mt-1 position-relative">
                            <input readonly type="text" class="form-control-text fs14 custom-input" maxlength="20"
                                :value="accountDetails.Address || '-'">
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>

    <NewEmail />
    <EditGSTDetails />
    <NewMobileNumber />
    <EditAddrDetails />
    <EditPersonalDetails />
</template>

<script setup>
import { nextTick, computed } from 'vue';
import { Modal } from 'bootstrap';
import NewEmail from '../modal/NewEmail.vue';
import NewMobileNumber from '../modal/NewMobileNumber.vue';
import EditGSTDetails from '../modal/EditGSTDetails.vue';
import EditAddrDetails from '../modal/EditAddrDetails.vue';
import { useAuthStore } from '@/stores/authStore';

defineProps({
    accountDetails: {
        type: Object,
        default: () => ({}),
    },
});

const authStore = useAuthStore();

const role = computed(() => {
    return authStore.adminDetails.Role;
});

const openModal = () => {
    nextTick(() => {
        const proofModal = new Modal(document.getElementById('NewEmail'));
        proofModal.show();
    });
};

const openMobileModal = () => {
    nextTick(() => {
        const proofModal = new Modal(document.getElementById('NewMobile'));
        proofModal.show();
    });
};

const openGSTModal = () => {
    nextTick(() => {
        const proofModal = new Modal(document.getElementById('EditGSTDetail'));
        proofModal.show();
    });
};

const openAddrModal = () => {
    nextTick(() => {
        const proofModal = new Modal(document.getElementById('EditAddrDetail'));
        proofModal.show();
    });
};

</script>

<style scoped>
.form-control-text {
    height: 34px !important;
}
</style>
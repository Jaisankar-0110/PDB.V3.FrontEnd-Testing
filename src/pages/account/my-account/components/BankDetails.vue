
    <template>
        <div class="d-flex justify-content-end rounded" @click="openModal" v-if="role === 'REMESHIRE'">
            <button class="btn btn-light fs16 bg-transparent text-primary"> <i class="bi bi-pencil-square fs14  me-1 cursor-pointer"  ></i> Edit</button>
        </div>
    <div class="row">
        <div class="col-md-12 col-lg-6 col-xxl-4 col-xl-6 pb-3">
            <div class="mb-3 mt-3">
                <div class="position-relative">
                    <div class="form-control-text">
                        <label class="fs12 text-muted">Bank Name</label>
                        <div class="input-group mt-1 position-relative">
                            <input readonly type="text" class="form-control-text fs14 custom-input" maxlength="20"
                                :value="accountDetails.RemBankName || '-'">
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-12 col-lg-6 col-xxl-4 col-xl-6 pb-3">
            <div class="mb-3 mt-3">
                <div class="position-relative">
                    <div class="form-control-text">
                        <label class="fs12 text-muted">Account No</label>
                        <div  class="input-group mt-1 position-relative">
                            <input readonly type="text" class="form-control-text fs14 custom-input" maxlength="20"
                                :value="accountDetails.RemBankAcBNo || '-'">
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-12 col-lg-6 col-xxl-4 col-xl-6 pb-3">
            <div class="mb-3 mt-3">
                <div class="position-relative">
                    <div class="form-control-text">
                        <label class="fs12 text-muted">IFSC Code</label>
                        <div class="input-group mt-1 position-relative">
                            <input readonly type="text" class="form-control-text fs14 custom-input" maxlength="20"
                                :value="accountDetails.RemIfscCode || '-'">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <EditBankDetails />
</template>

<script setup>
import { nextTick, computed } from 'vue'; 
import { Modal } from 'bootstrap';
import EditBankDetails from '../modal/EditBankDetails.vue';
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
        const proofModal = new Modal(document.getElementById('EditBankDetails'));
        proofModal.show();
    });
};

</script>

<style scoped>
.form-control-text {
    height: 34px !important;
}
</style>

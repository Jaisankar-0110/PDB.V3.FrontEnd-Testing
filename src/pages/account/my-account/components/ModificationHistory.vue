<template>
    <div v-if="!loading">
        <div class="table-responsive pt-1">
            <table class="table" style="width:auto" v-if="historys.length > 0">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Old Data</th>
                        <th>New Data</th>
                        <th>Admin Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(data, index) in historys" :key="index">
                        <td>{{ formatDate(data.RequestDate) || '-' }}</td>
                        <td>{{ data.RequestType || '-' }}</td>
                        <td>{{ decryptAES(data.OldValue) || '-' }}</td>
                        <td>{{ decryptAES(data.NewValue) || '-' }}</td>
                        <td>
                            <div v-if="data.AdminStatus" :class="data.AdminStatus == 'REJECTED' ? 'alert-danger' : 'alert-info'"
                                class="alert fs13 d-inline" role="alert">
                                {{ data.AdminStatus }}
                            </div>
                            <div v-else class="text-secondary fs13 d-inline">-</div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="historys.length <= 0">
                <NoDataFound class="py-2" width="260px" />
            </div>
        </div>
       
    </div>
     <div class="text-center my-5 py-5" v-else>
            <Loading class="my-5 py-4" />
        </div>

</template>

<script setup>
import { format, addMinutes } from 'date-fns';
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { accountService } from '../../../../services/account/account.service';
import CryptoJS from 'crypto-js';
import NoDataFound from '../../../../components/NoDataFound.vue';
import Loading from '../../../../components/Loading.vue';

const base64Key = 'M3d0YzN2TXpTZzBqY0F6UkFjWUNjQmRRaWhUZFlXTU4=';
const key = CryptoJS.enc.Base64.parse(base64Key);

const authStore = useAuthStore();
const adminDetails = ref({});
const errorMsg = ref('');
const loading = ref(false);

const historys = ref([]);

onMounted(() => {
    adminDetails.value = authStore.adminDetails;
    getModificationHistory();
});

const getModificationHistory = async () => {
    loading.value = true;
    try {
        const response = await accountService.getModificationHistory(adminDetails.value.RemCode);
        if (response.data?.isSuccess) {
            historys.value = response.data.data;
        } else {
            historys.value = [];
            errorMsg.message = response.data?.message || 'Something went wrong, please try again later.';
        }
    } catch (err) {
        console.error(err);
        historys.value = [];
        errorMsg.message = 'Something went wrong, please try again later.';
    } finally {
    loading.value = false;
  }
};

function formatDate(dateString) {
    if (!dateString) return null;
    const date = addMinutes(new Date(dateString), 5);
    return format(date, "dd-MM-yyyy");
}

function decryptAES(cipherText) {
    if (!cipherText) return '-';
    try {
        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: CryptoJS.enc.Base64.parse(cipherText) },
            key,
            {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            }
        );

        const result = decrypted.toString(CryptoJS.enc.Utf8);
        return result || '-';
    } catch (err) {
        console.warn('Decryption failed:', err);
        return '-';
    }
}

</script>

<style scoped>
@media(max-width:992px) {
    .table {
        width: 800px !important;
    }
}

.alert {
    padding: 4px 12px !important;
}

tbody td {
    font-size: 13px !important;
}
</style>

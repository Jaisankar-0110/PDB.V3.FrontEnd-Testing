<template>
    <div class="mt-1">
        <div class="mb-2 text-quaternary-color fs16 ps-2">My Account</div>
    </div>
    <div class="card mt-3">
        <div class="card-body">
            <div class="row py-4">
                <div class="col-xxl-2 col-xl-3 col-12 d-flex justify-content-center align-items-center">
                    <!-- <div class="mb-3 mt-xxl-0 mt-3"> -->
                    <img src="/image/user.png" alt="Partner Logo" class="mt-n5" width="70" />
                    <!-- </div> -->
                    <!-- <button class="btn btn-primary fs12">Change profile<i class="bi bi-pencil-square ps-2"></i></button> -->
                </div>
                <div class="col-xxl-10 col-xl-9 col-12">
                    <div class="text-primary-color fs16 fw600 mt-xl-3 mt-4 mb-3">{{ accountDetails.RemeshireName || '-'}}</div>
                    <div class="row">
                        <div class="col-xxl-4 col-sm-6 col-12">
                            <p class="fs14">
                                <span class="text-quaternary-color">Partner code : </span>
                                <span class="text-primary-color">{{ accountDetails.RemeshireCode || '-'}}</span>
                            </p>
                        </div>
                        <div class="col-xxl-4 col-sm-6 col-12">
                            <p class="fs14">
                                <span class="text-quaternary-color">Franchise type : </span>
                                <span class="text-primary-color">{{ accountDetails.RemeshireType || '-'}} </span>
                            </p>
                        </div>
                        <div class="col-xxl-4 col-sm-6 col-12">
                            <p class="fs14">
                                <span class="text-quaternary-color">Registered Date : </span>
                                <span class="text-primary-color">{{ formatDate(accountDetails.AgreementDate)  || '-' }}</span>
                            </p>
                        </div>
                        <div class="col-xxl-4 col-xl-6 col-12">
                            <p class="fs14">
                                <span class="text-quaternary-color">Website URL : </span>
                                <a href="https://aliceblueonline.com/" target="_blank" class="text-primary-color">https://aliceblueonline.com/</a>
                            </p>
                        </div>
                        <div class="col-xxl-8 col-12">
                            <p class="fs14">
                                <span class="text-quaternary-color">Digi Link URL : </span>
                                <a :href="`https://ekyc.aliceblueonline.com/?source=${accountDetails.RemeshireCode}`" target="_blank" class="text-primary-color">https://ekyc.aliceblueonline.com/?source={{ accountDetails.RemeshireCode || '-'}}</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="pt-2 mb-3">
        <div class="card mt-4">
            <div class="card-body">
                <div class="text-quaternary-color fs16 fw500">{{ sectionLabel }}</div>
                <div class="py-4">
                    <div class="row">
                        <div class="col-xxl-2 col-xl-3 col-12 pb-xl-0 pb-4">
                            <div class="tab-button-wrapper overflow-auto">
                                <button class="btn fs14"
                                    :class="activeSection === 'personal' ? 'btn-primary' : 'btn-light border-0'"
                                    @click="setActive('personal')">
                                    Personal
                                </button>
                                <button class="btn fs14"
                                    :class="activeSection === 'bank' ? 'btn-primary' : 'btn-light border-0'"
                                    @click="setActive('bank')">
                                    Bank details
                                </button>
                                <button class="btn fs14"
                                    :class="activeSection === 'certificates' ? 'btn-primary' : 'btn-light border-0'"
                                    @click="setActive('certificates')">
                                    Certificates
                                </button>
                                <button class="btn fs14"
                                    :class="activeSection === 'history' ? 'btn-primary' : 'btn-light border-0'"
                                    @click="setActive('history')">
                                    Modification History
                                </button>
                            </div>
                        </div>
                        <div class="col-xxl-10 col-xl-9 col-12">
                            <!-- Personal details -->
                            <div v-if="activeSection === 'personal'" class="personal-details">
                                <Personal :accountDetails="accountDetails" />
                            </div>

                            <!-- Bank details -->
                            <div v-if="activeSection === 'bank'" class="bank-details">
                                <BankDetails :accountDetails="accountDetails" />
                            </div>

                            <!-- Certificates -->
                            <div v-if="activeSection === 'certificates'" class="certificates">
                                <Certificates :accountDetails="accountDetails"  />
                            </div>

                            <!-- Modification History -->
                            <div v-if="activeSection === 'history'" class="modification-history">
                                <ModificationHistory />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Personal from './components/Personal.vue';
import BankDetails from './components/BankDetails.vue';
import ModificationHistory from './components/ModificationHistory.vue';
import Certificates from './components/Certificates.vue';
import { useAuthStore } from '@/stores/authStore';
import { accountService } from '../../../services/account/account.service';
import CryptoJS from 'crypto-js';
import { format, addMinutes } from 'date-fns';

const base64Key = 'M3d0YzN2TXpTZzBqY0F6UkFjWUNjQmRRaWhUZFlXTU4='; 
const key = CryptoJS.enc.Base64.parse(base64Key); 

const authStore = useAuthStore();
const adminDetails = ref({});
const accountDetails = ref({});
const errorMsg = ref({});
const activeSection = ref('personal');

function formatDate(dateString) {
  if (!dateString) return null;
  const date = addMinutes(new Date(dateString), 5);
  return format(date, "dd-MM-yyyy");
}

onMounted(() => {
    adminDetails.value = authStore.adminDetails;
    getAccountDetails();
});

function setActive(section) {
    activeSection.value = section
}

const sectionLabel = computed(() => {
    switch (activeSection.value) {
        case 'personal':
            return 'Personal Details'
        case 'bank':
            return 'Bank Details'
        case 'certificates':
            return 'Certificates'
        case 'history':
            return 'Modification History'
        default:
            return ''
    }
})

const getAccountDetails = async () => {
    try {
        const response = await accountService.getAccountDetails(adminDetails.value.RemCode);
        if (response.data?.isSuccess) {
           const rawData = response.data.data[0];

            rawData.MobileNo = decryptAES(rawData.MobileNo);
            rawData.RemBankAcBNo = decryptAES(rawData.RemBankAcBNo);
            rawData.RemBankName = decryptAES(rawData.RemBankName);
            rawData.GSTNumber = decryptAES(rawData.GSTNumber || '');
            rawData.RemIfscCode = decryptAES(rawData.RemIfscCode);
            rawData.Address = decryptAES(rawData.Address);

            accountDetails.value = rawData;
        } else {
            errorMsg.message = response.data?.message || 'Something went wrong, please try again later.';
        }
    } catch (err) {
        console.error(err);
        errorMsg.message = 'Something went wrong, please try again later.';
    }
};

function decryptAES(cipherText) {
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: CryptoJS.enc.Base64.parse(cipherText) },
    key,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  return decrypted.toString(CryptoJS.enc.Utf8);
}

</script>


<style scoped>
.btn {
    border-radius: 100px !important;
    height: 34px !important;
    padding: 0px 12px !important;
}

.tab-button-wrapper {
    white-space: nowrap;
    scrollbar-width: none;

}

.tab-button-wrapper .btn {
    display: block !important;
    margin-bottom: 8px !important;
}

.tab-button-wrapper::-webkit-scrollbar {
    display: none;
}

@media(max-width:1200px) {
    .tab-button-wrapper .btn {
        display: inline !important;
        margin-bottom: 0px !important;
        margin-right: 10px !important;
    }
}
</style>
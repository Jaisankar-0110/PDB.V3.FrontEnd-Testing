<template>
    <div class="text-quaternary-color fs16 fw500 p-3">GST</div>
    <div class="d-flex justify-content-center align-items-center generate-gst-container mt-4">
        <div class="card generate-gst-card">

            <div class="card-body p-md-4 p-3">
                <div class="alert alert-info fs13" role="alert">
                    Every month after 5th only can Generate the GST Invoice
                    for Previous Month Last Date of Upload Generated GST Invoice is Every Month 10th.
                </div>
                <div v-if="Object.keys(gstInvoiceDetails).length === 0">
                     <NoDataFound class="py-3" width="200px" />
                     <p class="text-center fs12 text-muted">No GST data found!</p>
                </div>
                <div class="d-flex justify-content-center" v-else>
                    <div class="row">
                        <div class="col-12">
                            <div class="text-secondary-color fw700 fs14 mt-2 mb-3">
                                Month : {{ formattedMonthYear }}
                            </div>
                        </div>

                        <div class="col-12 col-md-6">
                            <p>
                                <span class="text-dark-color fs14 mt-3">GST Amount : </span>
                                <span class="text-primary-color fs14 mt-3">{{ gstInvoiceDetails.GSTAmount }}</span>
                            </p>

                        </div>

                        <div class="col-12 col-md-6">
                            <p>
                                <span class="text-dark-color fs14 mt-3">Total Amount : </span>
                                <span class="text-primary-color fs14 mt-3">{{ gstInvoiceDetails.TotalAMount }}</span>
                            </p>

                        </div>

                        <div class="col-12 col-md-6">
                            <p>
                                <span class="text-dark-color fs14 mt-3">Admin Status : </span>
                                <span class="text-primary-color fs14 mt-3">{{ gstInvoiceDetails.AdminStatus || '-'
                                    }}</span>
                            </p>

                        </div>

                        <div class="col-12 col-md-6">
                            <p>
                                <span class="text-dark-color fs14 mt-3">Admin Status Date : </span>
                                <span class="text-primary-color fs14 mt-3">{{ gstInvoiceDetails.AdminStatusDT || '-'
                                    }}</span>
                            </p>

                        </div>

                        <div class="col-12">
                            <p>
                                <span class="text-dark-color fs14 mt-3">Admin Remark : </span>
                                <span class="text-primary-color fs14 mt-3">{{ gstInvoiceDetails.AdminRemark || '-'
                                    }}</span>
                            </p>

                        </div>

                        <div class="col-12 text-center">
                            <button class="btn btn-primary fs14" @click="GenerateGSTPDF">Generate PDF</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { accountService } from '../../../../services/account/account.service';
import { showErrorToast } from '../../../../js/toast';
import NoDataFound from '../../../../components/NoDataFound.vue';

const authStore = useAuthStore();
const adminDetails = ref({});
const errorMsg = ref('');

const gstInvoiceDetails = ref({});

const currentDocumentSrc = ref('');

onMounted(() => {
    adminDetails.value = authStore.adminDetails;
    getGSTDetails();
});

const today = new Date();
const previousMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
const formattedMonthYear = computed(() => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const month = monthNames[previousMonthDate.getMonth()]
    const year = previousMonthDate.getFullYear()
    return `${month.toUpperCase()}-${year}`
})

const getGSTDetails = async () => {
    errorMsg.value = '';
    const data = {
        rem_code: adminDetails.value.RemCode,
        month_year: formattedMonthYear.value,
    };
    try {
        const response = await accountService.getGST(data);
        if (response.data?.isSuccess) {
            gstInvoiceDetails.value = response.data.data[0];
        } else {
            showErrorToast(response.data?.message || 'Something went wrong, please try again later.');
        }
    } catch (err) {
        console.error(err);
        showErrorToast(err.response.data?.message || 'Something went wrong, please try again later.');
    }
};

const GenerateGSTPDF = async () => {
    errorMsg.value = '';
    const data = {
        rem_code: adminDetails.value.RemCode,
        month_year: formattedMonthYear.value,
    };
    try {
        const response = await accountService.GeneratePDF(data);
        if (response.data?.isSuccess) {
            viewDocument(response.data.data);
        } else {
            showErrorToast(response.data?.message || 'Something went wrong, please try again later.');
        }
    } catch (err) {
        console.error(err);
        showErrorToast(err.response.data?.message || 'Something went wrong, please try again later.');
    }
};

const viewDocument = (documentSrc) => {

    if (!documentSrc.startsWith('data:application/pdf;base64,')) {
        documentSrc = `data:application/pdf;base64,${documentSrc}`;
    }

    currentDocumentSrc.value = documentSrc;
    const base64PDF = currentDocumentSrc.value;
    const base64String = base64PDF.split(',')[1];
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobURL = URL.createObjectURL(blob);

    window.open(blobURL, '_blank');

};

</script>

<style scoped>
.generate-gst-container {
    height: 70vh !important;
    background-color: var(--light) !important;
}

.generate-gst-card {
    width: 100% !important;
    max-width: 550px !important;
    border-radius: 8px !important;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px !important;
}
</style>
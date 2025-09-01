<template>
    <div class="text-quaternary-color fs16 fw500 p-3">Contact Support</div>
    <div class="d-flex justify-content-center align-items-center generate-gst-container mt-4">
        <div class="card generate-gst-card mt-5 pt-2">
            <div class="card-header text-center p-3 bg-white border-0 border-bottom">
                <h5 class="text-dark fs18 fw500 mb-0">Branch Manger Contact Details</h5>
                <!-- <p class="text-muted fs12 mb-0">Get in touch with your support team</p> -->
            </div>

            <div class="card-body p-md-4 p-3">

                <div>
                    <div class="d-flex mb-2">
                        <div>
                            <img src="/image/user.png"
                                class="user-icon d-inline-block rounded-circle border cursor-pointer me-3" alt="Logo" />
                        </div>
                        <div>
                            <p class="text-dark fw500 fs16 mb-0">{{ contactDetails.Name || '-' }}</p>
                            <p class="text-muted fs14">{{ contactDetails.BranchCode || '-' }} |
                                {{ contactDetails.BranchName || '-' }}</p>
                        </div>
                    </div>

                </div>

                <table class="w-100">
                    <tbody>
                        <tr>
                            <td class="label-cell fs14 text-quaternary-color py-2">
                                <i class="bi text-danger fs16 bi-envelope-fill me-1"></i> Email
                            </td>
                            <!-- <td class="text-muted fs14 px-1"> : {{ contactDetails.EmailId &&
                            contactDetails.EmailId.length > 20
                            ? contactDetails.EmailId.slice(0, 20) + '...'
                            : contactDetails.EmailId || '-' }} </td> -->

                            <td class="text-muted fs14 px-1">
                                : {{ contactDetails.EmailId || '-' }}
                            </td>

                        </tr>
                        <tr>
                            <td class="label-cell fs14 text-quaternary-color py-2">
                                <i class="bi text-primary bi-telephone-fill fs16 me-1"></i> Mobile
                            </td>
                            <td class="text-muted fs14  px-1"> :
                                {{ contactDetails.MobileNo ? '******' + contactDetails.MobileNo.toString().slice(-4)
                                    : '-' }}
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" class="pt-3">
                                <a href="https://support.aliceblueonline.com/CreateTicket" target="_blank">
                                    <button class="btn btn-primary w-100 fs14"> Rise a Ticket
                                    </button>
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { accountService } from '../../../services/account/account.service';

const clients = ref([]);
const contactDetails = ref({});
const errorMsg = ref('');
const loading = ref(false);


const getContactDetails = async () => {
    try {
        const response = await accountService.getContactDetails(); // you must create or already have this API
        if (response.data?.isSuccess) {
            contactDetails.value = response.data.data;
            await contact(); // fetch contact list only after details are available
        } else {
            errorMsg.value = response.data.message || 'Failed to fetch contact details';
        }
    } catch (err) {
        console.error(err);
        errorMsg.value = 'Something went wrong while fetching contact details';
    }
};

const contact = async () => {
    if (!contactDetails.value.RemCode)
        return;

    loading.value = true;
    const params = {
        remCode: contactDetails.value.RemCode,
    };
    try {
        const response = await accountService.contact(params);
        if (response.data?.isSuccess) {
            clients.value = response.data?.data.result || [];
        } else {
            clients.value = [];
            errorMsg.value = response.data?.message || 'Failed to fetch contact list.';
        }
    } catch (err) {
        console.error(err);
        clients.value = [];
        totalClients.value = 0;
        errorMsg.value = 'Something went wrong while fetching contact list';
    } finally {
        loading.value = false;
    }
};

// Call contactDetails API first
onMounted(() => {
    getContactDetails();
});
</script>


<style scoped>
.user-icon {
    width: 50px;
}

@media (max-width: 768px) {
    .user-icon {
        width: 30px;
    }

    .logo {
        width: 100px;
    }
}

.generate-gst-card {
    width: 100% !important;
    max-width: 420px !important;
    border-radius: 8px !important;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px !important;
}
</style>

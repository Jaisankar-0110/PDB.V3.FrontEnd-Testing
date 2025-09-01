<template>
    <div class="modal fade" id="viewModal" tabindex="-1" aria-labelledby="viewModal" aria-hidden="true">
        <div class="modal-dialog modal-md modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header d-flex justify-content-between align-items-center">
                    <div v-if="partner.title" class="fs16 text-dark fw500">
                        {{ partner.title }}
                    </div>
                    <button type="button" class="btn-close fs14" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body fs14 p-4">
                    <div v-if="structuredDetails">
                        <div v-if="partner.RequestType === 'BANK'">
                            <div class="fs14 fw500">Account No : <span class="text-muted fw400">{{
                                    structuredDetails.accountNo }}</span></div>
                            <div class="fs14 fw500">Bank Name : <span class="text-muted fw400">{{
                                    structuredDetails.bankName }}</span></div>
                            <div class="fs14 fw500">IFSC Code : <span class="text-muted fw400">{{
                                    structuredDetails.ifscCode }}</span></div>
                            <div class="fs14 fw500">MICR Code :
                                <span class="text-muted fw400">{{ structuredDetails.MicrCode }}</span>
                            </div>
                        </div>
                        <div v-else-if="partner.RequestType === 'EMAIL'">
                            <div class="fs14 fw500">Email : <span class="text-muted fw400">{{ structuredDetails.EMAIL
                                    }}</span></div>
                        </div>
                        <div v-else-if="partner.RequestType === 'GST'">
                            <div class="fs14 fw500">GST : <span class="text-muted fw400">{{ structuredDetails.GST
                                    }}</span></div>
                        </div>
                        <div v-else-if="partner.RequestType === 'MOBILE'">
                            <div class="fs14 fw500">Mobile : <span class="text-muted fw400">{{
                                    structuredDetails.MOBILE}}</span></div>
                        </div>
                        <div v-else-if="partner.RequestType === 'ADDRESS'">
                            <div class="fs14 fw500">Address : <span class="text-muted fw400">{{
                                    structuredDetails.ADDRESS }}</span></div>
                        </div>
                    </div>
                    <div v-else class="fs14">
                        {{ partner.value }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { computed } from 'vue';

const props = defineProps({
    partner: Object,
});

const structuredDetails = computed(() => {
    const value = props.partner?.value || '';

    switch (props.partner?.RequestType) {
        case 'BANK':
            if (value.includes('|')) {
                const [accountNo, bankName, ifscCode ,MicrCode] = value.split('|');
                return { accountNo, bankName, ifscCode,MicrCode };
            }
            break;
        case 'EMAIL':
            return { EMAIL: value };
        case 'GST':
            return { GST: value };
        case 'MOBILE':
            return { MOBILE: value };
        case 'ADDRESS':
            return { ADDRESS: value };
    }

    return null;
});
</script>

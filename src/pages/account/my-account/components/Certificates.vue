<template>
    <div class="mt-1">
        <div class="row">
            <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4 col-12 mt-2 pt-2 ">
                <div class="card border">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between">
                            <div class="text-start">
                                <div class="text-quaternary-color fs16">Partner Certificate</div>
                            </div>
                            <i class="bi bi-file-earmark-medical text-primary-color fs24"></i>
                        </div>
                        <div class="pt-3">
                            <button class="btn btn-primary w-100"  @click="viewDocument(accountDetails.partner_certificate)"><i class="bi bi-download pe-1"></i> Download</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-4 col-12 mt-2 pt-2" v-if="accountDetails.annexure">
                <div class="card border">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between">
                            <div class="text-start">
                                <div class="text-quaternary-color fs16">Annexure</div>
                            </div>
                           <i class="bi bi-file-earmark-medical text-primary-color fs24"></i>
                        </div>
                        <div class="pt-3">
                            <button class="btn btn-primary w-100" @click="viewDocument(accountDetails.annexure)"><i class="bi bi-download pe-1"></i> Download</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref } from 'vue'; 

defineProps({
    accountDetails: {
        type: Object,
        default: () => ({}),
    },
});

const currentDocumentSrc = ref('');

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

<style scoped lang="scss">
.form-select {
    line-height: 1.0 !important;
}
</style>
<template>
    <div class="gst">
        <div class="d-flex">
            <div class="fs14 px-3 py-2 gstTab cursor-pointer" :class="{ activeGST: isActiveGST === 'generate_gst' }"
                @click="isActiveGST = 'generate_gst'">Generate GST Invoice</div>
            <div class="fs14 px-3 py-2 gstTab cursor-pointer" :class="{ activeGST: isActiveGST === 'upload_gst' }"
                @click="isActiveGST = 'upload_gst'">Upload GST</div>
            <div class="fs14 px-3 py-2 gstTab cursor-pointer" :class="{ activeGST: isActiveGST === 'gst_history' }"
                @click="isActiveGST = 'gst_history'">GST History</div>
        </div>
        <div v-if="isActiveGST === 'generate_gst'" class="generate-gst">
            <GenerateGST />
        </div>
        <div v-else-if="isActiveGST === 'upload_gst'" class="upload-gst">
            <UploadGST />
        </div>
        <div v-else-if="isActiveGST === 'gst_history'" class="gst_history">
            <GSTHistory />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

import UploadGST from './components/UploadGST.vue';
import GenerateGST from './components/GenerateGST.vue';
import GSTHistory from './components/GSTHistory.vue';

const isActiveGST = ref('generate_gst');

</script>

<style scoped>
.gstTab {
    color: var(--quaternary) !important;
    background-color: transparent !important;
    border-radius: 8px 8px 0px 0px !important;
    font-weight: 500;
}

.activeGST {
    color: var(--primary) !important;
    background-color: var(--light) !important;
}

.upload-gst,
.generate-gst,
.gst_history {
    background-color: var(--light) !important;
    border-radius: 0px 12px 12px 12px !important;
}
</style>

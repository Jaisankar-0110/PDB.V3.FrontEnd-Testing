<template>
    <div class="card">
        <div class="card-header py-3 bg-transparent">
            <p class="mb-0 text-quaternary-color fw500 fs16">Profile Summary</p>
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center pb-3">
                    <span class="text-quaternary-color fs14">Current sharing ratio</span>
                    <span class="text-quaternary-color fs14 text-end alert alert-info">{{ bdrPercent.amtReleasePercent }}%</span>
                </div>
                <div class="d-flex justify-content-between align-items-center pb-3">
                    <span class="text-quaternary-color fs14">Total account opened</span>
                    <span class="text-quaternary-color fs14 text-end alert alert-danger">{{ bdrPercent.derivativeUccCount }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center pb-3">
                    <span class="text-quaternary-color fs14">Total account traded</span>
                    <span class="text-quaternary-color fs14 text-end alert alert-primary">{{ bdrPercent.derivativeTradeCount }}</span>
                </div>
                <!-- <div class="d-flex justify-content-between align-items-center pb-2">
                    <span class="text-quaternary-color fs12">Next milestone</span>
                    <span class="text-quaternary-color fs12 text-end alert alert-success">-%</span>
                </div> -->

            </div>
    </div>
</template>

<script setup>
defineProps({
    bdrPercent: {
        type: Object,
        default: () => ({}),
    },
});


</script>

<style scoped>  
.alert {
    padding: 4px 14px;  
    margin-bottom: 8px;
    border-radius: 3.2px;
    font-size: 12px;
    color: #fff;
    border: none;
}

.card {
    height: 390px !important;
}

@media(max-width:1399px) {
    .card {
        height: auto !important;
    }
}
</style>
<template>
    <div class="card">
        <div class="card-header py-3 bg-transparent">
            <div class="d-flex justify-content-between">
                <div class="text-quaternary-color fs16 fw500">Client Debit Tracker Summary Statistics</div>
                <div class="d-flex">
                    <b class="bi bi-download fs20 text-quaternary-color"></b>
                </div>
            </div>
        </div>
        <div class="card-body bg-pink">
            <div class="mt-2">
                <div class="py-2">
                    <div class="row px-2 pb-3 text-quaternary-color fs14">
                        <div class="col">Total clients</div>
                        <div class="col"> 6</div>
                    </div>
                    <div class="row px-2 py-3 bg-light-color text-quaternary-color fs14">
                        <div class="col">Average clearance rate</div>
                        <div class="col">3192.0252 </div>
                    </div>
                    <div class="row px-2 py-3 text-quaternary-color fs14">
                        <div class="col"> Total outstanding amount</div>
                        <div class="col">452 </div>
                    </div>
                    <div class="row px-2 py-3 bg-light-color text-quaternary-color fs14">
                        <div class="col"> Critical risk clients </div>
                        <div class="col">2</div>
                    </div>
                    <div class="row px-2 py-3 text-quaternary-color fs14">
                        <div class="col">High risk clients</div>
                        <div class="col">53</div>
                    </div>
                    <div class="row px-2 py-3 bg-light-color text-quaternary-color fs14">
                        <div class="col">Moderate risk clients</div>
                        <div class="col">45</div>
                    </div>
                    <div class="row px-2 py-3 text-quaternary-color fs14">
                        <div class="col">Low risk clients</div>
                        <div class="col"> 45 </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped lang="scss">
.bg-pink {
    background-color: #fff6f6 !important;
}

.card {
    height: 510px !important;
}
</style>
<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="text-center">
            <img src="/image/404.png" class="img-404" alt="No Data Found" />
            <div class="text-dark fs14-12 mb-md-4 mt-2 px-3 px-md-0 paragraph-width">
                The page you are looking for could not be found.
            </div>
            <button class="btn btn-dark border-0 fs14 py-2 px-5 mt-3" @click="goBack">Go Back</button>
        </div>
    </div>
</template>

<script setup>

const goBack = () => {
    window.history.back();
}

</script>

<style scoped>
.img-404 {
    width: 70%;
    height: auto;
}

@media(max-width:767px) {
    .img-404 {
    width: 80%;
    height: auto;
}

}

</style>
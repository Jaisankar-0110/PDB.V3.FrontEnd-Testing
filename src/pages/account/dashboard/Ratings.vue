<template>
    <div>
        <div class="modal fade" id="starRatingModal" tabindex="-1" aria-labelledby="starRatingModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-sm modal-dialog-centered">
                <div class="modal-content  pb-4">
                    <div >
                        <img src="/image/star-face.png" alt="Background" class="bg-header-img" />
                    </div>

                    <div class="mt-3 pt-1 px-3">
                        <h5 class="text-dark text-center fs16 ">How Would You Rate Our website Experience ?</h5>
                        <div class="d-flex justify-content-center mt-3 gap-3">
                            <i v-for="n in 5" :key="n" class="bi fs24 cursor-pointer"
                                :class="n <= rating ? 'bi-star-fill text-warning' : 'bi-star text-secondary'"  @click="rating = n"></i>
                        </div>
                        <button class="btn btn-primary mt-4 px-4 w-100 fs14 rounded-pill" @click="submitRating">
                            Submit
                        </button>
                        <div class="text-muted mt-2 text-center fs14 cursor-pointer" @click="closeModal">
                            No, Thanks!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { showSuccessToast } from '../../../js/toast';
import { Modal } from 'bootstrap';

const rating = ref(0);

function submitRating() {
    showSuccessToast(`Thanks! You rated us ${rating.value}/5`);
    closeModal();
}

const closeModal = () => {
    const modalElement = document.getElementById("starRatingModal");
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    modal.hide();
};

</script>

<style scoped>
.modal-content {
    border-radius: 20px;
    overflow: hidden;
}
.bg-header-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
}

.star-image {
    width: 100px;
    height: 100px;
    object-fit: contain;
    position: absolute;
    bottom: -50px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cursor-pointer {
    cursor: pointer;
}
</style>

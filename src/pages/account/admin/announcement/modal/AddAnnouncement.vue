<template>
    <div class="modal fade" id="addAnnouncement" tabindex="-1" aria-labelledby="addAnnouncement" aria-hidden="true"
        data-bs-backdrop="static">
        <div class="modal-dialog modal-md modal-dialog-centered">
            <div class="modal-content p-md-5 p-3">
                <div class="modal-header border-bottom-0 w-100">
                    <div class="text-center fs18 fw500">
                        Add Announcement
                    </div>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="addAnnouncement">

                        <div >
                            <div class="position-relative">
                                <div class="form-control-text">
                                    <textarea  id="announcementText" class="fs14 mt-1 custom-input" rows="4" @input="validateAnnouncement"
                                        v-model="form.announcementText"></textarea>
                                    <ErrorMessage :class="'text-start form-text fs12 text-danger'"
                                        :message="errors.announcementText" />
                                </div>
                            </div>
                        </div>

                        <div class="marquee-container">
                            <div class="marquee-text">
                                {{ form.announcementText }}
                            </div>
                        </div>

                        <ErrorMessage :class="'text-center mb-2 pt-2'" :message="errors.message" />

                        <div class="d-flex justify-content-between pt-3">
                            <div class="btn btn-outline-tertiary w-50 pt-2 me-3" @click="closeModal">
                                Cancel
                            </div>
                            <ButtonTertiary label="Save" class="w-50 " :disabled="loading" />
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick, computed } from "vue";
import ButtonTertiary from "../../../../../components/button/ButtonTertiary.vue";
import { Modal } from "bootstrap";
import { showSuccessToast } from "../../../../../js/toast";
import ErrorMessage from "../../../../../components/ErrorMessage.vue";
import { accountService } from "../../../../../services/account/account.service";

const loading = ref(false);

const emit = defineEmits(['update-details']);

const form = reactive({
    announcementText: "",
});

const errors = reactive({
    announcementText: "",
    message: ""
});

// const validateAnnouncement = () => {
//     errors.announcementText = form.announcementText && form.announcementText.trim() ? "" : "Announcement is required.";
// };

const validateAnnouncement = () => {
    const isValid = form.announcementText && form.announcementText.trim();
    errors.announcementText = isValid ? "" : "Announcement is required.";
    return isValid;
};

const handleSubmit = async () => {
    loading.value = true;
    validateAnnouncement();
    if (!errors.announcementText) {
        showSuccessToast("Announcement updated!");
        loading.value = false;
        closeModal();
    } else {
        loading.value = false;
    }
};

const addAnnouncement = async () => {
    if (!validateAnnouncement()) return;

    loading.value = true;
    
    const data = {
        announcementText: form.announcementText,
    };

    try {
        const response = await accountService.addAnnouncement(data);
        if (response.data?.isSuccess) {
            showSuccessToast(response.data.message);
            closeModal();
        } else {
            errors.message = response.data.message;
            showErrorToast(response.data.message);
        }
    } catch (error) {
        errors.message = error?.response?.data?.message || "Something went wrong.";
        showErrorToast(errors.message);
    } finally {
        loading.value = false;
    }
};

const closeModal = () => {
    form.announcementText = "";
    errors.announcementText = "";
    errors.message = "";
    loading.value = false;
    emit('update-details');
    const modalElement = document.getElementById("addAnnouncement");
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    modal.hide();
};

</script>

<style scoped>
.marquee-container {
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    position: relative;
    height: 2.5rem;
}

.marquee-text {
    display: inline-block;
    padding-left: 100%;
    animation: scroll-left 10s linear infinite;
}

@keyframes scroll-left {
    0% {
        transform: translateX(0%);
    }

    100% {
        transform: translateX(-100%);
    }
}
</style>
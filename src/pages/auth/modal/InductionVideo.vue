<template>
    <div class="modal fade" id="InductionVideo" tabindex="-1" aria-labelledby="InductionVideo" aria-hidden="true"
        data-bs-backdrop="static">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content p-3">
                <div class="modal-header border-bottom-0 mb-0 pb-0 w-100">
                    <div class="text-center fs20 fw600">Induction Video</div>
                </div>

                <div class="modal-body">
                    <div class="text-center">
                        <div class="text-start text-muted pb-4 fs14">
                            Watch the <strong>Partner Induction video</strong> to understand the partnership process.
                        </div>
                        <video ref="videoRef" width="100%" height="315" @ended="videoEnded" controls>
                            <source src="/video/induction.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    <div class="mt-4" v-if="showContinue">
                        <div class="form-check mb-3">
                            <input class="form-check-input" type="checkbox" id="acknowledgment"
                                v-model="acknowledged" />
                            <label class="form-check-label fs14" for="acknowledgment">
                                I acknowledge that I have completed the <strong>Partner Induction video</strong> and
                                understood its content. Thank you for providing this resource. I am ready to apply the
                                knowledge gained to our partnership. Looking forward to our collaboration.
                            </label>
                        </div>
                        <div class="text-center">
                            <button class="btn btn-primary" @click="handleContinue" :disabled="!acknowledged">
                                Continue to proceed.
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { Modal } from "bootstrap";
import { useRouter } from 'vue-router';

const router = useRouter();

const showContinue = ref(false);
const acknowledged = ref(false);
const videoRef = ref(null);

const videoEnded = () => {
    showContinue.value = true;
};

const handleContinue = async () => {
    const modalElement = document.getElementById("InductionVideo");
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    modal.hide();
    await router.push('/verify-otp');
};
</script>

<style scoped>
video {
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-check-input {
    border: 1px solid #b3b3b3 !important;
}

.alert {
    padding: 4px 10px;
}
</style>

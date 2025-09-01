<template>
    <div class="px-2 pb-3 fs14 d-flex align-items-end">
        <RouterLink to="/dashboard" class="text-tertiary-color text-decoration-none"> <i
                class=" bi bi-house-fill fs16 pe-1"></i>
            Dashboard</RouterLink>
        <span class="px-2">/</span>
        <div class="text-muted">Post Questionnaires</div>
    </div>
    <div class="card">
        <div class="card-header py-3 bg-transparent">
            <div class="d-flex justify-content-between align-items-center">
                <div class="text-quaternary-color fs16 fw500">Post Questionnaires</div>
            </div>
        </div>
        <div class="card-body p-3">
            <div v-if="!isAlreadySubmitted">
                <form class="mx-3" @submit.prevent="handleSubmit">
                    <div class="mt-4">
                        <div class="mt-1">
                            <div class="mt-2 q-card p-3">
                                <p class="fs14 mb-2 text-secondary-color fw500">1) I have read and understood the AP
                                    Internal Agreement and Code of Conduct.</p>
                                <div class="fs14 text-secondary-color ms-3">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que1" name="que1"
                                            value="Yes">
                                        <label class="form-check-label">Yes</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que1" name="que1"
                                            value="No">
                                        <label class="form-check-label">No</label>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2 q-card p-3">
                                <p class="fs14 mb-2 text-secondary-color fw500">2) I am fully aware of the roles and
                                    responsibilities of an Authorized Person (AP).</p>
                                <div class="fs14 text-secondary-color ms-3">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que2" name="que2"
                                            value="Yes">
                                        <label class="form-check-label">Yes</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que2" name="que2"
                                            value="No">
                                        <label class="form-check-label">No</label>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2 q-card p-3">
                                <p class="fs14 mb-2 text-secondary-color fw500">3) My lead generation methods rely on
                                    organic sources, and I have not displayed or
                                    stated any promotions, assured returns, schemes, or advisory content in my lead
                                    source link or account-opening link.</p>
                                <div class="fs14 text-secondary-color ms-3">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que3" name="que3"
                                            value="Yes">
                                        <label class="form-check-label">Yes</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que3" name="que3"
                                            value="No">
                                        <label class="form-check-label">No</label>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2 q-card p-3">
                                <p class="fs14 mb-2 text-secondary-color fw500">4) I take full responsibility for the
                                    clients mapped under me.</p>
                                <div class="fs14 text-secondary-color ms-3">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que4" name="que4"
                                            value="Yes">
                                        <label class="form-check-label">Yes</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que4" name="que4"
                                            value="No">
                                        <label class="form-check-label">No</label>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2 q-card p-3">
                                <p class="fs14 mb-2 text-secondary-color fw500">5) I have not provided any advisory
                                    services to clients OR I hold a valid SEBI RA
                                    registration certificate.</p>
                                <div class="fs14 text-secondary-color ms-3">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que5" name="que5"
                                            value="Yes">
                                        <label class="form-check-label">Yes</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que5" name="que5"
                                            value="No">
                                        <label class="form-check-label">No</label>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2 q-card p-3">
                                <p class="fs14 mb-2 text-secondary-color fw500">6) I have not collected any fees from
                                    any client or member of the public.</p>
                                <div class="fs14 text-secondary-color ms-3">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que6" name="que6"
                                            value="Yes">
                                        <label class="form-check-label">Yes</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que6" name="que6"
                                            value="No">
                                        <label class="form-check-label">No</label>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2 q-card p-3">
                                <p class="fs14 mb-2 text-secondary-color fw500">7) I have not obtained or used login
                                    credentials or OTP from any clients.</p>
                                <div class="fs14 text-secondary-color ms-3">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que7" name="que7"
                                            value="Yes">
                                        <label class="form-check-label">Yes</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que7" name="que7"
                                            value="No">
                                        <label class="form-check-label">No</label>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2 q-card p-3">
                                <p class="fs14 mb-2 text-secondary-color fw500">8) I have not been involved in any
                                    scheme-based activities, and my social media
                                    channels do not contain any content or words related to:</p>
                                <ul class="fs14 text-secondary-color">
                                    <li>Assured profits/returns</li>
                                    <li>Percentage of profits/sharing</li>
                                    <li>Trading calls or tips</li>
                                    <li>Profit sharing/monthly returns</li>
                                    <li>Algo trading returns</li>
                                </ul>
                                <div class="fs14 text-secondary-color ms-3">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que8" name="que8"
                                            value="Yes">
                                        <label class="form-check-label">Yes</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que8" name="que8"
                                            value="No">
                                        <label class="form-check-label">No</label>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2 q-card p-3">
                                <p class="fs14 mb-2 text-secondary-color fw500">9) I have not displayed the Alice Blue
                                    account-opening link on any social media
                                    platform.</p>
                                <div class="fs14 text-secondary-color ms-3">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que9" name="que9"
                                            value="Yes">
                                        <label class="form-check-label">Yes</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que9" name="que9"
                                            value="No">
                                        <label class="form-check-label">No</label>
                                    </div>
                                </div>
                                <div class="row my-2 ms-1" v-if="form.que9 === 'Yes'">
                                    <div class="col-12">
                                        <p class="fs14 mb-2 text-secondary-color">If Yes, provide the link details :
                                        </p>
                                    </div>
                                    <div class="col-md-3 col-12">
                                        <div class="position-relative">
                                            <div class="form-control-text">
                                                <input type="text" class="fs12 mt-1 custom-input"
                                                    v-model="form.que9Others">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2 q-card p-3">
                                <p class="fs14 mb-2 text-secondary-color fw500">10) Are you collecting any account
                                    opening charges from clients?</p>
                                <div class="fs14 text-secondary-color ms-3">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que10" name="que10"
                                            value="Yes">
                                        <label class="form-check-label">Yes</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que10" name="que10"
                                            value="No">
                                        <label class="form-check-label">No</label>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2 q-card p-3">
                                <p class="fs14 mb-2 text-secondary-color fw500">11) Are you collecting any deposit or
                                    other charges from clients?</p>
                                <div class="fs14 text-secondary-color ms-3">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que11" name="que11"
                                            value="Yes">
                                        <label class="form-check-label">Yes</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que11" name="que11"
                                            value="No">
                                        <label class="form-check-label">No</label>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2 q-card p-3">
                                <p class="fs14 mb-2 text-secondary-color fw500">12) Are you collecting OTPs from
                                    clients?</p>
                                <div class="fs14 text-secondary-color ms-3">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que12" name="que12"
                                            value="Yes">
                                        <label class="form-check-label">Yes</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que12" name="que12"
                                            value="No">
                                        <label class="form-check-label">No</label>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2 q-card p-3">
                                <p class="fs14 mb-2 text-secondary-color fw500">13) Are you assuring clients of
                                    guaranteed returns?</p>
                                <div class="fs14 text-secondary-color ms-3">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que13" name="que13"
                                            value="Yes">
                                        <label class="form-check-label">Yes</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que13" name="que13"
                                            value="No">
                                        <label class="form-check-label">No</label>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2 q-card p-3">
                                <p class="fs14 mb-2 text-secondary-color fw500">14) Are you providing trading calls to
                                    clients?</p>
                                <div class="fs14 text-secondary-color ms-3">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que14" name="que14"
                                            value="Yes">
                                        <label class="form-check-label">Yes</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que14" name="que14"
                                            value="No">
                                        <label class="form-check-label">No</label>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2 q-card p-3">
                                <p class="fs14 mb-2 text-secondary-color fw500">15) Are you offering algo trading
                                    services to clients?</p>
                                <div class="fs14 text-secondary-color ms-3">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que15" name="que15"
                                            value="Yes">
                                        <label class="form-check-label">Yes</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que15" name="que15"
                                            value="No">
                                        <label class="form-check-label">No</label>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2 q-card p-3">
                                <p class="fs14 mb-2 text-secondary-color fw500">16) Are you posting any advertisements
                                    via social media?</p>
                                <div class="fs14 text-secondary-color ms-3">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que16" name="que16"
                                            value="Yes">
                                        <label class="form-check-label">Yes</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" v-model="form.que16" name="que16"
                                            value="No">
                                        <label class="form-check-label">No</label>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <br><br>
                    </div>
                     <ErrorMessage :class="'text-center mb-2 pt-2'" :message="errorMsg" />
                    <div class="d-flex justify-content-center mt-4">
                        <button type="submit" class="btn btn-primary fs16  w-50 px-4">Submit</button>
                    </div>

                </form>
            </div>
            <div v-else class="d-flex justify-content-center align-items-center my-5 py-5">
                <div class="d-inline alert alert-info fs14 my-5 ">
                    <i class="bi bi-info-circle me-1"></i>You have already submitted this Post questionnaire.
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, useRoute } from 'vue-router';
import { accountService } from '../../../services/account/account.service';
import { showSuccessToast, showErrorToast } from '../../../js/toast';
import ErrorMessage from '@/components/ErrorMessage.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const adminDetails = ref({});
const isAlreadySubmitted = ref(false);
const errorMsg = ref('');
const isSubmitting = ref(false);

const form = reactive({
    remeshireCode: '',
    que1: '',
    que2: '',
    que3: '',
    que4: '',
    que5: '',
    que6: '',
    que7: '',
    que8: '',
    que9: '',
    que9Others: '',
    que10: '',
    que11: '',
    que12: '',
    que13: '',
    que14: '',
    que15: '',
    que16: ''
});

const requiredQuestions = ['que1', 'que2', 'que3', 'que4', 'que5', 'que6', 'que7', 'que8', 'que9', 'que10', 'que11', 'que12', 'que13', 'que14', 'que15', 'que16'];

onMounted(() => {
    adminDetails.value = authStore.adminDetails;
    if (adminDetails.value?.RemCode) {
        getQuestionnaireData(adminDetails.value.RemCode);
    }
});

const validateForm = () => {
    for (const question of requiredQuestions) {
        if (!form[question]) {
            errorMsg.value = `Please answer all required questions (Question ${question.replace('que', '')} is missing)`;
            return false;
        }
    }
    
    // Additional validation for que9Others if que9 is "Yes"
    if (form.que9 === 'Yes' && !form.que9Others) {
        errorMsg.value = 'Please provide link details for question 9';
        return false;
    }
    
    errorMsg.value = '';
    return true;
};

const handleSubmit = async () => {
    if (isSubmitting.value) return;
    
    if (!validateForm()) {
        return;
    }

    isSubmitting.value = true;
    
    const payload = {
        RemeshireCode: adminDetails.value.RemCode,
        Que1: form.que1 === "Yes",
        Que2: form.que2 === "Yes",
        Que3: form.que3 === "Yes",
        Que4: form.que4 === "Yes",
        Que5: form.que5 === "Yes",
        Que6: form.que6 === "Yes",
        Que7: form.que7 === "Yes",
        Que8: form.que8 === "Yes",
        Que9: form.que9 === "Yes",
        Que9Others: form.que9Others,
        Que10: form.que10 === "Yes",
        Que11: form.que11 === "Yes",
        Que12: form.que12 === "Yes",
        Que13: form.que13 === "Yes",
        Que14: form.que14 === "Yes",
        Que15: form.que15 === "Yes",
        Que16: form.que16 === "Yes"
    };

    try {
        const response = await accountService.saveQuestionnaireData(payload);

        if (response?.data?.success) {
            showSuccessToast("Questionnaire submitted successfully");
            await router.push('/mandatory');
        } else if (response?.data?.message?.includes("already added")) {
            showErrorToast("You have already submitted this questionnaire.");
            await router.push('/mandatory');
        } else {
            showErrorToast("Submission failed. Please review your inputs.");
        }
    } catch (error) {
        console.error("Error submitting questionnaire:", error);
        showErrorToast("An error occurred while submitting.");
    } finally {
        isSubmitting.value = false;
    }
};

const getQuestionnaireData = async () => {
    try {
        const response = await accountService.getQuestionnaireData(adminDetails.value.RemCode);
        if (response.data?.isSuccess) {
            isAlreadySubmitted.value = true;
        }
    } catch (err) {
        console.error(err);
    }
};
</script>


<style scoped>
.card {
    border: 1px solid #ebebeb;
    border-radius: 20px !important;

}

.card-header {
    border-radius: 20px 20px 0px 0px !important;
    border-bottom: 1px solid #e9e9e9;
}

.close-btn {
    position: absolute;
    right: 19px;
    top: 22px;
}

.update-status {
    width: 100px;
}

.bi-arrow-left-circle-fill {
    position: relative;
    top: -5px
}

.custom-input {
    padding: 5px !important;
}

.q-card {
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    margin-bottom: 5px;
    border-radius: 10px !important;
    background: var(--light);
    margin-top: 30px !important;
}

/* .form-check-input:~.form-check-label,
.form-check-input[]~.form-check-label,
.form-check-input: {
    opacity: 1 !important;
} */

.form-check-input{
    border:1px solid #919191 !important;
 }
</style>
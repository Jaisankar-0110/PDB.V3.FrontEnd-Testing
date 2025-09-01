<template>
  <div class="mt-1">
    <div class="text-center w-100">
      <h5 class="modal-title fs-5 fw-semibold" id="verifyOTPForEditModalLabel">Verify Your OTP</h5>
      <p class="fs14 text-muted mt-2">We've sent a 6-digit verification code to your registered {{ data.Type === 'email'
        ? 'email' : 'mobile number' }}.</p>
    </div>
    <form @submit.prevent="verifyOTPForEdit">
      <div class="mb-4 mt-4 pt-2">
        <label for="otp" class="form-label fs14 mb-2 pb-1">Enter Verification Code</label>
        <div class="d-flex justify-content-between otp-input-group">
          <input v-for="(digit, index) in otp" :key="index" ref="otpInputs" type="text"
            class="otp-box fs14 text-center custom-input" maxlength="1" @input="onInput(index, $event)"
            @keydown.backspace="onBackspace(index, $event)" v-model="otp[index]" />
        </div>
      </div>
      <ErrorMessage :class="'text-center mb-2 pt-2'" :message="errorMsg" />
      <div class="d-flex justify-content-between pt-3">
        <div class="btn btn-outline-tertiary pt-2 w-50" @click="closeModal">
          Cancel
        </div>
        <ButtonTertiary label="Verify" class="w-50 ps-3" :disabled="loading" />

      </div>
    </form>
  </div>

</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick, computed } from "vue";
import ErrorMessage from "../../../../components/ErrorMessage.vue";
import { Modal } from "bootstrap";
import ButtonTertiary from "../../../../components/button/ButtonTertiary.vue";
import { authService } from "../../../../services/auth/auth.service";
import { accountService } from "../../../../services/account/account.service";
import { showSuccessToast } from "../../../../js/toast";

const props = defineProps({
  data: Object,
});

const loading = ref(false);
const errorMsg = ref("");

const otp = ref(Array(6).fill(''));
const otpInputs = ref([]);
const isActiveBtn = ref(false);

const onInput = (index, event) => {
  const value = event.target.value.replace(/[^0-9]/g, '');

  if (value) {
    otp.value[index] = value[0];
    if (index < otpInputs.value.length - 1) {
      otpInputs.value[index + 1].focus();
    }
  } else {
    otp.value[index] = '';
  }
  validateMobileOTP();
};

const onBackspace = (index, event) => {
  if (!otp.value[index] && index > 0) {
    otpInputs.value[index - 1].focus();
  }
};

const validateMobileOTP = () => {
  const joinedOTP = otp.value.join('');
  if (joinedOTP.length < 6) {
    errorMsg.value = 'Mobile OTP should be 6 characters.';
    isActiveBtn.value = false;
  } else {
    errorMsg.value = '';
    isActiveBtn.value = true;
    verifyOTPForEdit();
  }
};

const verifyOTPForEdit = async () => {
  loading.value = true;
  const finalOTP = otp.value.join('');
  errorMsg.value = '';
  try {
    const response = await authService.verifyOTPForEdit({
      identifier: props.data.Identifier,
      otp: finalOTP,
      
    });
    if (response.data?.isSuccess) {
      loading.value = true;
      sendNewEmailDetails();
    } else {
      loading.value = false;
      errorMsg.value = response.data?.message || 'Something went wrong, please try again later.';
    }
  } catch (err) {
    console.error(err);
    loading.value = false;
    errorMsg.value = err.response.data?.message || 'Something went wrong, please try again later.';
  }
};

const emit = defineEmits(['update-details']);

const sendNewEmailDetails = async () => {
  loading.value = true;
  try {
    const response = await accountService.updateEmailOrMobile({
      RemeshireCode: props.data.RemeshireCode,
      Type: props.data.Type,
      Identifier: props.data.Identifier
    });
    if (response.data?.isSuccess) {
      showSuccessToast(response.data?.message);
      emit('update-details');
    } else {
      errorMsg.value = response.data?.message || 'Something went wrong, please try again later.';
    }
  } catch (err) {
    console.error(err);
    errorMsg.value = err.response.data?.message || 'Something went wrong, please try again later.';
  } finally {
    loading.value = false;
  }
}

const closeModal = () => {
  emit('update-details');
};

</script>

<style scoped>
.otp-input-group {
  gap: 3px !important;
}

.otp-box {
  width: 39px;
  height: 40px;
  border: 1px solid var(--border, #ccc);
  border-radius: 4px;
  font-size: 20px;
}

.btn-link {
  color: #007bff;
  text-decoration: underline;
}
</style>
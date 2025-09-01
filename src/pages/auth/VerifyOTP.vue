<template>
  <div class="border-0">
    <h4 class="card-title fs20 text-dark text-center mb-3 mt-4">Verify OTP</h4>
    <p class="fs14 text-secondary text-center">Enter the 6-digit code sent to your {{ role === 'REMESHIRE'
      ? (isPasswordReset === 'true' ? 'email' : 'mobile number')
      : 'email'
      }}.</p>
    <div class="mt-4">
      <form @submit.prevent="verifyOTP" class="mt-2 pt-2">
        <div class="mb-4">
          <div class="d-flex justify-content-between otp-input-group">
            <input v-for="(digit, index) in otp" :key="index" ref="otpInputs" type="text"
              class="otp-box fs14 text-center custom-input" maxlength="1" @input="onInput(index, $event)"
              @keydown.backspace="onBackspace(index, $event)" v-model="otp[index]" />
          </div>
          <div class="form-text fs12 text-error" v-if="errors.otp">{{ errors.otp }}</div>
        </div>

        <div class="text-end fs14 text-secondary mb-2">
          <span v-if="remainingTime > 0">
            Resend OTP in <span class="text-primary-color">{{ formattedTime }}</span>
          </span>
          <div v-else class="btn btn-link p-0 m-0 fs14" @click="handleSendOTP">
            Resend OTP
          </div>
        </div>
        <ErrorMessage :class="'text-center mb-2 pt-2'" :message="errors.message" />
        <div class="text-center pt-3">
          <button type="submit" class="btn w-100 btn-primary w-50" :disabled="!isActiveBtn">Continue</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue';
import { authService } from '../../services/auth/auth.service';
import ErrorMessage from '../../components/ErrorMessage.vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const otp = ref(Array(6).fill(''));
const otpInputs = ref([]);
const isActiveBtn = ref(false);

const role = localStorage.getItem('role');

const isPasswordReset = localStorage.getItem('isPasswordReset');

const authStore = useAuthStore();

const router = useRouter();

const errors = reactive({
  message: '',
  otp: ''
});

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
  validateOTP();
};


const onBackspace = (index, event) => {
  if (!otp.value[index] && index > 0) {
    otpInputs.value[index - 1].focus();
  }
};

const validateOTP = () => {
  const joinedOTP = otp.value.join('');
  if (joinedOTP.length < 6) {
    // errors.otp = 'Mobile OTP should be 6 characters.';
    isActiveBtn.value = false;
  } else {
    errors.otp = '';
    isActiveBtn.value = true;
    verifyOTP();
  }
};

const remainingTime = ref(0);
let timerInterval = null;

const formattedTime = computed(() => {
  const minutes = String(Math.floor(remainingTime.value / 60)).padStart(2, '0');
  const seconds = String(remainingTime.value % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
});

// const startTimer = () => {
//   const expireTime = Date.now() + 60 * 1000;
//   localStorage.setItem('otp_expiry', expireTime);

//   updateRemainingTime();
//   timerInterval = setInterval(updateRemainingTime, 1000);
// };

const startTimer = () => {
  const expireTime = Date.now() + 60 * 1000; // 1 minute
  localStorage.setItem('otp_expiry', expireTime.toString());

  updateRemainingTime();
  timerInterval = setInterval(updateRemainingTime, 1000);
};


const updateRemainingTime = () => {
  const expireTime = parseInt(localStorage.getItem('otp_expiry'), 10) || 0;
  const now = Date.now();
  const diff = Math.floor((expireTime - now) / 1000);

  remainingTime.value = Math.max(diff, 0);

  if (diff <= 0 && timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

const handleSendOTP = async () => {
  await sendOTP();
};

onMounted(() => {
  const storedExpiry = parseInt(localStorage.getItem('otp_expiry'), 10) || 0;
  const now = Date.now();

  // If OTP was sent before and the timer hasn't expired
  if (storedExpiry > now) {
    updateRemainingTime();
    timerInterval = setInterval(updateRemainingTime, 1000);
  } else {
    // Send new OTP if `otpSend` is false
    if (localStorage.getItem('otpSend') === "false") {
      if (localStorage.getItem('isPasswordReset') === "true") {
        handleSendOTP();
      }

      startTimer();
      localStorage.setItem('otpSend', true);

    }
  }

  nextTick(() => otpInputs.value[0]?.focus());
});


const sendOTP = async () => {
  errors.message = '';
  try {

    // const response = await (
    //   role === 'ADMIN'
    //     ? authService.sendEmailOTP({ identifier: localStorage.getItem('identifier') })
    //     : authService.sendOTP({ identifier: localStorage.getItem('identifier') })
    // );

    const identifier = localStorage.getItem('identifier');
    const identifierMobile = localStorage.getItem('identifierMobile');
    const identifierEmail = localStorage.getItem('identifierMail');
    const isPasswordReset = localStorage.getItem('isPasswordReset');

    let response;

    if (role === 'ADMIN') {
      response = await authService.sendEmailOTP({ identifier: identifierEmail || identifier });
    } else if (isPasswordReset === 'true') {
      response = await authService.sendOTPEmailAndSMS({ identifierMobile, identifierEmail });
    } else {
      response = await authService.sendOTP({ identifier });
    }


    if (response.data?.isSuccess) {
      startTimer();
    } else {
      errors.message = response.data?.message || 'Something went wrong, please try again later.';
    }
  } catch (err) {
    console.error(err);
    errors.message = err.response.data?.message || 'Something went wrong, please try again later.';
  }
  localStorage.setItem('otpSend', true);
};

const verifyOTP = async () => {
  const finalOTP = otp.value.join('');
  errors.message = '';
  try {

    const response = await authService.verifyOTP({
      identifier: localStorage.getItem('isPasswordReset') === 'true'
        ? (
          localStorage.getItem('role') === 'REMESHIRE'
            ? localStorage.getItem('identifierMobile')
            : (localStorage.getItem('identifierMail') || localStorage.getItem('identifier'))
        )
        : localStorage.getItem('identifier'),
      otp: finalOTP,
      role: localStorage.getItem('role')
    });

    if (response.data?.isSuccess) {

      const token = response.data.data;
      const tokenExpiry = Date.now() + 3600000;

      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));

      authStore.setAdminDetails(decodedPayload);

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('tokenExpiry', tokenExpiry);

      if (localStorage.getItem('role') === 'ADMIN') {
        // await router.push('/admin/dashboard');
        if (localStorage.getItem('isPasswordReset') === 'true') {
          await router.push('/reset-password');
        } else {
          // await router.push('/admin/dashboard');
          if (decodedPayload.Role === 'KYC') {
            await router.push('/admin/manage-profile');
            return;
          } else if (decodedPayload.Role === 'FINANCE') {
            await router.push('/admin/gst-admin');
            return;
          } else if (decodedPayload.Role === 'ADMIN') {
            await router.push('/admin/select-partner');
            return;
          } else if (decodedPayload.Email === 'pec@aliceblueindia.com'.toUpperCase()) {
            await router.push('/admin/banner');
            return;
          } else if (decodedPayload.Role === 'SUPERADMIN') {
            await router.push('/admin/select-partner');
            return;
          }
        }
      } else {
        if (localStorage.getItem('isPasswordReset') === 'true') {
          await router.push('/reset-password');
        } else {
          // await router.push('/dashboard');
          const remCode = localStorage.getItem('identifier');
          try {
            const bannerResponse = await authService.getBanners(remCode);
            if (bannerResponse.data?.isSuccess) {
              const banners = bannerResponse.data.data;
              if (banners.length > 0) {
                localStorage.setItem('banners', JSON.stringify(banners));
                await router.push('/dashboard');
              } else {
                await router.push('/dashboard');
              }
            } else {
              await router.push('/dashboard');
            }
          } catch (bannerErr) {
            console.error(bannerErr);
            errors.message = 'Error fetching banners.';
          }
        }
      }

    } else {
      errors.message = response.data?.message || 'Something went wrong, please try again later.';
    }
  } catch (err) {
    console.error(err);
    errors.message = err.response.data?.message || 'Something went wrong, please try again later.';
  }
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
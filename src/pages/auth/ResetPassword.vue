<template>
  <div>
    <h4 class="card-title fs20 text-dark text-center mb-3 mt-4">Reset Password</h4>
    <div class="mt-4">
      <form @submit.prevent="handleLogin" class="mt-4 pt-2">
        <div class="mb-3 ">
          <div class="position-relative">
            <div class="form-control-text">
              <label class="fs14 text-muted">New Password</label>
              <div class="input-group mt-1 position-relative">
                <input :type="showNewPassword ? 'text' : 'password'"
                  class="form-control-text password fs14 custom-input" maxlength="20" v-model="form.new_password"
                  @blur="validateNewPassword">
                <span class="eye-icon bg-white cursor-pointer" @click="showNewPassword = !showNewPassword">
                  <i :class="showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </span>
              </div>

              <ErrorMessage :class="'text-start mb-2 pt-2'" :message="errors.new_password" />
            </div>
          </div>
        </div>
        <div class="mb-3 mt-3">
          <div class="position-relative">
            <div class="form-control-text">
              <label class="fs14 text-muted">Confirm Password</label>
              <div class="input-group mt-1 position-relative">
                <input :type="showConfirmPassword ? 'text' : 'password'"
                  class="form-control-text password fs14 custom-input" maxlength="20" v-model="form.confirm_password"
                  @blur="validateConfirmPassword">
                <span class="eye-icon bg-white cursor-pointer" @click="showConfirmPassword = !showConfirmPassword">
                  <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </span>
              </div>
              <ErrorMessage :class="'text-start mb-2 pt-2'" :message="errors.confirm_password" />
            </div>
          </div>
        </div>

        <ErrorMessage :class="'text-center mb-2 pt-2'" :message="errors.message" />
        <div class="text-center pt-3">
          <PrimaryButton label="Continue" />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/auth/auth.service';
import ErrorMessage from '@/components/ErrorMessage.vue';
import PrimaryButton from '@/components/button/ButtonPrimary.vue';
import { showSuccessToast } from '../../js/toast';

const router = useRouter();
const authStore = useAuthStore();

const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const form = reactive({
  confirm_password: '',
  new_password: '',
  role: localStorage.getItem('role'),
  username: localStorage.getItem('username'),
});

const errors = reactive({
  confirm_password: '',
  new_password: '',
  message: '',
});

const validateNewPassword = () => {
  if (!form.new_password) {
    errors.new_password = 'Password is required.';
  } else if (form.new_password.length < 6) {
    errors.new_password = 'Password must be at least 6 characters.';
  } else {
    errors.new_password = '';
  }
};

const validateConfirmPassword = () => {
  const confirmPassword = form.confirm_password;
  const newPassword = form.new_password;

  if (!confirmPassword) {
    errors.confirm_password = 'Confirm password is required.';
  } else if (
    confirmPassword &&
    newPassword &&
    newPassword.length >= 6 && 
    confirmPassword !== newPassword
  ) {
    errors.confirm_password = 'Passwords do not match.';
  } else {
    errors.confirm_password = '';
  }
};

const validateForm = () => {
  validateNewPassword();
  validateConfirmPassword();
  return !errors.new_password && !errors.confirm_password;
};

const handleLogin = async () => {
  errors.message = '';

  if (!validateForm()) return;

  try {

    const response = await authService.resetPassword(form);

    if (response.data?.isSuccess) {
      showSuccessToast('Password reset successful. Please log in to access your dashboard.');
      setTimeout(() => {
        if (form.role === 'REMESHIRE') {
          router.push('/');
        } else if (form.role === 'ADMIN') {
          router.push('/admin');
        }
      }, 2000);
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
.password {
  border-radius: 4px 0 0 4px !important;
}

.input-group-text {
  border: 1px solid var(--border);
  border-radius: 0px 4px 4px 0px !important;
}

.eye-icon {
  position: absolute;
  top: 10px;
  right: 15px;
}
</style>
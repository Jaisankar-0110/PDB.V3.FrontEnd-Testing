<template>
  <div class="modal fade" id="EditGSTDetail" tabindex="-1" aria-labelledby="EditGSTDetail" aria-hidden="true"
    data-bs-backdrop="static">
    <div class="modal-dialog modal-md modal-dialog-centered">
      <div class="modal-content p-md-5 p-3">
        <div class="modal-header border-bottom-0 w-100">
          <div class="text-center fs18 fw500">New GST Details</div>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleEditGSTDetail">
            <div class="position-relative">
              <div class="form-control-text">
                <label class="fs14 text-muted">GST No</label>
                <input
                  type="text"
                  maxlength="15"
                  v-model="form.GstOrAddress"
                  class="fs14 mt-1 custom-input"
                  placeholder="Enter the GST No"
                  @input="sanitizeGSTNo"
                />
                <ErrorMessage
                  class="text-start form-text fs12 text-danger"
                  :message="errors.GstOrAddress"
                />
              </div>
            </div>

            <div class="mb-3 mt-3">
              <InputFile
              :key="fileInputKey"
                containerClass="mb-4 mt-2"
                id="pan"
                labelHeading="Proof"
                v-model="form.Proof"
                :required="true"
              />
              <ErrorMessage
                class="text-start form-text fs12 text-danger"
                :message="errors.Proof"
              />
            </div>

            <ErrorMessage
              class="text-center mb-2 pt-2 text-danger"
              :message="errors.message"
            />

            <div class="d-flex justify-content-between pt-3">
              <div class="btn btn-outline-tertiary w-50 pt-2" @click="closeModal">Cancel</div>
              <ButtonTertiary label="Update" class="w-50 ps-3" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import ButtonTertiary from "../../../../components/button/ButtonTertiary.vue";
import ErrorMessage from "../../../../components/ErrorMessage.vue";
import InputFile from "../../../../components/form/InputFile.vue";
import { Modal } from "bootstrap";
import { useAuthStore } from "@/stores/authStore";
import { showErrorToast, showSuccessToast } from "../../../../js/toast";
import { accountService } from "../../../../services/account/account.service";

const authStore = useAuthStore();
const adminDetails = ref({});
const fileInputKey = ref(0);

const loading = ref(false);

const form = reactive({
  GstOrAddress: "",
  Proof: null,
  Type: "gst"
});

const errors = reactive({
  GstOrAddress: "",
  Proof: "",
  message: ""
});


const sanitizeGSTNo = (event) => {
    const clean = event.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '');
     form.GstOrAddress = clean;
};


onMounted(() => {
  adminDetails.value = authStore.adminDetails;
  
});

const validateForm = () => {
  errors.GstOrAddress = !form.GstOrAddress ? "GST No is required." : "";
  errors.Proof = !form.Proof ? "Proof is required." : "";
  return !errors.GstOrAddress && !errors.Proof;
};

const handleEditGSTDetail = async () => {
  if (!validateForm()) return;

  loading.value = true;

  const data = {
    RemeshireCode : adminDetails.value.RemCode, 
    Type: form.Type,
    GstOrAddress: form.GstOrAddress,
    Proof: form.Proof
  };

  console.log(data);

 try {
  const response = await accountService.getGSTAddress(data);
  console.log("API response:", response.data);

  if (response.data?.isSuccess) {
    showSuccessToast(response.data.message);
    closeModal();
  } else {
    errors.message = response.data.message;
    showErrorToast(response.data.message);
  }
} catch (error) {
  console.error("Error submitting GST detail:", error);
  errors.message = error?.response?.data?.message || "Something went wrong.";
  showErrorToast(errors.message);
} finally {
  loading.value = false;
}
};

const closeModal = () => {
  form.GstOrAddress = "";
  form.Proof = "null";
  fileInputKey.value++;
  errors.GstOrAddress = "";
  errors.Proof = "";
  errors.message = "";
  loading.value = false;

  const modalElement = document.getElementById("EditGSTDetail");
  const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
  modal.hide();
};
</script>

<style scoped></style>

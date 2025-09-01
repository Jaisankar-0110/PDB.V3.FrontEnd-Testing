<template>
  <div class="modal fade" id="EditAddrDetail" tabindex="-1" aria-labelledby="EditAddrDetail" aria-hidden="true"
    data-bs-backdrop="static">
    <div class="modal-dialog modal-md modal-dialog-centered">
      <div class="modal-content p-md-5 p-3">
        <div class="modal-header border-bottom-0 w-100">
          <div class="text-center fs18 fw500">New Address Details</div>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleEditAddrDetail">
            <div class="position-relative">
              <div class="form-control-text">
                <label class="fs14 text-muted">Address</label>
                <input type="text" maxlength="50" v-model="form.GstOrAddress" class="fs14 mt-1 custom-input"
                  placeholder="Enter the Address" />
                <ErrorMessage class="text-start form-text fs12 text-danger" :message="errors.GstOrAddress" />
              </div>
            </div>

            <div class="position-relative">
              <div class="form-control-text">
                <label class="fs14 text-muted">City</label>
                <input type="text" maxlength="30" v-model="form.City" class="fs14 mt-1 custom-input"
                  placeholder="Enter the City" />
                <ErrorMessage class="text-start form-text fs12 text-danger" :message="errors.City" />
              </div>
            </div>

            <div class="position-relative mt-2">
              <div class="form-control-text">
                <label class="fs14 text-muted">State</label>
                <input type="text" maxlength="30" v-model="form.State" class="fs14 mt-1 custom-input"
                  placeholder="Enter the State" />
                <ErrorMessage class="text-start form-text fs12 text-danger" :message="errors.State" />
              </div>
            </div>

            <div class="position-relative mt-2">
              <div class="form-control-text">
                <label class="fs14 text-muted">Pincode</label>
                <input type="text" maxlength="6" v-model="form.Pincode" class="fs14 mt-1 custom-input"
                  placeholder="Enter the Pincode" />
                <ErrorMessage class="text-start form-text fs12 text-danger" :message="errors.Pincode" />
              </div>
            </div>


            <div class="mb-3 mt-3">
              <InputFile :key="fileInputKey" containerClass="mb-4 mt-2" id="address" labelHeading="Proof"
                v-model="form.Proof" :required="true" />
              <ErrorMessage class="text-start form-text fs12 text-danger" :message="errors.Proof" />
            </div>

            <ErrorMessage class="text-center mb-2 pt-2 text-danger" :message="errors.message" />

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
  City: "",
  State: "",
  Pincode: "",
  Proof: null,
  Type: "address"
});

const errors = reactive({
  GstOrAddress: "",
  City: "",
  State: "",
  Pincode: "",
  Proof: "",
  message: ""
});

onMounted(() => {
  adminDetails.value = authStore.adminDetails;

});

const validateForm = () => {
  errors.GstOrAddress = !form.GstOrAddress ? "Address is required." : "";
  errors.City = !form.City ? "City is required." : "";
  errors.State = !form.State ? "State is required." : "";
  errors.Pincode = !form.Pincode
    ? "Pincode is required."
    : !/^\d{6}$/.test(form.Pincode)
      ? "Pincode must be a 6-digit number."
      : "";
  errors.Proof = !form.Proof ? "Proof is required." : "";

  return (
    !errors.GstOrAddress &&
    !errors.City &&
    !errors.State &&
    !errors.Pincode &&
    !errors.Proof
  );
};

const handleEditAddrDetail = async () => {
  if (!validateForm()) return;

  loading.value = true;

  const data = {
    RemeshireCode: adminDetails.value.RemCode,
    Type: form.Type,
    GstOrAddress: `${form.GstOrAddress}|${form.City}|${form.State}|${form.Pincode}`,
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
  form.Proof = "";
  fileInputKey.value++;
  errors.GstOrAddress = "";
  errors.Proof = "";
  errors.message = "";
  loading.value = false;

  const modalElement = document.getElementById("EditAddrDetail");
  const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
  modal.hide();
};
</script>

<style scoped></style>

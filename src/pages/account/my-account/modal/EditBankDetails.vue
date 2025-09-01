<template>
    <div class="modal fade" id="EditBankDetails" tabindex="-1" aria-labelledby="EditBankDetails" aria-hidden="true"
        data-bs-backdrop="static">
        <div class="modal-dialog modal-md modal-dialog-centered">
            <div class="modal-content p-md-5 p-3">
                <div class="modal-header border-bottom-0 w-100">
                    <div class="text-center fs18 fw500">
                        Update Bank Details
                    </div>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="handleSubmit">

                        <div class="mb-3">
                            <div class="position-relative">
                                <div class="form-control-text">
                                    <label class="fs14  text-muted">Account No</label>
                                    <input type="tel" oninput="this.value = this.value.replace(/[^0-9]/g, '');"
                                        maxlength="20" @blur="validateAccountNumber" v-model="form.BankAcNo"
                                        class="fs14 mt-1 custom-input" placeholder="Enter the Account No">
                                    <ErrorMessage :class="'text-start form-text fs12 text-danger'"
                                        :message="errors.BankAcNo" />
                                </div>
                            </div>
                        </div>
                        <div class="mb-3 mt-3">
                            <div class="position-relative">
                                <div class="form-control-text">
                                    <label class="fs14  text-muted ">IFSC code</label>
                                    <input type="text" maxlength="11"
                                        oninput="this.value = this.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();"
                                        @blur="validateIFSCCode" v-model="form.IfscCode" class="fs14 mt-1 custom-input"
                                        placeholder="Enter the IFSC code">
                                    <ErrorMessage :class="'text-start form-text fs12 text-danger'"
                                        :message="errors.IfscCode" />
                                </div>
                            </div>
                        </div>
                         <div class="mb-3 mt-3">
                            <div class="position-relative">
                                <div class="form-control-text">
                                    <label class="fs14  text-muted ">MICR code</label>
                                    <input type="text" maxlength="9"
                                        oninput="this.value = this.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();"
                                        @blur="validateMICRCode" v-model="form.MicrCode" class="fs14 mt-1 custom-input"
                                        placeholder="Enter the MIRC code">
                                    <ErrorMessage :class="'text-start form-text fs12 text-danger'"
                                        :message="errors.MicrCode" />
                                </div>
                            </div>
                        </div>

                        <div v-if="form.PennyDrop === false">
                            <div class="mb-3 mt-3">
                                <div class="position-relative">
                                    <div class="form-control-text">
                                        <label class="fs14 text-muted">Bank Name</label>
                                        <input type="text" @blur="validateBankName" maxlength="50"
                                            oninput="this.value = this.value.replace(/[^a-zA-Z0-9/,-\s]/g, '');"
                                            v-model="form.BankName" class="fs14 mt-1 custom-input"
                                            placeholder="Enter the Bank Name">
                                        <ErrorMessage :class="'text-start form-text fs12 text-danger'"
                                            :message="errors.BankName" />
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3 mt-3">
                                <div class="position-relative">
                                    <div class="form-control-text">
                                        <label class="fs14 text-muted">Account Holder Name</label>
                                        <input type="text" @blur="validateName" maxlength="50"
                                            oninput="this.value = this.value.replace(/[^a-zA-Z\s]/g, '');"
                                            v-model="form.Name" class="fs14 mt-1 custom-input"
                                            placeholder="Enter the Name">
                                        <ErrorMessage :class="'text-start form-text fs12 text-danger'"
                                            :message="errors.Name" />
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3 mt-3">
                                <InputFile containerClass="mb-4 mt-2" id="pan" labelHeading="Proof" v-model="form.Proof"
                                    :required="true" />
                                <ErrorMessage class="text-start form-text fs12 text-danger" :message="errors.Proof" />
                            </div>
                        </div>

                        <ErrorMessage :class="'text-center mb-2 pt-2'" :message="errors.message" />

                        <div class="d-flex justify-content-between pt-3">
                            <div class="btn btn-outline-tertiary w-50 pt-2" @click="closeModal">
                                Cancel
                            </div>
                            <ButtonTertiary label="Update" class="w-50 ps-3" />
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import ButtonTertiary from "../../../../components/button/ButtonTertiary.vue";
import ErrorMessage from "../../../../components/ErrorMessage.vue";
import { Modal } from "bootstrap";
import { useAuthStore } from '@/stores/authStore';
import InputFile from "../../../../components/form/InputFile.vue";
import { accountService } from "../../../../services/account/account.service";
import { showErrorToast, showSuccessToast } from "../../../../js/toast";

const authStore = useAuthStore();

const loading = ref(false);

const form = reactive({
    RemeshireCode: authStore.adminDetails.RemCode,
    Type: "bank",
    BankName: "",
    BankAcNo: "",
    MicrCode: "",
    IfscCode: "",
    Proof: "",
    PennyDrop: null,
    Name:"",
    PennyDropResponse:""
});

const errors = reactive({
    BankName: "",
    BankAcNo: "",
    IfscCode: "",
    MicrCode: "",
    Proof: "",
    message: "",
     Name:"",
});

const validateAccountNumber = () => {
    if (!form.BankAcNo) {
        errors.BankAcNo = "Account number is required.";
    } else if (form.BankAcNo.length < 9) {
        errors.BankAcNo = "Account number must be at least 10 characters long.";
    } else {
        errors.BankAcNo = "";
    }
};

const validateIFSCCode = () => {
    // if (!form.BankAcNo && form.IfscCode) {
    //     errors.IfscCode = "Account numbers must be entered before entering the IFSC code.";
    //     return;
    // }
    if (!form.IfscCode) {
        errors.IfscCode = "IFSC code is required.";
    } else if (form.IfscCode.length !== 11) {
        errors.IfscCode = "IFSC code must be 11 characters long.";
    } else {
        errors.IfscCode = "";
    }
};

const validateMICRCode = () => {
  if (!form.MicrCode) {
        errors.MicrCode = "Micr code is required.";
    } else if (form.MicrCode.length !== 9) {
        errors.MicrCode = "Micr code must be 9 characters long.";
    } else {
        errors.MicrCode = "";
    }
};

const validateBankName = () => {
    errors.BankName = form.BankName ? "" : "Bank name is required.";
};

const validateName = () => {
    errors.Name = form.Name ? "" : "Account holder name is required.";
};

const validateForm = () => {
    errors.message = '';
    validateAccountNumber();
    validateIFSCCode();
    validateMICRCode();
    if (form.PennyDrop === false) {
        validateBankName();
        errors.Proof = !form.Proof ? "Proof is required." : "";
        return !errors.BankName && !errors.BankAcNo && !errors.IfscCode && !errors.Proof && !errors.MicrCode;
    } else {
        return !errors.BankAcNo && !errors.IfscCode && !errors.MicrCode;
    }
};

const handleSubmit = () => {
    if (!validateForm()) return;
    loading.value = true;
    if (form.PennyDrop === null) {
        verifyPennyDrop();
    } else {
        handleSubmitBankDetails();
    }
}

const verifyPennyDrop = async () => {
   try {
        const response = await accountService.verifyPennyDrop(form);
        if (response.data?.isSuccess) {
            form.PennyDrop = response.data.data.PennyDrop; 
            form.BankName = response.data.data.bank_name;
            form.Proof = 'PennyDrop Verified'.toUpperCase(); 
            form.Name = response.data.data.name;
            form.PennyDropResponse = response.data.data.penny_drop_response;
            handleSubmitBankDetails();
        } else {
            // errors.message = response.data.message;
            form.PennyDrop = false; 
            form.PennyDropResponse = 'PennyDrop Failed'.toUpperCase();
            // showErrorToast(response.data.message);
        }
    } catch (error) {
        console.error("Error submitting bank details:", error);
        errors.message = error?.response?.data?.message || "Something went wrong.";
        showErrorToast(errors.message);
        form.PennyDrop = false; 
    } finally {
        loading.value = false;
    }
};

const handleSubmitBankDetails = async () => {
    try {
        const response = await accountService.updateBankDetails(form);
        if (response.data?.isSuccess) {
            showSuccessToast(response.data.message);
            closeModal();
        } else {
            errors.message = response.data.message;
             form.PennyDrop = null;
            showErrorToast(response.data.message);
        }
    } catch (error) {
        console.error("Error submitting bank details:", error);
        errors.message = error?.response?.data?.message || "Something went wrong.";
        showErrorToast(errors.message);
    } finally {
        loading.value = false;
    }
};

const closeModal = () => {
    form.BankName = "";
    form.BankAcNo = "";
    form.IfscCode = "";
    form.MicrCode = "";
    form.Proof = "";
    form.PennyDrop = null;

    errors.BankName = "";
    errors.BankAcNo = "";
    errors.IfscCode = "";
    errors.MicrCode= "",
    errors.Proof = "";
    errors.message = "";

    loading.value = false;
    const modalElement = document.getElementById("EditBankDetails");
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    modal.hide();
};

</script>

<style scoped></style>
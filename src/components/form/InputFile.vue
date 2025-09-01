<template>
    <div :class="containerClass">
        <div class="position-relative">
            <div class="form-text-light">
                <label class="fs14 px-1   text-muted">
                    {{ labelHeading }} <span class="  text-muted fs11">{{ labelSubHeading }}</span>
                   
                </label>
            </div>
            <div class="form-control-file bg-light-color d-flex w-100 align-items-center" :for="id">
                <input ref="fileInput" accept="application/pdf" type="file"
                    class="d-none my-0 mb-0 fs14 mt-1" :id="id" @change="previewProofFile" />
                <label :for="id" class="w-100 fs14 py-3 px-2 text-start">
                    <span class="file-name fs14 text-muted">
                        {{ selectedFileName }}
                        <span class="fs14" v-if="selectedFileName == 'Upload'">(Only Pdf, Max 500KB)</span>
                    </span>
                </label>
                <label :for="id" class="upload-img upload-icon pe-4">
                    <i class="bi bi-arrow-up-square-fill fs18"></i>
                </label>
            </div>
            <div class="text-end mt-2" v-if="modelValue">
                <div class="cursor-pointer fs13 text-primary-color" @click="viewDocument(modelValue)">
                    <i class="bi fs14 bi-file-earmark-pdf"></i> View document
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

const props = defineProps({
    containerClass: String,
    labelHeading: String,
    labelSubHeading: String,
    modelValue: String, 
    id: String,
    errorMessage: String,
    required: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(["update:modelValue"]);

const selectedFileName = ref("Upload");


const viewDocument = (src) => {
    if (!src) return;

    const base64String = src.split(",")[1];
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const blobURL = URL.createObjectURL(blob);
    window.open(blobURL, "_blank");
};

const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

const previewProofFile = async (event) => {
    const file = event.target.files[0];
    if (file) {
        console.log("File Size (in bytes):", file.size); 
        const minSize = 4* 1024; // Minimum file size: 5KB
        const maxSize = 500 * 1024; // Maximum file size: 500KB

        if (file.size >= minSize) {
            if (file.type === "application/pdf") {
                if (file.size <= maxSize) {
                    let fileName = file.name;
                    if (fileName.length > 20) {
                        fileName = fileName.substring(0, 25) + "...";
                    }
                    selectedFileName.value = fileName;

                    try {
                        const base64File = await toBase64(file);
                        emit("update:modelValue", base64File); 
                    } catch (error) {
                        console.error("Failed to process the file.");
                    }
                } else {
                    console.error("File size should be less than 500KB.");
                    Toastify({
                        text: "File size should be less than 500KB.",
                        duration: 3000,
                        close: true,
                        gravity: "top",
                        position: "center",
                        backgroundColor: "#f44336",
                    }).showToast();
                    emit("update:modelValue", null);
                    selectedFileName.value = "Upload ";
                    return;
                }
            } else {
                console.error("Only PDF files are allowed.");
                Toastify({
                    text: "Only PDF files are allowed.",
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "center",
                    backgroundColor: "#f44336",
                }).showToast();
            }
        } else {
            console.error("File size should be at least 5KB.");
            Toastify({
                text: "File size should be at least 5KB.",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "center",
                backgroundColor: "#f44336",
            }).showToast();
            emit("update:modelValue", null);
            selectedFileName.value = "Upload";
        }
    }
};

</script>


<style scoped>


</style>
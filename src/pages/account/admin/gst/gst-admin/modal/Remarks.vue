<template>
  <div class="modal fade" id="remarksModal" tabindex="-1" aria-labelledby="remarksModal" aria-hidden="true"
    data-bs-backdrop="static">
    <div class="modal-dialog modal-md modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fs16 text-dark fw500" id="remarksLabel">
            Admin Remark
          </h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>

        <div class="modal-body fs14 p-4">
          <div>
            <span class="text-muted">{{ remarks || '-' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Modal } from "bootstrap";

defineProps({
  remarks: String,
});

const closeModal = () => {
  const modalElement = document.getElementById("remarksModal");
  const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
  modal.hide();
};

</script>


<template>
  <div class="modal fade" id="confirmation" tabindex="-1" aria-labelledby="confirmation" aria-hidden="true"
       data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 rounded-4 shadow">
        <div class="modal-header border-0 bg-light rounded-top-4">
          <h5 class="modal-title w-100 text-center fw-bold">Confirmation</h5>
        </div>

        <div class="modal-body text-center py-4 px-4">
          <p class="mb-4 fs16">
            If continuing as a BDR, select <strong>YES</strong>. If not, select <strong>NO</strong>.
          </p>

          <div class="d-flex justify-content-center">
            <button type="button" class="btn btn-outline-primary px-5 py-2 me-2 rounded-pill fw-semibold"
                    @click="$emit('cancel')">
              No
            </button>
            <button type="button" class="btn btn-primary px-5 py-2 rounded-pill fw-semibold"
                    @click="$emit('confirm')">
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>

</script>

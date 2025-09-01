<template>
  <div class="modal fade" id="banner" tabindex="-1" aria-labelledby="banner" aria-hidden="true"
    data-bs-backdrop="static">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content p-md-3 p-2">
        <div class="modal-header border-bottom-0 w-100">
          <div class="text-center fs18-16 fw500">
            Latest Announcement
          </div>
          <button type="button" class="btn-close fs16" @click="closeModal"></button>
        </div>
        <div class="modal-body text-center overflow-hidden position-relative" style="min-height: 200px">
          <transition name="slide-fade" mode="out-in">
            <a
              :key="currentBanner?.Image"
              :href="currentBanner?.Link"
              target="_blank"
              class="d-block"
            >
              <img
                :src="currentBanner?.Image"
                class="img-fluid w-100"
                :alt="currentBanner?.Name || 'Banner'"
              />
            </a>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Modal } from 'bootstrap';

const banners = ref([]);
const currentIndex = ref(0);
let slideInterval = null;

const currentBanner = computed(() => banners.value[currentIndex.value] || null);

const startSlideShow = () => {
  slideInterval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % banners.value.length;
  }, 3000);
};

const stopSlideShow = () => {
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = null;
  }
};

const closeModal = () => {
  const modalElement = document.getElementById("banner");
  const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
  modal.hide();
  stopSlideShow();
};

onMounted(() => {
  const bannerFromStorage = localStorage.getItem('banners');
  if (bannerFromStorage) {
    try {
      const parsed = JSON.parse(bannerFromStorage);
      banners.value = parsed.filter(b => b.IsActive);
      if (banners.value.length > 0) {
        startSlideShow();
      }
    } catch (e) {
      console.error("Invalid banner JSON in localStorage", e);
    }
  }
});

onUnmounted(() => {
  stopSlideShow();
});
</script>

<style scoped>

</style>


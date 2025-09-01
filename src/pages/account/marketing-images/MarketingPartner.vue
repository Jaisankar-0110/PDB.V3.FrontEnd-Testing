<template>
    <div class="px-2 pb-3 fs14 d-flex align-items-end">
        <RouterLink to="/dashboard" class="text-tertiary-color text-decoration-none"> <i
                class=" bi bi-house-fill fs16 pe-1"></i>
            Dashboard</RouterLink>
        <span class="px-2">/</span>
        <div class="text-muted">Marketing Images</div>
    </div>
    <div class="card">
        <div class="card-header py-3 bg-transparent">
            <div class="d-flex justify-content-between align-items-center">
                <div class="text-quaternary-color fs16 fw500">Marketing Images</div>
            </div>
        </div>
        <div class="card-body p-3">
           
            <div class=" mb-5 pb-5">
        <div class="row g-4 uploaded-images-grid p-3">
            <div class="col-md-4 col-sm-6 col-12" v-for="(image, index) in staticImages" :key="index">
                <div class="position-relative image-wrapper">
                    <img :src="image" alt="Uploaded Image" class="uploaded-img img-fluid rounded shadow" />
                    <i class="bi bi-download download-icon text-primary fs20 fw600 p-1 cursor-pointer" @click="downloadImage(image)" title="Download"></i>

                </div>
            </div>
        </div>
    </div>
        </div>
    </div>
</template> 

<script setup>
import { ref } from 'vue';


const staticImages = ref([
    'https://www.shutterstock.com/shutterstock/photos/2557773529/display_1500/stock-photo-global-business-logistics-and-transportation-import-export-container-cargo-freight-ship-freight-2557773529.jpg',
    'https://www.shutterstock.com/image-photo/save-money-investment-concept-stack-260nw-2476383337.jpg',
    'https://www.shareindia.com/wp-content/uploads/2023/01/Futures-in-Stock-Market.webp',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTexbcuTMhhQC6wK7Tje7nO14A_hHLcx50LrQ&s',
    'https://img.freepik.com/free-photo/corporate-management-strategy-solution-branding-concept_53876-167088.jpg?semt=ais_hybrid&w=740',
    'https://media.istockphoto.com/id/1385970223/photo/great-idea-of-a-marketing-strategy-plan-at-a-creative-office.jpg?s=612x612&w=0&k=20&c=6up_J8ekhYIbF3qiUEo9t28u8X-UrFNqwryyRhBl35w='
]);

const downloadImage = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // const fileName = imageUrl.split('/').pop().split('?')[0] || 'downloaded-image.jpg';
    // link.download = fileName;
    link.download = 'marketing-image.jpg';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // clean up
  } catch (error) {
    console.error('Download failed:', error);
  }
};


</script>

<style scoped lang="scss">
.no-data {
    width: 400px !important;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: visible; 
  border-radius: 8px;
}

.uploaded-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.download-icon {
  position: absolute;
  top: -10px;
  right: -8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: red;
  background-color: white;
  border-radius:50%;
  z-index: 10;
  transition: transform 0.2s ease;
}

.download-icon:hover {
  transform: scale(1.15);
  color: rgb(194, 5, 5);
}
</style>
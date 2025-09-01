<template>
  <div class="sidebar-toggler" id="mobileToggle" @click="toggleSidebar">
    <i class="bi bi-chevron-left fs14"></i>
  </div>
  <div class="wrapper">
    <Sidebar :collapsed="isCollapsed" :show="showSidebar"
      @toggleCollapse="isCollapsed = !isCollapsed" @linkClicked="toggleSidebar" />
    <div id="main-content">
       <Navbar />
      <div class="scrollable-container flex-grow-1 overflow-auto">
        <div class="container-fluid mt-3">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Sidebar from './Sidebar.vue';
import Navbar from './Navbar.vue';

const isCollapsed = ref(false)
const showSidebar = ref(false);

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
  const mobileToggle = document.getElementById('mobileToggle')
  mobileToggle.style.left = showSidebar.value ? '240px' : '0px'
}

onMounted(() => {
  document.addEventListener('click', (event) => {
    if (
      window.innerWidth <= 768 &&
      !event.target.closest('#sidebar') &&
      !event.target.closest('#mobileToggle')
    ) {
      showSidebar.value = false
      document.getElementById('mobileToggle').style.left = '0px'
    }
  })
})

</script>

<style scoped>
.wrapper {
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

#main-content {
  flex: 1;
  background-color: var(--light) !important;
  overflow: auto;
  position: relative;
}

.sidebar-toggler {
  position: fixed;
  top: 50%;
  left: 0px;
  transform: translateY(-50%);
  background: var(--secondary);
  color: var(--light);
  border: 1px solid var(--light);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  text-align: center;
  line-height: 22px;
  cursor: pointer;
  z-index: 1100;
  font-weight: bold;
  transition: left 0.3s ease;
}

@media (max-width: 768px) {
  #mobileToggle {
    display: block;
    z-index: 1100;
  }
}

@media (min-width: 769px) {
  #mobileToggle {
    display: none;
  }
}

.scrollable-container {
  height: calc(100vh - 80px);
  overflow-y: auto;
}

/* Scrollbar styling */
.scrollable-container::-webkit-scrollbar {
  width: 4px;
}

.scrollable-container::-webkit-scrollbar-track {
  background: var(--scrollbar);
}

.scrollable-container::-webkit-scrollbar-thumb {
  background-color: var(--tertiary);
  border-radius: 2px;
}

.announcement {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999;
  /* background: var(--light); */
}
</style>

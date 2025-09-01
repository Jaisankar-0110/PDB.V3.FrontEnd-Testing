<template>
  <main>
    <RouterView />
  </main>
</template>

<script setup>
import { RouterView, useRouter } from 'vue-router';
import { onMounted, onBeforeUnmount } from 'vue';

const router = useRouter();
let tokenCheckInterval;

const checkTokenExpiration = () => {
  const token = sessionStorage.getItem('token');
  const tokenExpiry = sessionStorage.getItem('tokenExpiry');

  if (token && tokenExpiry && Date.now() > parseInt(tokenExpiry, 10)) {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('tokenExpiry');
    router.replace({ name: 'login' });
  }
};

onMounted(() => {
  tokenCheckInterval = setInterval(checkTokenExpiration, 30000);
});

onBeforeUnmount(() => {
  clearInterval(tokenCheckInterval);
});
</script>

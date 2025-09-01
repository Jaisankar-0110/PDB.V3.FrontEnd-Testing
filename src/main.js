import { createApp } from 'vue';
import './styles/main.scss';
import App from './App.vue';
import router from './router';

import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';

import { createPinia } from 'pinia';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import CanvasJSChart from '@canvasjs/vue-charts';


import axios from "./js/axios";
window.axios = axios;

const app = createApp(App);
const pinia = createPinia();
app.use(CanvasJSChart);
app.use(pinia);
app.use(router);

app.mount('#app');

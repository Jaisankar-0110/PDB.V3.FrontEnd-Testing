<template>
    <div class="mt-3">
        <div class="tab-container overflow-auto d-flex gap-2 pb-2">
            <button v-for="tab in tabs" :key="tab.name" class="btn rounded-pill fs14 position-relative" :class="{
                'btn-primary': isSelected(tab.name),
                'btn-outline-primary': !isSelected(tab.name)
            }" @click="handleTabClick(tab)">
                {{ tab.label }}
                <span v-if="tab.children" class="ms-1">▼</span>
            </button>
        </div>

        <div v-if="showGSTDropdown" class="dropdown-menu d-block mt-1 p-2 border rounded">
            <button v-for="child in gstChildren" :key="child.name" class="dropdown-item btn btn-sm text-start"
                :class="{ 'text-primary': isSelected(child.name) }" @click="selectTab(child.name)">
                {{ child.label }}
            </button>
        </div>

        <div class="mt-3">
            <component :is="currentComponent" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import GSTAdmin from './gst/gst-admin/GSTAdmin.vue';
import GSTModification from './gst/gst-modification/GSTModification.vue';
import GSTList from './gst/gst-list/GSTList.vue';
import GSTUpload from './gst/gst-upload/GSTUpload.vue';
import PartnerSelection from './partner-selection/PartnerSelection.vue';
import Profile from './profile/Profile.vue';
import { useAuthStore } from '@/stores/authStore';
import Banner from './banner/Banner.vue';
import Announcement from './announcement/Announcement.vue';
import MarketingImages from './marketing-images/MarketingImages.vue';

const authStore = useAuthStore();
const role = authStore.adminDetails?.Role;
const email = authStore.adminDetails?.Email;

const selectedTab = ref('');
const showGSTDropdown = ref(false);

const components = {
    selectPartner: PartnerSelection,
    gstAdmin: GSTAdmin,
    gstUpload: GSTUpload,
    profile: Profile,
    banner: Banner,
    announcement: Announcement,
    gstModification: GSTModification,
    gstList: GSTList,
    marketingImages: MarketingImages
};

const allTabs = [
    {
        name: 'gst',
        label: 'GST',
        children: [
            { name: 'gstAdmin', label: 'GST Admin' },
            { name: 'gstUpload', label: 'GST Upload' },
            { name: 'gstModification', label: 'GST Modification' },
            { name: 'gstList', label: 'GST List' }
        ]
    },
    { name: 'profile', label: 'Profile' },
    { name: 'selectPartner', label: 'Select Partner' },
    { name: 'banner', label: 'Banner' },
    { name: 'announcement', label: 'Announcement' },
    { name: 'marketingImages', label: 'Marketing Images' }
];

let tabs = [];
if (role === 'KYC') {
    tabs = [allTabs.find(t => t.name === 'profile')];
    selectedTab.value = 'profile';
} else if (role === 'FINANCE') {
    tabs = [allTabs.find(t => t.name === 'gst')];
    selectedTab.value = 'gstAdmin';
} else if (role === 'ADMIN') {
    tabs = [allTabs.find(t => t.name === 'selectPartner')];
    selectedTab.value = 'selectPartner';
} else if (email === 'pec@aliceblueindia.com'.toUpperCase()) {
    tabs = allTabs.filter(t => t.name === 'banner' || t.name === 'announcement');
    selectedTab.value = 'banner';
} else if (role === 'SUPERADMIN') {
    tabs = allTabs;
    selectedTab.value = 'selectPartner';
}

const gstChildren = tabs.find(tab => tab.name === 'gst')?.children || [];

const currentComponent = ref(components[selectedTab.value]);

function isSelected(name) {
    if (name === 'gst') {
        return gstChildren.some(child => child.name === selectedTab.value);
    }
    return selectedTab.value === name;
}

function handleTabClick(tab) {
    if (tab.children) {
        showGSTDropdown.value = !showGSTDropdown.value;
    } else {
        showGSTDropdown.value = false;
        selectTab(tab.name);
    }
}

function selectTab(name) {
    selectedTab.value = name;
    currentComponent.value = components[name];
    showGSTDropdown.value = false;
}
</script>


<style scoped>
.tab-container {
    white-space: nowrap;
    overflow-x: auto;
}

.dropdown-menu {
    background-color: #fff;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
    width: max-content;
}

.dropdown-item {
    border: none;
    background: none;
    width: 100%;
}

button.active {
    background-color: var(--primary);
    color: white;
}

.btn-outline-primary {
    color: var(--primary) !important;
    background-color: transparent !important;
    background-image: none;
    border-color: var(--primary) !important;
    border: 1px solid var(--primary) !important;
}
</style>

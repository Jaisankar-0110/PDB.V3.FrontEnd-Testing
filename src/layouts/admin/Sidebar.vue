<template>
    <div :class="['sidebar', { show, collapsed }]" id="sidebar">
        <div class="m-3">
            <div class="user-card d-flex p-2 rounded">
                <div>
                    <img src="/image/user.png"
                        class="user-icon1 d-inline-block rounded-circle border cursor-pointer me-3" alt="Logo" />
                </div>
                <div v-if="!collapsed">
                    <p class="text-light fw500 fs16 mb-0">{{ adminDetails.Name || '-' }}</p>
                    <p class="text-light mb-0 pb-0 fs12">{{ role || '-' }}</p>
                </div>
            </div>
        </div>
        <div class="menu mt-3">

            <div v-if="(role === 'SUPERADMIN' && adminDetails.Email !== 'PEC@ALICEBLUEINDIA.COM') || role === 'FINANCE'"
                class="sidebar-link cursor-pointer position-relative custom-dropdown-toggle"
                :class="!collapsed ? 'gap-12' : '', isGSTActive ? 'active' : ''" @click="toggleGSTDropdown">
                <i class="menu-icon bi bi-tag"></i>
                <span class="menu-title">GST</span>
                <i class="bi arrow fs14"
                    :class="!collapsed ? 'd-inline' : 'd-none', showGSTDropdown ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </div>
            <div v-if="showGSTDropdown" :class="!collapsed ? 'submenu d-flex' : 'd-none'">
                <router-link to="/admin/gst-admin" class="sidebar-link sub-link" @click="handleLinkClick"
                    :class="[$route.path === '/admin/gst-admin' ? 'active' : '']">
                    <i class="bi bi bi-arrow-return-right fs16 pe-2"></i><span class="menu-title">GST Admin</span>
                </router-link>
                <router-link to="/admin/gst-upload" class="sidebar-link sub-link" @click="handleLinkClick"
                    :class="[$route.path === '/admin/gst-upload' ? 'active' : '']">
                    <i class="bi bi bi-arrow-return-right fs16 pe-2"></i><span class="menu-title">GST Upload</span>
                </router-link>
                <router-link to="/admin/gst-modification" class="sidebar-link sub-link" @click="handleLinkClick"
                    :class="[$route.path === '/admin/gst-modification' ? 'active' : '']">
                    <i class="bi bi bi-arrow-return-right fs16 pe-2"></i><span class="menu-title">GST
                        Modification</span>
                </router-link>
                <router-link to="/admin/gst-list" class="sidebar-link sub-link" @click="handleLinkClick"
                    :class="[$route.path === '/admin/gst-list' ? 'active' : '']">
                    <i class="bi bi bi-arrow-return-right fs16 pe-2"></i><span class="menu-title">GST List</span>
                </router-link>
            </div>

            <router-link
                v-if="(role === 'SUPERADMIN' && adminDetails.Email !== 'PEC@ALICEBLUEINDIA.COM') || role === 'KYC'"
                to="/admin/manage-profile" class="sidebar-link" @click="handleLinkClick"
                :class="[!collapsed ? 'gap-12' : '', $route.path === '/admin/manage-profile' ? 'active' : '']">
                <i class="menu-icon bi bi-person-circle"></i><span class="menu-title">Profile</span>
            </router-link>
            <router-link
                v-if="(role === 'SUPERADMIN' && adminDetails.Email !== 'PEC@ALICEBLUEINDIA.COM') || role === 'ADMIN'"
                to="/admin/select-partner" class="sidebar-link" @click="handleLinkClick"
                :class="[!collapsed ? 'gap-12' : '', $route.path === '/admin/select-partner' ? 'active' : '']">
                <i class="menu-icon bi bi-person-vcard"></i><span class="menu-title">Select Partner</span>
            </router-link>
            <router-link v-if="role === 'SUPERADMIN' || adminDetails.Email === 'PEC@ALICEBLUEINDIA.COM'"
                to="/admin/banner" class="sidebar-link" @click="handleLinkClick"
                :class="[!collapsed ? 'gap-12' : '', $route.path === '/admin/banner' ? 'active' : '']">
                <i class="menu-icon bi bi-card-heading"></i><span class="menu-title">Banner</span>
            </router-link>
            <router-link v-if="role === 'SUPERADMIN' || adminDetails.Email === 'PEC@ALICEBLUEINDIA.COM'"
                to="/admin/announcement" class="sidebar-link" @click="handleLinkClick"
                :class="[!collapsed ? 'gap-12' : '', $route.path === '/admin/announcement' ? 'active' : '']">
                <i class="menu-icon bi bi-volume-up-fill"></i><span class="menu-title">Announcement</span>
            </router-link>
            <!-- <router-link  to="/admin/marketing-images" class="sidebar-link" @click="handleLinkClick"
                :class="[!collapsed ? 'gap-12' : '', $route.path === '/admin/marketing-images' ? 'active' : '']">
                <i class="menu-icon bi bi-images"></i><span class="menu-title">Marketing Images</span>
            </router-link> -->
        </div>

        <div class="sidebar-toggler" id="desktopToggle" @click="$emit('toggleCollapse')">
            <i class="bi bi-chevron-left fs14"></i>
        </div>

        <div class="signout-btn">
            <button class="btn btn-outline-danger px-4" @click="signOut">
                <span v-if="!collapsed" class="fs14">Sign Out</span>
                <span v-else class="fs14">
                    <i class="bi bi-box-arrow-right"></i>
                </span></button>
        </div>
    </div>
</template>

<script setup>
import { ref, watchEffect, computed, onMounted } from 'vue';
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from '@/stores/authStore';
import { authService } from '../../services/auth/auth.service';

const props = defineProps({
    collapsed: Boolean,
    show: Boolean,
})

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const adminDetails = ref({});
const role = ref("");

const signOut = async () => {
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('tokenExpiry');
    localStorage.removeItem('role');
    localStorage.removeItem('identifier');
    localStorage.removeItem('username');
    localStorage.removeItem('otpSend');
    localStorage.removeItem('otp_expiry');
    localStorage.removeItem('adminDetails');
    localStorage.removeItem('isPasswordReset');
    localStorage.removeItem('banners');
    localStorage.removeItem('announcement');
    localStorage.removeItem('identifierMobile');
    localStorage.removeItem('identifierMail');

    const role = authStore.adminDetails?.Role;

    try {
        const data = authStore.adminDetails?.Role === 'REMESHIRE' ? authStore.adminDetails?.RemCode : authStore.adminDetails?.Email;
        const response = await authService.logout(data);
        if (response.data?.isSuccess) {

        } else {
            console.log(response.data?.message);
        }
    } catch (err) {
        console.error(err);
    }

    authStore.clearAdminDetails();

    switch (role) {
        case 'REMISHIRE':
            router.push('/');
            break;
        case 'SUPERADMIN':
            router.push('/admin');
            break;
        case 'ADMIN':
            router.push('/admin');
            break;
        case 'KYC':
            router.push('/admin');
            break;
        case 'FINANCE':
            router.push('/admin');
            break;
        default:
            router.push('/');
    }

};

const emit = defineEmits(['linkClicked', 'toggleCollapse']);

const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
        emit('linkClicked')
    }
}

const showGSTDropdown = ref(false);

const isGSTActive = computed(() => {
    return ['/admin/gst-list', '/admin/gst-upload', '/admin/gst-modification', '/admin/gst-admin'].includes(route.path);
});

watchEffect(() => {
    showGSTDropdown.value = isGSTActive.value;
});

const toggleGSTDropdown = () => {
    if (props.collapsed) {
        emit('toggleCollapse');
    }
    showGSTDropdown.value = !showGSTDropdown.value;
};

onMounted(() => {
    adminDetails.value = authStore.adminDetails;
    role.value = adminDetails.value.Role;
});

</script>

<style scoped>
.sidebar {
    width: 250px;
    background-color: var(--light) !important;
    color: var(--light) !important;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1000;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px !important;
}

.sidebar.collapsed {
    width: 90px;
}

.sidebar-link.active .menu-title,
.sidebar-link.active i.bi-arrow-return-right {
    color: var(--secondary);
}

.sidebar-link.active {
    background-color: var(--primary-light) !important;
}

.sub-link.active {
    background-color: transparent !important;
}

.sub-link.active .menu-title,
.sub-link.active i.bi-arrow-return-right {
    color: var(--primary) !important;
}

.gap-12 {
    gap: 12px !important;
}

.sidebar-link {
    display: flex;
    align-items: center;
    padding: 14px 20px !important;
    color: var(--secondary) !important;
    text-decoration: none;
}

/* .sidebar-link:hover {
    background-color: var(--primary-light) !important;
} */

.menu-title {
    transition: opacity 0.3s;
}

.sidebar.collapsed .menu-title {
    opacity: 0;
    width: 0;
    overflow: hidden;
}

.sidebar-toggler {
    position: absolute;
    top: 50%;
    right: -12px;
    transform: translateY(-50%);
    background: var(--secondary);
    color: var(--light);
    border: 1px solid var(--light);
    border-radius: 50%;
    width: 24px;
    height: 24px;
    text-align: center;
    cursor: pointer;
    z-index: 1100;
    font-weight: bold;
}

@media (max-width: 768px) {
    .sidebar {
        position: fixed;
        height: 100vh;
        left: -250px;
    }

    .sidebar.show {
        left: 0;
    }

    .sidebar.collapsed {
        left: -90px;
    }

    #desktopToggle {
        display: none;
    }
}

.logo {
    position: relative;
}

.menu {
    overflow-y: auto;
    padding-bottom: 20px;
    max-height: calc(100vh - 160px);
    overflow-x: hidden;
}

.menu::-webkit-scrollbar {
    width: 2px !important;
}

.menu::-webkit-scrollbar-track {
    background: transparent !important;
}

.menu::-webkit-scrollbar-thumb {
    background-color: var(--primary-light);
    border-radius: 2px;
}

.menu::-webkit-scrollbar-thumb:hover {
    background-color: var(--primary);
}

.menu {
    scrollbar-width: thin;
    scrollbar-color: var(--primary-light) transparent;
}

.menu-title {
    font-size: 15px;
}

.menu-icon {
    color: var(--tertiary);
    font-size: 20px;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.signout-btn {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
}

.btn-sign-out {
    border-radius: .25rem;
    border: 1px solid var(--light) !important;
    color: var(--light) !important;
}

/* Sub menu Styles */

.submenu {
    /* padding-left: 40px; */
    padding-left: 20px;
    display: flex;
    flex-direction: column;
}

.sub-link {
    padding: 18px 15px !important;
    font-size: 14px;
}

.custom-dropdown-toggle .arrow {
    position: absolute;
    right: 12px;
}

.btn-outline-danger {
    border: 1px solid var(--error) !important;
}

.user-icon1 {
    width: 40px !important;
}

.user-card {
    background-color: var(--primary);
}
</style>
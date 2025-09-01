<template>
    <div :class="['sidebar', { show, collapsed }, isAnnouncement ? 'pt-2' : null]" id="sidebar">
        <div class="sidebar-header py-3" :class="collapsed ? '' : 'px-3'">
            <img src="/image/logo.png" class="logo border bg-light py-1 rounded" :class="collapsed ? 'px-2' : 'px-2'"
                :style="{ left: collapsed ? '0px' : '50px', width: collapsed ? '90px' : '110px' }" alt="Logo" />
        </div>
        <div class="menu">
            <router-link to="/dashboard" class="sidebar-link" @click="handleLinkClick"
                :class="[!collapsed ? 'gap-12' : '', $route.path === '/dashboard' ? 'active' : '']">
                <i class="menu-icon bi bi-house-fill"></i><span class="menu-title">Dashboard</span>
            </router-link>

            <div class="sidebar-link cursor-pointer position-relative custom-dropdown-toggle"
                :class="!collapsed ? 'gap-12' : '', isMyReferralsActive ? 'active' : ''"
                @click="toggleMyReferralsDropdown">
                <i class="menu-icon bi bi-person-lines-fill"></i>
                <span class="menu-title">My Referral</span>
                <i class="bi arrow fs14"
                    :class="!collapsed ? 'd-inline' : 'd-none', showMyReferralsDropdown ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </div>
            <div v-if="showMyReferralsDropdown" :class="!collapsed ? 'submenu d-flex' : 'd-none'">
                <router-link to="/my-referral" class="sidebar-link sub-link" @click="handleLinkClick"
                    :class="$route.path === '/my-referral' ? 'active' : ''">
                    <i class="bi bi-arrow-return-right fs16 pe-2"></i>
                    <span class="menu-title">Client Referral</span>
                </router-link>
                <router-link to="/partner-referral" class="sidebar-link sub-link" @click="handleLinkClick"
                    :class="$route.path === '/partner-referral' ? 'active' : ''">
                    <i class="bi bi-arrow-return-right fs16 pe-2"></i>
                    <span class="menu-title">Partner Referral</span>
                </router-link>
            </div>

            <!-- <router-link to="/client-summary" class="sidebar-link" @click="handleLinkClick"
                :class="[!collapsed ? 'gap-12' : '', $route.path === '/client-summary' ? 'active' : '']">
                <i class="menu-icon bi bi-person-vcard-fill"></i><span class="menu-title">Client Summary</span>
            </router-link> -->

            <div class="sidebar-link cursor-pointer position-relative custom-dropdown-toggle"
                :class="!collapsed ? 'gap-12' : '', isMyClientsActive ? 'active' : ''" @click="toggleMyClientsDropdown">
                <i class="menu-icon bi bi-people-fill"></i>
                <span class="menu-title">My Clients</span>
                <i class="bi arrow fs14"
                    :class="!collapsed ? 'd-inline' : 'd-none', showMyClientsDropdown ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </div>
            <div v-if="showMyClientsDropdown" :class="!collapsed ? 'submenu d-flex' : 'd-none'">
                <router-link to="/client-details" class="sidebar-link sub-link" @click="handleLinkClick"
                    :class="[$route.path === '/client-details' ? 'active' : '']">
                    <i class="bi bi bi-arrow-return-right fs16 pe-2"></i><span class="menu-title">Client Details</span>
                </router-link>
                <router-link to="/client-brokerage" class="sidebar-link sub-link" @click="handleLinkClick"
                    :class="[$route.path === '/client-brokerage' ? 'active' : '']">
                    <i class="fs16 pe-2 bi bi-arrow-return-right"></i><span class="menu-title">Brokerage Clients</span>
                </router-link>
                <router-link to="/day-wise-brokerage" class="sidebar-link sub-link" @click="handleLinkClick"
                    :class="[$route.path === '/day-wise-brokerage' ? 'active' : '']">
                    <i class="fs16 pe-2 bi bi-arrow-return-right"></i><span class="menu-title">Day-wise Brokerage</span>
                </router-link>
                <router-link to="/client-prediction" class="sidebar-link sub-link" @click="handleLinkClick"
                    :class="[$route.path === '/client-prediction' ? 'active' : '']">
                    <i class="fs16 pe-2 bi bi-arrow-return-right"></i><span class="menu-title">Client Prediction</span>
                </router-link>
                <router-link to="/dormant-reactivation" class="sidebar-link sub-link" @click="handleLinkClick"
                    :class="[$route.path === '/dormant-reactivation' ? 'active' : '']">
                    <i class="fs16 pe-2 bi bi-arrow-return-right"></i><span class="menu-title">Dormant
                        Reactivation</span>
                </router-link>
                <router-link to="/ekyc-status" class="sidebar-link sub-link" @click="handleLinkClick"
                    :class="[$route.path === '/ekyc-status' ? 'active' : '']">
                    <i class="fs16 pe-2 bi bi-arrow-return-right"></i><span class="menu-title">EKYC Status</span>
                </router-link>
            </div>

            <div class="sidebar-link cursor-pointer position-relative custom-dropdown-toggle"
                :class="!collapsed ? 'gap-12' : '', isGSTActive ? 'active' : ''" @click="toggleGSTDropdown">
                <i class="menu-icon bi bi-tag-fill"></i>
                <span class="menu-title">GST</span>
                <i class="bi arrow fs14"
                    :class="!collapsed ? 'd-inline' : 'd-none', showGSTDropdown ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </div>
            <div v-if="showGSTDropdown" :class="!collapsed ? 'submenu d-flex' : 'd-none'">
                <router-link to="/gst" class="sidebar-link sub-link" @click="handleLinkClick"
                    :class="[$route.path === '/gst' ? 'active' : '']">
                    <i class="bi bi bi-arrow-return-right fs16 pe-2"></i><span class="menu-title">GST Invoice</span>
                </router-link>
                <!-- <router-link to="/gst-admin" class="sidebar-link sub-link" @click="handleLinkClick"
                    :class="[$route.path === '/gst-admin' ? 'active' : '']">
                    <i class="fs16 pe-2 bi bi-arrow-return-right"></i><span class="menu-title">GST Reports</span>
                </router-link> -->
            </div>

            <router-link to="/circular" class="sidebar-link" @click="handleLinkClick"
                :class="[!collapsed ? 'gap-12' : '', $route.path === '/circular' ? 'active' : '']">
                <i class="menu-icon bi bi-book-half"></i><span class="menu-title">Circular</span>
            </router-link>
            <router-link to="/ledger" class="sidebar-link" @click="handleLinkClick"
                :class="[!collapsed ? 'gap-12' : '', $route.path === '/ledger' ? 'active' : '']">
                <i class="menu-icon bi bi-piggy-bank-fill"></i><span class="menu-title">Legder</span>
            </router-link>

            <div class="sidebar-link cursor-pointer position-relative custom-dropdown-toggle"
                :class="!collapsed ? 'gap-12' : '', isDocumentsActive ? 'active' : ''"
                @click="toggleNonMandatoryDropdown" v-if="isAP">
                <i class="menu-icon bi bi-file-text-fill"></i>
                <span class="menu-title">AP Inspection</span>
                <i class="bi arrow fs14"
                    :class="!collapsed ? 'd-inline' : 'd-none', showDocumentsDropdown ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </div>
            <div v-if="showDocumentsDropdown" :class="!collapsed ? 'submenu d-flex' : 'd-none'">
                <!-- <router-link to="/mandatory" class="sidebar-link sub-link" @click="handleLinkClick"
                    :class="$route.path === '/mandatory' ? 'active' : ''">
                    <i class="bi bi-arrow-return-right fs16 pe-2"></i>
                    <span class="menu-title">Mandatory</span>
                </router-link> -->
                <router-link :to="isAlreadySubmitted ? '/mandatory' : '/questionnaire'" class="sidebar-link sub-link"
                    @click="handleLinkClick"
                    :class="$route.path === (isAlreadySubmitted ? '/mandatory' : '/questionnaire') ? 'active' : ''">
                    <i class="bi bi-arrow-return-right fs16 pe-2"></i>
                    <span class="menu-title">Mandatory</span>
                </router-link>
                <router-link to="/non-mandatory" class="sidebar-link sub-link" @click="handleLinkClick"
                    :class="$route.path === '/non-mandatory' ? 'active' : ''">
                    <i class="bi bi-arrow-return-right fs16 pe-2"></i>
                    <span class="menu-title">Non Mandatory</span>
                </router-link>
                <router-link to="/ap-cancellation" class="sidebar-link sub-link" @click="handleLinkClick"
                    :class="$route.path === '/ap-cancellation' ? 'active' : ''">
                    <i class="bi bi-arrow-return-right fs16 pe-2"></i>
                    <span class="menu-title">AP Cancellation</span>
                </router-link>
            </div>
            
            <router-link to="/master-franchisee" class="sidebar-link" @click="handleLinkClick"
                :class="[!collapsed ? 'gap-12' : '', $route.path === '/master-franchisee' ? 'active' : '']">
                <i class="menu-icon bi bi-person-vcard-fill"></i><span class="menu-title">Master Franchisee</span>
            </router-link>
            <router-link to="/tds" class="sidebar-link" @click="handleLinkClick"
                :class="[!collapsed ? 'gap-12' : '', $route.path === '/tds' ? 'active' : '']">
                <i class="menu-icon bi bi-credit-card-2-back"></i><span class="menu-title">TDS</span>
            </router-link>
            <router-link to="/questionnaire" class="sidebar-link" @click="handleLinkClick"
                :class="[!collapsed ? 'gap-12' : '', $route.path === '/questionnaire' ? 'active' : '']" v-if="isAP">
                <i class="menu-icon bi bi-question-diamond"></i><span class="menu-title">Post Questionnaire </span>
            </router-link>

            <router-link to="/refer-and-earn" class="sidebar-link" @click="handleLinkClick"
                :class="[!collapsed ? 'gap-12' : '', $route.path === '/refer-and-earn' ? 'active' : '']">
                <i class="menu-icon bi bi-person-fill-add"></i><span class="menu-title">Refer and Earn</span>
            </router-link>
            <!-- <router-link to="/marketing" class="sidebar-link" @click="handleLinkClick"
                :class="[!collapsed ? 'gap-12' : '', $route.path === '/marketing' ? 'active' : '']">
                <i class="menu-icon bi bi-images"></i><span class="menu-title">Marketing Images</span>
            </router-link> -->

            <router-link to="/contact" class="sidebar-link" @click="handleLinkClick"
                v-if="authStore.adminDetails?.Role === 'REMESHIRE'"
                :class="[!collapsed ? 'gap-12' : '', $route.path === '/contact' ? 'active' : '']">
                <i class="menu-icon bi bi-person-fill-add"></i><span class="menu-title">Contact Us</span>
            </router-link>
            <!-- <a href="https://support.aliceblueonline.com/CreateTicket" target="_blank" class="sidebar-link">
                <i class="menu-icon bi bi-headset"></i>&nbsp<span class="menu-title ps-2">Contact Us</span>
            </a> -->
            <router-link to="/admin/select-partner" class="sidebar-link" :class="!collapsed ? 'gap-12' : ''"
                v-if="['SUPERADMIN', 'FINANCE', 'ADMIN', 'KYC'].includes(authStore.adminDetails?.Role)">
                <i class="menu-icon bi bi-toggle-on"></i><span class="menu-title">Switch Partner</span>
            </router-link>



        </div>

        <div class="sidebar-toggler" id="desktopToggle" @click="$emit('toggleCollapse')">
            <i class="bi bi-chevron-left fs14"></i>
        </div>
        <div class="signout-btn">
            <button class="btn btn-sign-out px-4" @click="signOut">
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
import { accountService } from '../../services/account/account.service';

const props = defineProps({
    collapsed: Boolean,
    show: Boolean,
    isAnnouncement: Boolean
})

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const isAlreadySubmitted = ref(false);

const isAP = ref(false);

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

const showMyReferralsDropdown = ref(false);
const showMyClientsDropdown = ref(false);
const showGSTDropdown = ref(false);
const showDocumentsDropdown = ref(false);

const isMyReferralsActive = computed(() => {
    return ['/my-referral', '/partner-referral'].includes(route.path);
});
const isMyClientsActive = computed(() => {
    return ['/client-details', '/client-brokerage', '/day-wise-brokerage', '/client-prediction', '/dormant-reactivation', '/ekyc-status'].includes(route.path);
});
const isGSTActive = computed(() => {
    return ['/gst', '/gst-admin'].includes(route.path);
});

const isDocumentsActive = computed(() => {
    return ['/non-mandatory', '/mandatory'].includes(route.path);
});

watchEffect(() => {
    showMyReferralsDropdown.value = isMyReferralsActive.value;
    showMyClientsDropdown.value = isMyClientsActive.value;
    showGSTDropdown.value = isGSTActive.value;
    showDocumentsDropdown.value = isDocumentsActive.value;
});

const toggleMyReferralsDropdown = () => {
    if (props.collapsed) {
        emit('toggleCollapse');
    }
    showMyReferralsDropdown.value = !showMyReferralsDropdown.value;
};

const toggleMyClientsDropdown = () => {
    if (props.collapsed) {
        emit('toggleCollapse');
    }
    showMyClientsDropdown.value = !showMyClientsDropdown.value;
};

const toggleGSTDropdown = () => {
    if (props.collapsed) {
        emit('toggleCollapse');
    }
    showGSTDropdown.value = !showGSTDropdown.value;
};

const toggleNonMandatoryDropdown = () => {
    if (props.collapsed) {
        emit('toggleCollapse');
    }
    showDocumentsDropdown.value = !showDocumentsDropdown.value;
};

onMounted(() => {
    getQuestionnaireData();
    getStatusAPInspection();
});

const getStatusAPInspection = async () => {
    try {
        const fccode = authStore.adminDetails?.RemCode;
        const response = await accountService.getStatusAPInspection(fccode);
        if (response.data?.isSuccess) {
            isAP.value = true;
        } else {
            console.error(response.data?.message);
        }
    } catch (err) {
        console.error(err);
    }
};

const getQuestionnaireData = async () => {
    try {
        const response = await accountService.getQuestionnaireData(authStore.adminDetails?.RemCode);
        if (response.data?.isSuccess) {
            isAlreadySubmitted.value = true;
        }
    } catch (err) {
        console.error(err);
    }
};

</script>

<style scoped>
.sidebar {
    width: 250px;
    background-color: var(--secondary) !important;
    color: var(--light) !important;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1000;
}

.sidebar.collapsed {
    width: 90px;
}

.sidebar-link.active .menu-title,
.sidebar-link.active i.bi-arrow-return-right {
    color: var(--primary) !important;
}

.gap-12 {
    gap: 12px !important;
}

.sidebar-link {
    display: flex;
    align-items: center;
    padding: 14px 20px !important;
    color: var(--light) !important;
    text-decoration: none;
}

.sidebar-link:hover {
    background-color: #495057;
}

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
    background: var(--light);
    color: var(--secondary);
    border: 1px solid var(--secondary);
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
    background: var(--primary-light);
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
</style>
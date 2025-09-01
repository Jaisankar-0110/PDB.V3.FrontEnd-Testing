import { createRouter, createWebHistory } from "vue-router";

import AuthLayout from "@/layouts/auth/AuthLayout.vue";
import PartnerLogin from "@/pages/auth/PartnerLogin.vue";
import AdminLogin from "@/pages/auth/AdminLogin.vue";
import ForgotPassword from "@/pages/auth/ForgotPassword.vue";
import VerifyOTP from "@/pages/auth/VerifyOTP.vue";
import ResetPassword from "../pages/auth/ResetPassword.vue";

import DashboardLayout from "../layouts/dashboard/DashboardLayout.vue";

import Dashboard from "@/pages/account/dashboard/DashboardView.vue";
import ClientSummary from "@/pages/account/client-summary/ClientSummary.vue";
import ClientDetails from "@/pages/account/client-details/ClientDetails.vue";
import ClientWiseBrokerage from "@/pages/account/prediction/clientWise-brokerage/ClientWiseBrokerage.vue";
import RevenuePrediction from "@/pages/account/prediction/revenue-prediction/RevenuePrediction.vue";
import ClientBrokerage from "@/pages/account/client-wise-brokerage/ClientBrokerage.vue";
import MyAccount from "@/pages/account/my-account/MyAccount.vue";
import ReferAndEarn from "@/pages/account/refer-and-earn/ReferAndEarn.vue";
import GST from "@/pages/account/gst/GST.vue";
import Ledger from "@/pages/account/ledger/Ledger.vue";
import ClientPrediction from "../pages/account/client-prediction/ClientPrediction.vue";
import Circular from "../pages/account/circular/Circular.vue";
import MyReferral from "../pages/account/my-referral/MyReferral.vue";
import MyPartnerReferral from "../pages/account/my-partner-referral/MyPartnerReferral.vue";
import Revenue from "../pages/account/revenue/Revenue.vue";
import DaywiseBrokerage from "@/pages/account/day-wise-brokerage/DaywiseBrokerage.vue";
import DormantReactivation from "../pages/account/dormant-reactivation/DormantReactivation.vue";
import AdminDashboard from "../pages/account/admin/dashboard.vue";
import Contact from "../pages/account/contact/Contact.vue";
import EKYCStatus from "../pages/account/ekyc-status/EKYCStatus.vue";
import NonMandatory from "../pages/account/documents/NonMandatory.vue";
import Mandatory from "../pages/account/documents/Mandatory.vue";
import APCancellation from "../pages/account/documents/APCancellation.vue";
import AdminLayout from "../layouts/admin/AdminLayout.vue";
import Profile from "../pages/account/admin/profile/Profile.vue";
import PartnerSelection from "../pages/account/admin/partner-selection/PartnerSelection.vue";
import Banner from "../pages/account/admin/banner/Banner.vue";
import Announcement from "../pages/account/admin/announcement/Announcement.vue";
import GSTList from "../pages/account/admin/gst/gst-list/GSTList.vue";
import GSTModification from "../pages/account/admin/gst/gst-modification/GSTModification.vue";
import GSTUpload from "../pages/account/admin/gst/gst-upload/GSTUpload.vue";
import GSTAdmin from "../pages/account/admin/gst/gst-admin/GSTAdmin.vue";
import MarketingImages from "../pages/account/admin/marketing-images/MarketingImages.vue";
import MarketingPartner from "../pages/account/marketing-images/MarketingPartner.vue";
import Questionnaire from "../pages/account/questionnaire/Questionnaire.vue";
import MasterFranchisee from "../pages/account/master-Franchise/MasterFranchisee.vue";
import TDS from "../pages/account/tds/TDS.vue";

const routes = [
  {
    path: '/',
    component: AuthLayout,
    children: [
      { path: '', name: 'partner', component: PartnerLogin },
      { path: 'admin', name: 'admin', component: AdminLogin },
      { path: 'forgot-password', name: 'forgot-password', component: ForgotPassword },
      { path: 'verify-otp', name: 'verify-otp', component: VerifyOTP },
      { path: 'reset-password', name: 'reset-password', component: ResetPassword },
    ],
  },
  {
    path: '/',
    component: DashboardLayout,
    children: [
      { path: 'dashboard', name: 'Dashboard', component: Dashboard },
      { path: 'my-account', name: 'my-account', component: MyAccount },
      { path: 'refer-and-earn', name: 'refer-and-earn', component: ReferAndEarn },
      { path: 'gst', name: 'gst', component: GST },
      { path: 'prediction-client-wise-brokerage', name: 'prediction-client-wise-brokerage', component: ClientWiseBrokerage },
      { path: 'revenue-prediction', name: 'revenue-prediction', component: RevenuePrediction },
      { path: 'client-summary', name: 'client-summary', component: ClientSummary },
      { path: 'client-details', name: 'client-details', component: ClientDetails },
      { path: 'client-brokerage', name: 'client-brokerage', component: ClientBrokerage },
      { path: 'day-wise-brokerage', name: 'day-wise-brokerage', component: DaywiseBrokerage },
      { path: 'ledger', name: 'ledger', component: Ledger },
      { path: 'client-prediction', name: 'client-prediction', component: ClientPrediction },
      { path: 'circular', name: 'circular', component: Circular },
      { path: 'my-referral', name: 'my-referral', component: MyReferral },
      { path: 'partner-referral', name: 'partner-referral', component: MyPartnerReferral },
      { path: 'revenue', name: 'revenue', component: Revenue },
      { path: 'dormant-reactivation', name: 'dormant-reactivation', component: DormantReactivation },
      { path: 'contact', name: 'contact', component: Contact },
      { path: 'ekyc-status', name: 'ekyc-status', component: EKYCStatus },
      { path: 'non-mandatory', name: 'non-mandatory', component: NonMandatory },
      { path: 'mandatory', name: 'mandatory', component: Mandatory },
      { path: 'ap-cancellation', name: 'ap-cancellation', component: APCancellation },
      { path: 'marketing', name: 'marketing', component: MarketingPartner },
      { path: 'questionnaire', name: 'questionnaire', component: Questionnaire },
      { path: 'master-franchisee', name: 'master-franchisee', component: MasterFranchisee},
      { path: 'tds', name: 'tds', component: TDS},
    ],
  },

  {
    path: '/admin',
    component: AdminLayout,
    children: [
      // { path: 'dashboard', name: 'admin-dashboard', component: AdminDashboard },
      { path: 'manage-profile', name: 'manage-profile', component: Profile },
      { path: 'select-partner', name: 'select-partner', component: PartnerSelection },
      { path: 'banner', name: 'banner', component: Banner },
      { path: 'announcement', name: 'announcement', component: Announcement },
      { path: 'gst-admin', name: 'gst-admin', component: GSTAdmin },
      { path: 'gst-upload', name: 'gst-upload', component: GSTUpload },
      { path: 'gst-modification', name: 'gst-modification', component: GSTModification },
      { path: 'gst-list', name: 'gst-list', component: GSTList },
      { path: 'marketing-images', name: 'marketing-images', component: MarketingImages }

    ],
  },

  {
    path: "/sample",
    name: "sample",
    component: () => import("@/pages/Sample.vue"),
  },

  {
    path: "/:pathMatch(.*)*",
    name: "PageNotFound",
    component: () => import("@/pages/PageNotFound.vue"),
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem("token");
  const tokenExpiry = sessionStorage.getItem("tokenExpiry");

  if (token && tokenExpiry && Date.now() > parseInt(tokenExpiry, 10)) {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("tokenExpiry");
    next({ name: "partner" });
  } else if (
    to.name === "sample" ||
    to.name === "partner" ||
    to.name === "admin" ||
    to.name === "forgot-password" ||
    to.name === "verify-otp" ||
    to.name === "reset-password"
  ) {
    next();
  } else if (!token) {
    next({ name: "partner" });
  } else {
    next();
  }
});

export default router;

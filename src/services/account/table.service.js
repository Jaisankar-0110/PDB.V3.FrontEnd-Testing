import { da } from "date-fns/locale";

export const tableService = {

    getClientSummary(data) {
        return axios.get("/activeinactivecash/get-active-inactive-cash-data", {
            params: { remCode: data.remCode, filter: data.filter, page: data.page, size: 5 }
        });
    },

    getClientDetails(data) {
        return axios.get("/clienalldetails/client-all-details", {
            params: { remCode: data.remCode, filter: data.filter, page: data.page, size: data.size, searchItem: data.searchItem }
        });
    },

    getClientWiseBrokerage(data) {
        return axios.get("/clientwisebrokerage/get-client-wise-brokerage-table", {
            params: { remCode: data.remCode, month: data.month, year: data.year, page: data.page, size: data.size }
        });
    },

    getClientWiseBrokerageBreakDown(data) {
        return axios.get("/clientwisebrokerage/get-client-wise-brokerage-detail", {
            params: { clientCode: data.clientCode, month: data.month, year: data.year, page: data.page, size: 5 }
        });
    },

    getLedgerTransaction(data) {
        return axios.get("/remtransledger/remtransledger", {
            params: { rem_code: data.rem_code, from_yr: data.from_yr, to_yr: data.to_yr, page: data.page, size: data.size }
        });
    },


    getClientPrediction(data) {
        return axios.get("/leadchurnprediction/get-lead-churn-prediction-table", {
            params: { remCode: data.remCode, page: data.page, size: data.size }
        });
    },

    getMyReferral(data) {
        return axios.get("/clientlead/get-client-lead-report", {
            params: { remCode: data.remCode, fromDate: data.fromDate, toDate: data.toDate, page: data.page, size: data.size,filter: data.filter  }
        });
    },

    getMyPartnerReferral(data) {
        return axios.get("/partnerlead/get-partner-lead-report", {
            params: { remCode: data.remCode }
        });
    },

    getRevenue(data) {
        return axios.get("/revenuebar/remeshire-data", {
            params: { rem_code: data.rem_code, month: data.month, year: data.year, page: data.page, size: 5 }
        });
    },

    getDayWiseBrokerage(data) {
        return axios.get("/clientwisebrokerage/get-client-wise-brokerage-date-filter", {
            params: { remCode: data.remCode, fromDate: data.fromDate, toDate: data.toDate, page: data.page, size: data.size }
        });
    },

    getDayWiseBrokerageBreakDown(data) {
        return axios.get("/clientwisebrokerage/get-client-wise-brokerage-detail-date-filter", {
            params: { remCode: data.remCode, date: data.date, page: data.page, size: 5 }
        });
    },

    getDormantDeactivation(data) {
        return axios.get("/dormantreport/get-dormant-reactivation-report", {
            params: { remCode: data.remCode, page: data.page, size: data.size }
        });
    },

    getGSTAdmin(data) {
        return axios.get("/GstAdmin/fetch-all-gst-files", {
            params: {
                branch: data.branch,
                from_date: data.from_date,
                to_date: data.to_date,
                filter_type: data.filter_type,
                filter: data.filter,
                page: data.page,
                size: data.size
            }
        });
    },


    getProfile(data) {
        return axios.get("/ProfileAdmin/fetch-all-partner-profile", {
            params: {
                branch: data.branch,
                from_date: data.from_date,
                to_date: data.to_date,
                filter_type: data.filter_type,
                filter: data.filter,
                page: data.page,
                size: data.size
            }
        });
    },

    getGSTHistory(data) {
        return axios.get("/gst/history", {
            params: { rem_code: data.rem_code, page: data.page, page_size: data.size }
        });
    },

    getLeadFunnel(data) {
        return axios.get("leadfunnel/get-lead-funnel-table", {
            params: { remCode: data.remCode, page: data.page, size: data.size, filter: data.filter }
        });
    },

    getNewBanner() {
        return axios.get("/banner/get-banners-details");
    },

    getAnnouncements() {
        return axios.get("/announcement/get-announcement");
    },

    getGSTList(data) {
        return axios.get("/GstAdmin/get-gst-number-list", {
            params: { page: data.page, size: data.size, filter: data.filter, filter_type: data.filter_type }
        });
    },

    getGSTModification(data) {
        return axios.get("/GstAdmin/get-gst-mod-history", {
            params: { page: data.page, size: data.size, filter: data.filter, filter_type: data.filter_type }
        });
    },

      getMasterFranchisee(data) {
        return axios.get("/masterremdetails/get-master-rem-details", {
            params: { remCode: data.remCode, page: data.page, size: data.size }
        });
    },

};


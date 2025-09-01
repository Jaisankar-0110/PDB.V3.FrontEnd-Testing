export const dashboardService = {
    getActiveInactive(remCode) {
        return axios.get("/activeinactive/get-active-inactive-data", {
            params: { remCode: remCode }
        });
    },

    getBDRPercent(data) {
        return axios.get("/bdrpercent/get-bdr-percent", {
            params: { remCode: data.remCode, month: data.month, year: data.year }
        });
    },

    getClientWiseBrokerage(remCode, year) {
        return axios.get("/clientwisebrokerage/get-client-wise-brokerage", {
            params: { remCode: remCode, year: year }
        });
    },

    getRevenueBarChart(remCode, year) {
        return axios.get("/revenuebar/remeshire-bar", {
            params: { rem_code: remCode, year: year }
        });
    },

    getPayinPayout(remCode, year) {
        return axios.get("/payinpayoutsummary/payinout", {
            params: { rem_code: remCode, year: year }
        });
    },

    getRevenueAnalyticsOverview(rem_code) {
        return axios.get("/revenuecalc/remeshire", {
            params: { rem_code: rem_code }
        });
    },

    getInactiveClientList(remCode) {
        return axios.get("/inactive/get-inactive-data", {
            params: {
                remCode: remCode
            }
        });
    },
      getActiveInactiveClientList(remCode) {
        return axios.get("/leadchurnprediction/get-lead-churn-prediction", {
            params: {
                remCode: remCode
            }
        });
    },

        getAccountOpenedAccountTraded(remCode, year) {
        return axios.get("/openedtraded/get-account-opened-traded", {
            params: { remCode: remCode, year: year }

        });
    },

      getLeadFunnel(remCode) {
        return axios.get("/leadfunnel/get-lead-funnel-data", {
            params: { remCode: remCode}
        });
    },

        getTradeSegment(remCode) {
        return axios.get("/tradesegment/get-trade-segment-percentage", {
            params: { remCode: remCode}
        });
    },



};

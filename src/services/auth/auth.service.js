export const authService = {
    login(data) {
        return axios.post("/users/login", data);
    },

    forgotPassword(data) {
        return axios.post("/forgotresetpassword/forgot", data);
    },

    sendOTP(data) {
        return axios.post("/otp/send", data);
    },

    sendOTPEmailAndSMS(data) {
        return axios.post("/otp/send-emailnsms", {
            identifier_mobile: data.identifierMobile,
            identifier_mail: data.identifierEmail,
        });
    },

    sendEmailOTP(data) {
        return axios.post("/otp/send-email", data);
    },

    verifyOTPForEdit(data) {
        return axios.post("/otp/verify", data);
    },

    verifyOTP(data) {
        return axios.post("/otp/login-verify", data);
    },

    resetPassword(data) {
        return axios.post("/forgotresetpassword/reset", data);
    },

    partnerPasswordCheck(remCode) {
        return axios.post("/users/partner-pwd-check", null, {
            params: {
                rem_code: remCode,
            }
        });
    },

    adminPasswordCheck(emailId) {
        return axios.post("/users/admin-pwd-check", null, {
            params: {
                email_id: emailId,
            }
        });
    },

    remcheck(remCode) {
        return axios.get("/users/remcheck", {
            params: {
                rem_code: remCode,
            }
        });
    },

    logout(data) {
        return axios.post("/users/logout", null, {
            params: {
                user_id: data,
            }
        });
    },

    getBanners(rem_code) {
        return axios.get("/banner/get-banners",{
            params: {
                remeshire_code : rem_code,
            }
        });
    }

};
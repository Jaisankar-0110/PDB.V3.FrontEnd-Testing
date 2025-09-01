export const accountService = {
  newClient(data) {
    return axios.post("/LeadInsert/Client-Lead-Insert", data);
  },

  referAndEarn(data) {
    return axios.post("/LeadInsert/Partner-Lead-Insert", data);
  },

  uploadGST(data) {
    return axios.post("/gst/updatepdf", data);
  },

  getGST(data) {
    return axios.get("/gst/remeshire", {
      params: {
        rem_code: data.rem_code,
        month_year: data.month_year,
      },
    });
  },

  GeneratePDF(data) {
    return axios.get("/gst/generatepdf", {
      params: {
        rem_code: data.rem_code,
        month_year: data.month_year,
      },
    });
  },

  getAccountDetails(remCode) {
    return axios.get("/profilesummary/partnerprofile", {
      params: {
        rem_code: remCode,
      },
    });
  },

  getModificationHistory(remCode) {
    return axios.get("/profilesummary/modprofilehistory", {
      params: {
        rem_code: remCode,
      },
    });
  },

  getRevenuePrediction(remCode) {
    return axios.get("/revenuebar/remeshire-forecasting", {
      params: {
        rem_code: remCode,
      },
    });
  },

  sendEmailOTP(data) {
    return axios.post("/otp/send-email", data);
  },

  updateEmailOrMobile(data) {
    return axios.post("/profilesummary/update-emailmobile", data);
  },

  getGSTAddress(data) {
    return axios.post("/profilesummary/update-gstaddress", data);
  },

  updateGST(data) {
    return axios.post("/GstAdmin/update-gst-status", data);
  },

  GSTUpload(data) {
    return axios.post("/GstAdmin/upload-gst-file", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateProfile(data) {
    return axios.post("/ProfileAdmin/update-profile-status", data);
  },

  verifyPennyDrop(data) {
    return axios.get("/profilesummary/pennydropverification", {
      params: {
        AccNo: data.BankAcNo,
        IfscCode: data.IfscCode,
      },
    });
  },

  updateBankDetails(data) {
    return axios.post("/profilesummary/update-bank", data);
  },

  getContactDetails(data) {
    return axios.get("/branchcontact/branch-admin-details", data);
  },

  uploadBanner(data) {
    return axios.post("/banner/upload-banner", data);
  },

  updateBanner(data) {
    return axios.post("/banner/update-banner-status", data);
  },

  addAnnouncement(data) {
    return axios.post("/announcement/insert-announcement", data);
  },

  updateAnnouncement(data) {
    return axios.post("/announcement/update-announcement-status", data);
  },

  getEnabledAnnouncement() {
    return axios.get("/announcement/get-enabled-announcement");
  },

  updateDocuments(data) {
    return axios.post(
      `${
        import.meta.env.VITE_PEKYC_API_BASE_URL
      }/NoticeBoard/UploadNoticeBoardOptional`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  getNonMandatoryDocuments(remeshirecode) {
    return axios.get(
      `${import.meta.env.VITE_PEKYC_API_BASE_URL}/NoticeBoard/getStatusremarks`,
      {
        params: { remeshirecode: remeshirecode },
      }
    );
  },

  mandatoryDocuments(fccode) {
    return axios.post(
      `${import.meta.env.VITE_PEKYC_API_BASE_URL}/EsignData/getDigiDocument`,
      {
        fccode: fccode,
      }
    );
  },

  updateNonMadndatoryDocuments(formData) {
    return axios.post(
      `${
        import.meta.env.VITE_PEKYC_API_BASE_URL
      }/NoticeBoard/UploadNoticeBoard`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  getMandatoryDoc(remCode, month, year) {
    return axios.get(
      `${import.meta.env.VITE_PEKYC_API_BASE_URL}/NoticeBoard/getNoticeBoard`,
      {
        params: {
          remeshirecode: remCode,
          Month: month,
          year: year,
        },
      }
    );
  },

  getStatusAPInspection(fccode) {
    return axios.get(
      `${
        import.meta.env.VITE_PEKYC_API_BASE_URL
      }/NoticeBoard/getstatusforinspection?fccode=${fccode}`
    );
  },

  getAPcancellation(fccode) {
    return axios.get(
      `${import.meta.env.VITE_PEKYC_API_BASE_URL}/AccountProcess/getStatus`,
      {
        params: { fccode: fccode },
      }
    );
  },

  getExchangeDetails(fccode) {
    return axios.get(
      `${import.meta.env.VITE_PEKYC_API_BASE_URL}/AccountProcess/getexchange`,
      {
        params: { fccode },
      }
    );
  },

  DocumentUpload(data) {
    return axios.post(
      `${import.meta.env.VITE_PEKYC_API_BASE_URL}/AccountProcess/UploadFile`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  getAPcancellationDoc(fccode) {
    return axios.post(
      `${import.meta.env.VITE_PEKYC_API_BASE_URL}/AccountProcess/apdownload`,
      {
        fccode: fccode,
      }
    );
  },

  saveQuestionnaireData(data) {
    return axios.post(
      `${
        import.meta.env.VITE_PEKYC_API_BASE_URL
      }/SurveyData/saveQuestionnaireData`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },

  getQuestionnaireData(remeshirecode) {
    return axios.get(
      `${
        import.meta.env.VITE_PEKYC_API_BASE_URL
      }/SurveyData/getSurveyDataQuestionFccode?remeshirecode=${remeshirecode}`
    );
  },

 tdsDocuments(remCode, qtr, year) {
  return axios.get(`/tdsfiledownload/get-tds-file-download`, {
    params: { remCode, qtr, year }
  });
}

};

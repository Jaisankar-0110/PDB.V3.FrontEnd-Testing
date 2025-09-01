import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

const commonOptions = {
  duration: 3000,
  close: true,
  gravity: "top",
  position: "right",
  stopOnFocus: true,
  style: {
    fontSize: "14px",
    padding: "10px 16px",
    borderRadius: "8px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    color: "#fff",
  }
};

export const showSuccessToast = (message) => {
  Toastify({
    ...commonOptions,
    text: message,
    style: {
      ...commonOptions.style,
      background: "linear-gradient(135deg, #28a745, #218838)"
    }
  }).showToast();
};

export const showErrorToast = (message) => {
  Toastify({
    ...commonOptions,
    text: message,
    style: {
      ...commonOptions.style,
      background: "linear-gradient(135deg, #dc3545, #c82333)"
    }
  }).showToast();
};


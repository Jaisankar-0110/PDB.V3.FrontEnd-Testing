import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    adminDetails: JSON.parse(localStorage.getItem('adminDetails')) || {},
  }),
  actions: {
    setAdminDetails(data) {
      this.adminDetails = { ...this.adminDetails, ...data };
      localStorage.setItem('adminDetails', JSON.stringify(this.adminDetails)); 
    },
    
    clearAdminDetails() {
      this.adminDetails = {};
      localStorage.removeItem('adminDetails');  
    },
  }
});

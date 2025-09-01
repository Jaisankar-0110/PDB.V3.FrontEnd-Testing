<template>
  <div class="card-0 p-2">
    <div class="card-header pb-3 px-0 bg-transparent">
      <div class="d-flex justify-content-between align-items-center">
        <div class="text-quaternary-color fs18 pb-2 fw500">Manage Announcement</div>
        <div @click="openAnnouncementModal" class="cursor-pointer ps-2">
          <p class="text-primary fs14 fw500"> <span><i class="bi bi-plus-lg  text-primary"></i></span> Add
            Announcement</p>
        </div>
      </div>
    </div>
    <div class="card-body pt-0 px-0">
      <div v-if="!loading">
        <div v-if="announcements.length" class="table-responsive ">
          <table class="table" style="width:auto">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Announcement Text</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(announcement, index) in announcements" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ announcement.announcementText }}</td>
                <td>
                  <span :class="announcement.enabled ? 'text-success' : 'text-danger'">
                    <i class="bi bi-circle-fill me-1"></i>
                    {{ announcement.enabled ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="align-middle">
                  <div class=" form-switch m-0">
                    <input class="form-check-input" @change="updateAnnouncementStatus(announcement)" type="checkbox"
                      :id="'checkbox' + index" :checked="announcement.enabled">
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <TableNoData class="py-5 my-md-3 my-xxl-4" />
        </div>

      </div>
      <div class="text-center my-5 py-5" v-else>
        <Loading class="my-5 py-4" />
      </div>
    </div>
  </div>
  <AddAnnouncement @update-details="getAnnouncements" />
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { tableService } from '../../../../services/account/table.service';
import { useAuthStore } from '@/stores/authStore';
import { Modal } from 'bootstrap';
import AddAnnouncement from './modal/AddAnnouncement.vue';
import { accountService } from '../../../../services/account/account.service';
import { showSuccessToast, showErrorToast } from '@/js/toast';
import Loading from '../../../../components/Loading.vue';
import TableNoData from '../../../../components/TableNoDataFound.vue';

const currentPage = ref(1);
const loading = ref(false);

const announcements = ref([]);

const authStore = useAuthStore();
const adminDetails = ref({});
const errorMsg = ref('');

onMounted(() => {
  adminDetails.value = authStore.adminDetails;
  getAnnouncements();
});

watch(currentPage, (newVal) => {
  getAnnouncements();
});

const getAnnouncements = async () => {
  loading.value = true;
  try {
    const response = await tableService.getAnnouncements();
    if (response.data?.isSuccess) {
      announcements.value = response.data?.data || [];
    } else {
      announcements.value = [];
      errorMsg.message = response.data?.message || 'Something went wrong, please try again later.';
    }
  } catch (err) {
    announcements.value = [];
    errorMsg.message = 'Something went wrong, please try again later.';
  } finally {
    loading.value = false;
  }
};

const updateAnnouncementStatus = async (announcement) => {
  announcement.enabled = !announcement.enabled;

  const data = {
    announcementId: announcement.id,
  }

  try {
    const response = await accountService.updateAnnouncement(data);
    if (!response.data?.isSuccess) {
      announcement.enabled = !announcement.enabled;
      showErrorToast(response.data.message);
    } else {
      showSuccessToast(response.data.message);
      getAnnouncements();
    }
  } catch (error) {
    announcement.enabled = !announcement.enabled;
    showErrorToast(error.response?.data?.message || 'Something went wrong, please try again later.');
  }
}

const openAnnouncementModal = () => {
  nextTick(() => {
    const modalEl = document.getElementById('addAnnouncement');
    if (!modalEl) {
      console.error("Modal element with ID 'addAnnouncement' not found.");
      return;
    }
    const proofModal = new Modal(modalEl);
    proofModal.show();
  });
};

</script>

<style scoped lang="scss">
.no-data {
  width: 400px !important;
}

@media(max-width:1400px) {
  .no-data {
    width: 360px !important;
  }
}

@media(max-width:767px) {
  .no-data {
    width: 300px !important;
  }
}


@media(max-width:1400px) {
  .table {
    width: 1600px !important;
  }
}

/*
.table {
  width: 1800px !important;
} */

.custom-alert {
  padding: 4px 10px;
  background-color: var(--tertiary) !important;
  color: var(--light) !important;
}

.alert {
  padding: 4px 10px;
}

.form-control,
.form-select {
  height: 40PX !important;
}
</style>



announcementText
:
"bvncnmgmgfm"
enabled
:
false
id
:
10
insertedAt
:
"2025-06-17T15:43:10.479451"
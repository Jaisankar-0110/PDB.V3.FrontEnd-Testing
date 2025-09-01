<template>
    <div class="modal fade" id="ClientsBreakdown" tabindex="-1" aria-labelledby="ClientsBreakdown" aria-hidden="true"
        data-bs-backdrop="static">
        <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content p-md-3 p-2">
                <div class="modal-header border-bottom-0 w-100">
                    <div class="text-center fs18-16 fw500">
                       Breakdown
                    </div>
                    <button type="button" class="btn-close fs16" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div v-if="clients.length > 0">
      <div class="table-responsive pt-1">
        <table class="table" style="width:auto">
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Trade Date</th>
              <th>Global Turnover</th>
              <th>T Pro Brokerage</th>
              <th>IBT Brokerage</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(client, index) in clients" :key="index">
              <td>{{ client.CLIENT_ID || '-'}}</td>
              <td>{{ formatDate(client.TRADE_DATE) || '-' }}</td>
              <td>{{ client.GLOBAL_TURNOVER || '-' }}</td>
              <td>{{ client.BROKERAGE || '-' }}</td>
              <!-- <td>{{ client.CHARGE_IBT || '-' }}</td> -->
              <td>{{ parseFloat(client.CHARGE_IBT).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination v-model="currentPage" :total-pages="totalPages" />
    </div>
    <div v-else>
      <TableNoData class="py-5 my-md-3 my-xxl-4" />
    </div>
                   
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { tableService } from '../../../services/account/table.service';
import Pagination from '../../../components/Pagination.vue';
import TableNoData from '../../../components/TableNoDataFound.vue';
import { Modal } from 'bootstrap';
import { format, addMinutes } from 'date-fns';

const props = defineProps({
  modelValue: Boolean, 
  clientCode: String,
  month: [String, Number],
  year: [String, Number],
});

const clients = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const totalClients = ref(0);

watch(
  () => [props.clientCode, props.month, props.year, currentPage.value],
  () => {
    if (props.clientCode && props.month && props.year) {
      getClientBrokerageBreakdown();
    }
  },
  { immediate: true }
);

function formatDate(dateString) {
  if (!dateString) return null;
  const date = addMinutes(new Date(dateString), 5);
  return format(date, "dd-MM-yyyy");
}

const getClientBrokerageBreakdown = async () => {
  const params = {
    clientCode: props.clientCode,
    page: currentPage.value,
    month: props.month,
    year: props.year,
  };

  try {
    const response = await tableService.getClientWiseBrokerageBreakDown(params);
    if (response.data?.isSuccess) {
      clients.value = response.data.data.result || [];
      totalPages.value = response.data.data.noOfPages || 1;
      totalClients.value = response.data.data.count;
    } else {
      clients.value = [];
    }
  } catch (error) {
    console.error(error);
    clients.value = [];
  }
};

const closeModal = () => {
    const modalElement = document.getElementById("ClientsBreakdown");
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    modal.hide();
};
</script>


<style scoped>

@media(max-width:992px) {
  .table {
    width: 900px !important;
  }
}

</style>
<template>
    <div class="d-flex justify-content-start align-items-center mb-2">
        <div class="d-flex mb-3">
                    <select class="text-quaternary-color fs12 fw500 form-select me-3">
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                    </select>
                    
                </div>
                <div class="d-flex mb-3">
                    <select class="text-quaternary-color fs12 fw500 form-select me-3">
                        <option value="January">January</option>
                        <option value="February">February</option>
                        <option value="March">March</option>
                        <option value="April">April</option>
                        <option value="May">May</option>
                        <option value="June">June</option>
                        <option value="July">July</option>
                        <option value="August">August</option>
                        <option value="September">September</option>
                        <option value="October">October</option>
                        <option value="November">November</option>
                        <option value="December">December</option>
                    </select>
                    
                </div>
                <div class="d-flex mb-3">
                    <select class="text-quaternary-color fs12 fw500 form-select me-3">
                        <option value="North">North</option>
                        
                    </select>
                    
                </div>
    </div>
    <div class="table-responsive pt-1">
        <table class="table" style="width:auto">
            <thead>
                <tr>
                    <th>Client Code</th>
                    <th>Trade date & time</th>
                    <th>Instrument</th>
                    <th>Order type</th>
                    <th>Trade type</th>
                    <th>Quantity</th>
                    <th>Avg buy price</th>
                    <th>Avg Sell price</th>
                    <th>Net quantity</th>
                    <th>Buy turnover</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(trade, index) in trades" :key="index">
                    <td>{{ trade.clientCode }}</td>
                    <td>{{ trade.tradeDateTime }}</td>
                    <td>{{ trade.instrument }}</td>
                    <td>{{ trade.orderType }}</td>
                    <td>{{ trade.tradeType }}</td>
                    <td>{{ trade.quantity }}</td>
                    <td>₹{{ formatNumber(trade.avgBuyPrice) }}</td>
                    <td>₹{{ formatNumber(trade.avgSellPrice) }}</td>
                    <td>{{ trade.netQuantity }}</td>
                    <td>₹{{ formatNumber(trade.buyTurnover) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <Pagination v-model="current" :total-pages="20" />
</template>

<script setup>
import { ref } from 'vue';
import Pagination from '../../../../../components/Pagination.vue';

const current = ref(1);

const trades = ref([
    {
        clientCode: '1745320',
        tradeDateTime: '2025-04-01 10:15 AM',
        instrument: 'NIFTY25APR24CE220000',
        orderType: 'Limit',
        tradeType: 'Buy',
        quantity: 50,
        avgBuyPrice: 12500.0,
        avgSellPrice: 12500.0,
        netQuantity: 0,
        buyTurnover: 6500,
    },
    {
        clientCode: '1745320',
        tradeDateTime: '2025-04-01 10:15 AM',
        instrument: 'NIFTY25APR24CE220000',
        orderType: 'Limit',
        tradeType: 'Buy',
        quantity: 50,
        avgBuyPrice: 12500.0,
        avgSellPrice: 12500.0,
        netQuantity: 0,
        buyTurnover: 6500,
    },
    {
        clientCode: '1745320',
        tradeDateTime: '2025-04-01 10:15 AM',
        instrument: 'NIFTY25APR24CE220000',
        orderType: 'Limit',
        tradeType: 'Buy',
        quantity: 50,
        avgBuyPrice: 12500.0,
        avgSellPrice: 12500.0,
        netQuantity: 0,
        buyTurnover: 6500,
    },
    {
        clientCode: '1745320',
        tradeDateTime: '2025-04-01 10:15 AM',
        instrument: 'NIFTY25APR24CE220000',
        orderType: 'Limit',
        tradeType: 'Buy',
        quantity: 50,
        avgBuyPrice: 12500.0,
        avgSellPrice: 12500.0,
        netQuantity: 0,
        buyTurnover: 6500,
    },
    {
        clientCode: '1745320',
        tradeDateTime: '2025-04-01 10:15 AM',
        instrument: 'NIFTY25APR24CE220000',
        orderType: 'Limit',
        tradeType: 'Buy',
        quantity: 50,
        avgBuyPrice: 12500.0,
        avgSellPrice: 12500.0,
        netQuantity: 0,
        buyTurnover: 6500,
    },
    {
        clientCode: '1745320',
        tradeDateTime: '2025-04-01 10:15 AM',
        instrument: 'NIFTY25APR24CE220000',
        orderType: 'Limit',
        tradeType: 'Buy',
        quantity: 50,
        avgBuyPrice: 12500.0,
        avgSellPrice: 12500.0,
        netQuantity: 0,
        buyTurnover: 6500,
    },
    {
        clientCode: '1745320',
        tradeDateTime: '2025-04-01 10:15 AM',
        instrument: 'NIFTY25APR24CE220000',
        orderType: 'Limit',
        tradeType: 'Buy',
        quantity: 50,
        avgBuyPrice: 12500.0,
        avgSellPrice: 12500.0,
        netQuantity: 0,
        buyTurnover: 6500,
    },
    {
        clientCode: '1745320',
        tradeDateTime: '2025-04-01 10:15 AM',
        instrument: 'NIFTY25APR24CE220000',
        orderType: 'Limit',
        tradeType: 'Buy',
        quantity: 50,
        avgBuyPrice: 12500.0,
        avgSellPrice: 12500.0,
        netQuantity: 0,
        buyTurnover: 6500,
    },
    {
        clientCode: '1745320',
        tradeDateTime: '2025-04-01 10:15 AM',
        instrument: 'NIFTY25APR24CE220000',
        orderType: 'Limit',
        tradeType: 'Buy',
        quantity: 50,
        avgBuyPrice: 12500.0,
        avgSellPrice: 12500.0,
        netQuantity: 0,
        buyTurnover: 6500,
    },
    {
        clientCode: '1745320',
        tradeDateTime: '2025-04-01 10:15 AM',
        instrument: 'NIFTY25APR24CE220000',
        orderType: 'Limit',
        tradeType: 'Buy',
        quantity: 50,
        avgBuyPrice: 12500.0,
        avgSellPrice: 12500.0,
        netQuantity: 0,
        buyTurnover: 6500,
    },

]);

const formatNumber = (num) => {
    return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
</script>

<style scoped lang="scss"></style>

<template>
   <figure class="highcharts-figure py-4">
                <div ref="chartContainer" id="prediction"></div>
            </figure>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Highcharts from 'highcharts'

const chartContainer = ref(null)

onMounted(() => {
  Highcharts.chart(chartContainer.value, {
    chart: {
        type: 'line',
        spacing: [10, 10, 15, 10]
    },

    title: {
        text: null
    },

    exporting: {
        enabled: false
    },

    credits: {
        enabled: false
    },

    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May',
            'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        lineColor: '#ccc',
        tickColor: '#ccc'
    },

    yAxis: {
        title: {
            text: null
        },
        gridLineColor: '#eee',
        labels: {
            formatter: function () {
                return this.value.toLocaleString();
            }
        }
    },

    tooltip: {
        shared: true,
        valueSuffix: ''
    },

    legend: {
        align: 'right',
        verticalAlign: 'top',
        layout: 'vertical',
        itemStyle: {
            fontWeight: 'normal',
            color: '#666'
        }
    },

    plotOptions: {
        series: {
            marker: {
                enabled: false
            }
        }
    },

    series: [
        {
            name: 'Past data',
            data: [500, 3000, 2500, 3400, 4000, 4000, 5000],
            color: '#333',
            lineWidth: 2,
            dashStyle: 'Solid'
        },
        {
            name: 'Prediction',
            data: [null, null, null, null, null, null, 5000, 6000, 7000, 8000, 9000, 10000],
            color: 'red',
            lineWidth: 2,
            dashStyle: 'Dash'
        }
    ]
  })
})
</script>
<style scoped>
</style>
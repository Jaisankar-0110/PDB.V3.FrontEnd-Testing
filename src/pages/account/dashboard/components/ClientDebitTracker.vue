<template>
    <div class="card">
        <div class="card-header py-3 bg-transparent">
            <div class="d-flex justify-content-between">
                <div class="text-quaternary-color fs16 fw500">Client Debit Tracker</div>
                <!-- <div class="d-flex">
                    <b class="bi bi-download fs20 text-quaternary-color"></b>
                </div> -->
            </div>
        </div>
        <div class="card-body">
            <div >
                <figure class="highcharts-figure">
                    <div ref="chartContainer" id="container"></div>
                </figure>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Highcharts from 'highcharts'

const chartContainer = ref(null)

onMounted(() => {
    Highcharts.chart(chartContainer.value, {
        chart: {
            type: 'pie',
        },
        title: {
            text: null
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: true,
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            symbolRadius: 4,
            symbolHeight: 14,
            symbolWidth: 20,
            itemMarginBottom: 8,
            x: 0,
            y: 0
        },
        plotOptions: {
            series: {
                allowPointSelect: true,
                cursor: 'pointer',
                borderRadius: 6,
                dataLabels: [{
                    enabled: true,
                    distance: -60,
                    format: '{point.percentage:.0f}%',
                    style: {
                        fontSize: '1em'
                    }
                }],
                showInLegend: true
            }
        },
        series: [{
            name: 'Clients',
            colorByPoint: true,
            innerSize: '0%',
            data: [{
                name: 'Low risk',
                y: 75,
                color: '#0D4593'
            }, {
                name: 'Moderate risk',
                y: 25,
                color: '#01CC9B'
            },
            {
                name: 'Critical risk',
                y: 10,
                color: '#66C1F4'
            },
            {
                name: 'High risk',
                y: 10,
                color: '#EE3158'
            }
            ]
        }]
    })
})
</script>

<style scoped lang="scss">
.card {
    height: 510px !important;
}
</style>
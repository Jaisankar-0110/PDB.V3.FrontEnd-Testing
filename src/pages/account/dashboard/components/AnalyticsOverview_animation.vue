<template>
    <div class="pb-2">
        <div class="row mb-2">
            <div class="col-7">
                <p class="text-quaternary-color fw500 fs16">Analytics overview</p>
            </div>
            <div class="col-5 text-end">
                <span class="bg-quaternary-color text-light rounded px-sm-3 px-1 py-1 py-sm-2 fs12-10">Mar 19-2024(20.3
                    PM)</span>
            </div>
        </div>

        <!-- Scrollable + Auto Marquee Container -->
        <div class="position-relative overflow-hidden">
            <div ref="marqueeContainer" class="records-card marquee" @mouseenter="pauseMarquee"
                @mouseleave="resumeMarquee">
                <div ref="marqueeContent" class="marquee-content" :class="{ paused: isPaused }">
                    <div class="card" v-for="(item, index) in repeatedCards" :key="index">
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between">
                                <div class="text-start">
                                    <div class="text-quaternary-color fs14">{{ item.title }}</div>
                                    <div class="text-quaternary-color fs18 fw500 mt-1" v-html="item.value"></div>
                                </div>
                                <div v-if="item.image">
                                    <img :src="item.image" :alt="item.title" />
                                </div>
                                <div v-else>
                                    <i class="bi bi-database-fill icon-blue"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    bdrPercent: Object,
});

const isPaused = ref(false);

const cards = [
    {
        title: "Total revenue per sharing",
        value: `₹ ${String(props.bdrPercent?.revenueCurrentMonthSum || '0')}`,
        image: "/image/analytics-overview-1.png",
    },
    {
        title: "Active traded UCC's",
        value: props.bdrPercent?.activeTradedCount || '0',
        image: "/image/analytics-overview-2.png",
    },
    {
        title: "Top revenue clients",
        value: "-",
        image: "/image/analytics-overview-3.png",
    },
    {
        title: "Revenue growth",
        value: `${props.bdrPercent?.revenueGrowthPercentage || '0'} 
      <i class="bi ${props.bdrPercent?.revenueTrendDirection === 'down' ? 'bi-caret-down-fill text-danger' : 'bi-caret-up-fill text-success'}"></i>`,
        image: "/image/analytics-overview-4.png",
    },
    {
        title: "Top traded segment",
        value: "Equity -35%<br/>Derivatives -25%",
        image: "",
    },
];

const repeatedCards = computed(() => [...cards, ...cards]);

function pauseMarquee() {
    isPaused.value = true;
}

function resumeMarquee() {
    isPaused.value = false;
}
</script>

<style scoped>
.records-card {
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.records-card::-webkit-scrollbar {
    display: none;
}

.marquee {
    white-space: nowrap;
}

.marquee-content {
    display: inline-flex;
    gap: 20px;
    animation: marqueeScroll 25s linear infinite;
}

.marquee-content.paused {
    animation-play-state: paused;
}

.card {
    width: 305px !important;
    flex-shrink: 0;
}

@keyframes marqueeScroll {
    0% {
        transform: translateX(0%);
    }

    100% {
        transform: translateX(-50%);
    }
}

.icon-blue {
    background-color: #0D4593;
    color: #ffffff;
    border-radius: 50%;
    padding: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    font-size: 16px;
}
</style>

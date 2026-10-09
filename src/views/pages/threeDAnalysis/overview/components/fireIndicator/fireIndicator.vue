<template>
    <basePanelMask>
        <basePanelTitle title="防火指标" />
        <basePanelCard class="panel-card">
            <header class="indicator-header">
                <div class="title-wrap">
                    <i class="title-bar"></i>
                    <span class="title-text">防火告警趋势</span>
                </div>
                <div class="range-switch">
                    <el-button
                        v-for="item in RANGE_OPTIONS"
                        :key="item.value"
                        class="range-btn"
                        :class="{ 'is-active': item.value === range }"
                        @click="range = item.value"
                    >
                        {{ item.label }}
                    </el-button>
                </div>
            </header>
            <div class="chart-wrap">
                <BaseChart ref="chartRef" :option="chartOption" />
            </div>
        </basePanelCard>
        <basePanelCard class="panel-card">
            <header class="indicator-header">
                <div class="title-wrap">
                    <i class="title-bar"></i>
                    <span class="title-text">隐患类型占比</span>
                </div>
            </header>
            <div class="hazard-body">
                <div class="hazard-chart-wrap">
                    <BaseChart ref="hazardChartRef" :option="hazardOption" />
                    <img class="ring-core" src="@/assets/images/pie-circle.png" alt="" />
                </div>
                <ul class="hazard-legend">
                    <li v-for="item in HAZARD_ITEMS" :key="item.name" class="legend-row">
                        <span class="legend-name">
                            <i class="legend-dot" :style="{ color: item.color }"></i>
                            {{ item.name }}
                        </span>
                        <span class="legend-value" :style="{ color: item.color }">
                            {{ item.value }}%
                        </span>
                    </li>
                </ul>
            </div>
        </basePanelCard>
    </basePanelMask>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import basePanelMask from '@/components/basePanel/basePanelMask.vue';
import BaseChart from '@/components/baseChart/BaseChart.vue';
import basePanelTitle from '@/components/basePanel/basePanelTitle.vue';
import basePanelCard from '@/components/basePanel/basePanelCard.vue';
import { RANGE_OPTIONS, buildIndicatorOption, type RangeValue } from './fireIndicator.config';
import { HAZARD_ITEMS, buildHazardOption } from './hazardRatio.config';

/**
 * 防火指标：上为「防火告警趋势」柱图（可切区间），下为「隐患类型占比」环形图。
 * 标题栏按设计稿自有样式实现（青色竖条 + 文字 + 右侧切换），未走 basePanelTitle。
 */
const range = ref<RangeValue>('7d');

/** 初始配置（近7天）；切换区间由 watch 调 setOption 更新 */
const chartOption = buildIndicatorOption('7d');

const chartRef = ref<InstanceType<typeof BaseChart> | null>(null);
const hazardChartRef = ref<InstanceType<typeof BaseChart> | null>(null);

/** 隐患占比环形图（静态数据，仅随屏宽基准重建） */
const hazardOption = buildHazardOption();

function refresh(): void {
    chartRef.value?.setOption(buildIndicatorOption(range.value), true);
    hazardChartRef.value?.setOption(buildHazardOption(), true);
}

watch(range, refresh);

/**
 * 切屏(1080p → 4K)后 --screen-base 变化：容器尺寸由 BaseChart 的 ResizeObserver 重绘，
 * 但 echarts 的字号是裸像素，须按新基准重建 option 才跟得上。
 */
let resizeTimer: number | undefined;

function onResize(): void {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(refresh, 200);
}

onMounted(() => window.addEventListener('resize', onResize));

onBeforeUnmount(() => {
    window.clearTimeout(resizeTimer);
    window.removeEventListener('resize', onResize);
});
</script>

<style scoped lang="scss">
.indicator-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: base(26px);
    margin-bottom: base(8px);

    .title-wrap {
        display: flex;
        align-items: center;
        gap: base(6px);

        .title-bar {
            width: base(3px);
            height: base(14px);
            border-radius: base(2px);
            background: var(--color-cyan-400);
            box-shadow: 0 0 base(10px) color-mix(in srgb, var(--color-cyan-400) 40%, transparent);
        }

        .title-text {
            color: var(--color-cyan-400);
            font-size: var(--lxj-font-desc);
            font-weight: var(--font-weight-600);
            letter-spacing: 0.05em;
        }
    }

    .range-switch {
        display: flex;

        .range-btn {
            padding: base(2px) base(8px);
            height: auto;
            border-radius: base(4px);
            line-height: base(20px);

            /* 走 EP 按钮变量绑定，hover/选中态一并接管，避免逐条压内置规则 */
            --el-button-bg-color: transparent;
            --el-button-border-color: color-mix(in srgb, var(--color-blue-500) 18%, transparent);
            --el-button-text-color: var(--color-blue-500);
            --el-button-hover-bg-color: color-mix(in srgb, var(--color-cyan-400) 10%, transparent);
            --el-button-hover-border-color: color-mix(
                in srgb,
                var(--color-cyan-400) 30%,
                transparent
            );
            --el-button-hover-text-color: var(--color-cyan-400);
            --el-button-active-bg-color: color-mix(in srgb, var(--color-cyan-400) 15%, transparent);
            --el-button-active-border-color: color-mix(
                in srgb,
                var(--color-cyan-400) 40%,
                transparent
            );
            --el-button-active-text-color: var(--color-cyan-400);

            &.is-active {
                --el-button-bg-color: color-mix(in srgb, var(--color-cyan-400) 15%, transparent);
                --el-button-border-color: color-mix(
                    in srgb,
                    var(--color-cyan-400) 40%,
                    transparent
                );
                --el-button-text-color: var(--color-cyan-400);
            }
        }
    }
}

.chart-wrap {
    height: base(149px);
}

.panel-card {
    padding: base(12px);
    margin-top: base(6px);
}

.hazard-body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: base(8px);

    .hazard-chart-wrap {
        position: relative;
        width: base(120px);
        height: base(120px);
        flex-shrink: 0;

        /* 环心球体：设计稿原图（边缘亮、中心暗），尺寸与环内径(65%)取齐 */
        .ring-core {
            position: absolute;
            top: 17.5%;
            left: 17.5%;
            width: 65%;
            height: 65%;
            border-radius: 50%;
            pointer-events: none;
        }
    }

    .hazard-legend {
        display: flex;
        flex-direction: column;
        gap: base(2px);
        width: base(139px);
        margin: 0;
        padding: 0;
        list-style: none;

        .legend-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;

            .legend-name {
                display: flex;
                align-items: center;
                gap: base(6px);
                color: var(--color-blue-300);
                font-size: var(--lxj-font-desc);

                .legend-dot {
                    width: base(8px);
                    height: base(8px);
                    border-radius: base(4px);
                    flex-shrink: 0;
                    /* 色标与发光同取行内 color，省去逐项内联阴影 */
                    background: currentColor;
                    box-shadow: 0 0 base(4px) currentColor;
                }
            }

            .legend-value {
                font-size: var(--lxj-font-desc);
            }
        }
    }
}
</style>

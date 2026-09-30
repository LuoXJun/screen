<template>
    <div ref="chartEl" class="base-chart" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { echarts, type EChartsCoreOption } from './echarts';

type ChartInstance = ReturnType<typeof echarts.init>;
type InitOptions = Parameters<typeof echarts.init>[2];

const props = withDefaults(
    defineProps<{
        /** 初始化图表配置；后续更新请调用暴露的 setOption */
        option: EChartsCoreOption;
        /** 容器尺寸变化时自适应重绘 */
        autoResize?: boolean;
        /** echarts.init 的 opts（renderer 渲染器、devicePixelRatio 等）；theme 不支持 */
        initOptions?: InitOptions;
    }>(),
    {
        autoResize: true,
        initOptions: undefined
    }
);

const chartEl = ref<HTMLDivElement | null>(null);

let chart: ChartInstance | null = null;
let resizeObserver: ResizeObserver | null = null;
let resizeTimer: number | undefined;

function destroy() {
    chart?.dispose();
    chart = null;
}

function init() {
    if (!chartEl.value) return;
    chart = echarts.init(chartEl.value, undefined, props.initOptions);
    chart.setOption(props.option);
}

function resize() {
    chart?.resize();
}

onMounted(() => {
    init();
    if (props.autoResize) {
        // 容器尺寸变化（窗口伸缩/面板折叠/初始隐藏后显示）时自适应重绘，150ms 防抖
        resizeObserver = new ResizeObserver(() => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(resize, 150);
        });
        if (chartEl.value) resizeObserver.observe(chartEl.value);
    }
});

onBeforeUnmount(() => {
    window.clearTimeout(resizeTimer);
    resizeObserver?.disconnect();
    resizeObserver = null;
    destroy();
});

defineExpose({
    /** 获取图表实例（事件监听、loading、dispatchAction 高亮等高级操作） */
    getChart: (): ChartInstance | null => chart,
    /** 手动更新图表配置；replace 为 true 时全量替换（大数据量/动态增删系列更优） */
    setOption: (option: EChartsCoreOption, replace = false) =>
        chart?.setOption(option, { notMerge: replace }),
    resize
});
</script>

<style scoped lang="scss">
.base-chart {
    width: 100%;
    height: 100%;
}
</style>

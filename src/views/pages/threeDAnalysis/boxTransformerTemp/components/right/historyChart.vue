<template>
    <section class="history-section">
        <detailSectionHead title="48小时历史温度曲线" :note="note" />

        <div class="chart-card">
            <BaseChart ref="chartRef" :option="chartOption" />
        </div>
    </section>
</template>

<script setup lang="ts">
import BaseChart from '@/components/baseChart/BaseChart.vue';
import detailSectionHead from './detailSectionHead.vue';
import { buildHistoryOption } from '../../detail.config';
import type { TempStatus } from '../../config';

const props = defineProps<{
    /** 选中路状态（曲线主题色） */
    status: TempStatus;
    /** 选中路 48h 温度序列 */
    values: number[];
    /** 选中路说明（标题右侧） */
    note: string;
    /** 预警阈值（温度接近阈值起点） */
    warnThreshold: number;
    /** 告警阈值（超温起点） */
    alertThreshold: number;
}>();

const chartRef = ref<InstanceType<typeof BaseChart> | null>(null);
const chartOption = computed(() =>
    buildHistoryOption(props.status, props.values, {
        warn: props.warnThreshold,
        alert: props.alertThreshold
    })
);

watch(chartOption, (option) => chartRef.value?.setOption(option, true));
</script>

<style scoped lang="scss">
.history-section {
    display: flex;
    flex-direction: column;
    gap: base(4px);
}

.chart-card {
    height: base(190px);
    padding: base(5px) base(7px) base(4px);
    background: rgb(0 0 0 / 8%);
    border: 1px solid color-mix(in srgb, var(--lxj-color-primary) 14%, transparent);
}
</style>

<template>
    <asidePanel title="箱变设备统计" :extra="`共 ${devices.length} 台`">
        <div class="stats-body">
            <basePanelCard class="stats-card">
                <ul class="stats-grid">
                    <li
                        v-for="item in stats"
                        :key="item.label"
                        class="stat-item"
                        :style="{ '--stat-color': item.color }"
                    >
                        <span class="stat-label">{{ item.label }}</span>
                        <p class="stat-value">
                            <span class="stat-number">{{ item.value }}</span>
                            <span class="stat-unit">{{ item.unit }}</span>
                        </p>
                    </li>
                </ul>
            </basePanelCard>

            <basePanelCard class="ratio-card">
                <div class="ratio-body">
                    <div class="ratio-chart">
                        <BaseChart :option="ringOption" />
                        <img class="ring-core" :src="ringCoreIcon" alt="" />
                    </div>

                    <ul class="ratio-legend">
                        <li
                            v-for="item in TEMP_RATIO_ITEMS"
                            :key="item.name"
                            class="legend-row"
                            :style="{ '--legend-color': item.color }"
                        >
                            <span class="legend-name">
                                <i class="legend-dot"></i>
                                {{ item.name }}
                            </span>
                            <span class="legend-value">{{ item.value }}%</span>
                        </li>
                    </ul>
                </div>
            </basePanelCard>
        </div>
    </asidePanel>
</template>

<script setup lang="ts">
import BaseChart from '@/components/baseChart/BaseChart.vue';
import basePanelCard from '@/components/basePanel/basePanelCard.vue';
import type { BoxTransformerDevice, BoxTransformerStatus } from '@/config/devices';
import { getImageWidthName } from '@/utils/getAssets';
import asidePanel from '../shared/asidePanel.vue';
import { TEMP_STATUS_META, TEMP_RATIO_ITEMS, buildRingOption } from '../../config';

const props = defineProps<{
    /** 当前站点箱变设备（全局设备注册表） */
    devices: BoxTransformerDevice[];
}>();

/** 环心球体（设计稿原图，与总览「隐患类型占比」共用） */
const ringCoreIcon = getImageWidthName('pie-circle.png');

const ringOption = buildRingOption();

interface StatItem {
    label: string;
    value: number;
    unit: string;
    color: string;
}

/** 统计条按当前站点箱变实时计数（超温/接近阈值/正常/离线） */
const stats = computed<StatItem[]>(() => {
    const countOf = (status: BoxTransformerStatus) =>
        props.devices.filter((device) => device.status === status).length;

    return [
        {
            label: '总数',
            value: props.devices.length,
            unit: '台',
            color: 'var(--lxj-color-accent-cyan)'
        },
        {
            label: '超温',
            value: countOf('overheat'),
            unit: '台',
            color: TEMP_STATUS_META.overheat.color
        },
        {
            label: '接近阈值',
            value: countOf('near'),
            unit: '台',
            color: TEMP_STATUS_META.near.color
        },
        {
            label: '正常',
            value: countOf('normal'),
            unit: '台',
            color: TEMP_STATUS_META.normal.color
        },
        {
            label: '设备离线',
            value: countOf('offline'),
            unit: '台',
            color: TEMP_STATUS_META.offline.color
        }
    ];
});
</script>

<style scoped lang="scss">
.stats-body {
    display: flex;
    flex-direction: column;
    gap: base(4px);

    /* basePanelCard 默认 4px 内衬；设计稿内层卡片为 10px + 4px 圆角。
       嵌套限定提高优先级，覆盖组件内 scoped 规则 */
    .stats-card,
    .ratio-card {
        padding: base(10px);
        border-radius: var(--lxj-radius-small);
    }
}

/* ---------------- 统计条 ---------------- */

.stats-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    height: base(52px);
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0 base(8px);
    /* 设计稿取值:列分隔线 rgba(0,200,255,.14) */
    border-right: 1px solid color-mix(in srgb, var(--lxj-color-primary) 14%, transparent);

    &:first-child {
        padding-left: 0;
    }

    &:last-child {
        padding-right: 0;
        border-right: none;
    }

    .stat-label {
        color: var(--stat-color);
        font-size: var(--lxj-font-body);
        line-height: base(21px);
        white-space: nowrap;
    }

    .stat-value {
        display: flex;
        align-items: baseline;
        gap: base(1px);
        padding-top: base(3px);
        white-space: nowrap;
    }

    .stat-number {
        color: var(--stat-color);
        font-size: font(19px);
        font-weight: var(--lxj-font-weight-Semibold);
        line-height: base(28px);
    }

    .stat-unit {
        color: var(--stat-color);
        font-size: var(--lxj-font-body);
        line-height: base(21px);
    }
}

/* ---------------- 环形图 + 图例 ---------------- */

.ratio-body {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.ratio-chart {
    position: relative;
    width: base(120px);
    height: base(120px);
    flex-shrink: 0;

    /* 环心球体尺寸对齐设计稿内圆（86px / 120px） */
    .ring-core {
        position: absolute;
        top: 50%;
        left: 50%;
        width: base(86px);
        height: base(86px);
        transform: translate(-50%, -50%);
        pointer-events: none;
    }
}

.ratio-legend {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: base(201px);
    height: base(120px);
    flex-shrink: 0;
}

.legend-row {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .legend-name {
        display: flex;
        align-items: center;
        gap: base(6px);
        color: var(--lxj-color-text-primary);
        font-size: var(--lxj-font-body);
        line-height: base(20px);
        white-space: nowrap;
    }

    .legend-dot {
        width: base(8px);
        height: base(8px);
        border-radius: base(4px);
        flex-shrink: 0;
        background: var(--legend-color);
        box-shadow: 0 0 base(4px) var(--legend-color);
    }

    .legend-value {
        color: var(--legend-color);
        font-size: var(--lxj-font-body);
        line-height: base(20px);
    }
}
</style>

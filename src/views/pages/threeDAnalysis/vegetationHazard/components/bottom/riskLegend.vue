<template>
    <basePanelMask class="risk-legend">
        <div class="legend-grid">
            <p class="legend-title">风险等级图例</p>
            <span v-for="item in RISK_LEGEND" :key="item.label" class="legend-item">
                <i class="legend-dot" :style="{ background: item.color }"></i>
                <span class="legend-label">{{ item.label }}</span>
                <span class="legend-range">{{ item.range }}</span>
            </span>
        </div>
    </basePanelMask>
</template>

<script setup lang="ts">
import basePanelMask from '@/components/basePanel/basePanelMask.vue';
import { RISK_LEGEND } from './bottomPanels.config';
</script>

<style scoped lang="scss">
.risk-legend {
    --lxj-panel-space-y: #{base(10px)};
    --lxj-space-panel: #{base(10px)};

    .legend-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: base(4px);
    }

    .legend-title {
        grid-column: 1 / -1;
        color: var(--lxj-color-text-strong);
        font-size: var(--lxj-font-body);
        font-weight: var(--lxj-font-weight-Semibold);
        line-height: base(21px);
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: base(6px);
        font-size: var(--lxj-font-body);
        line-height: base(21px);
        white-space: nowrap;
    }

    .legend-dot {
        flex-shrink: 0;
        width: base(9px);
        height: base(9px);
    }

    .legend-label {
        color: var(--lxj-color-text-primary);
    }

    .legend-range {
        color: var(--lxj-color-text-secondary);
    }
}
</style>

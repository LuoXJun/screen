<template>
    <div class="bottom-panels">
        <!-- 底部面板右上浮层：与右缘对齐、间隔 11px -->
        <riskLegend class="risk-legend" />
        <hazardChecklist />
        <droneImagery :item="selectedItem" />
    </div>
</template>

<script setup lang="ts">
import hazardChecklist from './hazardChecklist.vue';
import droneImagery from './droneImagery.vue';
import riskLegend from './riskLegend.vue';
import { useHazardSelection } from '../../composables/useHazardSelection';

const { selectedItem } = useHazardSelection();
</script>

<style scoped lang="scss">
/* 主区底部常驻双面板（定位同监控视频:cameraMonitorPanel） */
.bottom-panels {
    position: absolute;
    bottom: 0;
    left: 50%;
    display: flex;
    gap: base(6px);
    width: base(960px);
    height: base(340px);
    transform: translateX(-50%);
    pointer-events: none;

    > * {
        flex: 1;
        min-width: 0;
        pointer-events: all;
    }

    .risk-legend {
        position: absolute;
        right: 0;
        bottom: calc(100% + #{base(11px)});
        width: base(268px);
    }
}
</style>

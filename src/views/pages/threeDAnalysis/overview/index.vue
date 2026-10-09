<template>
    <baseOverlay>
        <template #left>
            <!-- 站点信息 -->
            <stationInfo />
            <!-- 防火指标 -->
            <fireIndicator />
        </template>
        <records />
        <!-- 图层管理--绝对定位 -->
        <layerControl v-model="checkedLayers" class="layer-control" :list="LAYER_ITEMS" />
        <template #right>
            <eqOverview />
            <inspection />
        </template>
    </baseOverlay>
</template>

<script setup lang="ts">
import baseOverlay from '@/components/baseOverlay/baseOverlay.vue';
import stationInfo from './components/stationInfo.vue';
import fireIndicator from './components/fireIndicator/fireIndicator.vue';
import records from './components/records/records.vue';
import eqOverview from './components/eqOverview.vue';
import inspection from './components/inspection/inspection.vue';
import layerControl from '@/components/screen/layerControl/layerControl.vue';
import { useLayerControl } from './composables/useLayerControl.ts';

const { LAYER_ITEMS, checkedLayers } = useLayerControl();
</script>

<style scoped lang="scss">
/* 图层管理：贴左栏右侧,顶部与侧栏内容顶对齐
   （避让值与左右 aside 同源：站点按钮占位 42px）,高度按内容撑开 */
.layer-control {
    position: absolute;
    left: 0;
    top: var(--lxj-aside-top-offset, 0);
    transform: translateX(20%);
    z-index: var(--lxj-z-sticky);
}
</style>

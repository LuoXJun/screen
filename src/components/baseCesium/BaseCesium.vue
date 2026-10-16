<template>
    <div ref="containerEl" class="base-cesium" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import {
    applyBaseMap,
    clearHandlers,
    destroyViewer,
    getViewer,
    hasViewer,
    initViewer,
    removeAllDataSources,
    removeAllEntities,
    removeAllLayers
} from '@/cesium';

const containerEl = ref<HTMLDivElement | null>(null);

onMounted(() => {
    if (!containerEl.value) return;
    /* HMR/组件重建会换上新容器，旧 Viewer 的 canvas 悬空在已卸载的旧容器上（白屏）：
       容器更换时必须清理重建；容器未变（纯脚本热更新）则复用，保住地图状态 */
    if (hasViewer() && getViewer().container !== containerEl.value) {
        clearHandlers();
        removeAllLayers();
        removeAllDataSources();
        removeAllEntities();
        destroyViewer();
    }
    initViewer(containerEl.value);
    applyBaseMap();
});

onBeforeUnmount(() => {
    /* HMR 热更新会重建组件实例(新实例 setup 复用既有 Viewer,见 initViewer),
       此时若走完整销毁链会把新实例的 Viewer 一并杀掉——dev 下跳过,生产环境正常清理 */
    if (import.meta.hot) return;
    // 清理顺序：先解除事件与数据，再销毁 Viewer，防止内存泄漏
    clearHandlers();
    removeAllLayers();
    removeAllDataSources();
    removeAllEntities();
    destroyViewer();
});
</script>

<style scoped lang="scss">
.base-cesium {
    width: 100%;
    height: 100%;

    :deep(.cesium-widget-credits) {
        display: none;
    }
}
</style>

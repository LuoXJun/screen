<template>
    <div ref="containerEl" class="base-cesium" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import {
    clearHandlers,
    destroyViewer,
    initViewer,
    removeAllDataSources,
    removeAllEntities,
    removeAllLayers
} from '@/cesium';

const containerEl = ref<HTMLDivElement | null>(null);

onMounted(() => {
    if (!containerEl.value) return;
    initViewer(containerEl.value);
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

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

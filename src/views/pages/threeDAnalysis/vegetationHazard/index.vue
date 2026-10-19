<template>
    <baseOverlay class="vegetation-hazard">
        <template #left>
            <!-- 页面专属图层管理（含隐患图）与分区植被统计 -->
            <div class="vegetation-aside">
                <layerPanel />
                <vegetationStats />
            </div>
        </template>
        <template #right>
            <!-- 火灾隐患列表（等级筛选 + 处置入口） -->
            <div class="hazard-aside">
                <hazardListPanel />
            </div>
        </template>
        <!-- 主区底部：植被隐患清单 + 无人机拍摄影像 -->
        <bottomPanels />
    </baseOverlay>
</template>

<script setup lang="ts">
import baseOverlay from '@/components/baseOverlay/baseOverlay.vue';
import layerPanel from './components/layerPanel.vue';
import vegetationStats from './components/vegetationStats.vue';
import hazardListPanel from './components/hazardListPanel.vue';
import bottomPanels from './components/bottom/bottomPanels.vue';
</script>

<style scoped lang="scss">
/* 栏宽随设计稿（全局默认 320）：左栏宽度取自路由 meta 的 asideWidth，右栏按 350 */
.vegetation-hazard {
    :deep(.aside.left) {
        width: var(--lxj-page-aside-width, var(--lxj-aside-width));
    }

    :deep(.aside.right) {
        width: base(350px);
    }
}

.vegetation-aside {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: var(--lxj-gap);
}

.hazard-aside {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
}
</style>

<template>
    <ScreenLayout>
        <template #left>
            <div class="side-column">
                <div class="side-panel-item" title="面板标题" />
                <div class="side-panel-item" title="面板标题" />
            </div>
        </template>

        <!-- 右侧面板 -->
        <template #right>
            <div class="side-column">
                <div class="side-panel-item" title="面板标题" />
                <div class="side-panel-item" title="面板标题" />
            </div>
        </template>
    </ScreenLayout>
</template>

<script setup lang="ts">
import ScreenLayout from '@/components/screen/ScreenLayout.vue';
</script>

<style scoped lang="scss">
/* 左右面板：base 等比宽度（340/1920 = 17.71%，与高度同基准 → 宽高等比） */
.side-column {
    width: base(340px);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: var(--lxj-gap-oversize);
    min-height: 0;
    pointer-events: auto;
}

.side-panel-item {
    flex: 1;
    min-height: 0;
    background: rgb(58, 59, 59);
}
</style>

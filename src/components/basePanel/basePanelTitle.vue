<template>
    <div class="basePanelTitle lxj-flex-between" :style="{ backgroundImage: panelBg }">
        <span class="title">{{ title }}</span>
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { getImageWidthName } from '@/utils/getAssets';

defineProps<{
    title: string;
}>();

/** 组件内置资产（经 getAssets 解析，同项目图片引用约定） */
const panelBg = `url("${getImageWidthName('panel-title-bg.png')}")`;
</script>

<style scoped lang="scss">
.basePanelTitle {
    background-repeat: no-repeat;
    background-size: contain;
    height: base(30px);
    padding-left: base(30px);
    /* 设计稿取值:标题蓝（blue-200 无对应语义档位） */
    color: var(--color-blue-200);
    font-family: var(--lxj-font-family-title);
    font-size: var(--lxj-font-panel-title);
}
</style>

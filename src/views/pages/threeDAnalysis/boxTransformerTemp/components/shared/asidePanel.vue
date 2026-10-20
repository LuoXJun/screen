<template>
    <basePanelMask class="aside-panel">
        <basePanelTitle class="panel-title" :title="title">
            <slot name="extra">
                <span v-if="extra" class="panel-extra">{{ extra }}</span>
            </slot>
        </basePanelTitle>
        <div class="panel-body">
            <slot></slot>
        </div>
    </basePanelMask>
</template>

<script setup lang="ts">
import basePanelMask from '@/components/basePanel/basePanelMask.vue';
import basePanelTitle from '@/components/basePanel/basePanelTitle.vue';

defineProps<{
    title: string;
    /** 标题右侧胶囊（如「共 11 层」） */
    extra?: string;
}>();
</script>

<style scoped lang="scss">
.aside-panel {
    /* 设计稿：卡片无顶衬，标题直接贴顶；左右/底部 10px */
    --lxj-panel-space-y: 0;

    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    min-height: 0;
    padding: 0 base(10px) base(10px);

    /* 标题条高 46，标题图保持 30 高并垂直居中（避免 contain 随容器高度放大） */
    .panel-title {
        flex-shrink: 0;
        height: base(46px);
        background-position: left center;
        background-size: auto base(30px);
        border-bottom: 1px solid var(--lxj-color-border-divider);
    }

    .panel-extra {
        padding: base(2px) base(8px);
        border: 1px solid var(--lxj-color-border-divider);
        border-radius: base(10px);
        color: var(--lxj-color-text-primary);
        font-size: var(--lxj-font-body);
        font-weight: var(--lxj-font-weight-Medium);
        line-height: base(21px);
    }

    .panel-body {
        display: flex;
        flex: 1;
        min-height: 0;
        flex-direction: column;
    }
}
</style>

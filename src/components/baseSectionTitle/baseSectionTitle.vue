<template>
    <div class="baseSectionTitle">
        <i class="title-bar"></i>
        <span class="title-text">{{ title }}</span>
        <span v-if="extra" class="title-extra">{{ extra }}</span>
    </div>
</template>

<script setup lang="ts">
/** 区块标题：青色竖条 + 标题；可选右侧附加文本（如「总计 5」） */
defineProps<{
    /** 标题 */
    title: string;
    /** 右侧附加文本（橙色） */
    extra?: string;
}>();
</script>

<style scoped lang="scss">
.baseSectionTitle {
    display: flex;
    align-items: center;
    gap: base(6px);

    /* 设计稿取值:青色发光竖条 */
    .title-bar {
        width: base(3px);
        height: base(14px);
        border-radius: base(2px);
        background: var(--color-cyan-400);
        box-shadow: 0 0 base(10px) color-mix(in srgb, var(--color-cyan-400) 40%, transparent);
    }

    .title-text {
        color: var(--color-cyan-400);
        font-size: var(--lxj-font-body);
        font-weight: var(--lxj-font-weight-Semibold);
        letter-spacing: base(0.7px);
    }

    /* 设计稿取值:附加文本橙色 */
    .title-extra {
        margin-left: auto;
        color: #f5a623;
        font-size: var(--lxj-font-body);
        font-weight: var(--lxj-font-weight-Semibold);
    }
}
</style>

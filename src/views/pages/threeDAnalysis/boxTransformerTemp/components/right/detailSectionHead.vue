<template>
    <div class="section-head">
        <baseSectionTitle :title="title" size="lg" />
        <span v-if="note" class="section-note">{{ note }}</span>
    </div>
</template>

<script setup lang="ts">
import baseSectionTitle from '@/components/baseSectionTitle/baseSectionTitle.vue';

defineProps<{
    title: string;
    /** 右侧提示（如「点击测温点查看历史曲线」） */
    note?: string;
}>();
</script>

<style scoped lang="scss">
.section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: base(8px);
    height: base(33px);
    padding: 0 base(4px);

    .section-note {
        color: var(--lxj-color-text-primary);
        font-size: font(10px);
        line-height: base(14px);
        white-space: nowrap;
    }
}
</style>

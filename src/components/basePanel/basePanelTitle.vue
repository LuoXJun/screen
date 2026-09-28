<template>
    <div class="basePanelTitle lxj-flex-between">
        <span class="title">{{ title }}</span>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
}>();
</script>

<style scoped lang="scss">
.basePanelTitle {
    background: url('@/assets/images/panel-title-bg.png');
    background-size: cover;
    height: base(30px);
    padding-left: base(30px);
    color: #c3e2fa;
    font-family: var(--lxj-font-family-title);
    font-size: var(--lxj-font-panel-title);
}
</style>

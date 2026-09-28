<template>
    <footer class="screen-footer">
        <span class="footer-text">{{ text }}</span>
        <span class="footer-status">{{ status }}</span>
    </footer>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ text?: string; status?: string }>(), {
    text: '',
    status: ''
});
</script>

<style scoped lang="scss">
.screen-footer {
    height: var(--lxj-footer-height);
    flex-shrink: 0;
    pointer-events: auto; /* 穿透的 UI 层中恢复事件：文字可选中 */
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--lxj-gap-oversize);
    font-size: var(--lxj-font-body);
    color: var(--lxj-color-text-secondary);
    background: var(--lxj-bg-panel);
    border-top: 1px solid var(--lxj-color-border);

    .footer-text {
        letter-spacing: 1px;
    }

    .footer-status {
        color: var(--lxj-color-primary);
    }
}
</style>

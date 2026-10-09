<template>
    <div class="basePanelMask">
        <slot></slot>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.basePanelMask {
    border-radius: var(--lxj-radius-small);
    background: rgba(7, 20, 40, 0.85);
    border: 1px solid var(--lxj-color-border-primary-light);
    pointer-events: all;
    padding: var(--lxj-space-panel);
}
</style>

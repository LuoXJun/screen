<template>
    <div class="basePanelCard">
        <slot></slot>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.basePanelCard {
    background: var(--lxj-bg-card);
    border: 1px solid var(--lxj-color-border-primary-light);
    padding: 4px;
}
</style>

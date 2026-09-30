<template>
    <div class="baseOverlay">
        <div class="aside left">
            <slot name="left"></slot>
        </div>
        <div class="main">
            <slot></slot>
        </div>
        <div class="aside right">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.baseOverlay {
    display: flex;
    justify-content: space-between;
    height: 100%;
    width: 100%;
    .aside {
        width: var(--lxj-aside-width);
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        gap: var(--lxj-gap);
        pointer-events: all;
        // overflow: auto;
    }
    .main {
        flex: 1;
        min-width: 0;
        height: 100%;
        overflow: hidden;
    }
}
</style>

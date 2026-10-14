<template>
    <div class="droneRoute">
        <toolsBar class="draw-tools" />
    </div>
</template>

<script setup lang="ts">
import toolsBar from '@/components/baseCesium/toolsBar.vue';
import { useBimModel } from './composables/useBimModel';

useBimModel();
</script>

<style scoped lang="scss">
.droneRoute {
    position: relative;
    height: 100%;

    /* 绘制工具条：中间底部 */
    .draw-tools {
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
    }
}
</style>

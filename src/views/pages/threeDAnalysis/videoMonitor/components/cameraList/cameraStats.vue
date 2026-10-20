<template>
    <div class="cameraStats">
        <baseStatList :rows="statRows" variant="grid" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import baseStatList from '@/components/baseStatList/baseStatList.vue';
import type { CameraStatCell } from './cameraList.config';

const props = defineProps<{
    /** 统计行（每行若干格，渲染时格间加分隔线） */
    rows: CameraStatCell[][];
}>();

/** 统计格 → baseStatList 数据模型（无图标） */
const statRows = computed(() =>
    props.rows.map((row) =>
        row.map((cell) => ({
            label: cell.label,
            value: cell.value,
            unit: cell.unit
        }))
    )
);
</script>

<style scoped lang="scss">
.cameraStats {
    width: 100%;
}
</style>

<template>
    <div class="alarmStats">
        <baseStatList :list="statItems" divider="alarm-stat-divider.svg" />
    </div>
</template>

<script setup lang="ts">
import baseStatList from '@/components/baseStatList/baseStatList.vue';
import { ALARM_STATS } from './alarmCenter.config';

/** 警报统计 → baseStatList 数据模型 */
const statItems = ALARM_STATS.map((stat) => ({
    label: stat.label,
    icon: stat.icon,
    value: stat.value,
    unit: '条',
    valueColor: stat.color
}));
</script>

<style scoped lang="scss">
.alarmStats {
    padding: base(12px);
    background: var(--lxj-bg-card);
    border: 1px solid var(--lxj-color-border-primary-light);
    border-radius: base(4px);

    :deep(.baseStatList) {
        width: 100%;
    }

    :deep(.baseStatListItem) {
        flex: 1;
    }
}
</style>

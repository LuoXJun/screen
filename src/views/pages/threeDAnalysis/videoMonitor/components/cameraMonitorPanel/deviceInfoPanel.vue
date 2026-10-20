<template>
    <div class="deviceInfoPanel">
        <baseSectionTitle title="设备信息" />
        <DeviceInfo :items="items" :show-icon="false" variant="grid" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import baseSectionTitle from '@/components/baseSectionTitle/baseSectionTitle.vue';
import DeviceInfo from '@/components/screen/popups/device/DeviceInfo.vue';
import type { DeviceInfoItem } from '@/components/screen/popups/device/DeviceInfo';
import type { MonitorInfoField } from './cameraMonitorPanel.config';

const props = defineProps<{
    /** 设备信息字段（两列网格铺排） */
    fields: MonitorInfoField[];
}>();

/** 面板字段 → 通用设备信息项 */
const items = computed<DeviceInfoItem[]>(() =>
    props.fields.map((field) => ({
        label: field.label,
        value: field.value,
        valueClass: field.strong ? 'is-strong' : undefined,
        valueColor: field.color
    }))
);
</script>

<style scoped lang="scss">
.deviceInfoPanel {
    display: flex;
    flex: 1;
    min-height: 0;
    flex-direction: column;
    padding: base(10px);
    background: var(--lxj-bg-card);
    border: 1px solid var(--lxj-color-border-primary-light);
    border-radius: base(4px);
}
</style>

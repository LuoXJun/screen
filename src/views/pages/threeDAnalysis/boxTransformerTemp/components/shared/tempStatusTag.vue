<template>
    <span class="status-tag" :style="{ '--status-color': meta.color }">{{ meta.label }}</span>
</template>

<script setup lang="ts">
import { TEMP_STATUS_META, type TempStatus } from '../../config';

/** 箱变温度状态标签（左栏列表 / 右栏详情共用，三态按语义色着色） */
const props = defineProps<{ status: TempStatus }>();

const meta = computed(() => TEMP_STATUS_META[props.status]);
</script>

<style scoped lang="scss">
.status-tag {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    height: base(27px);
    padding: 0 base(8px);
    border: 1px solid color-mix(in srgb, var(--status-color) 50%, transparent);
    border-radius: base(2px);
    background: color-mix(in srgb, var(--status-color) 7%, transparent);
    color: var(--status-color);
    font-size: var(--lxj-font-body);
    line-height: base(21px);
    white-space: nowrap;
}
</style>

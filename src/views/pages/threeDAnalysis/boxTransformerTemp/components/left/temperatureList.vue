<template>
    <asidePanel class="temperature-panel" title="箱变实时温度">
        <basePanelCard class="list-card">
            <ul class="temperature-list">
                <li
                    v-for="item in devices"
                    :key="item.id"
                    class="temperature-item"
                    :class="{ 'is-selected': item.id === selectedId }"
                    :style="{ '--status-color': TEMP_STATUS_META[item.status].color }"
                    @click="emits('select', item)"
                >
                    <i class="status-dot"></i>
                    <span class="item-name">{{ item.name }}</span>
                    <span class="item-zone">{{ item.zone }}</span>
                    <tempStatusTag :status="item.status" />
                </li>
            </ul>
        </basePanelCard>
    </asidePanel>
</template>

<script setup lang="ts">
import basePanelCard from '@/components/basePanel/basePanelCard.vue';
import type { BoxTransformerDevice } from '@/config/devices';
import asidePanel from '../shared/asidePanel.vue';
import tempStatusTag from '../shared/tempStatusTag.vue';
import { TEMP_STATUS_META } from '../../config';

defineProps<{
    /** 当前站点箱变设备（全局设备注册表） */
    devices: BoxTransformerDevice[];
    /** 当前选中箱变（列表/地图/详情联动同一来源） */
    selectedId: string;
}>();

const emits = defineEmits<{
    select: [device: BoxTransformerDevice];
}>();
</script>

<style scoped lang="scss">
/* 占据左栏剩余高度，列表区内部滚动 */
.temperature-panel {
    flex: 1;
    min-height: 0;

    /* basePanelCard 默认 4px 内衬；设计稿内层卡片为 10px + 4px 圆角。
       嵌套限定提高优先级，覆盖组件内 scoped 规则 */
    .list-card {
        display: flex;
        flex: 1;
        min-height: 0;
        flex-direction: column;
        padding: base(10px);
        border-radius: var(--lxj-radius-small);
    }
}

.temperature-list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}

.temperature-item {
    display: grid;
    grid-template-columns: base(7px) auto minmax(0, 1fr) auto;
    align-items: center;
    column-gap: base(8px);
    height: base(46px);
    padding: 0 base(10px);
    /* 设计稿取值:行分隔虚线 rgba(0,150,220,.15) */
    border-top: 1px dashed color-mix(in srgb, var(--lxj-color-primary) 15%, transparent);
    cursor: pointer;

    &:first-child {
        border-top: none;
    }

    /* 选中态（设计稿 1# 行）：深蓝底 + 主青 20% 描边 + 圆角 */
    &.is-selected {
        background: var(--color-blue-750);
        border: 1px solid color-mix(in srgb, var(--lxj-color-primary) 20%, transparent);
        border-radius: base(5px);
    }

    .status-dot {
        width: base(7px);
        height: base(7px);
        border-radius: var(--lxj-radius-circle);
        background: var(--status-color);
        box-shadow: 0 0 base(8px) var(--status-color);
    }

    .item-name {
        color: var(--lxj-color-text-desc);
        font-size: var(--lxj-font-body);
        font-weight: var(--lxj-font-weight-Semibold);
        line-height: base(21px);
        white-space: nowrap;
    }

    .item-zone {
        color: var(--lxj-color-text-secondary);
        font-size: var(--lxj-font-body);
        line-height: base(21px);
        white-space: nowrap;
    }
}
</style>

<template>
    <basePanelMask class="hazard-panel">
        <basePanelTitle class="panel-title" title="火灾隐患列表">
            <span class="panel-extra">{{ filteredRecords.length }} 条</span>
        </basePanelTitle>

        <baseTabs v-model="activeTab" :items="HAZARD_TABS" class="hazard-tabs" />

        <div ref="listRef" class="hazard-list">
            <hazardItem
                v-for="record in filteredRecords"
                :key="record.id"
                :record="record"
                :selected="record.id === selectedHazardId"
                @handle="onHandle"
            />
        </div>

        <div class="hazard-legend">
            <span v-for="item in HAZARD_LEGEND" :key="item.label" class="legend-item">
                <i class="legend-dot" :style="{ background: item.color }"></i>
                {{ item.label }}
            </span>
        </div>
    </basePanelMask>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import basePanelMask from '@/components/basePanel/basePanelMask.vue';
import basePanelTitle from '@/components/basePanel/basePanelTitle.vue';
import baseTabs from '@/components/baseTabs/baseTabs.vue';
import hazardItem from './hazardItem.vue';
import { useHazardSelection } from '../composables/useHazardSelection';
import { HAZARD_LEGEND, HAZARD_RECORDS, HAZARD_TABS, type HazardTab } from '../config';

/** 当前等级筛选 */
const activeTab = ref<HazardTab>('全部');

const listRef = ref<HTMLDivElement>();

const { selectedHazardId } = useHazardSelection();

const filteredRecords = computed(() =>
    activeTab.value === '全部'
        ? HAZARD_RECORDS
        : HAZARD_RECORDS.filter((record) => record.level === activeTab.value)
);

/* 清单选中联动：当前筛选看不到该记录时回到「全部」,并滚动到可视区 */
watch(
    selectedHazardId,
    async (id) => {
        if (!id) return;
        if (!filteredRecords.value.some((record) => record.id === id)) {
            activeTab.value = '全部';
        }
        await nextTick();
        listRef.value
            ?.querySelector(`[data-hazard-id="${id}"]`)
            ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    },
    { immediate: true }
);

/** 处理：处置流程（待接入） */
function onHandle(): void {
    /* 处置流程待接入 */
}
</script>

<style scoped lang="scss">
.hazard-panel {
    /* 设计稿：面板无上下内衬，左右 10px；页脚图例自带下距 */
    --lxj-panel-space-y: #{base(6px)};
    --lxj-space-panel: #{base(10px)};
    display: flex;
    min-height: 0;
    flex-direction: column;

    .panel-title {
        flex-shrink: 0;
        margin: base(2px) 0 base(8px);
        border-bottom: 1px solid var(--lxj-color-border-divider);
    }

    .panel-extra {
        padding: base(2px) base(8px);
        border: 1px solid var(--lxj-color-border-divider);
        border-radius: base(4px);
        color: var(--lxj-color-text-primary);
        font-size: var(--lxj-font-body);
        line-height: base(21px);
    }
}

.hazard-tabs {
    flex-shrink: 0;
    padding: base(8px) 0;
}

.hazard-list {
    display: flex;
    flex: 1;
    min-height: 0;
    flex-direction: column;
    gap: base(4px);
    overflow-y: auto;
}

.hazard-legend {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: base(12px);
    height: base(36px);
    margin-top: base(4px);
    border-top: 1px solid var(--lxj-color-border-divider);

    .legend-item {
        display: flex;
        align-items: center;
        gap: base(5px);
        color: var(--lxj-color-text-secondary);
        font-size: var(--lxj-font-body);
        line-height: base(21px);
        white-space: nowrap;
    }

    .legend-dot {
        width: base(7px);
        height: base(7px);
    }
}
</style>

<template>
    <basePanelMask class="checklist-panel">
        <basePanelTitle class="panel-title" title="植被隐患清单">
            <span class="pending-count">{{ CHECKLIST_PENDING }} 待处理</span>
        </basePanelTitle>

        <baseTabs
            v-model="activeType"
            :items="CHECKLIST_TYPES"
            variant="underline"
            class="type-tabs"
        />

        <div class="checklist">
            <hazardItem
                v-for="(item, index) in filteredItems"
                :key="item.id"
                :record="item"
                variant="checklist"
                :selected="index === activeIndex"
                @select="selectItem(item, index)"
                @handle="onHandle"
            />
        </div>
    </basePanelMask>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import basePanelMask from '@/components/basePanel/basePanelMask.vue';
import basePanelTitle from '@/components/basePanel/basePanelTitle.vue';
import baseTabs from '@/components/baseTabs/baseTabs.vue';
import hazardItem from '../hazardItem.vue';
import { useHazardSelection } from '../../composables/useHazardSelection';
import {
    CHECKLIST_ITEMS,
    CHECKLIST_PENDING,
    CHECKLIST_TYPES,
    type ChecklistItem,
    type ChecklistType
} from './bottomPanels.config';

/** 当前筛选类型 */
const activeType = ref<ChecklistType>('dry');

/** 当前选中行（-1 = 未选择,进入页面不默认选中） */
const activeIndex = ref(-1);

const { selectedItem } = useHazardSelection();

/* 进入页面清空跨页残留的选中态 */
selectedItem.value = null;

const filteredItems = computed(() =>
    CHECKLIST_ITEMS.filter((item) => item.type === activeType.value)
);

/* 切换筛选仅改变清单视图,保留右侧/影像的选中;当前视图能匹配到则恢复行高亮 */
watch(activeType, () => {
    activeIndex.value = selectedItem.value
        ? filteredItems.value.findIndex((item) => item.id === selectedItem.value?.id)
        : -1;
});

/** 选中清单项 → 联动火灾隐患列表与无人机影像 */
function selectItem(item: ChecklistItem, index: number): void {
    activeIndex.value = index;
    selectedItem.value = item;
}

/** 处理：处置流程（待接入） */
function onHandle(): void {
    /* 处置流程待接入 */
}
</script>

<style scoped lang="scss">
.checklist-panel {
    --lxj-panel-space-y: #{base(6px)};
    --lxj-space-panel: #{base(10px)};
    display: flex;
    min-height: 0;
    flex-direction: column;
    height: 100%;

    .panel-title {
        margin: base(2px) 0;
    }

    .pending-count {
        padding: base(2px) base(8px);
        border: 1px solid color-mix(in srgb, var(--lxj-color-danger-soft) 35%, transparent);
        border-radius: base(4px);
        color: var(--lxj-color-danger-soft);
        font-size: var(--lxj-font-body);
        line-height: base(21px);
    }
}

.type-tabs {
    flex-shrink: 0;
    height: base(38px);
    padding-top: base(4px);
    border-bottom: 1px solid var(--lxj-color-border-divider);
}

.checklist {
    flex: 1;
    min-height: 0;
    padding-bottom: base(10px);
    overflow-y: auto;
}

</style>

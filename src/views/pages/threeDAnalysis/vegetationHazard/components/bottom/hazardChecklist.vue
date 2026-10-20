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
            <div
                v-for="(item, index) in filteredItems"
                :key="item.id"
                class="checklist-item"
                :class="{ 'is-active': index === activeIndex }"
                :style="{ '--level-color': HAZARD_LEVEL_COLORS[item.level] }"
                @click="selectItem(item, index)"
            >
                <i class="level-dot"></i>
                <div class="item-text">
                    <p class="item-title">{{ item.title }}</p>
                    <p class="item-detail">{{ item.detail }}</p>
                </div>
                <span class="level-tag">{{ item.level }}</span>
                <el-button class="handle-btn" @click.stop="onHandle">处理</el-button>
            </div>
        </div>
    </basePanelMask>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import basePanelMask from '@/components/basePanel/basePanelMask.vue';
import basePanelTitle from '@/components/basePanel/basePanelTitle.vue';
import baseTabs from '@/components/baseTabs/baseTabs.vue';
import { HAZARD_LEVEL_COLORS } from '../../config';
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
        border: 1px solid rgba(255, 64, 88, 0.35);
        border-radius: base(4px);
        color: #ff5d6e;
        font-size: var(--lxj-font-body);
        line-height: base(21px);
    }
}

.type-tabs {
    flex-shrink: 0;
    height: base(38px);
    padding-top: base(4px);
    border-bottom: 1px solid rgba(0, 150, 220, 0.18);
}

.checklist {
    flex: 1;
    min-height: 0;
    padding-bottom: base(10px);
    overflow-y: auto;
}

.checklist-item {
    display: grid;
    grid-template-columns: base(7px) minmax(0, 1fr) base(42px) base(48px);
    align-items: center;
    gap: base(8px);
    height: base(58px);
    padding: base(7px) base(10px);
    border-bottom: 1px solid rgba(0, 150, 220, 0.12);
    cursor: pointer;

    &.is-active {
        background: var(--color-blue-750);
        border-bottom-color: rgba(0, 200, 255, 0.2);
        border-radius: base(4px);
    }

    .level-dot {
        width: base(7px);
        height: base(7px);
        border-radius: 50%;
        background: var(--level-color);
    }

    .item-text {
        min-width: 0;
    }

    .item-title {
        color: var(--color-blue-50);
        font-size: var(--lxj-font-body);
        font-weight: var(--lxj-font-weight-Semibold);
        line-height: base(21px);
        white-space: nowrap;
    }

    .item-detail {
        color: var(--color-blue-500);
        font-size: var(--lxj-font-body);
        line-height: base(21px);
        white-space: nowrap;
    }

    .level-tag {
        display: flex;
        height: base(25px);
        align-items: center;
        justify-content: center;
        padding: 0 base(6px);
        border: 1px solid var(--level-color);
        border-radius: base(2px);
        color: var(--level-color);
        font-size: var(--lxj-font-body);
        line-height: base(21px);
        white-space: nowrap;
    }

    .handle-btn {
        height: auto;
        padding: base(2px) base(9px);
        font-size: var(--lxj-font-body);
        line-height: base(21px);
        border-radius: base(3px);
        --el-button-bg-color: rgba(0, 200, 255, 0.06);
        --el-button-border-color: rgba(0, 200, 255, 0.3);
        --el-button-text-color: var(--lxj-color-primary);
        --el-button-hover-bg-color: rgba(0, 200, 255, 0.16);
        --el-button-hover-border-color: var(--lxj-color-primary);
        --el-button-hover-text-color: var(--lxj-color-primary);
        --el-button-active-bg-color: rgba(0, 200, 255, 0.2);
        --el-button-active-border-color: var(--lxj-color-primary);
        --el-button-active-text-color: var(--lxj-color-primary);
    }
}
</style>

<template>
    <basePanelMask class="stats-panel">
        <basePanelTitle class="panel-title" title="分区植被统计" />

        <div class="stats-body">
            <div class="total-card">
                <p class="total-number">
                    <span class="number">{{ TOTAL_AREA.value }}</span>
                    <span class="unit">{{ TOTAL_AREA.unit }}</span>
                </p>
                <span class="total-label">{{ TOTAL_AREA.label }}</span>
            </div>

            <div class="level-cards">
                <div
                    v-for="level in LEVELS"
                    :key="level.label"
                    class="level-card"
                    :style="{ '--level-color': level.color }"
                >
                    <span class="level-label">{{ level.label }}</span>
                    <p class="level-number">
                        <span class="number">{{ level.value }}</span>
                        <span class="unit">{{ TOTAL_AREA.unit }}</span>
                    </p>
                </div>
            </div>

            <div class="zone-table-wrap">
                <baseTable
                    ref="tableRef"
                    :model-value="ZONE_ROWS"
                    :table-column="ZONE_COLUMNS"
                    variant="table-vegetation-zone"
                    class="zone-table"
                    highlight-current-row
                />
            </div>
        </div>
    </basePanelMask>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { TableInstance } from 'element-plus';
import basePanelMask from '@/components/basePanel/basePanelMask.vue';
import basePanelTitle from '@/components/basePanel/basePanelTitle.vue';
import baseTable from '@/components/baseTable/baseTable.vue';
import { LEVELS, TOTAL_AREA, ZONE_COLUMNS, ZONE_ROWS } from '../config';

/** baseTable 暴露的实例回调（泛型组件无法直接 InstanceType，按 API 结构声明） */
type ZoneTableExposed = {
    callBackInstance: (callback: (table: { value?: TableInstance }) => void) => void;
};

const tableRef = ref<ZoneTableExposed>();

/* 设计稿默认聚焦 B3 行；后续点击行由 el-table current-row 交互接管 */
onMounted(() => {
    tableRef.value?.callBackInstance((table) => {
        table.value?.setCurrentRow(ZONE_ROWS[3]);
    });
});
</script>

<style scoped lang="scss">
.stats-panel {
    /* 设计稿：面板无上下内衬，底部间距由内容区持有 */
    --lxj-panel-space-y: #{base(6px)};
    --lxj-space-panel: #{base(10px)};

    /* 溢出链同监控视频：标题固定，内容区收缩并滚动 */
    display: flex;
    min-height: 0;
    flex-direction: column;

    .panel-title {
        flex-shrink: 0;
        margin: base(2px) 0 base(8px);
        border-bottom: 1px solid rgba(0, 150, 220, 0.18);
    }
}

.stats-body {
    display: flex;
    flex: 1;
    min-height: 0;
    flex-direction: column;
    gap: base(4px);
    padding-bottom: base(10px);
}

.total-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: base(55px);
    padding: base(10px);
    background: var(--lxj-bg-card);
    border: 1px solid var(--lxj-color-border-primary-light);
    border-radius: base(4px);

    .total-number {
        display: flex;
        align-items: baseline;
        gap: base(7px);

        .number {
            color: var(--color-white);
            font-size: font(26px);
            font-weight: var(--lxj-font-weight-Semibold);
            line-height: 1.5;
        }

        .unit {
            color: var(--color-blue-500);
            font-size: var(--lxj-font-body);
        }
    }

    .total-label {
        color: var(--color-white);
        font-size: var(--lxj-font-body);
    }
}

.level-cards {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    padding: base(10px);
    background: var(--lxj-bg-card);
    border: 1px solid var(--lxj-color-border-primary-light);
    border-radius: base(4px);
}

.level-card {
    display: flex;
    flex-direction: column;
    height: base(58px);
    padding: base(6px) base(7px);
    background: rgba(255, 255, 255, 0.02);
    border-left: base(2px) solid var(--level-color);

    .level-label {
        color: var(--level-color);
        font-size: var(--lxj-font-body);
        line-height: base(21px);
    }

    .level-number {
        display: flex;
        align-items: baseline;
        gap: base(3px);
        white-space: nowrap;

        .number {
            color: var(--level-color);
            font-size: font(17px);
            font-weight: var(--lxj-font-weight-Semibold);
            line-height: 1.5;
        }

        .unit {
            color: var(--color-blue-500);
            font-size: var(--lxj-font-body);
        }
    }
}

.zone-table-wrap {
    display: flex;
    flex: 1;
    min-height: 0;
    flex-direction: column;
    padding: base(10px);
    background: var(--lxj-bg-card);
    border: 1px solid var(--lxj-color-border-primary-light);
    border-radius: base(4px);
}

/* 表格占满卡片剩余高度,表体在表格内部滚动（表头固定） */
.zone-table {
    flex: 1;
    min-height: 0;
}
</style>

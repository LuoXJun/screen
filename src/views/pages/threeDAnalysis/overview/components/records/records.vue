<template>
    <basePanelMask class="records" collapsible>
        <div class="record-type">
            <p>
                当前预警数量
                <span>{{ pageInfo.total }}</span>
                条
            </p>
            <alarmTypeFilter v-model="selectedTypes" :types="ALARM_TYPES" />
        </div>
        <basePanelCard class="panel-card">
            <basePanelTitle class="panel-title" title="预警记录列表" />
            <baseTable
                v-model="tableData"
                class="record-table"
                :table-column="TABLE_COLUMNS"
                :page-info="pageInfo"
                variant="table-screen"
                @operation="onOperation"
            >
                <template #alarmNo="{ scope }">
                    <span class="cell-link">{{ scope.row.alarmNo }}</span>
                </template>
                <template #level="{ scope }">
                    <el-tag class="cell-tag" :class="LEVEL_MAP[scope.row.level].className">
                        {{ LEVEL_MAP[scope.row.level].label }}
                    </el-tag>
                </template>
                <template #status="{ scope }">
                    <span class="cell-status" :class="STATUS_MAP[scope.row.status].className">
                        {{ STATUS_MAP[scope.row.status].label }}
                    </span>
                </template>
            </baseTable>
        </basePanelCard>
        <basePagination
            v-model="pageInfo"
            variant="pagination-screen"
            @handle-change="getPage"
        ></basePagination>
    </basePanelMask>
</template>

<script setup lang="ts">
import basePanelMask from '@/components/basePanel/basePanelMask.vue';
import basePanelCard from '@/components/basePanel/basePanelCard.vue';
import basePanelTitle from '@/components/basePanel/basePanelTitle.vue';
import baseTable from '@/components/baseTable/baseTable.vue';
import basePagination from '@/components/base-pagination/base-pagination.vue';
import alarmTypeFilter from './alarmTypeFilter.vue';
import { usePageTable } from '@/hooks/usePageTable';
import {
    ALARM_TYPES,
    LEVEL_MAP,
    RECORD_LIST,
    STATUS_MAP,
    TABLE_COLUMNS,
    type AlarmRecord
} from './records.config';

/** 预警类型筛选，多选（空数组 = 全部；筛选参数接入后由 fetchFn 消费） */
const selectedTypes = ref<string[]>([]);

/**
 * 表格 + 分页组合：fetchFn 按入参 pageInfo 取当前页，
 * 分页组件翻页/改页容量后触发 getPage 重新取数
 */
const { pageInfo, tableData, getPage, resetPage } = usePageTable<AlarmRecord>(async (page) => {
    /* 模拟分页请求（等接口接入后替换为真实请求；类型筛选参数：selectedTypes.value） */
    const start = (page.pageNum - 1) * page.pageSize;
    return {
        records: RECORD_LIST.slice(start, start + page.pageSize),
        // total: RECORD_LIST.length
        total: 1000
    };
});

/** 筛选变化 → 回首页重新查询 */
watch(selectedTypes, () => {
    resetPage();
});

/** 操作列：详情 / 处置流程（待设计确认后接入业务） */
function onOperation(): void {
    /* 处置流程待接入 */
}
</script>

<style scoped lang="scss">
.records {
    width: 98%;
    position: absolute;
    bottom: 0;
    left: 0;
    margin: 0 1%;
    .record-type {
        display: flex;
        align-items: center;
        gap: base(8px); /* 设计稿:文案与首项间距 8px */
        margin-bottom: base(8px);
        > p {
            color: var(--lxj-color-text-primary);
            span {
                color: var(--lxj-color-primary);
                font-weight: var(--lxj-font-weight-Semibold); /* 设计稿计数 Semibold */
            }
        }
    }
    .panel-card {
        padding: base(8px) 0;
        .panel-title {
            margin-left: base(12px);
            margin-bottom: base(4px);
        }
    }
}
</style>

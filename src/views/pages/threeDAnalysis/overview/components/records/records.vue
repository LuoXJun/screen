<template>
    <basePanelMask class="records">
        <div class="record-type">
            <p>
                当前预警记录
                <span>9</span>
                条
            </p>
            <el-button v-for="it in 4" :key="it" class="button-card">
                <span>{{ it + 1 }}</span>
                温度异常
            </el-button>
        </div>
        <basePanelCard class="panel-card">
            <basePanelTitle class="panel-title" title="预警记录列表" />
            <baseTable
                v-model="recordList"
                class="record-table"
                :table-column="TABLE_COLUMNS"
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
    </basePanelMask>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import basePanelMask from '@/components/basePanel/basePanelMask.vue';
import basePanelCard from '@/components/basePanel/basePanelCard.vue';
import basePanelTitle from '@/components/basePanel/basePanelTitle.vue';
import baseTable from '@/components/baseTable/baseTable.vue';
import {
    LEVEL_MAP,
    RECORD_LIST,
    STATUS_MAP,
    TABLE_COLUMNS,
    type AlarmRecord
} from './records.config';

const recordList = ref<AlarmRecord[]>(RECORD_LIST);

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
        gap: base(4px);
        margin-bottom: base(4px);
        > p {
            color: var(--lxj-color-text-primary);
            span {
                color: var(--lxj-color-primary);
            }
        }
        .el-button {
            span {
                color: var(--lxj-color-warning);
                margin-right: base(4px);
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

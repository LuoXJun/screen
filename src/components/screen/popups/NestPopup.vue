<template>
    <baseDialog
        :model-value="true"
        title="无人机巢"
        icon="dialog-icon-monitor.svg"
        :buttons="BUTTONS"
        @close="emits('close')"
    >
        <template #header-extra>
            <DeviceStatusTag :status="data.status" />
        </template>
        <div class="nestPopup">
            <DeviceInfo :items="infoItems" />
            <!-- 设备状态六宫格 -->
            <div class="status-grid">
                <div v-for="cell in statusCells" :key="cell.label" class="status-cell">
                    <p class="cell-label">{{ cell.label }}</p>
                    <div class="cell-value">
                        <i v-if="cell.dot" class="cell-dot" :class="`is-${cell.dot}`"></i>
                        <span class="cell-text" :class="cell.valueClass">{{ cell.value }}</span>
                        <span v-if="cell.suffix" class="cell-suffix">{{ cell.suffix }}</span>
                    </div>
                </div>
            </div>
            <!-- 当前任务进度 -->
            <div class="task-bar">
                <div class="task-head">
                    <p class="task-title">
                        当前任务
                        <span class="task-no">{{ data.taskNo }}</span>
                        · {{ data.taskStatus }}
                    </p>
                    <span class="task-percent">{{ data.taskProgress }}%</span>
                </div>
                <div class="task-track">
                    <i class="task-fill" :style="{ width: `${data.taskProgress}%` }"></i>
                </div>
            </div>
        </div>
    </baseDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import baseDialog from '@/components/baseDialog/baseDialog.vue';
import type { BaseDialogButton } from '@/components/baseDialog/baseDialog';
import DeviceInfo from './DeviceInfo.vue';
import DeviceStatusTag from './DeviceStatusTag.vue';
import type { DeviceInfoItem } from './DeviceInfo';
import type { NestData } from './NestPopup';

/** 状态单元格 */
interface StatusCell {
    label: string;
    value: string;
    /** 状态圆点：alert=红（大点）/ success=绿（小点） */
    dot?: 'alert' | 'success';
    /** 值后缀（小字,如「适飞」） */
    suffix?: string;
    valueClass?: string;
}

const props = defineProps<{
    /** 机巢信息与状态 */
    data: NestData;
}>();

const emits = defineEmits(['close']);

/** 底部操作按钮（设计稿取值） */
const BUTTONS: BaseDialogButton[] = [{ label: '机巢详情' }, { label: '查看任务' }];

const infoItems = computed<DeviceInfoItem[]>(() => [
    { icon: 'id', label: '机巢编号', value: props.data.no },
    { icon: 'location', label: '安装位置', value: props.data.location },
    { icon: 'date', label: '投运日期', value: props.data.installDate },
    {
        icon: 'status',
        label: '当前状态',
        value: props.data.status === 'online' ? '·在线' : '·离线',
        valueClass: `is-${props.data.status}`
    }
]);

const statusCells = computed<StatusCell[]>(() => [
    {
        label: '舱门状态',
        value: props.data.door,
        dot: props.data.doorAlert ? 'alert' : undefined
    },
    { label: '充电状态', value: props.data.charge },
    { label: '环境温湿度', value: props.data.env },
    { label: '气象站', value: props.data.weather, suffix: props.data.weatherTag },
    {
        label: '网络状态',
        value: props.data.network === 'online' ? '在线' : '离线',
        dot: 'success',
        valueClass: props.data.network === 'online' ? 'is-online' : 'is-offline'
    },
    { label: '舱内无人机', value: props.data.drone }
]);
</script>

<style scoped lang="scss">
.nestPopup {
    .status-grid {
        /* 弹性三列：内容超长时换行(整格或格内文本),不截断 */
        display: flex;
        flex-wrap: wrap;
        gap: base(10px);
        margin-top: base(10px);

        .status-cell {
            display: flex;
            flex-direction: column;
            flex: 1 1 30%;
            min-height: base(80px);
            padding: base(12px);
            /* 设计稿取值:浅青底 + 微描边 */
            background: rgba(0, 200, 255, 0.05);
            border: 1px solid rgba(0, 200, 255, 0.12);
            border-radius: base(5px);
            box-sizing: border-box;

            .cell-label {
                margin: 0;
                color: #4a7a9b;
                font-size: font(16px);
            }

            .cell-value {
                display: flex;
                align-items: center;
                gap: base(7px);
                margin-top: auto;

                .cell-dot {
                    flex-shrink: 0;
                    border-radius: var(--radius-half);

                    /* 设计稿取值:舱门红点(大)/网络绿点(小) */
                    &.is-alert {
                        width: base(9px);
                        height: base(9px);
                        background: #e03030;
                    }

                    &.is-success {
                        width: base(6px);
                        height: base(6px);
                        background: #37f2a8;
                    }
                }

                .cell-text {
                    min-width: 0;
                    color: #e8f4ff;
                    font-size: font(17px);
                    font-weight: var(--lxj-font-weight-Semibold);
                    overflow-wrap: anywhere;

                    &.is-online {
                        color: #37f2a8;
                        font-weight: var(--font-weight-400);
                    }

                    &.is-offline {
                        color: #e03030;
                        font-weight: var(--font-weight-400);
                    }
                }

                .cell-suffix {
                    margin-left: base(4px);
                    color: #e8f4ff;
                    font-size: font(12px);
                    font-weight: var(--font-weight-400);
                }
            }
        }
    }

    .task-bar {
        margin-top: base(50px);
        padding: base(14px) base(18px);
        border-top: 1px solid rgba(0, 200, 255, 0.1);
        border-bottom: 1px solid rgba(0, 200, 255, 0.1);

        .task-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .task-title {
            margin: 0;
            color: #4a7a9b;
            font-size: font(16px);

            .task-no {
                color: var(--color-cyan-400);
            }
        }

        .task-percent {
            color: var(--color-cyan-400);
            font-size: font(16px);
            font-weight: var(--lxj-font-weight-Semibold);
        }

        .task-track {
            height: base(7px);
            margin-top: base(9px);
            background: rgba(255, 255, 255, 0.08);
            border-radius: base(3.5px);
            overflow: hidden;

            .task-fill {
                display: block;
                height: 100%;
                /* 设计稿取值:蓝→青渐变 + 发光 */
                background: linear-gradient(90deg, #0060ff 0%, #00c8ff 100%);
                border-radius: base(3.5px);
                box-shadow: 0 0 base(9px) rgba(0, 200, 255, 0.5);
            }
        }
    }
}
</style>

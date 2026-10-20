<template>
    <baseDialog
        :model-value="true"
        title="光纤测温"
        icon="dialog-icon-monitor.svg"
        :buttons="BUTTONS"
        @close="emits('close')"
    >
        <template #header-extra>
            <DeviceStatusTag :status="data.status" />
        </template>
        <div class="fiberPopup">
            <DeviceInfo :items="infoItems" />
            <!-- 温度读数卡 -->
            <div class="temp-card">
                <div class="temp-head">
                    <p class="temp-value" :class="`is-${data.tempStatus}`">
                        {{ data.temperature }}
                        <span class="temp-unit">°C</span>
                    </p>
                    <span class="temp-tag" :class="`is-${data.tempStatus}`">
                        {{ TEMP_STATUS_TEXT[data.tempStatus] }}
                    </span>
                </div>
                <p class="temp-threshold">{{ data.thresholdText }}</p>
            </div>
            <!-- 趋势折线卡 -->
            <div class="trend-card">
                <BaseChart ref="trendChartRef" :option="trendOption" />
            </div>
        </div>
    </baseDialog>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import baseDialog from '@/components/baseDialog/baseDialog.vue';
import BaseChart from '@/components/baseChart/BaseChart.vue';
import type { BaseDialogButton } from '@/components/baseDialog/baseDialog';
import DeviceInfo from '../device/DeviceInfo.vue';
import DeviceStatusTag from '../device/DeviceStatusTag.vue';
import type { DeviceInfoItem } from '../device/DeviceInfo';
import { buildFiberTrendOption } from './fiberTrend.config';
import type { FiberData, FiberTempStatus } from './FiberPopup';

const props = defineProps<{
    /** 装置信息与读数/趋势 */
    data: FiberData;
}>();

const emits = defineEmits(['close']);

/** 温度状态文案（配色见下方 .temp-value/.temp-tag 修饰类） */
const TEMP_STATUS_TEXT: Record<FiberTempStatus, string> = {
    normal: '正常',
    warning: '预警',
    overheat: '超温'
};

/** 底部操作按钮（设计稿:仅查看详情） */
const BUTTONS: BaseDialogButton[] = [{ label: '查看详情' }];

const infoItems = computed<DeviceInfoItem[]>(() => [
    { icon: 'id', label: '装置编号', value: props.data.no },
    { icon: 'model', label: '厂商型号', value: props.data.model },
    { icon: 'location', label: '安装位置', value: props.data.location },
    { icon: 'date', label: '投运日期', value: props.data.installDate },
    {
        icon: 'status',
        label: '历史最低',
        value: props.data.historyMin,
        valueClass: 'is-online'
    }
]);

/** 趋势折线（弹窗打开时按当前屏基准构建） */
const trendOption = buildFiberTrendOption(props.data.trendDates, props.data.trendValues);

const trendChartRef = ref<InstanceType<typeof BaseChart> | null>(null);

/**
 * 窗口尺寸变化:option 内的字号为裸像素,须按新基准重建
 *（BaseChart 的 ResizeObserver 只重绘画布尺寸,不会更新字号）
 */
let resizeTimer: number | undefined;

function onResize(): void {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
        trendChartRef.value?.setOption(
            buildFiberTrendOption(props.data.trendDates, props.data.trendValues),
            true
        );
    }, 200);
}

onMounted(() => window.addEventListener('resize', onResize));

onBeforeUnmount(() => {
    window.clearTimeout(resizeTimer);
    window.removeEventListener('resize', onResize);
});
</script>

<style scoped lang="scss">
.fiberPopup {
    .temp-card,
    .trend-card {
        margin-top: base(10px);
        padding: base(12px);
        background: color-mix(in srgb, var(--lxj-color-primary) 5%, transparent);
        border: 1px solid var(--lxj-color-border-divider-soft);
        border-radius: base(5px);
    }

    .temp-card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: base(102px);
        box-sizing: border-box;

        .temp-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .temp-value {
            display: flex;
            align-items: baseline;
            margin: 0;
            font-size: font(30px);
            font-weight: var(--lxj-font-weight-Semibold);

            &.is-normal {
                color: var(--lxj-color-status-online);
            }

            &.is-warning {
                color: var(--lxj-color-accent-orange);
            }

            &.is-overheat {
                color: var(--lxj-color-status-offline);
            }

            .temp-unit {
                margin-left: base(4px);
                color: var(--lxj-color-text-primary);
                font-size: font(18px);
                font-weight: var(--lxj-font-weight);
            }
        }

        .temp-tag {
            display: inline-flex;
            align-items: center;
            height: base(29px);
            padding: 0 base(10px);
            border-radius: base(5px);
            font-size: font(16px);

            &.is-normal {
                color: var(--lxj-color-status-online);
                background: color-mix(
                    in srgb,
                    var(--lxj-color-status-online) 15%,
                    transparent
                );
                border: 1px solid
                    color-mix(in srgb, var(--lxj-color-status-online) 40%, transparent);
            }

            &.is-warning {
                color: var(--lxj-color-accent-orange);
                background: color-mix(
                    in srgb,
                    var(--lxj-color-accent-orange) 15%,
                    transparent
                );
                border: 1px solid
                    color-mix(in srgb, var(--lxj-color-accent-orange) 40%, transparent);
            }

            &.is-overheat {
                color: var(--lxj-color-status-offline);
                background: color-mix(
                    in srgb,
                    var(--lxj-color-status-offline) 15%,
                    transparent
                );
                border: 1px solid
                    color-mix(in srgb, var(--lxj-color-status-offline) 40%, transparent);
            }
        }

        .temp-threshold {
            margin: base(6px) 0 0;
            color: var(--lxj-color-text-secondary);
            font-size: font(16px);
        }
    }

    .trend-card {
        height: base(204px);
    }
}
</style>

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
                        {{ data.temperature }}<span class="temp-unit">°C</span>
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
import DeviceInfo from './DeviceInfo.vue';
import DeviceStatusTag from './DeviceStatusTag.vue';
import type { DeviceInfoItem } from './DeviceInfo';
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
        /* 设计稿取值:浅青底 + 微描边 */
        margin-top: base(10px);
        padding: base(12px);
        background: rgba(0, 200, 255, 0.05);
        border: 1px solid rgba(0, 200, 255, 0.12);
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

            /* 设计稿取值:正常绿/预警橙/超温红 */
            &.is-normal {
                color: #37f2a8;
            }

            &.is-warning {
                color: #f5a623;
            }

            &.is-overheat {
                color: #e03030;
            }

            .temp-unit {
                margin-left: base(4px);
                color: var(--color-blue-300);
                font-size: font(18px);
                font-weight: var(--font-weight-400);
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
                color: #37f2a8;
                background: rgba(55, 242, 168, 0.15);
                border: 1px solid rgba(55, 242, 168, 0.4);
            }

            &.is-warning {
                color: #f5a623;
                background: rgba(245, 166, 35, 0.15);
                border: 1px solid rgba(245, 166, 35, 0.4);
            }

            &.is-overheat {
                color: #e03030;
                background: rgba(224, 48, 48, 0.15);
                border: 1px solid rgba(224, 48, 48, 0.4);
            }
        }

        .temp-threshold {
            margin: base(6px) 0 0;
            color: #4a7a9b;
            font-size: font(16px);
        }
    }

    .trend-card {
        height: base(204px);
    }
}
</style>

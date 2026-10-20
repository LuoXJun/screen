<template>
    <asidePanel class="detail-panel" title="箱变温度详情">
        <template #extra>
            <tempStatusTag :status="device.status" />
        </template>

        <div class="detail-body">
            <basePanelCard class="info-card">
                <div class="info-head">
                    <span class="device-name">{{ device.name }}</span>
                    <span class="device-zone">
                        <i class="zone-diamond">◆</i>
                        {{ device.zone }}
                    </span>
                </div>
                <div class="info-meta">
                    <span>· {{ detail.deviceNo }}</span>
                    <span>更新于 {{ detail.updatedAt }}</span>
                </div>
            </basePanelCard>

            <tempPointGrid
                :points="detail.points"
                :selected-id="selectedPointId"
                @select="onSelectPoint"
            />
            <historyChart
                :status="selectedPoint.status"
                :values="historyValues"
                :note="historyNote"
                :warn-threshold="warnThreshold"
                :alert-threshold="alertThreshold"
            />
            <historyExtremes :records="extremes" @edit-threshold="thresholdVisible = true" />
        </div>
    </asidePanel>

    <thresholdDialog
        v-model="thresholdVisible"
        :warn="warnThreshold"
        :alert="alertThreshold"
        @save="onSaveThresholds"
    />
</template>

<script setup lang="ts">
import basePanelCard from '@/components/basePanel/basePanelCard.vue';
import type { BoxTransformerDevice } from '@/config/devices';
import asidePanel from '../shared/asidePanel.vue';
import tempStatusTag from '../shared/tempStatusTag.vue';
import tempPointGrid from './tempPointGrid.vue';
import historyChart from './historyChart.vue';
import historyExtremes from './historyExtremes.vue';
import thresholdDialog from './thresholdDialog.vue';
import type { TempPointDetail, ThresholdSettings } from '../../detail.config';
import {
    DEFAULT_THRESHOLDS,
    buildPointExtremes,
    buildPointHistory,
    getBoxDetail,
    pointHistoryNote
} from '../../detail.config';

const props = defineProps<{
    /** 当前选中的箱变（列表/地图联动同一来源） */
    device: BoxTransformerDevice;
}>();

const detail = computed(() => getBoxDetail(props.device.id));

const selectedPointId = ref('');

/* 切换箱变时重置到第一路，避免沿用上一台的选中路 */
watch(
    () => props.device.id,
    () => {
        selectedPointId.value = detail.value.points[0]?.id ?? '';
    },
    { immediate: true }
);

const selectedPoint = computed<TempPointDetail>(() => {
    return (
        detail.value.points.find((point) => point.id === selectedPointId.value) ??
        detail.value.points[0] ?? {
            id: '',
            name: '',
            channel: '',
            base: 0,
            status: 'normal'
        }
    );
});

/** 箱变序号 × 10 + 路序：同一路在不同箱变下的历史/极值不同 */
const pointSeed = computed(() => {
    const boxNo = Number(props.device.id.replace(/\D/g, '')) || 1;
    const pointIndex = detail.value.points.findIndex(
        (point) => point.id === selectedPoint.value.id
    );
    return boxNo * 10 + Math.max(pointIndex, 0);
});

const historyValues = computed(() => buildPointHistory(selectedPoint.value.base, pointSeed.value));
const historyNote = computed(() => pointHistoryNote(selectedPoint.value));
const extremes = computed(() => buildPointExtremes(selectedPoint.value.base, pointSeed.value));

/* 阈值设置（页面内共享，保存后驱动曲线阈值线） */
const warnThreshold = ref(DEFAULT_THRESHOLDS.warn);
const alertThreshold = ref(DEFAULT_THRESHOLDS.alert);
const thresholdVisible = ref(false);

function onSaveThresholds(settings: ThresholdSettings): void {
    warnThreshold.value = settings.warn;
    alertThreshold.value = settings.alert;
}

function onSelectPoint(point: TempPointDetail): void {
    selectedPointId.value = point.id;
}
</script>

<style scoped lang="scss">
/* 贴合内容高度；视口不足时收缩，内容区内部滚动 */
.detail-panel {
    flex: 0 1 auto;
    min-height: 0;
}

.detail-body {
    display: flex;
    flex: 1;
    min-height: 0;
    flex-direction: column;
    gap: base(10px);
    overflow-y: auto;

    /* basePanelCard 默认 4px 内衬；设计稿信息卡为 10px + 4px 圆角 */
    .info-card {
        flex-shrink: 0;
        padding: base(10px);
        border-radius: var(--lxj-radius-small);
    }
}

.info-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: base(8px);

    .device-name {
        color: var(--lxj-color-text-soft);
        font-size: font(16px);
        font-weight: var(--lxj-font-weight-Semibold);
        line-height: base(22px);
    }

    .device-zone {
        display: flex;
        align-items: center;
        gap: base(4px);
        color: var(--lxj-color-text-strong);
        font-size: var(--lxj-font-body);
        font-weight: var(--lxj-font-weight-Semibold);
        line-height: base(21px);
    }

    .zone-diamond {
        color: var(--lxj-color-text-secondary);
        font-size: var(--lxj-font-desc);
        font-style: normal;
        line-height: 1;
    }
}

.info-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: base(8px);
    margin-top: base(4px);
    color: var(--lxj-color-text-primary);
    font-size: var(--lxj-font-body);
    line-height: base(20px);
    white-space: nowrap;
}
</style>

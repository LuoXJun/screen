<template>
    <section class="point-section">
        <detailSectionHead title="9路测温点实时温度" note="点击测温点查看历史曲线" />

        <ul class="point-grid">
            <li
                v-for="point in points"
                :key="point.id"
                class="point-card"
                :class="{ 'is-selected': point.id === selectedId }"
                :style="{ '--point-color': TEMP_STATUS_META[point.status].color }"
                @click="emits('select', point)"
            >
                <span class="point-name">{{ point.name }}</span>
                <p class="point-value">{{ displayValue(point) }}</p>
                <span class="point-channel">{{ point.channel }}</span>
            </li>
        </ul>
    </section>
</template>

<script setup lang="ts">
import detailSectionHead from './detailSectionHead.vue';
import type { TempPointDetail } from '../../detail.config';
import { TEMP_STATUS_META } from '../../config';

defineProps<{
    /** 当前箱变的 9 路测温点 */
    points: TempPointDetail[];
    /** 当前选中的测温点（驱动右侧曲线/极值） */
    selectedId: string;
}>();

const emits = defineEmits<{
    select: [point: TempPointDetail];
}>();

/** 离线点位无实时值，历史/极值仍按基准温度展示 */
function displayValue(point: TempPointDetail): string {
    return point.status === 'offline' ? '--' : `${point.base.toFixed(1)}°C`;
}
</script>

<style scoped lang="scss">
.point-section {
    display: flex;
    flex-direction: column;
    gap: base(4px);
}

.point-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: base(3.5px);
}

.point-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: base(84px);
    padding: base(7px) base(5px);
    overflow: hidden;
    cursor: pointer;
    /* 设计稿:状态色 40% 描边 + 双层 270deg 渐变（右亮左暗） */
    border: 1px solid color-mix(in srgb, var(--point-color) 40%, transparent);
    background:
        linear-gradient(
            270deg,
            transparent 0%,
            color-mix(in srgb, var(--point-color) 10%, transparent) 100%
        ),
        linear-gradient(
            270deg,
            color-mix(in srgb, var(--point-color) 4%, transparent) 0%,
            color-mix(in srgb, var(--point-color) 20%, transparent) 100%
        );

    /* 选中态：状态色描边 + 外发光（交互态，设计稿未定义） */
    &.is-selected {
        border-color: var(--point-color);
        box-shadow: 0 0 base(8px) color-mix(in srgb, var(--point-color) 45%, transparent);
    }

    /* 左上角状态色三角（设计稿 8.9px 角标，CSS 复现以跟随三态） */
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: base(9px);
        height: base(9px);
        background: var(--point-color);
        clip-path: polygon(14.3% 17.9%, 0 100%, 0 0, 100% 0);
    }

    .point-name {
        color: var(--lxj-color-text-primary);
        font-size: var(--lxj-font-body);
        line-height: base(20px);
        white-space: nowrap;
    }

    .point-value {
        margin-top: base(6px);
        color: var(--point-color);
        font-size: font(18px);
        font-weight: var(--lxj-font-weight-Semibold);
        line-height: base(25px);
        white-space: nowrap;
    }

    .point-channel {
        color: var(--lxj-color-text-primary);
        font-size: var(--lxj-font-desc);
        line-height: base(17px);
    }
}
</style>

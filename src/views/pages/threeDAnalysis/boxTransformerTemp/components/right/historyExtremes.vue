<template>
    <section class="extreme-section">
        <detailSectionHead title="历史温度极值记录" />

        <div
            v-for="record in records"
            :key="record.type"
            class="extreme-card"
            :class="`is-${record.type}`"
        >
            <i class="extreme-bar"></i>
            <div class="extreme-content">
                <span class="extreme-label">{{ record.label }}</span>
                <div class="extreme-row">
                    <span class="extreme-value">{{ record.value }}</span>
                    <span class="extreme-time">{{ record.time }}</span>
                </div>
            </div>
        </div>

        <el-button class="btn-cyan-ghost threshold-btn" @click="onEditThreshold">
            阈值修改
        </el-button>
    </section>
</template>

<script setup lang="ts">
import detailSectionHead from './detailSectionHead.vue';
import type { ExtremeRecord } from '../../detail.config';

defineProps<{
    /** 当前选中路的历史极值（随点位切换） */
    records: ExtremeRecord[];
}>();

const emits = defineEmits<{
    /** 打开阈值修改弹窗 */
    'edit-threshold': [];
}>();

function onEditThreshold(): void {
    emits('edit-threshold');
}
</script>

<style scoped lang="scss">
.extreme-section {
    display: flex;
    flex-direction: column;
    gap: base(4px);
}

.extreme-card {
    --extreme-color: var(--lxj-color-risk-serious);

    display: flex;
    align-items: center;
    gap: base(11px);
    padding: base(7px) base(10px);
    background: var(--lxj-bg-card);
    border: 1px solid color-mix(in srgb, var(--extreme-color) 35%, transparent);
    border-radius: var(--lxj-radius-small);

    &.is-low {
        --extreme-color: var(--lxj-color-primary);
    }

    .extreme-bar {
        width: base(3px);
        height: base(42px);
        border-radius: base(2px);
        flex-shrink: 0;
        background: var(--extreme-color);
    }

    .extreme-content {
        flex: 1;
        min-width: 0;
    }

    .extreme-label {
        display: block;
        color: var(--lxj-color-text-soft);
        font-size: var(--lxj-font-body);
        line-height: base(20px);
    }

    .extreme-row {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: base(8px);
    }

    .extreme-value {
        color: var(--extreme-color);
        font-size: font(22px);
        font-weight: var(--lxj-font-weight-Semibold);
        line-height: base(31px);
        white-space: nowrap;
    }

    .extreme-time {
        color: var(--lxj-color-text-primary);
        font-size: var(--lxj-font-body);
        line-height: base(21px);
        white-space: nowrap;
    }
}

/* 设计稿：全宽青底描边按钮（复用变体类，仅覆盖底色/文字档位） */
.threshold-btn {
    width: 100%;
    height: base(31px);
    --el-button-bg-color: color-mix(in srgb, var(--lxj-color-primary) 6%, transparent);
    --el-button-text-color: var(--lxj-color-text-primary);
}
</style>

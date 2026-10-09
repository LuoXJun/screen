<template>
    <div class="cameraStats">
        <div v-for="(row, i) in rows" :key="i" class="stats-row">
            <template v-for="(cell, j) in row" :key="cell.label">
                <i v-if="j > 0" class="stats-divider"></i>
                <div class="stats-cell">
                    <p class="cell-label">{{ cell.label }}</p>
                    <p class="cell-value">
                        <span class="cell-num">{{ cell.value }}</span>
                        <span class="cell-unit">{{ cell.unit }}</span>
                    </p>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { CameraStatCell } from './cameraList.config';

defineProps<{
    /** 统计行（每行若干格,渲染时格间加渐变竖线） */
    rows: CameraStatCell[][];
}>();
</script>

<style scoped lang="scss">
.cameraStats {
    display: flex;
    flex-direction: column;
    gap: base(6px);

    .stats-row {
        display: flex;
        align-items: center;
        gap: base(6px);
        padding: base(6px) 0;
        /* 设计稿取值:深蓝渐变卡(同 baseCardList 底色) */
        background:
            linear-gradient(270deg, rgba(16, 48, 84, 0) 0%, #103054 100%),
            linear-gradient(270deg, rgba(9, 29, 53, 0.2) 0%, #091d35 100%);
        border: 1px solid #395170;
    }

    /* 渐变竖线分隔（透明白 → 白 → 透明） */
    .stats-divider {
        flex-shrink: 0;
        width: 1px;
        height: base(30px);
        background: linear-gradient(
            180deg,
            rgb(255 255 255 / 0) 0%,
            rgb(255 255 255 / 78%) 56.25%,
            rgb(255 255 255 / 0) 100%
        );
    }

    .stats-cell {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: center;
        gap: base(4px);

        .cell-label {
            margin: 0;
            color: #dce9f7;
            font-size: var(--lxj-font-desc);
            font-weight: var(--lxj-font-weight-Medium);
            white-space: nowrap;
        }

        .cell-value {
            display: flex;
            align-items: flex-end;
            gap: base(4px);
            margin: 0;

            /* 双层渐变数字:垂直白渐隐 + 水平主色(与隐患占比数字同源) */
            .cell-num {
                background-image:
                    linear-gradient(180deg, rgb(254 255 245) 23.5%, rgb(254 255 245 / 0) 58.77%),
                    linear-gradient(90deg, #00feed 0%, #00feed 100%);
                background-clip: text;
                -webkit-background-clip: text;
                color: transparent;
                font-family: var(--lxj-font-family-num);
                font-size: font(15px);
                letter-spacing: base(1.3px);
                line-height: 1;
            }

            .cell-unit {
                color: rgb(255 255 255 / 50%);
                font-size: font(10px);
                letter-spacing: base(1px);
                line-height: base(14px);
            }
        }
    }
}
</style>

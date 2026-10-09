<template>
    <div class="alarmStats">
        <template v-for="(stat, i) in ALARM_STATS" :key="stat.key">
            <i v-if="i > 0" class="stats-divider"></i>
            <div class="stats-cell">
                <p class="cell-label">
                    <img class="cell-icon" :src="getImageWidthName(stat.icon)" alt="" />
                    {{ stat.label }}
                </p>
                <p class="cell-value">
                    <span class="cell-num" :style="{ color: stat.color }">{{ stat.value }}</span>
                    <span class="cell-unit">条</span>
                </p>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { getImageWidthName } from '@/utils/getAssets';
import { ALARM_STATS } from './alarmCenter.config';
</script>

<style scoped lang="scss">
.alarmStats {
    display: flex;
    align-items: center;
    padding: base(12px);
    /* 设计稿取值:深蓝半透明底 + 微青描边 */
    background: rgba(13, 36, 88, 0.4);
    border: 1px solid rgba(0, 200, 255, 0.3);
    border-radius: base(4px);

    .stats-divider {
        flex-shrink: 0;
        width: base(1px);
        height: base(36px);
        background: url('@/assets/images/alarm-stat-divider.svg') no-repeat center / 100% 100%;
    }

    .stats-cell {
        display: flex;
        flex: 1;
        min-width: 0;
        flex-direction: column;
        align-items: center;
        gap: base(4px);

        .cell-label {
            display: flex;
            align-items: center;
            gap: base(3px);
            margin: 0;
            color: var(--color-white);
            font-size: var(--lxj-font-desc);
            line-height: 1;

            .cell-icon {
                width: base(16px);
                height: base(16px);
            }
        }

        .cell-value {
            display: flex;
            align-items: baseline;
            gap: base(2px);
            margin: 0;

            /* 数字字体设计稿为 TCloud_Number,以 D-DIN 承接 */
            .cell-num {
                font-family: var(--lxj-font-family-num);
                font-size: font(15px);
                letter-spacing: base(1.27px);
                line-height: base(22px);
            }

            .cell-unit {
                color: #aacdf3;
                font-size: font(9px);
                font-weight: var(--lxj-font-weight-Medium);
            }
        }
    }
}
</style>

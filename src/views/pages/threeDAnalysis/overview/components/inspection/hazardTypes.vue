<template>
    <div class="hazardTypes">
        <template v-for="(group, gi) in HAZARD_GROUPS" :key="group.name">
            <div class="group-head">
                <img class="ellipse-a" :src="ellipseA" alt="" />
                <img class="ellipse-b" :src="ellipseB" alt="" />
                <img class="group-dot" :src="groupDot" alt="" />
                <span class="group-name">{{ group.name }}</span>
                <p class="group-total">
                    <span class="total-num">{{ group.total }}</span>
                    <span class="total-unit">处</span>
                </p>
            </div>
            <div v-for="(item, ii) in group.items" :key="item.name" class="hazard-item">
                <div class="item-row">
                    <span class="item-name">{{ item.name }}</span>
                    <span class="item-value">{{ item.value }}</span>
                </div>
                <div class="item-bar">
                    <i
                        class="bar-fill"
                        :class="`tone-${item.tone}`"
                        :style="{ width: barWidths[gi][ii] }"
                    >
                        <img class="bar-dot" :src="barDots[item.tone]" alt="" />
                    </i>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getImageWidthName } from '@/utils/getAssets';
import { HAZARD_GROUPS, type HazardTone } from './inspection.config';

/** 组件内置资产（经 getAssets 解析，同项目图片引用约定） */
const ellipseA = getImageWidthName('group-ellipse-a.svg');
const ellipseB = getImageWidthName('group-ellipse-b.svg');
const groupDot = getImageWidthName('group-dot.svg');

/** 条长 = 本项占分组总数的比例（各条独立,均自左端起） */
const barWidths = computed(() =>
    HAZARD_GROUPS.map((group) =>
        group.items.map((item) => `${((item.value / group.total) * 100).toFixed(2)}%`)
    )
);

/** 条末端圆点（按样式组取色） */
const barDots: Record<HazardTone, string> = {
    blue: getImageWidthName('bar-dot-blue.svg'),
    cyan: getImageWidthName('bar-dot-cyan.svg'),
    purple: getImageWidthName('bar-dot-purple.svg'),
    orange: getImageWidthName('bar-dot-orange.svg')
};
</script>

<style scoped lang="scss">
.hazardTypes {
    display: flex;
    flex-direction: column;
    gap: base(11px);
    width: 100%;

    .group-head {
        position: relative;
        display: flex;
        align-items: center;
        height: base(26px);
        border-bottom: 1px solid #19618e;
        overflow: hidden;

        /* 光晕装饰:两枚模糊椭圆错位叠加(中心偏移为设计稿定值) */
        .ellipse-a {
            position: absolute;
            left: 50%;
            top: 50%;
            width: base(208.2px);
            height: base(164.2px);
            transform: translate(calc(-50% + #{base(16.5px)}), -50%);
            pointer-events: none;
        }

        .ellipse-b {
            position: absolute;
            left: 50%;
            top: 50%;
            width: base(98.4px);
            height: base(122.4px);
            transform: translate(calc(-50% - #{base(17.5px)}), -50%);
            pointer-events: none;
        }

        .group-dot {
            width: base(10px);
            height: base(10px);
            margin-left: base(8px);
        }

        .group-name {
            margin-left: base(6px);
            color: #b3cdeb;
            font-size: var(--lxj-font-body);
        }

        .group-total {
            display: flex;
            align-items: baseline;
            margin: 0 0 0 auto;

            /* 双层渐变数字:垂直白渐隐 + 水平主色,背景裁剪到文字 */
            .total-num {
                background-image:
                    linear-gradient(180deg, rgb(254 255 245) 23.5%, rgb(254 255 245 / 0) 58.77%),
                    linear-gradient(90deg, #00feed 0%, #00feed 100%);
                background-clip: text;
                -webkit-background-clip: text;
                color: transparent;
                font-family: var(--lxj-font-family-num);
                font-size: var(--lxj-font-section);
                letter-spacing: base(1.3px);
                line-height: base(20px);
            }

            .total-unit {
                color: #aacdf3;
                font-family: var(--lxj-font-family);
                font-size: font(9px);
                font-weight: var(--lxj-font-weight-Medium);
            }
        }
    }

    .hazard-item {
        display: flex;
        flex-direction: column;
        gap: base(1px);

        .item-row {
            display: flex;
            align-items: baseline;
            justify-content: space-between;

            .item-name {
                color: #a4b6cc;
                font-size: font(13px);
            }

            .item-value {
                background-image:
                    linear-gradient(180deg, rgb(254 255 245) 23.5%, rgb(254 255 245 / 0) 58.77%),
                    linear-gradient(90deg, #a3d0fe 0%, #a3d0fe 100%);
                background-clip: text;
                -webkit-background-clip: text;
                color: transparent;
                font-family: var(--lxj-font-family-num);
                font-size: var(--lxj-font-body);
            }
        }

        .item-bar {
            position: relative;
            height: base(4px);
            background: #172a42;

            /* 条长由行内样式按 value/total 给出 */
            .bar-fill {
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;

                /* 末端圆点:中心压住条的终点;z-index 防止被相邻后段盖住 */
                .bar-dot {
                    position: absolute;
                    right: base(-8px);
                    top: 50%;
                    width: base(16px);
                    height: base(16px);
                    transform: translateY(-50%);
                    z-index: 1;
                }

                /* 配色组:渐变取自设计稿 */
                &.tone-blue {
                    background: linear-gradient(to right, rgb(1 87 139 / 30%), #0296f1);
                }

                &.tone-cyan {
                    background: linear-gradient(to right, rgb(1 135 139 / 30%), #02eaf1);
                }

                &.tone-purple {
                    background: linear-gradient(to right, rgb(97 82 194 / 30%), #b5a9ff);
                }

                &.tone-orange {
                    background: linear-gradient(to right, rgb(196 135 2 / 30%), #ffb81e);
                }
            }
        }
    }
}
</style>

<template>
    <div class="baseStatList" :class="variant ? `is-${variant}` : ''">
        <div v-for="(row, ri) in groups" :key="ri" class="stat-row">
            <template v-for="(item, i) in row" :key="item.label">
                <div class="baseStatListItem">
                    <div class="head">
                        <img v-if="item.icon" class="icon" :src="getImageWidthName(item.icon)" alt="" />
                        <span class="label">{{ item.label }}</span>
                    </div>
                    <div class="body">
                        <p
                            class="value"
                            :class="{ 'is-gradient': variant === 'grid' && !item.valueColor }"
                            :style="{ color: item.valueColor }"
                        >
                            {{ item.value }}
                            <span class="unit">{{ item.unit }}</span>
                        </p>
                        <p v-if="item.note" class="note" :class="`is-${item.noteType}`">
                            <img
                                v-if="item.noteType === 'trend'"
                                class="arrow"
                                :src="chevronUpIcon"
                                alt=""
                            />
                            {{ item.note }}
                        </p>
                    </div>
                </div>
                <img v-if="i < row.length - 1" class="divider" :src="dividerIcon" alt="" />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getImageWidthName } from '@/utils/getAssets';
import type { BaseStatListItem } from './baseStatList';

const props = defineProps<{
    /** 单行统计项（与 rows 二选一） */
    list?: BaseStatListItem[];
    /** 多行统计项（每行独立渲染，配合 grid 变体） */
    rows?: BaseStatListItem[][];
    /** 布局变体：grid = 深色渐变统计卡 */
    variant?: 'grid';
    /** 分隔图文件名（assets/images 下） */
    divider?: string;
}>();

const groups = computed<BaseStatListItem[][]>(() => {
    if (props.rows) return props.rows;
    return props.list ? [props.list] : [];
});

/** 组件内置资产（经 getAssets 解析，同项目图片引用约定） */
const chevronUpIcon = getImageWidthName('chevron-up.svg');
const dividerIcon = computed(() => getImageWidthName(props.divider ?? 'divider.svg'));
</script>

<style scoped lang="scss">
.baseStatList {
    display: flex;
    flex-direction: column;

    .stat-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .baseStatListItem {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: base(4px);

        .head {
            display: flex;
            align-items: center;
            gap: base(3px);

            .icon {
                width: base(16px);
                height: base(16px);
            }

            .label {
                color: var(--lxj-color-text-desc);
                font-size: var(--lxj-font-desc);
                white-space: nowrap;
            }
        }

        .body {
            display: flex;
            flex-direction: column;
            align-items: center;

            .value {
                display: flex;
                align-items: baseline;
                margin: 0;
                font-family: var(--lxj-font-family-num);
                font-size: font(15px);
                letter-spacing: base(1.3px);

                .unit {
                    color: var(--lxj-color-text-muted);
                    font-family: var(--lxj-font-family);
                    font-size: font(9px);
                    font-weight: var(--lxj-font-weight-Medium);
                    letter-spacing: normal;
                }
            }

            .note {
                display: flex;
                align-items: flex-end;
                margin: 0;
                font-size: font(10px);

                /* 设计稿取值:环比青绿/待消缺橙 */
                &.is-trend {
                    color: #19fac5;
                }

                &.is-todo {
                    color: #f8b122;
                }

                .arrow {
                    width: base(12px);
                    height: base(12px);
                }
            }
        }
    }

    .divider {
        width: 1px;
        height: base(36px);
    }

    /* grid 变体：深色渐变统计卡（原 cameraStats 行样式） */
    &.is-grid {
        gap: base(6px);

        .stat-row {
            gap: base(6px);
            padding: base(6px) 0;
            background: var(--lxj-bg-card-strong);
            border: 1px solid var(--lxj-color-border-card);
        }

        .baseStatListItem {
            flex: 1;
        }

        .label {
            color: var(--lxj-color-text-soft);
        }

        .divider {
            height: base(30px);
        }

        .unit {
            color: color-mix(in srgb, var(--color-white) 50%, transparent);
        }

        .value.is-gradient {
            background-image:
                linear-gradient(180deg, rgb(254 255 245) 23.5%, rgb(254 255 245 / 0) 58.77%),
                linear-gradient(90deg, var(--lxj-color-num-cyan) 0%, var(--lxj-color-num-cyan) 100%);
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
        }
    }
}
</style>

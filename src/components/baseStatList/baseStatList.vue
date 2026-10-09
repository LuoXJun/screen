<template>
    <div class="baseStatList">
        <template v-for="(item, i) in list" :key="item.label">
            <div class="baseStatListItem">
                <div class="head">
                    <img class="icon" :src="getImageWidthName(item.icon)" alt="" />
                    <span class="label">{{ item.label }}</span>
                </div>
                <div class="body">
                    <p class="value" :style="{ color: item.valueColor }">
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
            <img v-if="i < list.length - 1" class="divider" :src="dividerIcon" alt="" />
        </template>
    </div>
</template>

<script setup lang="ts">
import { getImageWidthName } from '@/utils/getAssets';
import type { BaseStatListItem } from './baseStatList';

defineProps<{
    list: BaseStatListItem[];
}>();

/** 组件内置资产（经 getAssets 解析，同项目图片引用约定） */
const chevronUpIcon = getImageWidthName('chevron-up.svg');
const dividerIcon = getImageWidthName('divider.svg');
</script>

<style scoped lang="scss">
.baseStatList {
    display: flex;
    align-items: center;
    justify-content: space-between;

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
                color: var(--color-white);
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
                    /* 设计稿取值 */
                    color: #aacdf3;
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
}
</style>

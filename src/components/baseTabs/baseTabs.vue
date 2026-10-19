<template>
    <div class="base-tabs" :class="{ 'is-underline': variant === 'underline' }" role="tablist">
        <div
            v-for="tab in items"
            :key="tab.value"
            class="base-tab"
            :class="{ 'is-active': tab.value === active }"
            role="tab"
            :aria-selected="tab.value === active"
            @click="select(tab.value)"
        >
            {{ tab.label }}
        </div>
    </div>
</template>

<script setup lang="ts" generic="T extends string">
import type { BaseTabItem } from './baseTabs';

/** 当前选中页签标识 */
const active = defineModel<T>({ required: true });

defineProps<{
    /** 页签项 */
    items: BaseTabItem<T>[];
    /** 视觉变体：默认渐变页签 / underline 下划线筛选项 */
    variant?: 'underline';
}>();

function select(value: T): void {
    active.value = value;
}
</script>

<style scoped lang="scss">
.base-tabs {
    display: flex;
    gap: base(12px);

    /* 页签：未激活灰条+半透白字，激活渐变底+亮青条+白字（资产随设计稿） */
    .base-tab {
        position: relative;
        width: base(50px);
        height: base(25px);
        color: var(--color-white);
        font-size: var(--lxj-font-body);
        line-height: base(21px);
        text-align: center;
        letter-spacing: base(0.33px);
        opacity: 0.5;
        cursor: pointer;

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: base(3px);
            background: url('@/assets/images/alarm-tab-bar.svg') no-repeat center / 100% 100%;
        }

        &.is-active {
            font-weight: var(--lxj-font-weight-Semibold);
            opacity: 1;
            background: url('@/assets/images/alarm-tab-bg-active.svg') no-repeat center / 100% 100%;

            &::after {
                background-image: url('@/assets/images/alarm-tab-bar-active.svg');
            }
        }
    }

    /* 下划线变体：文字自适应宽度,选中仅变色+底部实线（无渐变底/指示条资产） */
    &.is-underline {
        gap: 0;

        .base-tab {
            width: auto;
            height: base(33px);
            padding: 0 base(14px);
            color: var(--color-blue-500);
            font-size: var(--lxj-font-body);
            line-height: base(21px);
            letter-spacing: 0;
            opacity: 1;
            background: none;
            border-bottom: base(2px) solid transparent;

            &::after {
                display: none;
            }

            &.is-active {
                color: var(--lxj-color-primary);
                font-weight: var(--lxj-font-weight);
                background: none;
                border-bottom-color: var(--lxj-color-primary);
            }
        }
    }
}
</style>

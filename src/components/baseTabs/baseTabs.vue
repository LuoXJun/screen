<template>
    <div
        class="base-tabs"
        :class="{
            'is-underline': variant === 'underline',
            'is-panel': variant === 'panel',
            'is-overlay': variant === 'overlay'
        }"
        :style="assetVars"
        role="tablist"
    >
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
import { computed } from 'vue';
import { getImageWidthName } from '@/utils/getAssets';
import type { BaseTabItem } from './baseTabs';

/** 当前选中页签标识 */
const active = defineModel<T>({ required: true });

const props = defineProps<{
    /** 页签项 */
    items: BaseTabItem<T>[];
    /** 视觉变体：默认渐变页签 / underline 下划线筛选项 / panel 巡检面板页签 / overlay 视频画面页签 */
    variant?: 'underline' | 'panel' | 'overlay';
}>();

/** 页签资源：默认变体(alarm 系) / panel 变体(tab 系) */
const ASSETS = {
    default: {
        bar: getImageWidthName('alarm-tab-bar.svg'),
        activeBar: getImageWidthName('alarm-tab-bar-active.svg'),
        activeBg: getImageWidthName('alarm-tab-bg-active.svg')
    },
    panel: {
        bar: getImageWidthName('tab-bar.svg'),
        activeBar: getImageWidthName('tab-active-bar.svg'),
        activeBg: getImageWidthName('tab-active-bg.svg')
    }
} as const;

const assetVars = computed(() => {
    const set = props.variant === 'panel' ? ASSETS.panel : ASSETS.default;
    return {
        '--tab-bar': `url("${set.bar}")`,
        '--tab-active-bar': `url("${set.activeBar}")`,
        '--tab-active-bg': `url("${set.activeBg}")`
    };
});

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
        color: var(--lxj-color-text-desc);
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
            background-image: var(--tab-bar);
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100% 100%;
        }

        &.is-active {
            font-weight: var(--lxj-font-weight-Semibold);
            opacity: 1;
            background-image: var(--tab-active-bg);
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100% 100%;

            &::after {
                background-image: var(--tab-active-bar);
            }
        }
    }

    /* panel 变体：沿用巡检面板资源，宽度随文案（原 baseTab） */
    &.is-panel {
        .base-tab {
            width: auto;
            padding: 0 base(12px);
        }
    }

    /* overlay 变体：视频画面底部页签（等分、边框、激活半透明底） */
    &.is-overlay {
        gap: 0;
        border-top: 1px solid var(--lxj-color-accent-cyan);

        .base-tab {
            flex: 1;
            width: auto;
            height: auto;
            padding: base(8px) 0;
            color: var(--lxj-color-accent-cyan);
            line-height: base(21px);
            letter-spacing: normal;
            border: 1px solid var(--lxj-color-accent-cyan);
            opacity: 1;

            &::after {
                display: none;
            }

            &.is-active {
                color: var(--lxj-color-text-desc);
                font-weight: var(--lxj-font-weight-Semibold);
                background: color-mix(in srgb, var(--lxj-color-accent-cyan) 20%, transparent);
                border-color: transparent;
                border-right-color: color-mix(
                    in srgb,
                    var(--lxj-color-accent-cyan) 20%,
                    transparent
                );
                background-image: none;
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
            color: var(--lxj-color-text-secondary);
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

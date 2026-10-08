<template>
    <div class="baseTab">
        <div
            v-for="item in list"
            :key="item.value"
            class="baseTabItem"
            :class="{ 'is-active': isActive(item) }"
            @click="model = item.value"
        >
            <img v-if="isActive(item)" class="tab-bg" :src="activeBg" alt="" />
            <span class="tab-label">{{ item.label }}</span>
            <img class="tab-bar" :src="isActive(item) ? activeBar : bar" alt="" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { getImageWidthName } from '@/utils/getAssets';
import type { BaseTabItem } from './baseTab';

const model = defineModel<string | number>({ required: true });

defineProps<{
    list: BaseTabItem[];
}>();

/** 组件内置资产（经 getAssets 解析，同项目图片引用约定） */
const activeBg = getImageWidthName('tab-active-bg.svg');
const activeBar = getImageWidthName('tab-active-bar.svg');
const bar = getImageWidthName('tab-bar.svg');

function isActive(item: BaseTabItem): boolean {
    return item.value === model.value;
}
</script>

<style scoped lang="scss">
.baseTab {
    display: flex;
    align-items: center;
    gap: base(12px);

    .baseTabItem {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: base(25px);
        padding: 0 base(12px);
        cursor: pointer;

        .tab-bg {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
        }

        .tab-label {
            position: relative;
            color: var(--color-white);
            font-size: var(--lxj-font-body);
            letter-spacing: base(0.33px);
            opacity: 0.5;
        }

        .tab-bar {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: base(3px);
        }

        &.is-active .tab-label {
            font-weight: var(--lxj-font-weight-Semibold);
            opacity: 1;
        }
    }
}
</style>

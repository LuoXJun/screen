<template>
    <div class="baseEmpty">
        <span class="empty-icon">
            <img :src="iconUrl" alt="" />
        </span>
        <p class="empty-title">{{ title }}</p>
        <p v-if="description" class="empty-desc">{{ description }}</p>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getImageWidthName } from '@/utils/getAssets';

const props = withDefaults(
    defineProps<{
        /** 占位主提示 */
        title: string;
        /** 补充说明 */
        description?: string;
        /** 图标文件名（src/assets/images/） */
        icon?: string;
    }>(),
    {
        description: '',
        icon: 'drone-empty.svg'
    }
);

const iconUrl = computed(() => getImageWidthName(props.icon));
</script>

<style scoped lang="scss">
/* 面板内容区空状态：虚线描边 + 径向暗底,撑满父级内容区 */
.baseEmpty {
    display: flex;
    width: 100%;
    height: 100%;
    flex: 1;
    min-height: 0;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: base(8px);
    border: 1px dashed color-mix(in srgb, var(--lxj-color-primary) 25%, transparent);
    background:
        radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--lxj-color-primary) 6%, transparent) 0%,
            color-mix(in srgb, var(--lxj-color-primary) 0%, transparent) 58%
        ),
        /* 设计稿取值:画面暗底（无对应语义色，按原值保留） */
        rgba(2, 16, 36, 0.46);

    .empty-icon {
        display: flex;
        width: base(54px);
        height: base(54px);
        align-items: center;
        justify-content: center;
        border: 1px solid color-mix(in srgb, var(--lxj-color-primary) 28%, transparent);
        border-radius: var(--lxj-radius-circle);
        background: color-mix(in srgb, var(--lxj-color-primary) 6%, transparent);

        img {
            width: base(25px);
            height: base(25px);
        }
    }

    .empty-title {
        color: var(--lxj-color-text-primary);
        font-size: font(18px);
        font-weight: var(--lxj-font-weight-Semibold);
    }

    .empty-desc {
        color: var(--lxj-color-text-secondary);
        font-size: var(--lxj-font-body);
        text-align: center;
    }
}
</style>

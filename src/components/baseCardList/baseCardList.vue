<template>
    <div class="baseCardList">
        <div v-for="it in list" :key="it.name" class="baseCardListItem">
            <img class="arc" :src="arcIcon" alt="" />
            <img class="icon" :src="getImageWidthName(it.imgName)" alt="" />
            <div>
                <div class="name">{{ it.name }}</div>
                <div class="desc">
                    <slot>
                        {{ it.text }}
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getImageWidthName } from '@/utils/getAssets';
import type { BaseCardListItem } from './baseCardList';

defineProps<{
    list: BaseCardListItem[];
}>();

/** 组件内置资产（经 getAssets 解析，同项目图片引用约定） */
const arcIcon = getImageWidthName('arc.svg');
</script>

<style scoped lang="scss">
.baseCardList {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding-bottom: base(10px);
    .baseCardListItem {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: base(142px);
        min-height: base(54px);
        flex: 49% 0 0;
        border: 1px solid var(--lxj-color-border-card);
        margin-top: base(10px);
        font-size: var(--lxj-font-desc);
        background: var(--lxj-bg-card-strong);

        .name {
            color: var(--lxj-color-text-soft);
        }
        .desc {
            color: var(--lxj-color-text-muted);
        }
        .arc {
            position: absolute;
            left: 0;
            top: 0;
        }
        .icon {
            width: base(40px);
        }
    }
}
</style>

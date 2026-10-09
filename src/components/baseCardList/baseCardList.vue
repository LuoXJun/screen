<template>
    <div class="baseCardList">
        <div v-for="it in list" :key="it.name" class="baseCardListItem">
            <img class="arc" src="@/assets/images/arc.svg" alt="" />
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
        border: 1px solid #395170;
        margin-top: base(10px);
        font-size: var(--lxj-font-desc);
        background:
            linear-gradient(270deg, rgba(16, 48, 84, 0) 0%, #103054 100%),
            linear-gradient(270deg, rgba(9, 29, 53, 0.2) 0%, #091d35 100%);

        .name {
            color: #dce9f7;
        }
        .desc {
            color: #aacdf3;
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

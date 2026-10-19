<template>
    <article
        class="hazard-item"
        :class="{ 'is-selected': selected }"
        :style="toneVars"
        :data-hazard-id="record.id"
    >
        <div class="item-head">
            <p class="item-meta">
                <i class="level-dot"></i>
                <span class="item-date">{{ record.date }}</span>
                <span class="item-sep">◆</span>
                <span class="item-zone">{{ record.zone }}</span>
            </p>
            <span class="level-tag">{{ record.level }}</span>
            <el-button class="handle-btn" @click="emits('handle', record)">处理</el-button>
        </div>

        <div class="item-tags">
            <span
                v-for="tag in record.tags"
                :key="tag.label"
                class="hazard-tag"
                :style="{ '--tag-color': tag.color }"
            >
                {{ tag.label }}
            </span>
        </div>
    </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { HAZARD_LEVEL_COLORS, type HazardRecord } from '../config';

const props = defineProps<{
    /** 隐患记录 */
    record: HazardRecord;
    /** 是否被隐患清单选中 */
    selected?: boolean;
}>();

const emits = defineEmits<{
    /** 处理（流程待接入） */
    handle: [record: HazardRecord];
}>();

/** 等级色调 → CSS 变量（圆点光晕与等级标签共用） */
const toneVars = computed(() => ({
    '--level-color': HAZARD_LEVEL_COLORS[props.record.level]
}));
</script>

<style scoped lang="scss">
.hazard-item {
    padding: base(10px);
    background: var(--lxj-bg-card);
    border: 1px solid var(--lxj-color-border-primary-light);
    border-radius: base(4px);

    /* 选中态（设计稿 1103:1207）：深蓝底 + 青色描边 */
    &.is-selected {
        background: var(--color-blue-750);
        border-color: rgba(0, 200, 255, 0.2);
    }

    .item-head {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto auto;
        gap: base(7px);
        align-items: center;
        height: base(27px);

        .item-meta {
            display: flex;
            align-items: center;
            min-width: 0;
            color: var(--color-blue-500);
            font-size: var(--lxj-font-body);
            line-height: base(21px);
            white-space: nowrap;

            .level-dot {
                flex-shrink: 0;
                width: base(7px);
                height: base(7px);
                margin-right: base(6px);
                border-radius: 50%;
                background: var(--level-color);
                box-shadow: 0 0 base(8px) var(--level-color);
            }

            .item-sep {
                margin: 0 base(5px);
            }

            .item-zone {
                color: var(--color-blue-50);
                font-weight: var(--lxj-font-weight-Semibold);
            }
        }

        .level-tag {
            padding: base(2px) base(4px);
            border: 1px solid var(--level-color);
            border-radius: base(2px);
            color: var(--level-color);
            font-size: var(--lxj-font-body);
            line-height: base(21px);
            white-space: nowrap;
        }

        /* 处理按钮:青底描边小按钮（hover/active 随令牌联动） */
        .handle-btn {
            height: auto;
            padding: base(2px) base(4px);
            font-size: var(--lxj-font-body);
            line-height: base(21px);
            border-radius: base(3px);
            --el-button-bg-color: rgba(0, 200, 255, 0.06);
            --el-button-border-color: rgba(0, 200, 255, 0.3);
            --el-button-text-color: var(--lxj-color-primary);
            --el-button-hover-bg-color: rgba(0, 200, 255, 0.16);
            --el-button-hover-border-color: var(--lxj-color-primary);
            --el-button-hover-text-color: var(--lxj-color-primary);
            --el-button-active-bg-color: rgba(0, 200, 255, 0.2);
            --el-button-active-border-color: var(--lxj-color-primary);
            --el-button-active-text-color: var(--lxj-color-primary);
        }
    }

    .item-tags {
        display: flex;
        gap: base(5px);
        height: base(32px);
        padding: base(7px) 0 0 base(17px);

        .hazard-tag {
            display: inline-flex;
            align-items: center;
            height: base(25px);
            padding: 0 base(6px);
            color: var(--tag-color);
            font-size: var(--lxj-font-body);
            line-height: base(21px);
            white-space: nowrap;
            background: color-mix(in srgb, var(--tag-color) 7%, transparent);
            border: 1px solid color-mix(in srgb, var(--tag-color) 55%, transparent);
            border-radius: base(2px);
        }
    }
}
</style>

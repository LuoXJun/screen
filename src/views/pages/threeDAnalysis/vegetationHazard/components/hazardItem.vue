<template>
    <article
        class="hazard-item"
        :class="[{ 'is-selected': selected }, `is-${variant}`]"
        :style="toneVars"
        :data-hazard-id="record.id"
        @click="variant === 'checklist' && emits('select')"
    >
        <template v-if="variant === 'list'">
            <div class="item-head">
                <p class="item-meta">
                    <i class="level-dot"></i>
                    <span class="item-date">{{ record.date }}</span>
                    <span class="item-sep">◆</span>
                    <span class="item-zone">{{ record.zone }}</span>
                </p>
                <span class="level-tag">{{ record.level }}</span>
                <el-button class="btn-cyan-ghost" @click="emits('handle', record)">处理</el-button>
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
        </template>
        <template v-else>
            <i class="level-dot"></i>
            <div class="item-text">
                <p class="item-title">{{ record.title }}</p>
                <p class="item-detail">{{ record.detail }}</p>
            </div>
            <span class="level-tag">{{ record.level }}</span>
            <el-button class="btn-cyan-ghost" @click.stop="emits('handle', record)">处理</el-button>
        </template>
    </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
    HAZARD_LEVEL_COLORS,
    type HazardLevel,
    type HazardTag
} from '../config';

/** 列表 / 清单两种数据模型的公共字段 */
interface HazardItemRecord {
    id: string;
    level: HazardLevel;
    /** 列表模式：日期 / 区域 / 标签 */
    date?: string;
    zone?: string;
    tags?: HazardTag[];
    /** 清单模式：标题 / 详情 */
    title?: string;
    detail?: string;
}

const props = withDefaults(
    defineProps<{
        /** 隐患记录（列表或清单） */
        record: HazardItemRecord;
        /** 是否被隐患清单选中 */
        selected?: boolean;
        /** 展示形态：list 右侧列表 / checklist 底部清单 */
        variant?: 'list' | 'checklist';
    }>(),
    { selected: false, variant: 'list' }
);

const emits = defineEmits<{
    /** 处理（流程待接入） */
    handle: [record: HazardItemRecord];
    /** 清单行选中 */
    select: [];
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
        border-color: color-mix(in srgb, var(--lxj-color-primary) 20%, transparent);
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
            color: var(--lxj-color-text-secondary);
            font-size: var(--lxj-font-body);
            line-height: base(21px);
            white-space: nowrap;

            .level-dot {
                flex-shrink: 0;
                width: base(7px);
                height: base(7px);
                margin-right: base(6px);
                border-radius: var(--lxj-radius-circle);
                background: var(--level-color);
                box-shadow: 0 0 base(8px) var(--level-color);
            }

            .item-sep {
                margin: 0 base(5px);
            }

            .item-zone {
                color: var(--lxj-color-text-strong);
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

    }

    /* 底部清单形态（原 hazardChecklist 条目） */
    &.is-checklist {
        display: grid;
        grid-template-columns: base(7px) minmax(0, 1fr) base(42px) base(48px);
        align-items: center;
        gap: base(8px);
        height: base(58px);
        padding: base(7px) base(10px);
        background: transparent;
        border: none;
        border-bottom: 1px solid var(--lxj-color-border-divider-soft);
        border-radius: 0;
        cursor: pointer;

        &.is-selected {
            background: var(--color-blue-750);
            border-bottom-color: color-mix(
                in srgb,
                var(--lxj-color-primary) 20%,
                transparent
            );
            border-radius: base(4px);
        }

        .level-dot {
            width: base(7px);
            height: base(7px);
            margin-right: 0;
            border-radius: var(--lxj-radius-circle);
            background: var(--level-color);
            box-shadow: none;
        }

        .item-text {
            min-width: 0;
        }

        .item-title {
            color: var(--lxj-color-text-strong);
            font-size: var(--lxj-font-body);
            font-weight: var(--lxj-font-weight-Semibold);
            line-height: base(21px);
            white-space: nowrap;
        }

        .item-detail {
            color: var(--lxj-color-text-secondary);
            font-size: var(--lxj-font-body);
            line-height: base(21px);
            white-space: nowrap;
        }

        .level-tag {
            display: flex;
            height: base(25px);
            align-items: center;
            justify-content: center;
            padding: 0 base(6px);
            border: 1px solid var(--level-color);
            border-radius: base(2px);
            color: var(--level-color);
            font-size: var(--lxj-font-body);
            line-height: base(21px);
            white-space: nowrap;
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

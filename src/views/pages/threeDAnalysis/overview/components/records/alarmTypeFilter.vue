<template>
    <el-checkbox-group v-model="selected" class="alarmTypeFilter">
        <el-checkbox v-for="item in types" :key="item.value" :value="item.value">
            <span class="typeCount">{{ item.count }}</span>
            <span class="typeName">{{ item.label }}</span>
        </el-checkbox>
    </el-checkbox-group>
</template>

<script setup lang="ts">
import type { AlarmTypeOption } from './records.config';

defineProps<{
    /** 预警类型筛选项（配置见 records.config.ts 的 ALARM_TYPES） */
    types: AlarmTypeOption[];
}>();

/** 选中类型值，多选（空数组 = 不筛选）；筛选联动由消费方 watch 后重查 */
const selected = defineModel<string[]>({ default: () => [] });
</script>

<style scoped lang="scss">
.alarmTypeFilter {
    display: flex;
    gap: var(--lxj-gap-middle); /* 设计稿项间距 8px */

    /* 整块 label 作胶囊,勾选框整体隐藏;设计稿:Figma 洪家渡防火灾 · 预警类型筛选(132:6147) */
    :deep(.el-checkbox) {
        /* ---- ① 变量绑定 ---- */
        --el-checkbox-font-weight: var(--lxj-font-weight); /* 500 → 400(设计稿名称 Regular) */
        --el-checkbox-height: base(30px); /* EP 默认 32(2 边框 + 8 padding + 20 行高 = 设计稿 30) */

        /* ---- ② 属性规则 ---- */
        width: auto;
        margin-right: 0;
        padding: base(4px) base(8px);
        border: 1px solid var(--lxj-color-border-divider);
        border-radius: var(--lxj-radius-small);
        background: var(--color-blue-750); /* 设计稿 #0d2458 */

        .el-checkbox__input {
            display: none;
        }

        .el-checkbox__label {
            display: flex;
            align-items: center;
            gap: var(--lxj-gap-little); /* 数字与名称间距 4px */
            padding-left: 0;
            font-size: var(--lxj-font-body);
            line-height: base(20px);
            color: var(--lxj-color-text-secondary);
        }

        /* 计数:设计稿 #ff8904(orange-500),Semibold */
        .typeCount {
            font-weight: var(--lxj-font-weight-Semibold);
            color: var(--lxj-color-warning);
        }

        /* 悬浮(设计稿未出样张,按面板交互语言推导):名称提亮一档 + 描边 18% → 30% */
        &:hover:not(.is-checked) {
            border-color: color-mix(in srgb, var(--lxj-color-primary) 30%, transparent);

            .el-checkbox__label {
                color: var(--lxj-color-text-primary); /* blue-300 */
            }
        }

        /* 选中:底 rgba(0,200,255,.2) / 框 rgba(0,150,220,.4) → 主青 20%/40%;名称变主色,计数保持橙色 */
        &.is-checked {
            background: color-mix(in srgb, var(--lxj-color-primary) 20%, transparent);
            border-color: color-mix(in srgb, var(--lxj-color-primary) 40%, transparent);

            .el-checkbox__label {
                color: var(--lxj-color-primary);
            }
        }
    }
}
</style>

<template>
    <basePanelMask class="layerControl">
        <baseSectionTitle :title="title" />
        <el-checkbox-group v-model="checked" class="layerControl-list">
            <el-checkbox v-for="item in list" :key="item.value" :value="item.value">
                {{ item.label }}
            </el-checkbox>
        </el-checkbox-group>
    </basePanelMask>
</template>

<script setup lang="ts">
import basePanelMask from '@/components/basePanel/basePanelMask.vue';
import baseSectionTitle from '@/components/baseSectionTitle/baseSectionTitle.vue';
import type { LayerControlItem } from './layerControl';

/** 选中图层标识列表 */
const checked = defineModel<string[]>({ default: () => [] });

withDefaults(
    defineProps<{
        /** 图层项 */
        list: LayerControlItem[];
        /** 面板标题 */
        title?: string;
    }>(),
    { title: '图层管理' }
);
</script>

<style scoped lang="scss">
.layerControl {
    /* 覆写 basePanelMask 的默认内距（变量定义在元素上,直接覆盖 :root 继承值；设计稿 8px） */
    --lxj-space-panel: #{base(8px)};

    .layerControl-list {
        display: flex;
        flex-direction: column;
        margin-top: base(8px);

        /* 设计稿取值:10px 方框、蓝灰/青色双态 */
        :deep(.el-checkbox) {
            height: base(21px);
            margin-right: 0;
            --el-checkbox-input-width: #{base(10px)};
            --el-checkbox-input-height: #{base(10px)};
            --el-checkbox-border-radius: #{base(2px)};
            --el-checkbox-bg-color: transparent;
            --el-checkbox-input-border: 1px solid var(--color-blue-500);
            --el-checkbox-text-color: var(--color-blue-300);
            --el-checkbox-font-size: var(--lxj-font-body);
            --el-checkbox-font-weight: var(--font-weight-400);
            --el-checkbox-checked-bg-color: color-mix(
                in srgb,
                var(--color-cyan-400) 30%,
                transparent
            );
            --el-checkbox-checked-input-border-color: var(--color-cyan-400);
            --el-checkbox-checked-text-color: var(--color-cyan-400);

            & + .el-checkbox {
                margin-top: base(4px);
            }
        }

        :deep(.el-checkbox__label) {
            padding-left: base(6px);
        }

        /* 勾形替换为实心内芯：接管 EP 的 ::after(默认勾为边框拼形) */
        :deep(.el-checkbox__inner::after) {
            left: 50%;
            top: 50%;
            width: base(6px);
            height: base(6px);
            margin-left: calc(#{base(6px)} / -2);
            margin-top: calc(#{base(6px)} / -2);
            border: none;
            border-radius: base(1px);
            background: var(--color-cyan-400);
            transform: scale(0);
        }

        :deep(.el-checkbox.is-checked .el-checkbox__inner::after) {
            transform: scale(1);
        }
    }
}
</style>

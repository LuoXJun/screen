<template>
    <div class="toolsBar">
        <div
            v-for="tool in TOOLS"
            :key="tool.type"
            class="tool"
            :class="{ isActive: activeType === tool.type }"
            @click="handleTool(tool)"
            @mouseenter="hoverLabel = tool.label"
            @mouseleave="hoverLabel = ''"
        >
            <img v-if="tool.icon" :src="getImageWidthName(tool.icon)" alt="" />
            <span v-else class="tool-placeholder" />
            <p v-if="hoverLabel === tool.label" class="tool-label">{{ tool.label }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { DrawGeometry, getViewer, type GeometryType } from '@/cesium';
import { getImageWidthName } from '@/utils/getAssets';
import { TOOLS, type ToolItem } from './toolsBar.config';

/** 当前激活的绘制类型（''=未激活） */
const activeType = ref<GeometryType | ''>('');
const hoverLabel = ref('');

let drawGeometry: DrawGeometry | null = null;

const handleTool = (tool: ToolItem) => {
    const { type } = tool;

    if (type === 'reset') {
        getViewer().camera.flyHome();
        return;
    }
    if (type === 'clear') {
        drawGeometry?.clear();
        activeType.value = '';
        return;
    }

    /* 再次点击已激活的工具 = 取消绘制 */
    if (activeType.value === type) {
        drawGeometry?.stop();
        activeType.value = '';
        return;
    }

    activeType.value = type;
    drawGeometry ??= new DrawGeometry();
    drawGeometry.draw(type);
};

onBeforeUnmount(() => {
    drawGeometry?.destroy();
    drawGeometry = null;
});
</script>

<style scoped lang="scss">
.toolsBar {
    display: flex;
    align-items: center;
    gap: base(2px);
    height: base(40px);
    padding: 0 base(6px);
    border-radius: var(--lxj-radius-small);
    background: rgba(7, 20, 40, 0.85);
    border: 1px solid var(--lxj-color-border-primary-light);
    /* 页面层(.screen)默认禁用指针事件，控件需自行开启 */
    pointer-events: all;

    .tool {
        position: relative;
        width: base(34px);
        height: base(30px);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: base(3px);

        &:hover {
            background: rgba(0, 200, 255, 0.15);
        }

        &.isActive {
            background: color-mix(in srgb, var(--color-cyan-400) 30%, transparent);
        }

        > img {
            width: base(20px);
            height: base(20px);
        }

        /* 图标文件缺失时的占位块（补图后自动替换） */
        .tool-placeholder {
            width: base(16px);
            height: base(16px);
            border-radius: base(2px);
            background: red;
        }

        .tool-label {
            position: absolute;
            left: 50%;
            top: 0;
            transform: translate(-50%, -130%);
            white-space: nowrap;
            padding: base(2px) base(6px);
            border-radius: base(2px);
            background: rgba(7, 20, 40, 0.9);
            border: 1px solid var(--lxj-color-border-primary-light);
            font-size: base(12px);
            color: #fff;
        }
    }
}
</style>

<template>
    <div
        class="cameraCard"
        :class="{ 'is-selected': selected }"
        :style="{ '--status-color': CAMERA_STATUS_TONE[device.status] }"
        @click="emits('select', device)"
    >
        <i class="status-dot"></i>
        <div class="card-info">
            <p class="card-name">
                {{ device.id }}{{ device.suffix ? `（${device.suffix}）` : '' }}
            </p>
            <p class="card-desc">
                {{ device.type }} ·
                <span class="desc-state">{{ CAMERA_STATUS_MAP[device.status] }}</span>
            </p>
        </div>
        <span v-if="selected" class="card-selected">已选择</span>
        <el-button v-else class="card-detail" @click.stop="emits('detail', device)">详情</el-button>
    </div>
</template>

<script setup lang="ts">
import { CAMERA_STATUS_MAP, CAMERA_STATUS_TONE, type CameraDevice } from './cameraList.config';

/** 摄像头设备卡：状态点 + 编号/类型 + 详情（或选中态） */
defineProps<{
    device: CameraDevice;
    /** 当前选中（主画面设备;「已选择」标签与「详情」按钮互斥显示） */
    selected?: boolean;
}>();

const emits = defineEmits<{
    /** 卡片点击（切主画面） */
    select: [device: CameraDevice];
    /** 详情点击（弹监控弹窗） */
    detail: [device: CameraDevice];
}>();
</script>

<style scoped lang="scss">
.cameraCard {
    display: flex;
    /* 设计稿 items-start:状态点/文字/按钮均顶部对齐,点钉在左上 */
    align-items: flex-start;
    /* 点右缘 → 文字左缘（设计稿像素实测 ≈4px） */
    gap: base(4px);
    padding: base(8px) base(12px);
    /* 设计稿取值:深蓝半透明卡 + 微青描边 */
    background: rgba(13, 36, 88, 0.2);
    border: 1px solid rgba(0, 200, 255, 0.2);
    border-radius: var(--radius-4);
    cursor: pointer;

    /* --status-color 由内联样式注入（CAMERA_STATUS_TONE,状态点与状态词共用） */

    /* 选中态(当前主画面) */
    &.is-selected {
        background: var(--color-blue-750);
    }

    .status-dot {
        flex-shrink: 0;
        width: base(6px);
        height: base(6px);
        border-radius: base(3px);
        background: var(--status-color);
    }

    .card-info {
        flex: 1;
        min-width: 0;

        .card-name {
            margin: 0;
            overflow: hidden;
            color: #e8f4ff;
            font-size: var(--lxj-font-body);
            line-height: base(21px);
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .card-desc {
            margin: 0;
            color: #4a7a9b;
            font-size: var(--lxj-font-body);
            line-height: base(21px);

            /* 状态词随点同色(灰/绿/橙/红四种状态) */
            .desc-state {
                color: var(--status-color);
            }
        }
    }

    /* 选中标签 */
    .card-selected {
        flex-shrink: 0;
        padding: base(2px) base(8px);
        color: var(--color-cyan-400);
        font-size: var(--lxj-font-body);
        line-height: base(21px);
        background: rgba(0, 200, 255, 0.2);
        border: 1px solid var(--color-cyan-400);
        border-radius: base(3px);
    }

    /* 详情按钮:青底描边小按钮(hover/active 随变量联动) */
    .card-detail {
        flex-shrink: 0;
        height: auto;
        padding: base(2px) base(8px);
        font-size: var(--lxj-font-body);
        line-height: base(21px);
        border-radius: base(3px);
        --el-button-bg-color: rgba(0, 200, 255, 0.12);
        --el-button-border-color: rgba(0, 200, 255, 0.3);
        --el-button-text-color: var(--color-cyan-400);
        --el-button-hover-bg-color: rgba(0, 200, 255, 0.2);
        --el-button-hover-border-color: var(--color-cyan-400);
        --el-button-hover-text-color: var(--color-cyan-400);
        --el-button-active-bg-color: rgba(0, 200, 255, 0.24);
        --el-button-active-border-color: var(--color-cyan-400);
        --el-button-active-text-color: var(--color-cyan-400);
    }
}
</style>

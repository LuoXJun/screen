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
        <el-button
            v-else
            class="card-detail btn-cyan-ghost"
            @click.stop="emits('select', device)"
        >
            详情
        </el-button>
    </div>
</template>

<script setup lang="ts">
import type { CameraDevice } from '@/config/devices';
import { CAMERA_STATUS_MAP, CAMERA_STATUS_TONE } from './cameraList.config';

/** 摄像头设备卡：状态点 + 编号/类型 + 详情（或选中态）;点卡片与点详情同为选中动作 */
defineProps<{
    device: CameraDevice;
    /** 当前选中（面板展示 + 地图定位高亮;「已选择」标签与「详情」按钮互斥显示） */
    selected?: boolean;
}>();

const emits = defineEmits<{
    /** 卡片/详情点击（选中该设备） */
    select: [device: CameraDevice];
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
    background: color-mix(in srgb, var(--color-blue-750) 20%, transparent);
    border: 1px solid color-mix(in srgb, var(--lxj-color-primary) 20%, transparent);
    border-radius: var(--lxj-radius-small);
    cursor: pointer;

    /* --status-color 由内联样式注入（CAMERA_STATUS_TONE,状态点与状态词共用） */

    /* 选中态(底部面板展示 + 地图定位高亮):实底 + 光晕 */
    &.is-selected {
        background: var(--color-blue-750);
        box-shadow: 0 0 base(10px)
            color-mix(in srgb, var(--lxj-color-primary) 40%, transparent);
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
            color: var(--lxj-color-text-strong);
            font-size: var(--lxj-font-body);
            line-height: base(21px);
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .card-desc {
            margin: 0;
            color: var(--lxj-color-text-secondary);
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
        color: var(--lxj-color-primary);
        font-size: var(--lxj-font-body);
        line-height: base(21px);
        background: color-mix(in srgb, var(--lxj-color-primary) 20%, transparent);
        border: 1px solid var(--lxj-color-primary);
        border-radius: base(3px);
    }

    .card-detail {
        flex-shrink: 0;
    }
}
</style>

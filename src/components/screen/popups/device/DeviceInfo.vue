<template>
    <div class="deviceInfo" :class="{ 'is-grid': variant === 'grid' }">
        <div v-for="item in items" :key="item.label" class="info-item">
            <img v-if="showIcon && item.icon" class="info-icon" :src="ICON_MAP[item.icon]" alt="" />
            <p class="info-text">
                <span class="info-label">{{ item.label }}:</span>
                <span
                    class="info-value"
                    :class="item.valueClass"
                    :style="{ color: item.valueColor }"
                    :title="item.value"
                >
                    {{ item.value }}
                </span>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getImageWidthName } from '@/utils/getAssets';
import type { DeviceInfoIcon, DeviceInfoItem } from './DeviceInfo';

withDefaults(
    defineProps<{
        /** 设备信息项（双列网格渲染） */
        items: DeviceInfoItem[];
        /** 是否渲染图标（默认 true；面板内紧凑网格可关闭） */
        showIcon?: boolean;
        /** 布局变体：grid = 面板内两列紧凑网格 */
        variant?: 'grid';
    }>(),
    { showIcon: true, variant: undefined }
);

/* 图标集（经 getAssets 解析，同项目图片引用约定） */
const ICON_MAP: Record<DeviceInfoIcon, string> = {
    id: getImageWidthName('camera-info-id.svg'),
    model: getImageWidthName('camera-info-model.svg'),
    location: getImageWidthName('camera-info-location.svg'),
    date: getImageWidthName('camera-info-date.svg'),
    status: getImageWidthName('camera-info-status.svg'),
    alarm: getImageWidthName('camera-info-alarm.svg')
};
</script>

<style scoped lang="scss">
.deviceInfo {
    /* 弹性双列：内容超长时换行,不截断 */
    display: flex;
    flex-wrap: wrap;
    row-gap: base(10px);

    .info-item {
        display: flex;
        align-items: center;
        gap: base(8px);
        flex: 0 1 auto;
        min-width: 50%;
        max-width: 100%;

        .info-icon {
            width: base(24px);
            height: base(24px);
            flex-shrink: 0;
        }

        .info-text {
            margin: 0;
            min-width: 0;
            font-size: font(16px);
            overflow-wrap: anywhere;

            .info-label {
                color: var(--lxj-color-text-primary);
            }

            .info-value {
                color: var(--lxj-color-text-desc);

                /* 设计稿取值:在线绿/离线红 */
                &.is-online {
                    color: var(--lxj-color-status-online);
                }

                &.is-offline {
                    color: var(--lxj-color-status-offline);
                }

                &.is-strong {
                    font-weight: var(--lxj-font-weight-Semibold);
                }
            }
        }
    }

    /* 面板内两列紧凑网格（原 deviceInfoPanel 信息区） */
    &.is-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        row-gap: base(6px);
        padding-top: base(8px);

        .info-item {
            min-width: 0;
            gap: 0;
            overflow: hidden;
            font-size: var(--lxj-font-body);
            line-height: base(21px);
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .info-text {
            font-size: var(--lxj-font-body);
        }

        .info-value {
            color: var(--lxj-color-text-strong);
        }
    }
}
</style>

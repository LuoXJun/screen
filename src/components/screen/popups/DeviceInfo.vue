<template>
    <div class="deviceInfo">
        <div v-for="item in items" :key="item.label" class="info-item">
            <img class="info-icon" :src="ICON_MAP[item.icon]" alt="" />
            <p class="info-text">
                <span class="info-label">{{ item.label }}:</span>
                <span class="info-value" :class="item.valueClass" :title="item.value">
                    {{ item.value }}
                </span>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getImageWidthName } from '@/utils/getAssets';
import type { DeviceInfoIcon, DeviceInfoItem } from './DeviceInfo';

defineProps<{
    /** 设备信息项（双列网格渲染） */
    items: DeviceInfoItem[];
}>();

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
                color: var(--color-blue-300);
            }

            .info-value {
                color: var(--color-white);

                /* 设计稿取值:在线绿/离线红 */
                &.is-online {
                    color: #37f2a8;
                }

                &.is-offline {
                    color: #e03030;
                }
            }
        }
    }
}
</style>

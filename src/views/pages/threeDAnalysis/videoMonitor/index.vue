<template>
    <baseOverlay>
        <template #left>
            <!-- 监控摄像头列表（点击卡片/详情=选中该设备:底部面板展示 + 地图定位高亮） -->
            <cameraList :groups="groups" :selected-device="selectedDevice" @select="onSelect" />
        </template>
        <!-- 监控画面面板（主区底部,位置体系同 overview 的 records） -->
        <cameraMonitorPanel v-if="selectedDevice" :device="selectedDevice" />
        <template #right>
            <!-- 视频监控警报中心 -->
            <alarmCenter />
        </template>
    </baseOverlay>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import baseOverlay from '@/components/baseOverlay/baseOverlay.vue';
import cameraList from './components/cameraList/cameraList.vue';
import cameraMonitorPanel from './components/cameraMonitorPanel/cameraMonitorPanel.vue';
import alarmCenter from './components/alarmCenter/alarmCenter.vue';
import { useCameraMarkers } from './composables/useCameraMarkers';
import type { CameraDevice } from '@/config/devices';

/** 摄像头交互编排（选中设备 → 地图定位高亮;点位为全局加载,本层不管理其生死） */
const { groups, focusDevice } = useCameraMarkers();

/** 选中设备（null=未选中;底部面板展示 + 卡片选中态;shallowRef 保住对象引用供卡片比较） */
const selectedDevice = shallowRef<CameraDevice>();

/** 选中设备（点卡片或详情同一动作）：底部面板展示 + 地图定位高亮 */
function onSelect(device: CameraDevice): void {
    selectedDevice.value = device;
    focusDevice(device);
}
</script>

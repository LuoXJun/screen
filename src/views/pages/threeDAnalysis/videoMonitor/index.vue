<template>
    <baseOverlay>
        <template #left>
            <!-- 监控摄像头列表（「详情」= 选中该设备,互斥;主区底部面板展示其监控画面） -->
            <cameraList :selected-device="detailDevice" @select="onSelect" @detail="onDetail" />
        </template>
        <!-- 监控画面面板（主区底部,位置体系同 overview 的 records） -->
        <cameraMonitorPanel v-if="detailDevice" :device="detailDevice" />
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
import type { CameraDevice } from './components/cameraList/cameraList.config';

/** 详情设备（null=未选中,面板不显示;shallowRef 保住对象引用,卡片据此做互斥选中比较） */
const detailDevice = shallowRef<CameraDevice>();

/** 卡片点击：切换主画面（待接视频流） */
function onSelect(): void {
    /* 主画面切换待接入 */
}

/** 详情点击：在底部面板查看监控画面 */
function onDetail(device: CameraDevice): void {
    detailDevice.value = device;
}
</script>

<style scoped lang="scss"></style>

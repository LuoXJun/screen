<template>
    <div class="cameraMonitorPanel">
        <basePanelTitle class="panel-title" title="摄像头监控画面" />
        <div class="panel-frame">
            <div class="panel-inner">
                <!-- 监控画面 -->
                <monitorPlayer :channel="data.channel" />
                <!-- 右侧:设备信息 + 云台控制 -->
                <div class="side-col">
                    <deviceInfoPanel :fields="data.infoFields" />
                    <ptzControl />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import basePanelTitle from '@/components/basePanel/basePanelTitle.vue';
import monitorPlayer from './monitorPlayer.vue';
import deviceInfoPanel from './deviceInfoPanel.vue';
import ptzControl from './ptzControl.vue';
import { buildMonitorPanelData } from './cameraMonitorPanel.config';
import type { CameraDevice } from '../cameraList/cameraList.config';

const props = defineProps<{
    /** 详情设备（点击列表「详情」传入,切换设备即刷新面板） */
    device: CameraDevice;
}>();

const data = computed(() => buildMonitorPanelData(props.device));
</script>

<style scoped lang="scss">
/* 主区底部常驻面板（定位体系同 overview 的 records:absolute 贴主区底部居中） */
.cameraMonitorPanel {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: base(1068px);
    padding: base(9px);
    transform: translateX(-50%);
    /* 磨砂深底 + 描边 + 内发光（与大屏弹窗同一设计语言） */
    background: rgba(3, 31, 68, 0.5);
    border: 1px solid #2d6099;
    border-radius: base(8px);
    backdrop-filter: blur(base(10px));
    box-shadow: inset 0 0 base(20px) #1458a3;
    pointer-events: all;

    /* 顶部装饰线(悬于框外) */
    &::before {
        content: '';
        position: absolute;
        left: 50%;
        top: base(-6px);
        width: base(1068px);
        height: base(3px);
        transform: translateX(-50%);
        background: url('@/assets/images/dialog-top-line.svg') no-repeat center / 100% 100%;
        pointer-events: none;
    }

    /* 右下角镶边(探出框外;贴主区底部时裁切) */
    &::after {
        content: '';
        position: absolute;
        right: base(-1px);
        bottom: base(-9px);
        width: base(57px);
        height: base(8px);
        background: url('@/assets/images/dialog-corner.svg') no-repeat center / 100% 100%;
        pointer-events: none;
    }

    .panel-frame {
        background: rgba(13, 36, 88, 0.4);
        border: 1px solid rgba(0, 200, 255, 0.3);
        border-radius: base(4px);
    }

    .panel-inner {
        display: flex;
        gap: base(4px);
        padding: base(8px) base(12px);
        border-bottom: 1px solid rgba(0, 150, 220, 0.18);

        .side-col {
            display: flex;
            flex: 1;
            min-width: 0;
            flex-direction: column;
            gap: base(4px);
        }
    }
}
</style>

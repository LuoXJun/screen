<template>
    <basePanelMask class="cameraMonitorPanel">
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
    </basePanelMask>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import basePanelMask from '@/components/basePanel/basePanelMask.vue';
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
/* 主区底部常驻面板（basePanelMask 打底;定位体系同 overview 的 records:absolute 贴主区底部居中） */
.cameraMonitorPanel {
    /* 覆写 basePanelMask 内距（设计稿内容 9px 边距） */
    --lxj-space-panel: #{base(9px)};

    position: absolute;
    bottom: 0;
    left: 50%;
    width: base(1068px);
    transform: translateX(-50%);

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

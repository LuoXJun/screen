<template>
    <div class="monitorPlayer">
        <img class="frame" :src="previewImg" alt="" />
        <!-- 上下黑纱(提升顶部信息/底部页签可读性) -->
        <i class="shade"></i>
        <div class="info-row">
            <span class="channel">
                <i class="channel-dot"></i>
                {{ channel }}
            </span>
            <span class="time">{{ timeText }}</span>
        </div>
        <!-- 画面模式页签(可见光/红外,视频流待接入) -->
        <div class="modes">
            <div
                v-for="mode in MONITOR_MODES"
                :key="mode.key"
                class="mode"
                :class="{ 'is-active': active === mode.key }"
                @click="active = mode.key"
            >
                {{ mode.label }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getImageWidthName } from '@/utils/getAssets';
import { MONITOR_MODES, type MonitorMode } from './cameraMonitorPanel.config';

defineProps<{
    /** 画面左上角频道名 */
    channel: string;
}>();

/** 当前画面模式（演示态） */
const active = ref<MonitorMode['key']>('visible');

/** 时间戳水印（占位:当前时刻,接视频流后跟随流时间） */
const timeText = (() => {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
})();

/** 画面占位图（接入视频流后替换为播放器） */
const previewImg = getImageWidthName('camera-monitor-preview.jpg');
</script>

<style scoped lang="scss">
.monitorPlayer {
    position: relative;
    flex-shrink: 0;
    width: base(472px);
    height: base(312px);
    padding: base(15px) base(18px) 0 base(15px);
    overflow: hidden;
    border-radius: base(4px);

    .frame {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    /* 设计稿取值:上下各 60% 黑纱 */
    .shade {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            179.32deg,
            rgb(0 0 0 / 60%) 0.88%,
            rgb(0 0 0 / 0%) 25.56%,
            rgb(0 0 0 / 0%) 84.27%,
            rgb(0 0 0 / 60%) 99.13%
        );
    }

    .info-row {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: base(21px);

        /* 频道名胶囊（设计稿:半透明青底 + 微青描边） */
        .channel {
            display: flex;
            align-items: center;
            gap: base(4px);
            height: base(21px);
            padding: 0 base(10px);
            color: var(--color-white);
            font-size: var(--lxj-font-body);
            line-height: base(21px);
            background: rgba(0, 200, 255, 0.1);
            border: 1px solid rgba(0, 200, 255, 0.3);
            border-radius: base(4px);

            .channel-dot {
                width: base(4px);
                height: base(4px);
                background: url('@/assets/images/camera-monitor-dot.svg') no-repeat center / 100%
                    100%;
            }
        }

        .time {
            color: #fbfdff;
            font-size: var(--lxj-font-body);
            line-height: base(21px);
        }
    }

    /* 底部模式页签:贴底居中,激活项半透明底+白字,未激活亮边+青字 */
    .modes {
        position: absolute;
        bottom: 0;
        left: 50%;
        display: flex;
        width: base(378px);
        transform: translateX(-50%);
        border-top: 1px solid #44caff;

        .mode {
            flex: 1;
            padding: base(8px) 0;
            color: #44caff;
            font-size: var(--lxj-font-body);
            line-height: base(21px);
            text-align: center;
            border: 1px solid #44caff;
            cursor: pointer;

            /* 激活态：半透明底 + 白字；边框转透明保留占位（仅留右分隔线） */
            &.is-active {
                color: var(--color-white);
                font-weight: var(--lxj-font-weight-Semibold);
                background: rgba(68, 202, 255, 0.2);
                border-color: transparent;
                border-right-color: rgba(68, 202, 255, 0.2);
            }
        }
    }
}
</style>

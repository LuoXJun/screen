<template>
    <div class="monitorPlayer" :style="assetVars">
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
        <baseTabs v-model="active" :items="MODE_TABS" variant="overlay" class="modes" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getImageWidthName } from '@/utils/getAssets';
import baseTabs from '@/components/baseTabs/baseTabs.vue';
import { MONITOR_MODES, type MonitorMode } from './cameraMonitorPanel.config';

/** 画面模式 → baseTabs 数据模型 */
const MODE_TABS = MONITOR_MODES.map((mode) => ({ label: mode.label, value: mode.key }));

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

/** 组件内置资产（经 getAssets 解析，同项目图片引用约定） */
const assetVars = {
    '--channel-dot': `url("${getImageWidthName('camera-monitor-dot.svg')}")`
};
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
            rgb(from var(--color-black) r g b / 60%) 0.88%,
            rgb(from var(--color-black) r g b / 0%) 25.56%,
            rgb(from var(--color-black) r g b / 0%) 84.27%,
            rgb(from var(--color-black) r g b / 60%) 99.13%
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
            color: var(--lxj-color-text-desc);
            font-size: var(--lxj-font-body);
            line-height: base(21px);
            background: color-mix(in srgb, var(--lxj-color-primary) 10%, transparent);
            border: 1px solid var(--lxj-color-border-primary-light);
            border-radius: base(4px);

            .channel-dot {
                width: base(4px);
                height: base(4px);
                background-image: var(--channel-dot);
                background-repeat: no-repeat;
                background-position: center;
                background-size: 100% 100%;
            }
        }

        .time {
            color: var(--lxj-color-text-desc);
            font-size: var(--lxj-font-body);
            line-height: base(21px);
        }
    }

    /* 底部模式页签定位（外观见 baseTabs overlay 变体） */
    .modes {
        position: absolute;
        bottom: 0;
        left: 50%;
        width: base(378px);
        transform: translateX(-50%);
    }
}
</style>

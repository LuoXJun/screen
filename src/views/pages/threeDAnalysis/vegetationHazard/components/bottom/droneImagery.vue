<template>
    <basePanelMask class="drone-panel">
        <basePanelTitle class="panel-title" title="无人机拍摄影像" />

        <div class="drone-body">
            <div v-if="item" class="drone-frame">
                <div class="scene">
                    <div class="stripes">
                        <i v-for="index in STRIPE_COUNT" :key="index" class="stripe"></i>
                        <i class="spot spot-1"></i>
                        <i class="spot spot-2"></i>
                        <i class="spot spot-3"></i>
                    </div>
                </div>

                <div class="frame-bar is-top">
                    <span class="bar-zone">{{ zoneText }}</span>
                    <span class="bar-risk" :style="{ color: levelColor }">{{ levelText }}</span>
                </div>
                <div class="frame-bar is-bottom">
                    <span class="bar-camera">{{ DRONE_IMAGERY.camera }}</span>
                    <span class="bar-online" :class="{ 'is-offline': !DRONE_IMAGERY.online }">
                        ● {{ DRONE_IMAGERY.online ? '在线' : '离线' }}
                    </span>
                </div>
            </div>

            <!-- 未选中隐患点位:虚线占位 -->
            <div v-else class="drone-empty">
                <span class="empty-icon">
                    <img src="@/assets/images/drone-empty.svg" alt="" />
                </span>
                <p class="empty-title">暂未选择隐患点位</p>
                <p class="empty-desc">请在地图、隐患清单或右侧列表中选择一条记录</p>
            </div>
        </div>
    </basePanelMask>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import basePanelMask from '@/components/basePanel/basePanelMask.vue';
import basePanelTitle from '@/components/basePanel/basePanelTitle.vue';
import { HAZARD_LEVEL_COLORS } from '../../config';
import { DRONE_IMAGERY, STRIPE_COUNT, type ChecklistItem } from './bottomPanels.config';

const props = defineProps<{
    /** 当前选中的隐患清单项（同步区域与等级） */
    item?: ChecklistItem | null;
}>();

const zoneText = computed(() => props.item?.zone ?? '--');
const levelText = computed(() => props.item?.level ?? '--');
const levelColor = computed(() =>
    props.item ? HAZARD_LEVEL_COLORS[props.item.level] : 'var(--color-blue-500)'
);
</script>

<style scoped lang="scss">
.drone-panel {
    --lxj-panel-space-y: #{base(6px)};
    --lxj-space-panel: #{base(10px)};
    display: flex;
    min-height: 0;
    flex-direction: column;
    height: 100%;

    .panel-title {
        margin: base(2px) 0;
    }
}

.drone-body {
    flex: 1;
    min-height: 0;
    padding: base(6px) 0 0 0;
}

.drone-frame {
    position: relative;
    height: 100%;
    overflow: hidden;
    border: 1px solid rgba(0, 150, 220, 0.18);
    background: linear-gradient(157.29deg, #225b75 6.17%, #3b7090 45.62%, #28546b 93.83%);
}

.drone-empty {
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: base(8px);
    border: 1px dashed rgba(0, 200, 255, 0.25);
    background:
        radial-gradient(ellipse at center, rgba(0, 200, 255, 0.06) 0%, rgba(0, 200, 255, 0) 58%),
        rgba(2, 16, 36, 0.46);

    .empty-icon {
        display: flex;
        width: base(54px);
        height: base(54px);
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(0, 200, 255, 0.28);
        border-radius: 50%;
        background: rgba(0, 200, 255, 0.06);

        img {
            width: base(25px);
            height: base(25px);
        }
    }

    .empty-title {
        color: var(--color-blue-300);
        font-size: font(18px);
        font-weight: var(--lxj-font-weight-Semibold);
    }

    .empty-desc {
        color: var(--color-blue-500);
        font-size: var(--lxj-font-body);
    }
}

.scene {
    position: absolute;
    inset: 0;
    overflow: hidden;
}

/* 无人机俯拍条带：整体倾斜,条带各自轻微旋转 */
.stripes {
    position: absolute;
    left: 50%;
    top: 50%;
    display: flex;
    align-items: center;
    width: base(431px);
    height: base(221px);
    gap: base(49px);
    transform: translate(-50%, -50%) skewX(-9deg) scaleY(0.99);

    .stripe {
        flex-shrink: 0;
        width: base(7px);
        height: 130%;
        background: #071c32;
        box-shadow: 0 0 0 #{base(2px)} rgba(116, 187, 220, 0.2);
        transform: rotate(4.05deg);
    }
}

/* 植被异常热区：黄色径向光斑 */
.spot {
    position: absolute;
    width: base(110px);
    height: base(81px);
    border-radius: 50%;
    background: radial-gradient(
        ellipse at center,
        rgba(255, 229, 99, 1) 0%,
        rgba(234, 225, 86, 0.875) 15%,
        rgba(205, 220, 68, 0.75) 30%,
        rgba(180, 210, 66, 0.55) 42.5%,
        rgba(160, 202, 64, 0.45) 48.75%,
        rgba(128, 190, 61, 0.35) 55%,
        rgba(128, 190, 61, 0) 72%
    );
    filter: blur(#{base(5px)});
}

.spot-1 {
    left: base(65px);
    top: base(40px);
}

.spot-2 {
    left: base(207px);
    top: base(77px);
}

.spot-3 {
    left: base(308px);
    top: base(18px);
}

.frame-bar {
    position: absolute;
    right: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    padding: base(5px) base(8px);
    background: rgba(5, 20, 45, 0.68);
    font-size: var(--lxj-font-body);
    line-height: base(21px);

    &.is-top {
        top: 0;
    }

    &.is-bottom {
        bottom: 0;
    }

    .bar-zone {
        color: var(--color-white);
        font-weight: var(--lxj-font-weight-Semibold);
    }

    .bar-risk {
        font-weight: var(--lxj-font-weight-Medium);
    }

    .bar-camera {
        color: var(--color-blue-300);
    }

    .bar-online {
        color: var(--color-green-400);
        font-weight: var(--lxj-font-weight-Medium);

        &.is-offline {
            color: var(--color-blue-500);
        }
    }
}
</style>

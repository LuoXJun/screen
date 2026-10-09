<template>
    <basePanelMask class="cameraList">
        <!-- 面板装饰标题（复用 basePanelTitle） -->
        <basePanelTitle class="panel-title" :title="title" />
        <!-- 统计条 -->
        <cameraStats class="camera-stats" :rows="CAMERA_STATS" />
        <!-- 分组列表 -->
        <div class="camera-groups">
            <div v-for="group in CAMERA_GROUPS" :key="group.title" class="camera-group">
                <baseSectionTitle
                    class="group-head"
                    :title="group.title"
                    :extra="`总计 ${group.total}`"
                />
                <!-- 滚动只在卡片体,分组头固定 -->
                <div class="group-body">
                    <div v-for="(sub, si) in group.subgroups" :key="si" class="group-sub">
                        <p v-if="sub.title" class="sub-title">— {{ sub.title }}</p>
                        <cameraCard
                            v-for="(device, di) in sub.items"
                            :key="`${device.id}-${di}`"
                            :device="device"
                            :selected="device === selectedDevice"
                            @select="emits('select', $event)"
                            @detail="emits('detail', $event)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </basePanelMask>
</template>

<script setup lang="ts">
import basePanelMask from '@/components/basePanel/basePanelMask.vue';
import basePanelTitle from '@/components/basePanel/basePanelTitle.vue';
import baseSectionTitle from '@/components/baseSectionTitle/baseSectionTitle.vue';
import cameraStats from './cameraStats.vue';
import cameraCard from './cameraCard.vue';
import { CAMERA_GROUPS, CAMERA_STATS, type CameraDevice } from './cameraList.config';

withDefaults(
    defineProps<{
        /** 面板标题 */
        title?: string;
        /** 当前选中设备（互斥单选:点击详情后由页面注入,对应卡片呈现「已选择」态） */
        selectedDevice?: CameraDevice;
    }>(),
    { title: '监控摄像头列表' }
);

const emits = defineEmits<{
    /** 卡片点击（切主画面） */
    select: [device: CameraDevice];
    /** 详情点击（弹监控弹窗） */
    detail: [device: CameraDevice];
}>();
</script>

<style scoped lang="scss">
.cameraList {
    /* 覆写 basePanelMask 内距（设计稿内容左缘 10/11px） */
    --lxj-space-panel: #{base(10px)};

    /* 撑满 left aside 且内容超长时收缩（面板高度受限是组内滚动的前提） */
    display: flex;
    // flex: 1;
    min-height: 0;
    flex-direction: column;

    .panel-title {
        flex-shrink: 0;
    }

    .camera-stats {
        flex-shrink: 0;
        margin-top: base(7px);
    }

    /* ---- 分组列表:各分组平分面板剩余高度,内容超出各自滚动 ---- */
    .camera-groups {
        display: flex;
        flex: 1;
        min-height: 0;
        flex-direction: column;
        gap: base(10px);
        margin-top: base(9px);

        .camera-group {
            display: flex;
            flex-direction: column;
            max-height: base(300px);

            &:last-child {
                max-height: unset;
                flex: 1;
                min-height: 0;
            }

            /* 分组头（设计稿:px4 py6;固定不随卡片滚动） */
            .group-head {
                flex-shrink: 0;
                padding: base(6px) base(4px);
            }

            /* 卡片体:独立滚动层 */
            .group-body {
                flex: 1;
                min-height: 0;
                overflow-y: auto;
            }
        }

        /* 方阵子标题（设计稿:px8 py4,蓝灰 Medium） */
        .sub-title {
            margin: 0;
            padding: base(4px) base(8px);
            color: var(--color-blue-300);
            font-size: var(--lxj-font-body);
            font-weight: var(--lxj-font-weight-Medium);
            line-height: base(21px);
        }

        /* 卡片间距（设计稿 pt4） */
        .cameraCard + .cameraCard {
            margin-top: base(4px);
        }
    }
}
</style>

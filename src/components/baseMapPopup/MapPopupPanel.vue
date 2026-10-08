<template>
    <div v-show="visible" class="map-panel-popup">
        <BasePanel
            v-model="visible"
            :title="title"
            :width="width"
            :height="height"
            :draggable="draggable"
            @on-close="close"
            @on-confirm="emits('onConfirm')"
        >
            <component :is="content" />
        </BasePanel>
    </div>
</template>

<script setup lang="ts">
import { ref, type VNode } from 'vue';
import BasePanel from './basePanel.vue';

/**
 * 地图弹窗面板（内部组件，不直接使用，由 showMapPopup 挂载）
 * 复用 BasePanel 样式体系，整体上移、底部箭头指向锚点
 */
defineProps({
    title: {
        type: String,
        default: () => '标题'
    },
    width: {
        type: String,
        default: () => '420px'
    },
    height: {
        type: String,
        default: () => '240px'
    },
    draggable: {
        type: Boolean,
        default: () => true
    },
    content: {
        type: Object as () => VNode | null,
        default: null
    }
});

const emits = defineEmits(['onConfirm', 'onClose']);

const visible = ref(true);

/** 关闭弹窗并通知服务层销毁 */
const close = () => {
    visible.value = false;
    emits('onClose');
};

defineExpose({ close });
</script>

<style scoped lang="scss">
.map-panel-popup {
    position: absolute;
    left: 0;
    top: 0;
    /* 面板整体上移，底边落在锚点上 */
    transform: translate(-50%, -100%);
    pointer-events: auto;

    /* 覆盖 BasePanel 的 fixed 定位，改为随锚点移动 */
    :deep(.base-panel) {
        position: absolute;
        right: unset;
        top: unset;
    }
}
</style>

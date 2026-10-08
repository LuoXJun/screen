<template>
    <div v-if="visible" ref="panelRef" class="popup-panel" :style="{ height, width }">
        <div
            ref="triggerRef"
            class="popup-panel-header"
            :style="{ cursor: draggable ? 'move' : 'unset' }"
        >
            <!-- 左端斜切装饰 -->
            <img class="header-deco" :src="headerDecoIcon" alt="" />
            <p class="header-title">{{ title }}</p>
            <img class="close-icon" :src="closeIcon" alt="" @click="onCancel" />
        </div>
        <div class="popup-panel-content">
            <slot />
        </div>
        <div v-if="$slots.footer" class="popup-panel-footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useDraggable } from 'element-plus';
import { getImageWidthName } from '@/utils/getAssets';

const visible = defineModel<boolean>({ default: false });

const emits = defineEmits(['onConfirm', 'onClose']);

const props = defineProps({
    title: {
        type: String,
        default: () => '标题'
    },
    width: {
        type: String,
        default: () => '60%'
    },
    height: {
        type: String,
        default: () => '40%'
    },
    draggable: {
        type: Boolean,
        default: () => true
    }
});

// 需要移动的目标
const panelRef = useTemplateRef('panelRef');
// 触发移动事件的目标
const triggerRef = useTemplateRef('triggerRef');
const drag = computed(() => {
    return props.draggable;
});
useDraggable(panelRef as Ref<HTMLElement>, triggerRef as Ref<HTMLElement>, drag);

const onCancel = () => {
    visible.value = false;
    emits('onClose');
};

/** 组件内置资产（复用 dialog 系装饰件,与其他浮层视觉统一） */
const headerDecoIcon = getImageWidthName('dialog-header-deco.svg');
const closeIcon = getImageWidthName('dialog-close.svg');
</script>

<style lang="scss" scoped>
.popup-panel {
    position: fixed;
    right: 100px;
    top: 100px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    user-select: none;
    overflow: hidden;
    /* 与其他浮层统一的深色磨砂（设计稿取值,同 dialog-screen） */
    background: rgba(3, 31, 68, 0.5);
    border: 1px solid #2d6099;
    backdrop-filter: blur(base(10px));
    box-shadow: inset 0 0 base(20px) #1458a3;

    .popup-panel-header {
        position: relative;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        height: base(50px);
        overflow: hidden;
        border-bottom: 1px solid #469ce4;
        /* 设计稿取值:左浓右透蓝渐变 + 底槽实色 + 内发光 */
        background:
            linear-gradient(90deg, rgba(5, 102, 186, 0.83) 0%, rgba(2, 96, 160, 0) 100%),
            #003865;
        box-shadow:
            inset 0 base(-5px) base(13.5px) rgba(46, 135, 213, 0.63),
            inset 0 0 base(19.4px) rgba(5, 102, 186, 0.78);

        .header-deco {
            position: absolute;
            left: base(-30px);
            top: 0;
            width: base(340px);
            height: base(50px);
            pointer-events: none;
        }

        .header-title {
            position: relative;
            margin: 0;
            padding-left: base(14px);
            color: #fcffff;
            font-family: var(--lxj-font-family-title);
            font-size: font(20px);
        }

        .close-icon {
            position: absolute;
            right: base(15px);
            top: 50%;
            width: base(20px);
            height: base(20px);
            transform: translateY(-50%);
            cursor: pointer;
        }
    }

    .popup-panel-content {
        flex: 1;
        min-height: 0;
        padding: base(14px);
        overflow: auto;
    }

    .popup-panel-footer {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: flex-end;
        gap: base(20px);
        padding: 0 base(14px) base(14px);
    }
}
</style>

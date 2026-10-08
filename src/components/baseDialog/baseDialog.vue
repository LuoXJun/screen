<template>
    <el-dialog
        v-model="visible"
        class="dialog-screen"
        align-center
        append-to-body
        draggable
        :show-close="false"
        v-bind="$attrs"
    >
        <template #header>
            <!-- 左端斜切装饰 -->
            <img class="header-deco" :src="headerDecoIcon" alt="" />
            <div class="header-title">
                <img v-if="icon" class="title-icon" :src="getImageWidthName(icon)" alt="" />
                <span class="title-text">{{ title }}</span>
                <!-- 标题右侧附加内容（如设备状态标签） -->
                <slot name="header-extra"></slot>
            </div>
            <img class="close-icon" :src="closeIcon" alt="" @click="visible = false" />
        </template>
        <slot></slot>
        <template v-if="$slots.footer || buttons?.length" #footer>
            <slot name="footer">
                <div
                    v-for="(btn, i) in buttons"
                    :key="i"
                    class="dialog-btn"
                    :class="btn.type ? `is-${btn.type}` : ''"
                    @click="emits('action', btn, i)"
                >
                    <img class="btn-layer back" :src="btnLayerIcon" alt="" />
                    <img class="btn-layer front" :src="btnBgIcon" alt="" />
                    <span class="btn-label">{{ btn.label }}</span>
                </div>
            </slot>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { getImageWidthName } from '@/utils/getAssets';
import type { BaseDialogButton } from './baseDialog';

const visible = defineModel<boolean>({ default: false });

defineProps<{
    /** 标题 */
    title: string;
    /** 标题图标（assets/images 下文件名,可选） */
    icon?: string;
    /** 底部操作按钮（渲染于 #footer 插槽默认内容,插槽存在时以插槽优先） */
    buttons?: BaseDialogButton[];
}>();

const emits = defineEmits<{
    /** 操作按钮点击（回传按钮配置与其下标） */
    action: [button: BaseDialogButton, index: number];
}>();

/** 组件内置资产（经 getAssets 解析，同项目图片引用约定；顶部装饰线与右下角镶边见 _dialog.scss 伪元素） */
const headerDecoIcon = getImageWidthName('dialog-header-deco.svg');
const closeIcon = getImageWidthName('dialog-close.svg');
const btnLayerIcon = getImageWidthName('dialog-btn-layer.svg');
const btnBgIcon = getImageWidthName('dialog-btn-bg.svg');
</script>

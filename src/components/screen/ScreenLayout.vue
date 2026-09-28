<template>
    <div class="screen-layout">
        <!-- 地图层：真实尺寸 100% 弹性填充，独立自适应（页面不传 #map 时不渲染，避免空容器拦截全局地图交互） -->
        <div v-if="$slots.map" class="map-layer">
            <slot name="map" />
        </div>

        <!-- UI 层：流式布局 + clamp 限幅自适应（无整体缩放） -->
        <div class="ui-layer">
            <slot name="header" />
            <div class="layout-body">
                <slot name="left" />
                <slot name="right" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * 大屏基础布局组件（双图层流式框架）：
 * - 地图层（#map 插槽）：真实尺寸 100% 弹性填充
 * - UI 层：流式排布（顶底 100% 宽、左右面板、中央空隙），
 *   组件尺寸与字号由 clamp() 限幅自适应（1920×1080 为设计基准），
 *   不整体缩放——小屏保可读性下限，大屏/超宽屏不臃肿
 * - 底部栏由全局 layout 提供（贴底浮层），内容区 padding-bottom 留白避开
 *
 * 事件穿透：ui-layer / layout-body / main-gap 均 pointer-events: none，
 * 只有具体 UI 组件（ScreenPanel 等）自身 auto——地图交互不受遮挡。
 */
</script>

<style scoped lang="scss">
.screen-layout {
    width: 100vw;
    height: 100vh;
    position: relative;
    overflow: hidden;
    /* 背景由全局壳（App.vue）提供，页面自身透明，露出全局地图；
       整层事件穿透，地图交互不受页面容器遮挡（面板自身恢复 auto） */
    pointer-events: none;
}

.map-layer {
    position: absolute;
    inset: 0;
}

.ui-layer {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    /* 内容区从全局顶栏下方开始；底部留出全局底部栏高度（--lxj-footer-height） */
    padding-top: var(--lxj-header-height);
    padding-bottom: var(--lxj-footer-height);
    font-size: var(--lxj-font-body); /* 基础字号随视口自适应 */
    pointer-events: none; /* 整层穿透：地图交互不受 UI 层遮挡 */
}

.layout-body {
    flex: 1;
    min-height: 0;
    display: flex;
    justify-content: space-between;
    padding: var(--lxj-space-page);
    pointer-events: none; /* 空白容器穿透，中央地图可交互 */
}
</style>

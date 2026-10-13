<template>
    <div class="basePanelMask" :class="{ 'is-collapsed': collapsed }">
        <basePanelHandle v-if="collapsible" :collapsed="collapsed" @toggle="toggle" />
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import basePanelHandle from './basePanelHandle.vue';

defineProps({
    /** 显示收起/展开把手(默认隐藏);点击把手面板整体下滑收起,把手停在面板原底边处 */
    collapsible: {
        type: Boolean,
        default: false
    }
});

const collapsed = ref(false);

const toggle = () => {
    collapsed.value = !collapsed.value;
};
</script>

<style scoped lang="scss">
.basePanelMask {
    /* 上下内衬单一数据源:与把手的负偏移公式共用(见 basePanelHandle)——
       调整上下间距只改它(或其来源 --lxj-space-top 的值),把手位置自动跟随。
       slot 内容直挂本层(不包内衬层):消费方常以本组件根为 flex 容器做
       限高滚动(flex:1 + overflow),多包一层会打断其 flex 链 */
    --lxj-panel-space-y: var(--lxj-space-top);

    border-radius: var(--lxj-radius-small);
    background: var(--lxj-bg-mask); /* blue-900/85%,与把手同源(原为同值硬编码) */
    border: 1px solid var(--lxj-color-border-primary-light);
    pointer-events: all;
    padding: var(--lxj-panel-space-y) var(--lxj-space-panel);
    /* 收起:面板整体下滑出容器外,把手(位于顶缘上方)恰好停在面板原底边处 */
    transition: transform 0.3s ease;

    /* 滑出后视口内可能残存面板顶条(取决于消费方容器与视口底的间距,如 .screen 的页边距):
       visibility 延迟到滑动结束再隐藏残条(动画期间完整可见),同时不拦截地图鼠标事件;
       展开侧(order 反向)由基础态 transition 立即恢复 */
    &.is-collapsed {
        transform: translateY(100%);
        visibility: hidden;
        pointer-events: none;
        transition:
            transform 0.3s ease,
            visibility 0s 0.3s;
    }

    /* 子组件根(scoped 命中):收起后把手仍须可见可点 */
    .basePanelHandle {
        visibility: visible;
        pointer-events: auto;
    }
}
</style>

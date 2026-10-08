<template>
    <el-container class="layout-shell">
        <el-header class="layout-navbar">
            <img src="@/assets/images/pro-title.png" alt="" />
            <el-button>退出</el-button>
        </el-header>
        <el-container class="layout-body">
            <el-aside class="side-bar">
                <baseMenu />
            </el-aside>
            <el-main class="content">
                <!-- 图层管理 -->
                <layerControl v-model="checkedLayers" class="layer-control" :list="LAYER_ITEMS" />
                <!-- 全局地图层：路由切换不销毁，视角状态跨页面保留 -->
                <div class="layout-map">
                    <BaseCesium />
                </div>
                <div class="screen">
                    <RouterView />
                </div>
            </el-main>
        </el-container>
    </el-container>
    <!-- 三类设备弹窗（点击地图点位弹出） -->
    <CameraPopup v-if="cameraData" :data="cameraData" @close="cameraData = null" />
    <FiberPopup v-if="fiberData" :data="fiberData" @close="fiberData = null" />
    <NestPopup v-if="nestData" :data="nestData" @close="nestData = null" />
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import BaseCesium from '@/components/baseCesium/BaseCesium.vue';
import baseMenu from '@/components/baseMenu/baseMenu.vue';
import layerControl from '@/components/screen/layerControl/layerControl.vue';
import PopupInfo from '@/components/screen/popups/PopupInfo.vue';
import CameraPopup from '@/components/screen/popups/CameraPopup.vue';
import FiberPopup from '@/components/screen/popups/FiberPopup.vue';
import NestPopup from '@/components/screen/popups/NestPopup.vue';
import type { CameraData } from '@/components/screen/popups/CameraPopup';
import type { FiberData } from '@/components/screen/popups/FiberPopup';
import type { NestData } from '@/components/screen/popups/NestPopup';
import { showMapPopup } from '@/components/screen/mapPopup/mapPopup';
import { useMapEntities } from './composables/useMapEntities';
import { useEntityPopup } from './composables/useEntityPopup';
import { useLayerControl } from './composables/useLayerControl';

/* 主题作用域同步到 html[data-app]：语义令牌层按端解析，
   teleport 到 body 的 EP 浮层同样命中，与管理端 admin 作用域互不干扰。
   必须在 setup 阶段同步置位（而非 onMounted）：子组件 setup/mounted 均早于
   父组件 onMounted，置于 mounted 会让首屏内联算基准的组件（如 scalePx）读不到
   --screen-base 而退回设计原值 */
document.documentElement.dataset.app = 'screen';

/* 地图业务编排（实现见 ./composables/） */
useMapEntities();

/** 三类设备弹窗数据（null=关闭；点击对应点位时填充） */
const cameraData = ref<CameraData | null>(null);
const fiberData = ref<FiberData | null>(null);
const nestData = ref<NestData | null>(null);

useEntityPopup({
    contents: {
        /* 三类设备：各自的自包含弹窗（标题/按钮/内容由弹窗组件内置） */
        camera: ({ props }) => {
            cameraData.value = props as unknown as CameraData;
        },
        fiber: ({ props }) => {
            fiberData.value = props as unknown as FiberData;
        },
        nest: ({ props }) => {
            nestData.value = props as unknown as NestData;
        }
    },
    /* 未注册类型：地图锚点信息卡兜底 */
    fallback: ({ position, lonlat }) => {
        showMapPopup({
            position,
            title: '实体信息',
            width: '20vw',
            height: '15vw',
            content: h(PopupInfo, { lonlat })
        });
    }
});
const { LAYER_ITEMS, checkedLayers } = useLayerControl();

onUnmounted(() => {
    /* HMR 热更新会重建组件实例(新实例 setup 设置作用域后,旧实例再触发本钩子),
       若此处直接删除会把新实例刚设置的值清掉——dev 下跳过,生产环境正常清理 */
    if (!import.meta.hot) {
        delete document.documentElement.dataset.app;
    }
});
</script>

<style scoped lang="scss">
.layout-shell {
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    .layout-navbar {
        height: var(--lxj-header-height);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: var(--lxj-bg-bar);
        border-bottom: 1px solid var(--lxj-color-border-light);

        > img {
            width: base(145px);
        }

        .navbar-right {
            display: flex;
            align-items: center;
            gap: base(24px);
        }
    }
    .layout-body {
        flex: 1;
        min-height: 0;
        .side-bar {
            position: relative;
            width: base(180px);
            background: var(--lxj-bg-bar);
        }

        .content {
            position: relative;
            /* 图层管理：贴侧栏底部居中（菜单占满高度,不参与文档流） */
            .layer-control {
                position: absolute;
                left: var(--lxj-aside-width);
                top: base(12px);
                transform: translateX(20%);
                z-index: var(--lxj-z-sticky);
            }
            .layout-map {
                position: absolute;
                width: 100%;
                height: 100%;
            }
            .screen {
                width: 100%;
                height: 100%;
                position: absolute;
                pointer-events: none;
                z-index: var(--lxj-z-sticky);
                padding: var(--lxj-space-page);
            }
        }
    }
}
</style>

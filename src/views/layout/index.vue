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
            <el-main class="content" :style="pageAsideStyle">
                <!-- 全局地图层：路由切换不销毁，视角状态跨页面保留 -->
                <div class="layout-map">
                    <BaseCesium />
                </div>
                <div class="screen">
                    <!-- 站点切换时重建页面组件（切换即初始化,不保留筛选等页面状态） -->
                    <RouterView :key="activeSite" />
                </div>
                <!-- 全局站点切换（每页展示,悬浮于左侧面板上方） -->
                <siteSwitch v-model="activeSite" class="site-switch" />
                <!-- 全局图层管理（每页展示,贴左栏右侧） -->
                <layerControl v-model="checkedLayers" class="layer-control" :list="LAYER_ITEMS" />
            </el-main>
        </el-container>
    </el-container>
    <!-- 三类设备弹窗（点击地图点位弹出） -->
    <CameraPopup v-if="cameraData" :data="cameraData" @close="cameraData = null" />
    <FiberPopup v-if="fiberData" :data="fiberData" @close="fiberData = null" />
    <NestPopup v-if="nestData" :data="nestData" @close="nestData = null" />
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseCesium from '@/components/baseCesium/BaseCesium.vue';
import baseMenu from '@/components/baseMenu/baseMenu.vue';
import layerControl from '@/components/screen/layerControl/layerControl.vue';
import PopupInfo from '@/components/screen/popups/PopupInfo.vue';
import CameraPopup from '@/components/screen/popups/camera/CameraPopup.vue';
import FiberPopup from '@/components/screen/popups/fiber/FiberPopup.vue';
import NestPopup from '@/components/screen/popups/nest/NestPopup.vue';
import siteSwitch from '@/components/screen/siteSwitch/siteSwitch.vue';
import type { CameraData } from '@/components/screen/popups/camera/CameraPopup';
import type { FiberData } from '@/components/screen/popups/fiber/FiberPopup';
import type { NestData } from '@/components/screen/popups/nest/NestPopup';
import { showMapPopup, type MapPopupHandle } from '@/components/screen/mapPopup/mapPopup';
import {
    clearHandlers,
    destroyViewer,
    removeAllDataSources,
    removeAllEntities,
    removeAllLayers
} from '@/cesium';
import { useSiteStore } from '@/stores/site';
import { useMapEntities } from './composables/useMapEntities';
import { useSiteSwitch } from './composables/useSiteSwitch';
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
useSiteSwitch();

const router = useRouter();
const route = useRoute();

/** 页面左栏宽度变量：路由 meta 按设计稿 px 声明时覆盖全局默认 320（供左栏与全局悬浮面板共用） */
const pageAsideStyle = computed(() => {
    const asideWidth = route.meta.asideWidth;
    return typeof asideWidth === 'number'
        ? { '--lxj-page-aside-width': `calc(var(--screen-base) * ${asideWidth} / 1920)` }
        : undefined;
});

/** 当前站点（写入口径统一走 store.switchSite,以携带切换纪元） */
const siteStore = useSiteStore();
const activeSite = computed({
    get: () => siteStore.activeSite,
    set: (key) => siteStore.switchSite(key)
});

/** 图层管理（全局,每页可见；勾选联动地图图层显隐,状态跨路由保留） */
const { LAYER_ITEMS, checkedLayers } = useLayerControl();

/** 三类设备弹窗数据（null=关闭；点击对应点位时填充） */
const cameraData = ref<CameraData | null>(null);
const fiberData = ref<FiberData | null>(null);
const nestData = ref<NestData | null>(null);

/** 兜底地图弹窗句柄（命令式创建,切换站点时统一关闭） */
let fallbackPopup: MapPopupHandle | null = null;

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
        fallbackPopup?.close();
        fallbackPopup = showMapPopup({
            position,
            title: '实体信息',
            width: '20vw',
            height: '15vw',
            content: h(PopupInfo, { lonlat }),
            onClose: () => {
                fallbackPopup = null;
            }
        });
    }
});

/** 切换站点时关闭全部弹窗,避免旧站点数据残留（设备弹窗为 v-if 状态,兜底弹窗为命令式句柄） */
watch(activeSite, () => {
    cameraData.value = null;
    fiberData.value = null;
    nestData.value = null;
    fallbackPopup?.close();
});

onUnmounted(() => {
    /* HMR 热更新会重建组件实例(新实例 setup 设置作用域后,旧实例再触发本钩子),
       若此处直接删除会把新实例刚设置的值清掉——dev 下跳过,生产环境正常清理 */
    if (!import.meta.hot && document.documentElement.dataset.app === 'screen') {
        delete document.documentElement.dataset.app;
    }

    /* 跨端离场(切到管理端/退出登录)时销毁 Cesium 会话:
       dev 下 BaseCesium 的 HMR 防御不会清理,但真实跨端切换必须清理,
       否则 Viewer 随容器卸载悬空(切回大屏将无地图);HMR 重建时当前路由仍属本端,跳过 */
    if (router.currentRoute.value.matched[0]?.meta?.app === 'screen') return;
    clearHandlers();
    removeAllLayers();
    removeAllDataSources();
    removeAllEntities();
    destroyViewer();
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
            /* 页面侧栏顶缘避让全局站点切换按钮（按钮高 32 + 间距 10）；
               定义在使用方（screen 内页面侧栏 / 站点切换 / 图层管理）的共同祖先上 */
            --lxj-aside-top-offset: #{base(42px)};
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

        /* 全局站点切换:与页面内容(左 aside)左/上缘对齐 */
        .site-switch {
            position: absolute;
            top: var(--lxj-space-page);
            left: var(--lxj-space-page);
            z-index: var(--lxj-z-sticky);
        }

        /* 全局图层管理:贴左栏右侧、顶部与侧栏内容顶对齐
           （左缘=内容左缘+侧栏宽;顶缘=内容顶缘+侧栏避让） */
        .layer-control {
            position: absolute;
            left: calc(var(--lxj-space-page) + var(--lxj-page-aside-width, var(--lxj-aside-width)));
            top: calc(var(--lxj-space-page) + var(--lxj-aside-top-offset));
            transform: translateX(10%);
            z-index: var(--lxj-z-sticky);
        }
    }
}
</style>

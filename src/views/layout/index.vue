<template>
    <el-container class="layout-shell">
        <el-header class="layout-navbar">
            <img src="@/assets/images/pro-title.png" alt="" />
            <el-button>退出</el-button>
        </el-header>
        <el-container class="layout-body">
            <el-aside class="side-bar"><baseMenu /></el-aside>
            <el-main class="content">
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
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue';
import BaseCesium from '@/components/baseCesium/BaseCesium.vue';
import baseMenu from '@/components/baseMenu/baseMenu.vue';
import { createHandler, getViewer, toLonLat } from '@/cesium';
import * as Cesium from 'cesium';
import { showMapPopup } from '@/components/baseMapPopup/mapPopup';
import PopupInfo from '@/components/baseMapPopup/PopupInfo.vue';

/* 主题作用域同步到 html[data-app]：语义令牌层按端解析，
   teleport 到 body 的 EP 浮层同样命中，与管理端 admin 作用域互不干扰。
   必须在 setup 阶段同步置位（而非 onMounted）：子组件 setup/mounted 均早于
   父组件 onMounted，置于 mounted 会让首屏内联算基准的组件（如 scalePx）读不到
   --screen-base 而退回设计原值 */
document.documentElement.dataset.app = 'screen';

onMounted(() => {
    const pickHandler = createHandler();
    pickHandler.setInputAction((movement: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const picked = getViewer().scene.pick(movement.position);
        if (!Cesium.defined(picked)) return;
        const entity = picked.id instanceof Cesium.Entity ? picked.id : undefined;
        if (!entity) return;
        const position = entity.position?.getValue(getViewer().clock.currentTime);
        if (!position) return;
        showMapPopup({
            position,
            title: '实体信息',
            width: '20vw',
            height: '15vw',
            content: h(PopupInfo, { lonlat: toLonLat(position) })
        });
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
});

onUnmounted(() => {
    delete document.documentElement.dataset.app;
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
            width: base(180px);
            background: var(--lxj-bg-bar);
        }

        .content {
            position: relative;
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

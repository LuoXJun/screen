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
                <!-- 站点切换重建页面（切换即初始化;管理端站点切换器待定,key 兜底全站语义） -->
                <RouterView :key="siteStore.activeSite" />
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue';
import baseMenu from '@/components/baseMenu/baseMenu.vue';
import { useSiteStore } from '@/stores/site';

/* 主题作用域同步到 html[data-app]（_admin.scss 生效位）：
   同大屏布局，须在 setup 阶段同步置位（子组件首个 mounted 均早于本组件 mounted） */
document.documentElement.dataset.app = 'admin';

const siteStore = useSiteStore();

onUnmounted(() => {
    /* HMR 热更新会重建组件实例（dev 下跳过删除，防清掉新实例刚设置的值）；
       仅当当前值仍为本端时才清空（切到其他端时新布局可能已在 setup 中设置新值） */
    if (!import.meta.hot && document.documentElement.dataset.app === 'admin') {
        delete document.documentElement.dataset.app;
    }
});
</script>

<style scoped lang="scss">
/* 布局骨架：结构与大屏一致（顶栏 / 侧栏菜单 / 内容区），视觉差异待设计稿；
   无地图层与站点切换/图层管理（Cesium 模块仅大屏端） */
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
            overflow: auto;
            padding: var(--lxj-space-page);
        }
    }
}
</style>

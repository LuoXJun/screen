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
import { onMounted, onUnmounted } from 'vue';
import BaseCesium from '@/components/baseCesium/BaseCesium.vue';
import baseMenu from '@/components/baseMenu/baseMenu.vue';

/* 主题作用域同步到 html[data-app]：语义令牌层按端解析，
   teleport 到 body 的 EP 浮层同样命中，与管理端 admin 作用域互不干扰 */
onMounted(() => {
    document.documentElement.dataset.app = 'screen';
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

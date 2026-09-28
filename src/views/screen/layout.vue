<template>
    <div class="layout-shell">
        <!-- 全局顶部导航：左侧标题 + 右侧菜单 -->
        <header class="layout-navbar">
            <h1 class="navbar-title">大屏标题</h1>
            <div class="navbar-right">
                <BaseMenu />
                <button class="back-admin-btn" @click="router.push('/admin')">返回管理端</button>
            </div>
        </header>

        <!-- 全局地图层：路由切换不销毁，视角状态跨页面保留 -->
        <div class="layout-map">
            <BaseCesium />
        </div>

        <!-- 页面出口：子页面自行组织 ScreenLayout 布局，叠加在全局地图之上 -->
        <RouterView />

        <!-- 全局底部栏：贴底浮层，页面内容区通过 padding-bottom 留白避开 -->
        <ScreenFooter class="layout-footer" text="大屏可视化平台" status="运行正常" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import BaseCesium from '@/components/screen/baseCesium/BaseCesium.vue';
import BaseMenu from '@/components/screen/BaseMenu.vue';
import ScreenFooter from '@/components/screen/ScreenFooter.vue';

const router = useRouter();

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
    position: relative;
    overflow: hidden;
    background:
        radial-gradient(
            ellipse at 50% 0%,
            color-mix(in srgb, var(--lxj-color-primary) 16%, transparent),
            transparent 55%
        ),
        var(--lxj-bg-page);
}

.layout-navbar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: var(--lxj-header-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 base(32px);
    background: var(--lxj-bg-panel);
    border-bottom: 1px solid var(--lxj-color-border);
    z-index: 20;

    .navbar-title {
        font-family: var(--lxj-font-family-title);
        font-size: var(--lxj-font-hero);
        letter-spacing: var(--lxj-letter-spacing-little);
        color: var(--lxj-color-text-primary);
        text-shadow: 0 0 base(18px) color-mix(in srgb, var(--lxj-color-primary) 65%, transparent);
        margin: 0;
    }

    .navbar-right {
        display: flex;
        align-items: center;
        gap: base(24px);
    }

    .back-admin-btn {
        height: base(32px);
        padding: 0 base(16px);
        box-sizing: border-box;
        font-size: var(--lxj-font-section);
        letter-spacing: 1px;
        color: var(--lxj-color-primary);
        background: color-mix(in srgb, var(--lxj-color-primary) 12%, transparent);
        border: 1px solid color-mix(in srgb, var(--lxj-color-primary) 45%, transparent);
        border-radius: base(4px);
        cursor: pointer;
        transition: background 0.2s;

        &:hover {
            background: color-mix(in srgb, var(--lxj-color-primary) 24%, transparent);
        }
    }
}

.layout-map {
    position: absolute;
    inset: 0;
}

/* 全局底部栏：贴底浮层，页面内容区通过 padding-bottom 留白避开 */
.layout-footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 15;
}
</style>

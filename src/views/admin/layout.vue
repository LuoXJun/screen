<template>
    <el-container class="admin-shell">
        <el-aside v-if="sideMenu.length" width="220px" class="admin-aside">
            <div class="aside-brand">项目管理系统</div>
            <el-menu class="aside-menu" :default-active="activePath" router>
                <baseMenuHorizontalAside :list="sideMenu" />
            </el-menu>
        </el-aside>
        <el-container class="admin-body">
            <el-header height="56px" class="admin-header">
                <baseMenuHorizontalHeader />
            </el-header>
            <el-main class="admin-main">
                <RouterView />
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import baseMenuHorizontalAside from '@/components/admin/baseMenuHorizontal/baseMenuHorizontalAside.vue';
import baseMenuHorizontalHeader from '@/components/admin/baseMenuHorizontal/baseMenuHorizontalHeader.vue';

const route = useRoute();

const activePath = computed(() => route.path);

/* 主题作用域同步到 html[data-app]：语义令牌层（styles/tokens）按端解析，
   挂 html 而非布局根，teleport 到 body 的 EP 弹层同样命中 */
onMounted(() => {
    document.documentElement.dataset.app = 'admin';
});
onUnmounted(() => {
    delete document.documentElement.dataset.app;
});

/** 侧栏菜单跟随顶栏选中项：取当前一级菜单路由的子路由；一级菜单无子级时侧栏隐藏 */
const sideMenu = computed(() => route.matched[1]?.children ?? []);
</script>

<style scoped lang="scss">
.admin-shell {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: linear-gradient(180deg, var(--lxj-bg-sidebar) 0%, var(--lxj-bg-page) 100%);
}

.admin-aside {
    background: var(--lxj-bg-sidebar);
    border-right: 1px solid var(--lxj-color-border);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;

    .aside-brand {
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: var(--font-weight-600);
        font-size: var(--lxj-font-section);
        letter-spacing: 1px;
        color: var(--lxj-color-text-primary);
        border-bottom: 1px solid var(--lxj-color-border);
        flex-shrink: 0;
    }

    .aside-menu {
        flex: 1;
        overflow-y: auto;
        border-right: none;
        background: transparent;
        --el-menu-item-height: 46px;
        --el-menu-bg-color: transparent;
        --el-menu-text-color: var(--lxj-color-text-regular);
        --el-menu-hover-bg-color: var(--lxj-bg-hover);

        :deep(.el-menu-item.is-active) {
            background: var(--lxj-bg-active);
        }
    }
}

.admin-body {
    display: flex;
    flex-direction: column;
}

.admin-header {
    background: var(--lxj-bg-panel);
    border-bottom: 1px solid var(--lxj-color-border);
    padding: 0;
}

.admin-main {
    flex: 1;
    min-height: 0;
    overflow: auto;
    background: var(--lxj-bg-page);
    padding: var(--lxj-space-page);
}
</style>

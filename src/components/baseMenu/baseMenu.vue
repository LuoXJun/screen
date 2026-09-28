<template>
    <el-menu class="base-menu" :default-active="activePath" router>
        <baseMenuHorizontalAside :list="sideMenu" />
    </el-menu>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import baseMenuHorizontalAside from './baseMenuHorizontalAside.vue';

const route = useRoute();
const activePath = computed(() => route.path);

/** 侧栏承载全部菜单：取布局路由的子路由（4 个分类），经组件自递归展开二级 */
const sideMenu = computed(() => route.matched[0]?.children ?? []);
</script>

<style scoped lang="scss">
.base-menu {
    height: 100%;
    border: unset;

    :deep(.el-sub-menu) {
        background-color: var(--lxj-menu-active-bg-color);
    }
    :deep(.is-active) {
        background-color: var(--lxj-menu-active-bg-color);
    }
    :deep(.el-sub-menu__title) {
        --el-menu-text-color: var(--color-blue-50);
    }
}
</style>

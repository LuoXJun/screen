<template>
    <el-menu
        class="base-menu"
        :default-active="activePath"
        :default-openeds="openedCategories"
        router
        @open="onMenuOpen"
        @close="onMenuClose"
    >
        <baseMenuHorizontalAside :list="sideMenu" />
    </el-menu>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { menuRoutes } from '@/router';
import { openedCategories } from './menuOpened';
import baseMenuHorizontalAside from './baseMenuHorizontalAside.vue';

const route = useRoute();
const activePath = computed(() => route.path);

/** 侧栏承载全部菜单（两端一致，可从任一端跳转另一端），经组件自递归展开二级 */
const sideMenu = menuRoutes;

/** 当前页面所属分类（自动保持展开） */
const activeCategory = computed(() => `/${route.path.split('/')[1] ?? ''}`);

watch(
    activeCategory,
    (category) => {
        if (!openedCategories.value.includes(category)) {
            openedCategories.value = [...openedCategories.value, category];
        }
    },
    { immediate: true }
);

/* 展开态由 menuOpened（模块级数组）维护：default-openeds 提供重建还原值,
   open/close 事件同步用户操作；activeCategory 保证当前页所属分类始终展开 */
function onMenuOpen(index: string): void {
    if (!openedCategories.value.includes(index)) {
        openedCategories.value = [...openedCategories.value, index];
    }
}

function onMenuClose(index: string): void {
    openedCategories.value = openedCategories.value.filter((i) => i !== index);
}
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

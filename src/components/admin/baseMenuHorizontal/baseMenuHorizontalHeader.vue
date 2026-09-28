<template>
    <div class="base-horizontal-menu-header">
        <div class="menu-part">
            <template v-for="menu in menus" :key="menu.path">
                <div class="lxj-menu-item" @click="goPath(menu)">
                    <span :class="{ 'is-selected': isMenuActive(menu) }">
                        {{ menu.meta?.title }}
                    </span>
                </div>
            </template>
        </div>
        <div class="operation-part">
            <el-button @click="router.push('/login')">退出登录</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const router = useRouter();
const route = useRoute();

/** 顶栏菜单 = 布局路由的子路由中带 meta.title 且未隐藏的项（路由即菜单） */
const menus = computed(() => (route.matched[0]?.children ?? []).filter(isMenuItem));

function isMenuItem(record: RouteRecordRaw): boolean {
    return Boolean(record.meta?.title) && !record.meta?.isHidden;
}

/** 父级非页面时，跳其第一个可见子路由 */
function targetPath(menu: RouteRecordRaw): string {
    const first = (menu.children ?? []).find(isMenuItem);
    return first ? targetPath(first) : menu.path;
}

function isMenuActive(menu: RouteRecordRaw): boolean {
    const path = targetPath(menu);
    return route.path === path || route.path.startsWith(`${path}/`);
}

function goPath(menu: RouteRecordRaw): void {
    router.push(targetPath(menu));
}
</script>

<style scoped lang="scss">
.base-horizontal-menu-header {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    box-sizing: border-box;
    .menu-part {
        height: 100%;
        display: flex;
        align-items: center;

        .lxj-menu-item {
            cursor: pointer;
            > span {
                color: var(--lxj-color-text-primary);
                margin-right: 20px;
                display: inline-block;
                padding: 8px 20px;
                transition: background 0.2s;
                &:hover {
                    background: var(--lxj-bg-hover);
                }
                &.is-selected {
                    background: var(--lxj-bg-active);
                }
            }
        }
    }
}
</style>

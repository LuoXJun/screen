import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import type { Component } from 'vue';
import { menuTree } from './menu';

/**
 * 路由即菜单（双端）：布局按"端"挂在分类路由上——大屏分类挂大屏布局、
 * 管理端分类挂管理端布局；URL 一律绝对路径、无端级前缀（既有地址不变）。
 * 菜单组件按当前端过滤 menuRoutes 渲染（见 baseMenu）。
 */

/** 页面组件表：Vite 须静态分析，glob 用字面量，不能拼变量路径 */
const pageModules = import.meta.glob<Component>('../views/pages/**/index.vue');

function resolvePage(categoryName: string, leafName: string): () => Promise<Component> {
    const key = `../views/pages/${categoryName}/${leafName}/index.vue`;
    const component = pageModules[key];
    if (!component) {
        throw new Error(`[router] 页面组件缺失：${key}（menu.ts 的 name 须与目录同名）`);
    }
    return component;
}

/** 端级布局组件（常量引用：同端跨分类切换时布局按组件复用不重建） */
const layouts = {
    screen: () => import('@/views/layout/index.vue'),
    admin: () => import('@/views/layout/admin/index.vue')
} as const;

/** 分类路由（导出供菜单按端过滤渲染）：children 一律绝对路径 */
export const menuRoutes: RouteRecordRaw[] = menuTree.map((category) => {
    const basePath = `/${category.name}`;
    return {
        path: basePath,
        name: category.name,
        redirect: `${basePath}/${category.children[0].name}`,
        component: layouts[category.app],
        meta: { title: category.title, icon: category.icon, app: category.app },
        children: category.children.map((leaf) => ({
            path: `${basePath}/${leaf.name}`,
            name: leaf.name,
            component: resolvePage(category.name, leaf.name),
            meta: { title: leaf.title, icon: leaf.icon }
        }))
    };
});

/** 应用落地页取菜单树首项（须先于 /home 重定向目标计算） */
const defaultPath = (() => {
    const category = menuTree.at(0);
    const leaf = category?.children.at(0);
    return category && leaf ? `/${category.name}/${leaf.name}` : '/login';
})();

/** 首页并入大屏分类记录（URL /home 保留,直接重定向到落地页；与三维分析页同记录，布局复用行为同改造前） */
menuRoutes
    .find((record) => record.meta?.app === 'screen')
    ?.children?.unshift({
        path: '/home',
        name: 'home',
        redirect: defaultPath,
        meta: { title: '首页', isHidden: true }
    });

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: { isHidden: true }
    },
    {
        path: '/:pathMatch(.*)',
        name: 'notFound',
        component: () => import('@/views/notFound.vue'),
        meta: { isHidden: true }
    },
    {
        path: '/',
        name: 'index',
        redirect: defaultPath
    },
    ...menuRoutes
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 };
    }
});

export default router;

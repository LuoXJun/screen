import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import type { Component } from 'vue';
import { menuTree } from './menu';

/**
 * 路由即菜单：布局路由(meta.isHidden 未设)的 children 中带 meta.title 的项自动成为菜单条目。
 * 大屏菜单树由 menu.ts 生成，两级——分类仅作分组(无组件，redirect 到首个子项)，叶子挂页面组件。
 * 子路由一律写绝对路径，便于一眼看清完整地址，也让菜单组件免去拼接前缀。
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

const menuRoutes: RouteRecordRaw[] = menuTree.map((category) => {
    const basePath = `/${category.name}`;
    return {
        path: basePath,
        name: category.name,
        redirect: `${basePath}/${category.children[0].name}`,
        meta: { title: category.title },
        children: category.children.map((leaf) => ({
            path: `${basePath}/${leaf.name}`,
            name: leaf.name,
            component: resolvePage(category.name, leaf.name),
            meta: { title: leaf.title }
        }))
    };
});

/** 应用落地页取菜单树首项 */
const defaultPath = (() => {
    const category = menuTree.at(0);
    const leaf = category?.children.at(0);
    return category && leaf ? `/${category.name}/${leaf.name}` : '/home';
})();

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
        redirect: defaultPath,
        component: () => import('@/views/layout/index.vue'),
        children: [
            {
                path: '/home',
                name: 'home',
                component: () => import('@/views/pages/index.vue'),
                meta: { title: '首页', isHidden: true }
            },
            ...menuRoutes
        ]
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 };
    }
});

export default router;

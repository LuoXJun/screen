import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

/**
 * 路由即菜单：布局路由(meta.isHidden 未设)的 children 中带 meta.title 的项自动成为菜单条目。
 * 管理端(/admin)与大屏(/screen)各自独立、互不联动，两端之间靠业务自行 router.push 跳转。
 * 子路由一律写绝对路径，便于一眼看清完整地址，也让菜单组件免去拼接前缀。
 */
const routes: RouteRecordRaw[] = [
    { path: '/', redirect: '/admin' },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: { isHidden: true }
    },
    {
        path: '/admin',
        name: 'admin',
        component: () => import('@/views/admin/layout.vue'),
        redirect: '/admin/project',
        children: [
            {
                path: '/admin/project',
                name: 'adminProject',
                component: () => import('@/views/admin/project/index.vue'),
                meta: { title: '项目列表' }
            }
        ]
    },
    {
        path: '/screen',
        name: 'screen',
        component: () => import('@/views/screen/layout.vue'),
        redirect: '/screen/index',
        children: [
            {
                path: '/screen/index',
                name: 'screenIndex',
                component: () => import('@/views/screen/index/index.vue'),
                meta: { title: '首页' }
            }
        ]
    },
    {
        path: '/:pathMatch(.*)',
        name: 'notFound',
        component: () => import('@/views/notFound.vue'),
        meta: { isHidden: true }
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

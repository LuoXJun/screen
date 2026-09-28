import 'vue-router';

declare module 'vue-router' {
    interface RouteMeta {
        /** 菜单标题：存在即进入菜单（路由即菜单的开关） */
        title?: string;
        /** 菜单图标：EP 图标组件名，或 utils/getAssets 解析的资源名 */
        icon?: string;
        /** 从菜单中隐藏（登录页、详情页、兜底页等） */
        isHidden?: boolean;
    }
}

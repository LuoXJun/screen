<template>
    <el-menu
        mode="horizontal"
        :ellipsis="false"
        :default-active="activePath"
        class="base-menu"
        @select="onSelect"
    >
        <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
            {{ item.label }}
        </el-menu-item>
    </el-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

/**
 * 布局路由菜单：菜单项从当前布局路由的子路由派生（meta.title 作菜单名，path 作跳转地址），
 * 单一事实来源——新增页面只需注册路由并配置 meta.title。
 */
const route = useRoute();
const router = useRouter();

const menuItems = computed(() => {
    const layoutRoute = route.matched[0];
    return (layoutRoute?.children ?? [])
        .filter((child) => child.meta?.title)
        .map((child) => ({
            label: String(child.meta!.title),
            // 动态路由的 child.path 可能为绝对路径（如 '/A'），避免拼出 '//A'
            path: child.path.startsWith('/') ? child.path : `/${child.path}`
        }));
});

const activePath = computed(() => route.path);

function onSelect(path: string): void {
    router.push(path);
}
</script>

<style scoped lang="scss">
.base-menu {
    flex-shrink: 0;
    --el-menu-bg-color: transparent;
    --el-menu-text-color: var(--lxj-color-text-primary);
    /* 选中色走 EP 变量机制（内部规则取值），避免逐条覆盖 + !important */
    --el-menu-active-color: var(--lxj-color-primary);
    --el-menu-hover-bg-color: transparent;
    border-bottom: none;

    :deep(.el-menu-item) {
        font-size: var(--lxj-font-body);
        letter-spacing: 1px;
        border-bottom: 2px solid transparent;

        &.is-active {
            border-bottom-color: var(--lxj-color-primary);
            text-shadow: 0 0 base(10px)
                color-mix(in srgb, var(--lxj-color-primary) 60%, transparent);
        }

        &:hover {
            background: color-mix(in srgb, var(--lxj-color-primary) 8%, transparent);
        }
    }
}
</style>

<template>
    <div class="base-menu-horizontal-aside">
        <template v-for="item in visible" :key="item.path">
            <el-sub-menu v-if="item.children?.length" :index="item.path">
                <template #title>
                    <i class="menu-icon" :style="iconStyle(item.meta?.icon)" />
                    <span class="menu-title">{{ item.meta?.title }}</span>
                </template>
                <!-- 组件自递归 -->
                <baseMenuHorizontalAside :list="item.children" />
            </el-sub-menu>
            <el-menu-item v-else :index="item.path" :to="item.path">
                <i class="menu-icon" :style="iconStyle(item.meta?.icon)" />
                <span class="menu-title">{{ item.meta?.title }}</span>
            </el-menu-item>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { getImageWidthName } from '@/utils/getAssets';

/** 侧栏菜单 = 当前一级菜单路由的子路由（路径为绝对路径，无需拼接父级） */
const props = defineProps<{ list: RouteRecordRaw[] }>();

const visible = computed(() =>
    props.list.filter((record) => record.meta?.title && !record.meta?.isHidden)
);

/**
 * 图标以 mask 着色（形状取 svg,颜色/透明度由菜单项状态控制）:
 * 未激活跟随文字色半透明、激活点亮（currentColor + opacity）,分类头固定青色。
 * 无图标项返回透明占位,保持文字对齐。
 */
function iconStyle(icon?: unknown): Record<string, string> {
    if (typeof icon !== 'string' || !icon) return { background: 'transparent' };
    const url = `url("${getImageWidthName(icon)}")`;
    return { maskImage: url, WebkitMaskImage: url };
}
</script>

<style lang="scss" scoped>
.base-menu-horizontal-aside {
    height: 100%;

    /* 菜单图标:mask 着色,未激活半透明、激活点亮 */
    .menu-icon {
        display: inline-block;
        flex-shrink: 0;
        width: base(14px);
        height: base(14px);
        margin-right: base(8px);
        background: currentColor;
        mask-repeat: no-repeat;
        mask-position: center;
        mask-size: contain;
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-position: center;
        -webkit-mask-size: contain;
        opacity: 0.5;
    }

    /* 元素级覆写 EP 内距变量（同元素直接声明,不经特异性对抗；设计稿:叶子 16/分类头 12。
       高度定制统一见 patch/nav/_menu.scss） */
    :deep(.el-menu-item) {
        --el-menu-base-level-padding: #{base(16px)};
        /* 归零层级（EP 内距含 level×20px 的缩进,本菜单平铺不需要） */
        --el-menu-level: 0;

        /* 内容左对齐 */
        justify-content: flex-start;
    }

    :deep(.el-sub-menu__title) {
        --el-menu-base-level-padding: #{base(12px)};
    }

    /* 激活项图标点亮 */
    :deep(.el-menu-item.is-active) .menu-icon {
        opacity: 1;
    }

    /* 分类头图标:固定青色亮显(设计稿) */
    :deep(.el-sub-menu__title) .menu-icon {
        background: var(--color-cyan-400);
        opacity: 1;
    }
}
</style>

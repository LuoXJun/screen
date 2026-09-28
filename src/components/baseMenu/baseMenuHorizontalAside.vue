<template>
    <div class="base-menu-horizontal-aside">
        <template v-for="item in visible" :key="item.path">
            <el-sub-menu v-if="item.children?.length" :index="item.path">
                <template #title>
                    <span style="padding-left: 10px; box-sizing: border-box">
                        {{ item.meta?.title }}
                    </span>
                </template>
                <!-- 组件自递归 -->
                <baseMenuHorizontalAside :list="item.children" />
            </el-sub-menu>
            <el-menu-item v-else :index="item.path" :to="item.path">
                <span style="padding-left: 10px; box-sizing: border-box">
                    {{ item.meta?.title }}
                </span>
            </el-menu-item>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { RouteRecordRaw } from 'vue-router';

/** 侧栏菜单 = 当前一级菜单路由的子路由（路径为绝对路径，无需拼接父级） */
const props = defineProps<{ list: RouteRecordRaw[] }>();

const visible = computed(() =>
    props.list.filter((record) => record.meta?.title && !record.meta?.isHidden)
);
</script>

<style lang="scss" scoped>
.base-menu-horizontal-aside {
    height: 100%;
    :deep(.el-menu-item) {
        justify-content: center;
    }
}
</style>

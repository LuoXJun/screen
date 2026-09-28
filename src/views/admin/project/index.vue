<template>
    <div class="project-list">
        <el-card
            v-for="item in placeholders"
            :key="item.id"
            class="project-card"
            shadow="hover"
            @click="enterScreen"
        >
            <div class="project-name">{{ item.name }}</div>
            <div class="project-desc">{{ item.desc }}</div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

/** 占位数据：接入业务后替换为接口返回 */
const placeholders = [
    { id: 1, name: '示例项目一', desc: '替换为业务数据' },
    { id: 2, name: '示例项目二', desc: '替换为业务数据' },
    { id: 3, name: '示例项目三', desc: '替换为业务数据' }
];

/** 大屏入口：两端不联动，直接路由跳转 */
function enterScreen(): void {
    router.push('/screen');
}
</script>

<style scoped lang="scss">
.project-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;

    .project-card {
        cursor: pointer;

        .project-name {
            font-size: var(--lxj-font-section);
            font-weight: var(--font-weight-600);
            color: var(--lxj-color-text-primary);
        }

        .project-desc {
            margin-top: var(--lxj-gap-middle);
            font-size: var(--lxj-font-desc);
            color: var(--lxj-color-text-secondary);
        }
    }
}
</style>

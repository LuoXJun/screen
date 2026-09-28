<template>
    <div class="login">
        <el-button @click="login">登录</el-button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const login = () => {
    sessionStorage.setItem('token', '555');
    router.push('/admin');
};

/* 登录页无布局壳：归属管理端主题作用域（EP 按钮等经 --el-* → --lxj-* 取色） */
onMounted(() => {
    document.documentElement.dataset.app = 'admin';
});
onUnmounted(() => {
    delete document.documentElement.dataset.app;
});
</script>

<style scoped></style>

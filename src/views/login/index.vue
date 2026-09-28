<template>
    <div class="login">
        <el-button @click="login">登录</el-button>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const login = () => {
    sessionStorage.setItem('token', '555');
    router.push('/');
};
</script>

<style scoped></style>

<template>
    <baseOverlay>
        <template #left>
            <!-- 站点信息 -->
            <stationInfo />
            <!-- 防火指标 -->
            <fireIndicator />
        </template>
        <records />
        <template #right>
            <eqOverview />
            <inspection />
        </template>
    </baseOverlay>
</template>

<script setup lang="ts">
import baseOverlay from '@/components/baseOverlay/baseOverlay.vue';
import stationInfo from './components/stationInfo.vue';
import fireIndicator from './components/fireIndicator/fireIndicator.vue';
import records from './components/records/records.vue';
import eqOverview from './components/eqOverview.vue';
import inspection from './components/inspection/inspection.vue';
</script>

<style scoped lang="scss"></style>

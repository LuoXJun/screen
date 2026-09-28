<template>
    <baseOverlay>
        <template #left>
            <stationInfo />
            <fireIndicator />
        </template>
    </baseOverlay>
</template>

<script setup lang="ts">
import baseOverlay from '@/components/baseOverlay/baseOverlay.vue';
import stationInfo from './components/stationInfo.vue';
import fireIndicator from './components/fireIndicator.vue';
</script>

<style scoped lang="scss"></style>

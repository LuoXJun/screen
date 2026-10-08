<template>
    <basePanelMask class="inspection">
        <basePanelTitle title="无人机巡检">
            <span class="date">本月 07-01 ~ 07-15</span>
        </basePanelTitle>
        <basePanelCard></basePanelCard>
    </basePanelMask>
</template>

<script setup lang="ts">
import basePanelMask from '@/components/basePanel/basePanelMask.vue';
import basePanelTitle from '@/components/basePanel/basePanelTitle.vue';
import basePanelCard from '@/components/basePanel/basePanelCard.vue';
</script>

<style scoped lang="scss">
.inspection {
    .date {
        color: var(--color-blue-500);
        font-family: var(--lxj-font-family);
        font-size: var(--lxj-font-body);
    }
}
</style>

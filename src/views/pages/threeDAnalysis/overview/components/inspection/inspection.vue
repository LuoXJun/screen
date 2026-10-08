<template>
    <basePanelMask class="inspection">
        <basePanelTitle title="无人机巡检">
            <span class="date">本月 07-01 ~ 07-15</span>
        </basePanelTitle>
        <basePanelCard class="stat-card">
            <baseStatList :list="INSPECT_STATS" />
        </basePanelCard>
        <basePanelCard class="task-card">
            <baseTab v-model="activeTab" :list="TASK_TABS" />
            <recentTasks v-if="activeTab === 'recent'" />
            <hazardTypes v-else />
        </basePanelCard>
    </basePanelMask>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import basePanelMask from '@/components/basePanel/basePanelMask.vue';
import basePanelTitle from '@/components/basePanel/basePanelTitle.vue';
import basePanelCard from '@/components/basePanel/basePanelCard.vue';
import baseStatList from '@/components/baseStatList/baseStatList.vue';
import baseTab from '@/components/baseTab/baseTab.vue';
import recentTasks from './recentTasks.vue';
import hazardTypes from './hazardTypes.vue';
import { INSPECT_STATS, TASK_TABS } from './inspection.config';

const activeTab = ref('recent');
</script>

<style scoped lang="scss">
.inspection {
    .date {
        color: var(--color-blue-500);
        font-family: var(--lxj-font-family);
        font-size: var(--lxj-font-body);
    }

    .stat-card {
        /* 覆盖 basePanelCard 默认 4px 内距(设计稿 12px) */
        padding: base(12px);
        margin-top: base(6px);
    }

    .task-card {
        display: flex;
        flex-direction: column;
        gap: base(6px);
        padding: base(12px);
        margin-top: base(6px);
    }
}
</style>

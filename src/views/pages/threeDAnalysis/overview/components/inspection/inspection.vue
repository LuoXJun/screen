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
            <div class="task-card-body">
                <recentTasks v-if="activeTab === 'recent'" />
                <hazardTypes v-else />
            </div>
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
    display: flex;
    flex-direction: column;
    /* 高度贴合内容(富余空间留白,不把面板撑满);仅在空间不足时收缩,
       收起在面板内部滚动,不挤压设备总览 */
    flex: 0 1 auto;
    min-height: 0;

    /* 标题与指标行按内容高度固定,只有任务卡参与剩余空间分配 */
    > .basePanelTitle,
    .stat-card {
        flex-shrink: 0;
    }

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
        flex: 1 1 auto;
        min-height: 0;
        gap: base(6px);
        padding: base(12px);
        margin-top: base(6px);

        /* 页签高度固定,内容区吸收剩余高度并按需滚动(勿用 scroll:会常驻滚动条) */
        > .baseTab {
            flex-shrink: 0;
        }

        .task-card-body {
            flex: 1 1 auto;
            min-height: 0;
            overflow-y: auto;
        }
    }
}
</style>

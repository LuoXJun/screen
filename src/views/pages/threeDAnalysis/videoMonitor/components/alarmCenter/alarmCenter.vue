<template>
    <basePanelMask class="alarmCenter">
        <basePanelTitle class="panel-title" title="视频监控警报中心">
            <!-- 标题右侧:未处理计数（设计稿红字） -->
            <span class="panel-extra">{{ ALARM_UNDONE_TEXT }}</span>
        </basePanelTitle>
        <!-- 三格统计 -->
        <alarmStats class="alarm-stats" />
        <div class="alarm-body">
            <!-- 级别筛选页签 -->
            <div class="alarm-tabs">
                <div
                    v-for="tab in ALARM_TABS"
                    :key="tab.key"
                    class="alarm-tab"
                    :class="{ 'is-active': tab.key === activeTab }"
                    @click="activeTab = tab.key"
                >
                    {{ tab.label }}
                </div>
            </div>
            <!-- 警报列表(超出滚动,页签固定) -->
            <div class="alarm-list">
                <alarmCard
                    v-for="item in filteredList"
                    :key="item.id"
                    :item="item"
                    @view="onView"
                    @handle="onHandle"
                />
            </div>
        </div>
    </basePanelMask>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import basePanelMask from '@/components/basePanel/basePanelMask.vue';
import basePanelTitle from '@/components/basePanel/basePanelTitle.vue';
import alarmStats from './alarmStats.vue';
import alarmCard from './alarmCard.vue';
import { ALARM_LIST, ALARM_TABS, ALARM_UNDONE_TEXT, type AlarmTabKey } from './alarmCenter.config';

/** 当前级别筛选 */
const activeTab = ref<AlarmTabKey>('all');

const filteredList = computed(() =>
    activeTab.value === 'all'
        ? ALARM_LIST
        : ALARM_LIST.filter((item) => item.level === activeTab.value)
);

/** 查看：跳转定位（待接入） */
function onView(): void {
    /* 待接入定位 */
}

/** 处理：处置流程（待接入） */
function onHandle(): void {
    /* 处置流程待接入 */
}
</script>

<style scoped lang="scss">
.alarmCenter {
    /* 覆写 basePanelMask 内距（设计稿内容左缘 11px） */
    --lxj-space-panel: #{base(11px)};

    /* 撑满 right aside 且内容超长时收缩(溢出链同左侧列表面板) */
    display: flex;
    // flex: 1;
    min-height: 0;
    flex-direction: column;

    .panel-title {
        flex-shrink: 0;

        /* 未处理计数:红字（设计稿为 PingFang 常规体,单独覆写标题的优设字体） */
        .panel-extra {
            color: var(--color-red-400);
            font-family: var(--lxj-font-family);
            font-size: var(--lxj-font-body);
        }
    }

    .alarm-stats {
        flex-shrink: 0;
        margin-top: base(6px);
    }

    .alarm-body {
        display: flex;
        flex: 1;
        min-height: 0;
        flex-direction: column;
        padding: base(13px) base(13px) 0;
    }

    .alarm-tabs {
        display: flex;
        flex-shrink: 0;
        gap: base(12px);
    }

    /* 页签:未激活灰条+半透白字,激活渐变底+亮青条+白字(资产随设计稿) */
    .alarm-tab {
        position: relative;
        width: base(50px);
        height: base(25px);
        color: var(--color-white);
        font-size: var(--lxj-font-body);
        line-height: base(21px);
        text-align: center;
        letter-spacing: base(0.33px);
        opacity: 0.5;
        cursor: pointer;

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: base(3px);
            background: url('@/assets/images/alarm-tab-bar.svg') no-repeat center / 100% 100%;
        }

        &.is-active {
            font-weight: var(--lxj-font-weight-Semibold);
            opacity: 1;
            background: url('@/assets/images/alarm-tab-bg-active.svg') no-repeat center / 100% 100%;

            &::after {
                background-image: url('@/assets/images/alarm-tab-bar-active.svg');
            }
        }
    }

    .alarm-list {
        display: flex;
        flex: 1;
        min-height: 0;
        flex-direction: column;
        gap: base(6px);
        padding: base(6px) 0 base(13px);
        overflow-y: auto;
    }
}
</style>

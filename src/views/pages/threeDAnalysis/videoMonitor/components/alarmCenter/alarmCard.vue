<template>
    <div class="alarmCard" :class="`is-${item.level}`" :style="toneVars">
        <div class="card-head">
            <p class="card-title">{{ item.title }}</p>
            <span class="card-tag">{{ ALARM_LEVEL_MAP[item.level].label }}</span>
        </div>
        <p class="card-location">{{ item.location }}</p>
        <p class="card-desc">{{ item.desc }}</p>
        <!-- 已处理卡无时间/操作行 -->
        <div v-if="item.time" class="card-foot">
            <span class="card-time">{{ item.time }}</span>
            <span class="card-actions">
                <el-button class="btn-cyan-ghost" @click="emits('view', item)">查看</el-button>
                <el-button class="btn-cyan-ghost" @click="emits('handle', item)">处理</el-button>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ALARM_LEVEL_MAP, type AlarmItem } from './alarmCenter.config';

const props = defineProps<{
    /** 警报条目 */
    item: AlarmItem;
}>();

const emits = defineEmits<{
    /** 查看（设计稿:跳转定位,待接入） */
    view: [item: AlarmItem];
    /** 处理（待接入） */
    handle: [item: AlarmItem];
}>();

/** 级别色调 → CSS 变量（色值集中定义在 config） */
const toneVars = computed(() => {
    const tone = ALARM_LEVEL_MAP[props.item.level];
    return {
        '--card-bg': tone.bg,
        '--card-border': tone.border,
        '--card-title': tone.title,
        '--tag-bg': tone.tagBg,
        '--tag-border': tone.tagBorder
    };
});
</script>

<style scoped lang="scss">
.alarmCard {
    padding: base(8px) base(12px);
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: base(4px);

    .card-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;

        .card-title {
            margin: 0;
            color: var(--card-title);
            font-size: var(--lxj-font-body);
            font-weight: var(--lxj-font-weight-Semibold);
            line-height: base(21px);
        }

        .card-tag {
            flex-shrink: 0;
            padding: 0 base(6px);
            color: var(--card-title);
            font-size: var(--lxj-font-body);
            line-height: base(21px);
            background: var(--tag-bg);
            border: 1px solid var(--tag-border);
            border-radius: base(3px);
        }
    }

    .card-location {
        margin: 0;
        padding-top: base(4px);
        color: var(--lxj-color-text-secondary);
        font-size: var(--lxj-font-body);
        line-height: base(21px);
    }

    .card-desc {
        margin: 0;
        padding-top: base(4px);
        color: var(--lxj-color-text-primary);
        font-size: var(--lxj-font-body);
        line-height: 1.4;
    }

    /* 已处理卡的末行为状态提示（设计稿绿字） */
    &.is-done .card-desc {
        color: var(--lxj-color-success);
    }

    .card-foot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: base(6px);

        .card-time {
            color: var(--lxj-color-text-secondary);
            font-size: var(--lxj-font-body);
            line-height: base(21px);
        }

        .card-actions {
            display: flex;
            gap: base(4px);

            :deep(.el-button + .el-button) {
                margin-left: 0;
            }
        }
    }

}
</style>

<template>
    <div class="recentTasks">
        <div v-for="task in INSPECT_TASKS" :key="task.name" class="task-item">
            <div class="task-head">
                <div class="task-no">
                    <i class="no-bg"></i>
                    <img class="corner tl" :src="cornerIcon" alt="" />
                    <img class="corner tr" :src="cornerIcon" alt="" />
                    <img class="corner bl" :src="cornerIcon" alt="" />
                    <img class="corner br" :src="cornerIcon" alt="" />
                    <span class="no-text">{{ task.no }}</span>
                </div>
                <span class="task-status" :class="`is-${task.status}`">
                    {{ TASK_STATUS_MAP[task.status] }}
                </span>
            </div>
            <p class="task-name">{{ task.name }}</p>
            <p class="task-meta">
                <template v-for="(seg, i) in task.meta" :key="seg">
                    <span v-if="i > 0" class="dot">·</span>
                    <span>{{ seg }}</span>
                </template>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getImageWidthName } from '@/utils/getAssets';
import { INSPECT_TASKS, TASK_STATUS_MAP } from './inspection.config';

/** 编号四角角标（同一图形,四角旋转复用;图形原生为左下角） */
const cornerIcon = getImageWidthName('task-corner.svg');
</script>

<style scoped lang="scss">
.recentTasks {
    display: flex;
    flex-direction: column;
    gap: base(6px);
    width: 100%;

    .task-item {
        padding: base(8px);
        /* 设计稿取值 */
        background: rgba(0, 200, 255, 0.04);
        border: 1px solid rgba(0, 150, 220, 0.18);
        border-radius: var(--radius-4);

        .task-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .task-no {
            position: relative;
            display: flex;
            align-items: center;
            height: base(21px);
            min-width: base(104px);
            padding-left: base(10px);

            /* 编号底纹 */
            .no-bg {
                position: absolute;
                left: base(2px);
                top: base(2px);
                width: base(100px);
                height: base(17px);
                border-radius: base(2px);
                background: rgba(43, 136, 221, 0.1);
            }

            .no-text {
                position: relative;
                color: #dce9f7;
                font-size: var(--lxj-font-body);
                line-height: base(21px);
                text-shadow: 0 0.5px 1px rgb(0 0 0 / 25%);
            }

            .corner {
                position: absolute;
                width: base(8.5px);
                height: base(8.5px);

                &.tl {
                    top: 0;
                    left: 0;
                    transform: scaleY(-1);
                }

                &.tr {
                    top: 0;
                    right: 0;
                    transform: rotate(180deg);
                }

                &.bl {
                    bottom: 0;
                    left: 0;
                }

                &.br {
                    bottom: 0;
                    right: 0;
                    transform: scaleX(-1);
                }
            }
        }

        .task-status {
            padding: base(2px) base(6px);
            border-radius: var(--radius-4);
            font-size: var(--lxj-font-body);

            /* 设计稿取值 */
            &.is-done {
                color: #60ff8a;
                background: rgba(0, 255, 127, 0.2);
                border: 1px solid rgba(48, 224, 142, 0.4);
            }

            &.is-running {
                color: #60e2ff;
                background: rgba(59, 203, 255, 0.2);
                border: 1px solid rgba(48, 177, 224, 0.4);
            }
        }

        .task-name {
            margin: 0;
            padding-top: base(2px);
            color: #7ab8d4;
            font-size: var(--lxj-font-body);
            line-height: base(21px);
        }

        .task-meta {
            display: flex;
            gap: base(4px);
            margin: 0;
            padding-top: base(2px);
            color: #aacdf3;
            font-size: var(--lxj-font-body);
            line-height: base(21px);
        }
    }
}
</style>

<template>
    <div class="ptzControl">
        <baseSectionTitle title="云台控制" />
        <div class="ptz-body">
            <!-- 方向控制（上/左/3D/右/下） -->
            <div class="dir-pad">
                <el-button class="dir-btn btn-cyan-ghost" @click="onPtzCommand('up')">▲</el-button>
                <div class="dir-row">
                    <el-button class="dir-btn btn-cyan-ghost" @click="onPtzCommand('left')">
                        ◀
                    </el-button>
                    <el-button class="dir-center" @click="onPtzCommand('3d')">3D</el-button>
                    <el-button class="dir-btn btn-cyan-ghost" @click="onPtzCommand('right')">
                        ▶
                    </el-button>
                </div>
                <el-button class="dir-btn btn-cyan-ghost" @click="onPtzCommand('down')">▼</el-button>
            </div>
            <!-- 参数控制（变倍/变焦 +/−）与画面锁定 -->
            <div class="ptz-params">
                <div v-for="row in PTZ_PARAM_ROWS" :key="row.key" class="param-row">
                    <span class="param-label">{{ row.label }}:</span>
                    <span class="param-ops">
                        <img
                            class="op-btn"
                            :src="plusIcon"
                            alt="+"
                            @click="onPtzCommand(`${row.key}-plus`)"
                        />
                        <img
                            class="op-btn"
                            :src="minusIcon"
                            alt="-"
                            @click="onPtzCommand(`${row.key}-minus`)"
                        />
                    </span>
                </div>
                <div class="param-row">
                    <span class="param-label">摄像头锁定:</span>
                    <el-switch
                        v-model="locked"
                        class="lock-switch"
                        @change="onPtzCommand('lock')"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getImageWidthName } from '@/utils/getAssets';
import baseSectionTitle from '@/components/baseSectionTitle/baseSectionTitle.vue';
import { PTZ_PARAM_ROWS } from './cameraMonitorPanel.config';

/** 云台指令（演示态,待接设备控制） */
function onPtzCommand(command: string): void {
    void command;
}

/** 摄像头锁定（设计稿默认开） */
const locked = ref(true);

const plusIcon = getImageWidthName('camera-ptz-plus.svg');
const minusIcon = getImageWidthName('camera-ptz-minus.svg');
</script>

<style scoped lang="scss">
.ptzControl {
    display: flex;
    flex: 1;
    min-height: 0;
    flex-direction: column;
    padding: base(10px);
    background: var(--lxj-bg-card);
    border: 1px solid var(--lxj-color-border-primary-light);
    border-radius: base(4px);

    .ptz-body {
        display: flex;
        flex: 1;
        gap: base(16px);
        padding-top: base(12px);
    }

    /* EP 邻近按钮默认外边距归零(间距由 gap 控制) */
    :deep(.el-button + .el-button) {
        margin-left: 0;
    }

    /* 方向键:尺寸覆写（配色见 btn-cyan-ghost 变体） */
    .dir-btn {
        width: base(28px);
        height: base(28px);
        padding: 0;
        font-size: var(--lxj-font-body);
        line-height: 1;
        border-radius: base(4px);
    }

    /* 中心 3D:青渐变圆钮(渐变超出变量能力,属性规则补充) */
    .dir-center {
        width: base(36px);
        height: base(36px);
        padding: 0;
        color: var(--lxj-color-text-desc);
        font-size: var(--lxj-font-body);
        font-weight: var(--lxj-font-weight-Semibold);
        line-height: 1;
        border-radius: base(18px);
        background-image: linear-gradient(
            135deg,
            var(--color-blue-450) 0%,
            var(--lxj-color-primary) 100%
        );
        box-shadow: 0 0 base(5px) color-mix(in srgb, var(--lxj-color-primary) 40%, transparent);
        --el-button-bg-color: transparent;
        --el-button-border-color: transparent;
        --el-button-text-color: var(--lxj-color-text-desc);
        --el-button-hover-bg-color: transparent;
        --el-button-hover-border-color: transparent;
        --el-button-hover-text-color: var(--lxj-color-text-desc);
        --el-button-active-bg-color: transparent;
        --el-button-active-border-color: transparent;
        --el-button-active-text-color: var(--lxj-color-text-desc);
    }

    .dir-pad {
        display: flex;
        flex: 1;
        min-width: 0;
        flex-direction: column;
        align-items: center;
        gap: base(4px);

        .dir-row {
            display: flex;
            align-items: center;
            gap: base(4px);
        }
    }

    .ptz-params {
        display: flex;
        flex: 1;
        min-width: 0;
        flex-direction: column;
        gap: base(8px);

        .param-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-height: base(22px);

            .param-label {
                color: var(--lxj-color-text-primary);
                font-size: var(--lxj-font-body);
                line-height: base(21px);
            }

            .param-ops {
                display: flex;
                gap: base(8px);

                .op-btn {
                    width: base(22px);
                    height: base(22px);
                    cursor: pointer;
                }
            }
        }
    }

    /* 锁定开关:40×22 胶囊 + 白点(尺寸 EP 无变量,属性规则覆盖) */
    .lock-switch {
        --el-switch-on-color: var(--lxj-color-success);
        --el-switch-off-color: color-mix(
            in srgb,
            var(--lxj-color-text-secondary) 50%,
            transparent
        );

        :deep(.el-switch__core) {
            height: base(22px);
            border-radius: base(11px);
        }
    }
}
</style>

<template>
    <baseDialog v-model="visible" variant="compact" title="温度阈值设置">
        <div class="threshold-form">
            <div class="field-row">
                <label class="field-label" for="threshold-warn">预警阈值（接近）</label>
                <el-input-number
                    id="threshold-warn"
                    v-model="form.warn"
                    class="field-input"
                    aria-label="预警阈值"
                    :controls="false"
                    :min="0"
                    :max="200"
                    :precision="0"
                />
                <span class="field-unit">°C</span>
            </div>
            <p class="field-note">温度 ≥ 预警阈值且 ＜ 告警阈值时，标记为“温度接近阈值”</p>

            <div class="field-row is-alert">
                <label class="field-label" for="threshold-alert">告警阈值（超温）</label>
                <el-input-number
                    id="threshold-alert"
                    v-model="form.alert"
                    class="field-input"
                    aria-label="告警阈值"
                    :controls="false"
                    :min="0"
                    :max="200"
                    :precision="0"
                />
                <span class="field-unit">°C</span>
            </div>
            <p class="field-note">温度 ≥ 告警阈值时，标记为“超温”并触发告警</p>
        </div>

        <template #footer>
            <el-button class="threshold-btn is-cancel" @click="visible = false">取消</el-button>
            <el-button class="threshold-btn is-save" @click="onSave">保存</el-button>
        </template>
    </baseDialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import baseDialog from '@/components/baseDialog/baseDialog.vue';

const props = defineProps<{
    /** 已保存的预警阈值（打开时回填） */
    warn: number;
    /** 已保存的告警阈值（打开时回填） */
    alert: number;
}>();

const visible = defineModel<boolean>({ default: false });

const emits = defineEmits<{
    save: [thresholds: { warn: number; alert: number }];
}>();

const form = reactive<{ warn: number | undefined; alert: number | undefined }>({
    warn: props.warn,
    alert: props.alert
});

/* 每次打开回填已保存值（取消/关闭不污染表单） */
watch(visible, (open) => {
    if (!open) return;
    form.warn = props.warn;
    form.alert = props.alert;
});

function onSave(): void {
    const { warn, alert } = form;
    if (typeof warn !== 'number' || typeof alert !== 'number') {
        ElMessage.warning('请填写完整的温度阈值');
        return;
    }
    if (warn >= alert) {
        ElMessage.warning('预警阈值需小于告警阈值');
        return;
    }
    emits('save', { warn, alert });
    visible.value = false;
}
</script>

<style scoped lang="scss">
.threshold-form {
    .field-row {
        display: grid;
        grid-template-columns: base(145px) minmax(0, 1fr) base(25px);
        column-gap: base(8px);
        align-items: center;
        margin-top: base(22px);
    }

    .field-row.is-alert {
        margin-top: base(20px);
    }

    .field-label {
        color: var(--lxj-color-text-primary);
        font-size: var(--lxj-font-body);
        line-height: base(21px);
        white-space: nowrap;
    }

    .field-unit {
        color: var(--lxj-color-text-primary);
        font-size: var(--lxj-font-body);
        font-weight: var(--lxj-font-weight-Semibold);
        line-height: base(21px);
    }

    /* 设计稿:说明与输入框左缘对齐，宽度保证两行换行（+4px 补偿 Windows 中文字体宽度） */
    .field-note {
        width: base(208px);
        margin: base(7px) 0 0 base(153px);
        color: var(--lxj-color-text-secondary);
        font-size: var(--lxj-font-body);
        line-height: base(20px);
    }
}

/* 设计稿取值:输入框深底 + 青描边；数值左对齐，隐藏步进按钮 */
.field-input {
    width: 100%;

    :deep(.el-input__wrapper) {
        height: base(36px);
        padding: 0 base(10px);
        background: #030d1f;
        border: 1px solid rgba(0, 184, 255, 0.35);
        border-radius: base(5px);
        box-shadow: none;
    }

    :deep(.el-input__wrapper.is-focus) {
        border-color: var(--lxj-color-primary);
        box-shadow: none;
    }

    :deep(.el-input__inner) {
        height: base(36px);
        color: var(--lxj-color-text-desc);
        font-size: font(15px);
        text-align: left;
    }
}

.threshold-btn {
    min-width: base(72px);
    height: base(34px);
    padding: 0 base(16px);
    border-radius: base(5px);
    font-size: var(--lxj-font-body);
    font-weight: var(--lxj-font-weight);
}

.is-cancel {
    --el-button-bg-color: transparent;
    --el-button-border-color: color-mix(in srgb, var(--lxj-color-primary) 45%, transparent);
    --el-button-text-color: var(--lxj-color-text-primary);
    --el-button-hover-bg-color: color-mix(in srgb, var(--lxj-color-primary) 8%, transparent);
    --el-button-hover-border-color: var(--lxj-color-primary);
    --el-button-hover-text-color: var(--lxj-color-text-desc);
    --el-button-active-bg-color: color-mix(in srgb, var(--lxj-color-primary) 12%, transparent);
    --el-button-active-border-color: var(--lxj-color-primary);
    --el-button-active-text-color: var(--lxj-color-text-desc);
}

.is-save {
    /* 设计稿取值:保存按钮实底蓝（无对应语义色，按原值保留） */
    --el-button-bg-color: #079be8;
    --el-button-border-color: color-mix(in srgb, var(--lxj-color-primary) 45%, transparent);
    --el-button-text-color: var(--lxj-color-text-desc);
    --el-button-hover-bg-color: color-mix(in srgb, #079be8 85%, var(--color-white));
    --el-button-hover-border-color: var(--lxj-color-primary);
    --el-button-hover-text-color: var(--lxj-color-text-desc);
    --el-button-active-bg-color: color-mix(in srgb, #079be8 85%, var(--color-black));
    --el-button-active-border-color: var(--lxj-color-primary);
    --el-button-active-text-color: var(--lxj-color-text-desc);
}
</style>

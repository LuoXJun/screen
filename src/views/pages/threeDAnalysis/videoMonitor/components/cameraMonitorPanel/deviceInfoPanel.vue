<template>
    <div class="deviceInfoPanel">
        <baseSectionTitle title="设备信息" />
        <div class="info-grid">
            <p v-for="(field, i) in fields" :key="i" class="info-field">
                <span class="field-label">{{ field.label }}</span>
                <span class="field-colon">:</span>
                <span
                    class="field-value"
                    :class="{ 'is-strong': field.strong }"
                    :style="{ color: field.color }"
                >
                    {{ field.value }}
                </span>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import baseSectionTitle from '@/components/baseSectionTitle/baseSectionTitle.vue';
import type { MonitorInfoField } from './cameraMonitorPanel.config';

defineProps<{
    /** 设备信息字段（两列网格铺排） */
    fields: MonitorInfoField[];
}>();
</script>

<style scoped lang="scss">
.deviceInfoPanel {
    display: flex;
    flex: 1;
    min-height: 0;
    flex-direction: column;
    padding: base(10px);
    /* 设计稿取值:深蓝半透明底 + 微青描边 */
    background: rgba(13, 36, 88, 0.4);
    border: 1px solid rgba(0, 200, 255, 0.3);
    border-radius: base(4px);

    .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        row-gap: base(6px);
        padding-top: base(8px);

        .info-field {
            margin: 0;
            overflow: hidden;
            font-size: var(--lxj-font-body);
            line-height: base(21px);
            white-space: nowrap;
            text-overflow: ellipsis;

            .field-label {
                color: #7ab8d4;
            }

            .field-colon {
                margin-right: base(4px);
                color: #4a7a9b;
            }

            .field-value {
                color: #e8f4ff;

                &.is-strong {
                    font-weight: var(--lxj-font-weight-Semibold);
                }
            }
        }
    }
}
</style>

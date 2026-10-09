<template>
    <baseDialog
        :model-value="true"
        title="监控"
        icon="dialog-icon-monitor.svg"
        :buttons="BUTTONS"
        @close="emits('close')"
    >
        <div class="cameraPopup">
            <DeviceInfo :items="infoItems" />
            <div class="preview">
                <img v-if="data.preview" :src="getImageWidthName(data.preview)" alt="" />
            </div>
        </div>
    </baseDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getImageWidthName } from '@/utils/getAssets';
import baseDialog from '@/components/baseDialog/baseDialog.vue';
import type { BaseDialogButton } from '@/components/baseDialog/baseDialog';
import DeviceInfo from './DeviceInfo.vue';
import type { DeviceInfoItem } from './DeviceInfo';
import type { CameraData, CameraStatus } from './CameraPopup';

const props = defineProps<{
    /** 设备信息与画面 */
    data: CameraData;
}>();

const emits = defineEmits(['close']);

/** 状态文案（配色见 DeviceInfo 的 .info-value） */
const STATUS_MAP: Record<CameraStatus, string> = {
    online: '·在线',
    offline: '·离线'
};

/** 底部操作按钮（设计稿取值） */
const BUTTONS: BaseDialogButton[] = [{ label: '切换：可见光/热成像' }, { label: '查看详情' }];

const infoItems = computed<DeviceInfoItem[]>(() => [
    { icon: 'id', label: '设备编号', value: props.data.no },
    { icon: 'model', label: '厂商型号', value: props.data.model },
    { icon: 'location', label: '安装位置', value: props.data.location },
    { icon: 'date', label: '投运日期', value: props.data.installDate },
    {
        icon: 'status',
        label: '当前状态',
        value: STATUS_MAP[props.data.status],
        valueClass: `is-${props.data.status}`
    },
    { icon: 'alarm', label: '最后告警', value: props.data.lastAlarm }
]);
</script>

<style scoped lang="scss">
.cameraPopup {
    .preview {
        height: base(254px);
        margin-top: base(18px);
        border-radius: base(10px);
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
}
</style>

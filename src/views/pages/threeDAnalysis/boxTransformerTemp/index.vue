<template>
    <baseOverlay class="box-transformer-temp">
        <template #left>
            <!-- 左栏：箱变设备统计（统计条 + 环图图例）+ 箱变实时温度列表 -->
            <div class="temperature-aside">
                <deviceStats :devices="devices" />
                <temperatureList
                    :devices="devices"
                    :selected-id="selectedBoxId"
                    @select="onListSelect"
                />
            </div>
        </template>
        <template #right>
            <!-- 右栏：选中箱变的测温详情；未选中（设备数据未到/尚未点选）时以空状态占位 -->
            <detailPanel v-if="selectedDevice" :device="selectedDevice" />
            <asidePanel v-else class="detail-empty" title="箱变温度详情">
                <baseEmpty
                    title="暂未选择箱变"
                    description="请在地图或左侧列表中选择一台箱变"
                />
            </asidePanel>
        </template>
    </baseOverlay>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import {
    clearHandler,
    isDrawingActive,
    lookAtLonLat,
    onLeftClick,
    pickEntity,
    sampleGroundHeights,
    TERRAIN_READY
} from '@/cesium';
import baseEmpty from '@/components/baseEmpty/baseEmpty.vue';
import baseOverlay from '@/components/baseOverlay/baseOverlay.vue';
import { listBoxTransformers, type BoxTransformerDevice } from '@/config/devices';
import { useSiteStore } from '@/stores/site';
import deviceStats from './components/left/deviceStats.vue';
import temperatureList from './components/left/temperatureList.vue';
import detailPanel from './components/right/detailPanel.vue';
import asidePanel from './components/shared/asidePanel.vue';
import { useBoxTransformerAreas } from './composables/useBoxTransformerAreas';
import { useBoxTransformerFocus } from './composables/useBoxTransformerFocus';
import { BOX_VIEW } from './config';

const siteStore = useSiteStore();
/** 当前站点箱变（全局设备注册表；页面随站点切换重建,初始化取一次） */
const devices = listBoxTransformers(siteStore.activeSite);

/* ---- 选中状态（列表 / 地图 / 右侧详情同一来源） ----
   默认选中第一项须在设备数据就绪后执行；数据未到（接口慢/失败）时保持空选中,右栏显示占位 */
const selectedBoxId = ref(devices[0]?.id ?? '');
const selectedDevice = computed(() =>
    devices.find((device) => device.id === selectedBoxId.value)
);

/** 进入视角是否已接管（含列表聚焦；避免迟到的进入视角覆盖用户聚焦） */
let viewTaken = false;

useBoxTransformerAreas(devices);

const { focus: focusDevice, sync: syncDevice } = useBoxTransformerFocus(devices, () => {
    viewTaken = true;
});

/** 列表点击：选中 + 相机聚焦 + 标牌高亮 */
function onListSelect(device: BoxTransformerDevice): void {
    selectedBoxId.value = device.id;
    void focusDevice(device);
}

/* ---- 页面进入视角：箱变集群 ---- */
/** 箱变集群中心（视角目标） */
const center = devices.reduce(
    (acc, device) => ({
        lng: acc.lng + device.lng / devices.length,
        lat: acc.lat + device.lat / devices.length
    }),
    { lng: 0, lat: 0 }
);

let removeTerrainListener: (() => void) | undefined;
let mapClickHandler: ReturnType<typeof onLeftClick> | undefined;
let disposed = false;

/** 采样地面高度后定位（贴地目标，避免 0 米回退钻入地形） */
async function focusBoxCluster(): Promise<void> {
    if (disposed || viewTaken || !devices.length) return;
    const heights = await sampleGroundHeights(devices);
    /* 采样期间可能切站/卸载：丢弃过期结果，避免旧站点视角覆盖新站点 */
    if (disposed || viewTaken) return;
    const groundHeight = heights.reduce((sum, height) => sum + height, 0) / heights.length;
    /* 地形未就绪时采样为 0 米：等 TERRAIN_READY 再定位 */
    if (groundHeight <= 0) return;
    viewTaken = true;
    removeTerrainListener?.();
    removeTerrainListener = undefined;
    lookAtLonLat(center.lng, center.lat, { ...BOX_VIEW, height: groundHeight });
}

/* 进入页面接管视角到箱变集群：地形异步挂载，就绪后重试；定位天然晚于布局站点飞行 */
onMounted(() => {
    removeTerrainListener = TERRAIN_READY.addEventListener(() => {
        void focusBoxCluster();
    });
    void focusBoxCluster();

    /* 地图点击箱变：反选列表/详情（不移动相机；弹窗已由 layout 吞掉） */
    mapClickHandler = onLeftClick((position) => {
        if (isDrawingActive()) return;
        const picked = pickEntity(position);
        const props = picked?.props;
        if (props?.type !== 'boxTransformer') return;
        const deviceId = typeof props.deviceId === 'string' ? props.deviceId : '';
        const device = devices.find((item) => item.id === deviceId);
        if (!device) return;
        selectedBoxId.value = device.id;
        syncDevice(device);
    });
});

onBeforeUnmount(() => {
    disposed = true;
    removeTerrainListener?.();
    removeTerrainListener = undefined;
    if (mapClickHandler) {
        clearHandler(mapClickHandler);
        mapClickHandler = undefined;
    }
});
</script>

<style scoped lang="scss">
/* 左栏取路由 meta 的 asideWidth（设计稿 390）；右栏设计稿 350 */
.box-transformer-temp {
    :deep(.aside.left) {
        width: var(--lxj-page-aside-width, var(--lxj-aside-width));
    }

    :deep(.aside.right) {
        width: base(350px);
    }
}

.temperature-aside {
    display: flex;
    flex: 1;
    min-height: 0;
    flex-direction: column;
    gap: var(--lxj-gap);
}

/* 未选中占位面板撑满右栏,占位区才有完整高度 */
.detail-empty {
    flex: 1;
    min-height: 0;
}
</style>

import * as Cesium from 'cesium';
import { onBeforeUnmount, onMounted } from 'vue';
import {
    addEntity,
    createBillboard,
    hasViewer,
    lookAtLonLat,
    removeEntity,
    requestRenderWithNextFrame,
    sampleGroundHeights,
    TERRAIN_READY
} from '@/cesium';
import { scalePx } from '@/components/baseChart/screenScale';
import type { BoxTransformerDevice } from '@/config/devices';
import { getImageWidthName } from '@/utils/getAssets';
import { BOX_FOCUS_VIEW } from '../config';

/** 选中标牌：范围面上方悬浮的 billboard；图标本身不再高亮/流光 */
const MARKER_ID = 'box-selected-marker';
const MARKER_HEIGHT = 80;
const markerImage = getImageWidthName('box-selected-marker.svg');

/**
 * 箱变选中联动：列表点击聚焦相机，地图点击只同步选中。
 * 选中态由范围面上方的 billboard 表示；页面卸载即移除。
 */
export function useBoxTransformerFocus(
    devices: BoxTransformerDevice[],
    /** 即将执行列表聚焦时通知页面接管视角（取消迟到的进入视角） */
    onTakeOver: () => void
) {
    /* 数据就绪后默认选中第一项，与页面选中态一致 */
    let currentId = devices[0]?.id;
    let disposed = false;
    let markerSeq = 0;

    /** 在范围上方放置选中 billboard（位置高度取地形） */
    function placeMarker(device: BoxTransformerDevice, groundHeight: number): void {
        addEntity(MARKER_ID, {
            ...createBillboard(device.lng, device.lat, groundHeight + MARKER_HEIGHT, markerImage, {
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                /* 选中标牌需越过地形/图标显示 */
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                width: scalePx(32),
                height: scalePx(42)
            }),
            properties: { type: 'boxTransformerSelected' }
        });
        requestRenderWithNextFrame();
    }

    /** 采样地形后放置标牌（seq 防止快速切换时旧结果覆盖新选中） */
    async function showMarker(device: BoxTransformerDevice): Promise<void> {
        const seq = ++markerSeq;
        const heights = await sampleGroundHeights([device]);
        if (disposed || seq !== markerSeq) return;
        const groundHeight = heights[0] ?? 0;
        if (groundHeight <= 0) return;
        placeMarker(device, groundHeight);
    }

    /** 地图点击/初始化：只同步选中标牌,不移动相机 */
    function sync(device: BoxTransformerDevice): void {
        currentId = device.id;
        void showMarker(device);
    }

    /** 列表点击：同步标牌 + 相机聚焦（目标高度取地形,避开 0 米回退） */
    async function focus(device: BoxTransformerDevice): Promise<void> {
        currentId = device.id;
        const seq = ++markerSeq;
        const targetId = device.id;
        const heights = await sampleGroundHeights([device]);
        if (disposed || seq !== markerSeq || currentId !== targetId) return;
        const height = heights[0] ?? 0;
        if (height <= 0) return;
        placeMarker(device, height);
        onTakeOver();
        lookAtLonLat(device.lng, device.lat, { ...BOX_FOCUS_VIEW, height });
    }

    /* 地形就绪后为当前选中补摆标牌（初始加载时地形可能未就绪） */
    const offTerrain = TERRAIN_READY.addEventListener(() => {
        const device = devices.find((item) => item.id === currentId);
        if (device) void showMarker(device);
    });

    onMounted(() => {
        const initial = devices[0];
        if (initial) sync(initial);
    });

    onBeforeUnmount(() => {
        disposed = true;
        offTerrain();
        if (hasViewer()) removeEntity(MARKER_ID);
    });

    return { focus, sync };
}

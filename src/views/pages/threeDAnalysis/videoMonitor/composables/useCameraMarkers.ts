import { onBeforeUnmount } from 'vue';
import type * as Cesium from 'cesium';
import { getSiteEntities, lookAtLonLat, setLabelPinHighlight } from '@/cesium';
import { useSiteStore } from '@/stores/site';
import {
    CAMERA_GROUPS_BY_SITE,
    cameraMarkerName,
    listCameraDevices,
    type CameraDevice
} from '@/config/devices';
import { CAMERA_FOCUS_VIEW } from '../config';

/**
 * 视频监控页摄像头交互：设备标牌由全局加载（layout 的 useMapEntities 按
 * config/devices 注册表创建）,本层只做「选中设备 → 定位并高亮对应标牌」;
 * 页面选中状态由调用方持有,本层只在卸载时清除高亮（标牌全局保活）。
 */
export function useCameraMarkers() {
    const siteStore = useSiteStore();
    /* 页面随站点切换重建,生命周期内站点取一次即可 */
    const siteKey = siteStore.activeSite;
    const groups = CAMERA_GROUPS_BY_SITE[siteKey];

    /** 当前高亮设备（仅本层切换判断用,响应式状态由页面持有） */
    let currentDevice: CameraDevice | undefined;
    /** 当前高亮实体（清除高亮与流光用） */
    let focusedEntity: Cesium.Entity | undefined;

    /** 设备 → 标牌实体（展平序号与全局点位生成同源同序） */
    function markerOf(device: CameraDevice): Cesium.Entity | undefined {
        const index = listCameraDevices(siteKey).indexOf(device);
        if (index < 0) return undefined;
        return getSiteEntities(siteKey).getById(cameraMarkerName(index));
    }

    /** 选中设备：定位到其标牌（切换设备时恢复上一个高亮;重复选中仅找回视角） */
    function focusDevice(device: CameraDevice): void {
        if (currentDevice !== device) {
            setLabelPinHighlight(focusedEntity, false);
            focusedEntity = markerOf(device);
            setLabelPinHighlight(focusedEntity, true);
            currentDevice = device;
        }
        lookAtLonLat(device.lng, device.lat, CAMERA_FOCUS_VIEW);
    }

    onBeforeUnmount(() => {
        /* 标牌全局保活,本页只清高亮与流光 */
        setLabelPinHighlight(focusedEntity, false);
        focusedEntity = undefined;
        currentDevice = undefined;
    });

    return { groups, focusDevice };
}

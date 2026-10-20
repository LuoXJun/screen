/**
 * 站点设备注册表：设备列表/点位数据的全局横切配置（同 site.ts 定位）。
 * 全局加载器（layout 的 useMapEntities）据此创建标牌实体,各页面按需消费:
 * 视频监控页用摄像头分组做列表联动,弹窗分发经 useEntityPopup 按 type 路由。
 */

import type { SiteKey } from '@/config/site';
import { buildBoxTransformerPoints } from './boxTransformer';
import { buildCameraPoints } from './camera';
import { SAMPLE_POINTS_BY_SITE } from './samplePoints';
import type { DevicePoint } from './types';

export type {
    BoxTransformerDevice,
    BoxTransformerStatus,
    CameraDevice,
    CameraDeviceStatus,
    CameraGroup,
    CameraSubgroup,
    DeviceKind,
    DevicePoint,
    DomeCameraStatus,
    GunCameraStatus
} from './types';
export { DEVICE_TYPE_DOME, DEVICE_TYPE_GUN } from './types';
export {
    CAMERA_GROUPS_BY_SITE,
    cameraMarkerName,
    buildCameraPopupData,
    listCameraDevices
} from './camera';
export { boxTransformerMarkerName, listBoxTransformers } from './boxTransformer';

/** 站点设备点位全量（摄像头展平 + 箱变 + 光纤/机巢样本点;加载器按此建实体） */
export const DEVICE_POINTS_BY_SITE: Record<SiteKey, DevicePoint[]> = {
    xianfeng: [
        ...buildCameraPoints('xianfeng'),
        ...buildBoxTransformerPoints('xianfeng'),
        ...SAMPLE_POINTS_BY_SITE.xianfeng
    ],
    tuanqing: [
        ...buildCameraPoints('tuanqing'),
        ...buildBoxTransformerPoints('tuanqing'),
        ...SAMPLE_POINTS_BY_SITE.tuanqing
    ]
};

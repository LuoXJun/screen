/**
 * 摄像头设备配置：分组数据索引、列表↔点位同源的展平规则与弹窗数据派生。
 * 面板点位的实体名由 cameraMarkerName 生成,页面侧按同一规则构名查实体。
 */

import type { SiteKey } from '@/config/site';
import { SITE_CONFIG_MAP } from '@/config/site';
import type { CameraData, CameraStatus } from '@/components/screen/popups/camera/CameraPopup';
import { XIANFENG_CAMERA_GROUPS } from './camera-xianfeng';
import { TUANQING_CAMERA_GROUPS } from './camera-tuanqing';
import type { CameraDevice, CameraDeviceStatus, CameraGroup, DevicePoint } from './types';

/** 摄像头分组列表（按站点;列表 UI 与点位生成共用） */
export const CAMERA_GROUPS_BY_SITE: Record<SiteKey, CameraGroup[]> = {
    xianfeng: XIANFENG_CAMERA_GROUPS,
    tuanqing: TUANQING_CAMERA_GROUPS
};

/** 展平分组为设备数组（顺序即点位序号;列表与点位关联靠同源同序） */
export function listCameraDevices(siteKey: SiteKey): CameraDevice[] {
    return CAMERA_GROUPS_BY_SITE[siteKey].flatMap((group) =>
        group.subgroups.flatMap((sub) => sub.items)
    );
}

/** 点位实体名（站点容器内唯一;index 为展平序号） */
export function cameraMarkerName(index: number): string {
    return `camera-${index + 1}`;
}

/** 列表状态 → 弹窗状态（弹窗仅在线/离线二态,非离线即在线） */
const POPUP_STATUS_MAP: Record<CameraDeviceStatus, CameraStatus> = {
    offline: 'offline',
    normal: 'online',
    warning: 'online',
    overheat: 'online',
    fire: 'online'
};

/** 设备 → 点位点击弹窗数据（样本派生,待接口直供;location 为安装位置描述） */
export function buildCameraPopupData(device: CameraDevice, location: string): CameraData {
    return {
        no: device.id,
        model: 'Fd491',
        location,
        installDate: '2026-09-22',
        status: POPUP_STATUS_MAP[device.status],
        lastAlarm: '无',
        preview: 'camera-preview.png'
    };
}

/** 标牌文字（与列表卡片标题同款,便于对照） */
function buildMarkerText(device: CameraDevice): string {
    return `${device.id}${device.suffix ? `（${device.suffix}）` : ''}`;
}

/** 站点摄像头点位（展平序与 listCameraDevices 一致） */
export function buildCameraPoints(siteKey: SiteKey): DevicePoint[] {
    const siteLabel = SITE_CONFIG_MAP[siteKey].label;
    const points: DevicePoint[] = [];
    CAMERA_GROUPS_BY_SITE[siteKey].forEach((group) => {
        group.subgroups.forEach((sub) => {
            sub.items.forEach((device) => {
                const location = [siteLabel, group.title, sub.title, device.suffix ?? device.type]
                    .filter(Boolean)
                    .join('·');
                points.push({
                    id: cameraMarkerName(points.length),
                    type: 'camera',
                    text: buildMarkerText(device),
                    lng: device.lng,
                    lat: device.lat,
                    /* 展开使类型获得隐式索引签名（DevicePoint.data 契约） */
                    data: { ...buildCameraPopupData(device, location) }
                });
            });
        });
    });
    return points;
}

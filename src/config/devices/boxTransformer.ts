/**
 * 箱变设备样本（每站 10 台,四态分布为超温 2 / 接近阈值 3 / 正常 4 / 离线 1）。
 * 坐标为站点附近近似值（待实地确认）;全局加载器据此建标牌,箱变测温页列表同源。
 * 与摄像头集群错开布置：5×2 网格独立成区（步长约 180m）,避免标牌堆叠遮挡。
 */

import type { SiteKey } from '@/config/site';
import type {
    BoxTransformerDevice,
    BoxTransformerStatus as TempStatus,
    DevicePoint
} from './types';

interface BoxMeta {
    zone: string;
    status: TempStatus;
}

/** 10 台箱变的分区与总状态（最差点即箱变总状态） */
const BOX_META: BoxMeta[] = [
    { zone: 'B3区', status: 'overheat' },
    { zone: 'A区', status: 'near' },
    { zone: 'B区', status: 'normal' },
    { zone: 'B区', status: 'normal' },
    { zone: 'C区', status: 'near' },
    { zone: 'C区', status: 'offline' },
    { zone: 'D区', status: 'overheat' },
    { zone: 'D区', status: 'normal' },
    { zone: 'E区', status: 'near' },
    { zone: 'F区', status: 'normal' }
];

/** 网格步长（5 列 × 2 行,约 180m / 190m） */
const GRID_STEP = { lng: 0.0018, lat: 0.0017 };

/** 站点箱变区基准点（与摄像头集群错开） */
const SITE_BASE: Record<SiteKey, { lng: number; lat: number }> = {
    xianfeng: { lng: 105.9336, lat: 26.8666 },
    tuanqing: { lng: 105.8646, lat: 26.8214 }
};

function buildSiteDevices(siteKey: SiteKey): BoxTransformerDevice[] {
    const base = SITE_BASE[siteKey];
    return BOX_META.map((meta, index) => {
        const row = Math.floor(index / 5);
        const col = index % 5;
        return {
            id: `box-${index + 1}`,
            name: `${index + 1}#箱变`,
            zone: meta.zone,
            status: meta.status,
            lng: Number((base.lng + col * GRID_STEP.lng).toFixed(4)),
            lat: Number((base.lat - row * GRID_STEP.lat).toFixed(4))
        };
    });
}

const BOX_TRANSFORMERS_BY_SITE: Record<SiteKey, BoxTransformerDevice[]> = {
    xianfeng: buildSiteDevices('xianfeng'),
    tuanqing: buildSiteDevices('tuanqing')
};

export function listBoxTransformers(siteKey: SiteKey): BoxTransformerDevice[] {
    return BOX_TRANSFORMERS_BY_SITE[siteKey];
}

/** 点位实体名（站点容器内唯一;index 为列表序号） */
export function boxTransformerMarkerName(index: number): string {
    return `box-transformer-${index + 1}`;
}

/** 站点箱变点位（与列表同源同序;deviceId 供地图点击回选列表） */
export function buildBoxTransformerPoints(siteKey: SiteKey): DevicePoint[] {
    return listBoxTransformers(siteKey).map((device, index) => ({
        id: boxTransformerMarkerName(index),
        type: 'boxTransformer',
        text: device.name,
        lng: device.lng,
        lat: device.lat,
        data: { deviceId: device.id, status: device.status, zone: device.zone }
    }));
}

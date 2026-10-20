/**
 * 箱变设备样本（每站 4 台,超温/接近阈值/正常/离线四态各一）。
 * 坐标为站点附近近似值（待实地确认）;全局加载器据此建标牌,箱变测温页列表同源。
 * 与摄像头集群错开布置：箱变单独成区且彼此拉开间距,避免标牌堆叠遮挡。
 */

import type { SiteKey } from '@/config/site';
import type { BoxTransformerDevice, DevicePoint } from './types';

const BOX_TRANSFORMERS_BY_SITE: Record<SiteKey, BoxTransformerDevice[]> = {
    xianfeng: [
        {
            id: 'box-1',
            name: '1#箱变',
            zone: 'B3区',
            status: 'overheat',
            lng: 105.9336,
            lat: 26.8666
        },
        {
            id: 'box-2',
            name: '2#箱变',
            zone: 'A区',
            status: 'near',
            lng: 105.9354,
            lat: 26.8662
        },
        {
            id: 'box-3',
            name: '3#箱变',
            zone: 'C区',
            status: 'normal',
            lng: 105.9339,
            lat: 26.8649
        },
        {
            id: 'box-4',
            name: '4#箱变',
            zone: 'D区',
            status: 'offline',
            lng: 105.9357,
            lat: 26.8645
        }
    ],
    tuanqing: [
        {
            id: 'box-1',
            name: '1#箱变',
            zone: 'B3区',
            status: 'overheat',
            lng: 105.8646,
            lat: 26.8214
        },
        {
            id: 'box-2',
            name: '2#箱变',
            zone: 'A区',
            status: 'near',
            lng: 105.8664,
            lat: 26.821
        },
        {
            id: 'box-3',
            name: '3#箱变',
            zone: 'C区',
            status: 'normal',
            lng: 105.8649,
            lat: 26.8197
        },
        {
            id: 'box-4',
            name: '4#箱变',
            zone: 'D区',
            status: 'offline',
            lng: 105.8667,
            lat: 26.8193
        }
    ]
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

/**
 * 监控摄像头列表 UI 配置（设备数据模型与样本数据见 @/config/devices,状态映射为展示层职责）。
 * 状态体系：枪机 4 态（离线/在线/预警/超温）/ 球机 3 态（离线/在线/明火明烟）。
 * 色调映射语义色：offline→info 灰 / normal→success 绿 / warning→warning 橙 / overheat·fire→danger 红。
 */

import type { CameraDeviceStatus } from '@/config/devices';

/** 状态 → 文案 */
export const CAMERA_STATUS_MAP: Record<CameraDeviceStatus, string> = {
    offline: '离线',
    normal: '在线',
    warning: '预警',
    overheat: '超温',
    fire: '明火明烟'
};

/** 状态 → 色调（CSS 色值;卡片状态点/状态词与监控面板共用，经 --status-color 消费） */
export const CAMERA_STATUS_TONE: Record<CameraDeviceStatus, string> = {
    offline: 'var(--lxj-color-info)',
    normal: 'var(--lxj-color-success)',
    warning: 'var(--lxj-color-warning)',
    overheat: 'var(--lxj-color-danger)',
    fire: 'var(--lxj-color-danger)'
};

/** 统计格 */
export interface CameraStatCell {
    label: string;
    value: number;
    unit: string;
}

/** 统计条（两排,设计稿值;接口后由统计聚合替换） */
export const CAMERA_STATS: CameraStatCell[][] = [
    [
        { label: '监控总数', value: 50, unit: '台' },
        { label: '固定枪机测温摄像头', value: 10, unit: '台' },
        { label: '球机监控摄像头', value: 40, unit: '台' }
    ],
    [
        { label: '在线设备', value: 50, unit: '台' },
        { label: '离线设备', value: 10, unit: '台' }
    ]
];

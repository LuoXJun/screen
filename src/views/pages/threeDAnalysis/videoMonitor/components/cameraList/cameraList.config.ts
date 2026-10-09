/**
 * 监控摄像头列表配置（设计稿样本数据,待接接口）。
 * 状态体系：枪机 4 态（离线/在线/预警/超温）/ 球机 3 态（离线/在线/明火明烟）。
 * 色调映射语义色：offline→info 灰 / normal→success 绿 / warning→warning 橙 / overheat·fire→danger 红。
 */

/** 固定枪机测温摄像头状态（4 态） */
export type GunCameraStatus = 'offline' | 'normal' | 'warning' | 'overheat';

/** 球机监控摄像头状态（3 态） */
export type DomeCameraStatus = 'offline' | 'normal' | 'fire';

/** 摄像头设备状态（枪机 4 态 / 球机 3 态;配色修饰类见 cameraCard） */
export type CameraDeviceStatus = GunCameraStatus | DomeCameraStatus;

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

/** 摄像头设备 */
export interface CameraDevice {
    /** 设备编号 */
    id: string;
    /** 括注（如 备用变 / SVG / 进出线路） */
    suffix?: string;
    /** 设备类型（展示名） */
    type: string;
    /** 状态 */
    status: CameraDeviceStatus;
}

/** 子分组（光伏站的方阵；无标题则平铺） */
export interface CameraSubgroup {
    title?: string;
    items: CameraDevice[];
}

/** 摄像头分组 */
export interface CameraGroup {
    title: string;
    total: number;
    subgroups: CameraSubgroup[];
}

/** 统计格 */
export interface CameraStatCell {
    label: string;
    value: number;
    unit: string;
}

/** 统计条（两排,设计稿值） */
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

/** 摄像头分组列表（设计稿样本,数量与接口对齐后替换;状态铺满枪机 4 态/球机 3 态便于验证） */
export const CAMERA_GROUPS: CameraGroup[] = [
    {
        title: '升压站',
        total: 5,
        subgroups: [
            {
                items: [
                    {
                        id: 'CAM-XF-B4-K90',
                        suffix: '备用变',
                        type: '固定枪机测温摄像头',
                        status: 'normal'
                    },
                    {
                        id: 'CAM-XF-B4-K91',
                        suffix: 'SVG',
                        type: '固定枪机测温摄像头',
                        status: 'warning'
                    },
                    {
                        id: 'CAM-XF-B4-K90',
                        suffix: '进出线路',
                        type: '固定枪机测温摄像头',
                        status: 'offline'
                    },
                    {
                        id: 'CAM-XF-B4-K90',
                        suffix: '主变电',
                        type: '固定枪机测温摄像头',
                        status: 'overheat'
                    },
                    {
                        id: 'CAM-XF-B4-K90',
                        suffix: '主变电',
                        type: '固定枪机测温摄像头',
                        status: 'overheat'
                    },
                    {
                        id: 'CAM-XF-B4-K90',
                        suffix: '主变电',
                        type: '固定枪机测温摄像头',
                        status: 'overheat'
                    },
                    {
                        id: 'CAM-XF-B4-K90',
                        suffix: '主变电',
                        type: '固定枪机测温摄像头',
                        status: 'overheat'
                    }
                ]
            }
        ]
    },
    {
        title: '光伏站',
        total: 5,
        subgroups: [
            {
                title: 'A01方阵',
                items: [
                    { id: 'CAM-XF-B4-K90', type: '球机监控摄像头', status: 'normal' },
                    { id: 'CAM-XF-B4-K90', type: '球机监控摄像头', status: 'fire' }
                ]
            },
            {
                title: 'A02方阵',
                items: [
                    { id: 'CAM-XF-B4-K90', type: '球机监控摄像头', status: 'normal' },
                    { id: 'CAM-XF-B4-K90', type: '球机监控摄像头', status: 'offline' }
                ]
            },
            {
                title: 'A03方阵',
                items: [{ id: 'CAM-XF-B4-K90', type: '球机监控摄像头', status: 'normal' }]
            },
            {
                title: 'A04方阵',
                items: [
                    { id: 'CAM-XF-B4-K90', type: '球机监控摄像头', status: 'fire' },
                    { id: 'CAM-XF-B4-K90', type: '球机监控摄像头', status: 'offline' },
                    { id: 'CAM-XF-B4-K90', type: '球机监控摄像头', status: 'normal' }
                ]
            },
            {
                title: 'A05方阵',
                items: [{ id: 'CAM-XF-B4-K90', type: '球机监控摄像头', status: 'normal' }]
            }
        ]
    }
];

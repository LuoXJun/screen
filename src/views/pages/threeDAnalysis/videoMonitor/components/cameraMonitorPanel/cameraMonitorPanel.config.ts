/**
 * 监控画面面板配置（设计稿 251-838,样本数据待接接口）。
 * 位置体系：与 overview 的 records 一致——主区底部居中常驻面板,非模态弹窗。
 */
import {
    CAMERA_STATUS_MAP,
    CAMERA_STATUS_TONE,
    type CameraDevice
} from '../cameraList/cameraList.config';

/** 画面模式（可见光 / 红外） */
export interface MonitorMode {
    key: 'visible' | 'infrared';
    label: string;
}

/** 画面模式页签（设计稿:可见光默认激活） */
export const MONITOR_MODES: MonitorMode[] = [
    { key: 'visible', label: '可见光' },
    { key: 'infrared', label: '红外' }
];

/** 云台参数行（每行 +/− 两个操作钮） */
export interface PtzParamRow {
    key: string;
    label: string;
}

/** 云台参数行（设计稿取值;摄像头锁定行为开关,单独渲染） */
export const PTZ_PARAM_ROWS: PtzParamRow[] = [
    { key: 'zoom-factor', label: '变倍' },
    { key: 'zoom-focus', label: '变焦' }
];

/** 设备信息字段（值为演示数据,待接口） */
export interface MonitorInfoField {
    label: string;
    value: string;
    /** 值加粗（设计稿:仅设备编号） */
    strong?: boolean;
    /** 值色调（CSS 色值,默认 #e8f4ff） */
    color?: string;
}

/** 面板展示数据 */
export interface MonitorPanelData {
    /** 画面左上角频道名 */
    channel: string;
    /** 设备信息字段（两列网格铺排） */
    infoFields: MonitorInfoField[];
}

/** 设备 → 面板展示数据（演示映射,待接口） */
export function buildMonitorPanelData(device: CameraDevice): MonitorPanelData {
    const suffix = device.suffix ? `（${device.suffix}）` : '';
    return {
        channel: '升压站-摄像头-2',
        infoFields: [
            { label: '设备编号', value: `${device.id}${suffix}`, strong: true },
            { label: '厂商型号', value: '海康 DS-2DC7223' },
            { label: '安装位置', value: '先锋站 B区4方阵·逆变器#4·组串12' },
            { label: '投运日期', value: '2022-03-15' },
            {
                label: '当前状态',
                value: `● ${CAMERA_STATUS_MAP[device.status]}`,
                color: CAMERA_STATUS_TONE[device.status]
            },
            { label: '最近告警', value: '无', color: 'var(--color-white)' }
        ]
    };
}

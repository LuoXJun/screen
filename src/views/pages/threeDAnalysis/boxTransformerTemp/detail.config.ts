/**
 * 箱变温度详情（右侧栏）配置（设计稿 node 1191:7105）。
 * 每台箱变 9 路测温点（状态混合）；单路 48h 曲线与极值为按点位种子生成的示例数据，待接接口。
 */

import type { EChartsCoreOption } from '@/components/baseChart/echarts';
import { scalePx } from '@/components/baseChart/screenScale';
import { TEMP_STATUS_COLORS, type TempStatus } from './config';

export interface TempPointDetail {
    id: string;
    name: string;
    channel: string;
    /** 基准温度（历史/极值按此派生；离线点位仅用于历史展示） */
    base: number;
    status: TempStatus;
}

export interface BoxDetailData {
    deviceNo: string;
    updatedAt: string;
    points: TempPointDetail[];
}

const POINT_NAMES = [
    '高压侧A相触点',
    '高压侧B相触点',
    '高压侧C相触点',
    '高压侧A接头',
    '高压侧B接头',
    '高压侧C接头',
    '低压侧A接触点',
    '低压侧B接触点',
    '低压侧C接触点'
];

interface PointProfile {
    statuses: TempStatus[];
    bases: number[];
}

/** 各总状态对应的 9 路分布（最差点与箱变总状态一致） */
const POINT_PROFILES: Record<TempStatus, PointProfile> = {
    overheat: {
        statuses: ['overheat', 'overheat', 'near', 'normal', 'normal', 'near', 'normal', 'normal', 'normal'],
        bases: [91.2, 89.8, 82.4, 64.5, 58.2, 79.6, 61.3, 55.8, 68.4]
    },
    near: {
        statuses: ['near', 'near', 'normal', 'normal', 'near', 'normal', 'normal', 'near', 'normal'],
        bases: [83.6, 79.2, 63.4, 58.7, 78.4, 61.9, 56.3, 80.1, 64.8]
    },
    normal: {
        statuses: ['normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal'],
        bases: [62.5, 58.9, 55.2, 71.4, 66.8, 60.3, 57.6, 63.2, 59.4]
    },
    offline: {
        statuses: ['offline', 'offline', 'offline', 'offline', 'offline', 'offline', 'offline', 'offline', 'offline'],
        bases: [60.2, 57.4, 55.8, 65.1, 62.3, 59.7, 56.5, 61.8, 58.6]
    }
};

const UPDATED_TIMES = [
    '09:59:12',
    '09:58:47',
    '09:59:03',
    '09:57:36',
    '09:58:21',
    '09:41:26',
    '09:59:44',
    '09:58:05',
    '09:57:52',
    '09:59:18'
];

function pointsOf(profile: PointProfile, boxNo: number): TempPointDetail[] {
    /* 同状态箱变之间做 ±0.6°C 偏移，避免 9 路数值完全重复 */
    const offset = ((boxNo % 3) - 1) * 0.6;
    return POINT_NAMES.map((name, index) => ({
        id: `p${index + 1}`,
        name,
        channel: `CH${index + 1}`,
        base: Number((profile.bases[index] + offset).toFixed(1)),
        status: profile.statuses[index]
    }));
}

/** 按箱变状态与编号生成 9 路明细（编号决定设备号/更新时间/数值偏移） */
export function getBoxDetail(deviceId: string, status: TempStatus): BoxDetailData {
    const boxNo = Number(deviceId.replace(/\D/g, '')) || 1;
    return {
        deviceNo: `光纤测温装置DTS-${String(boxNo).padStart(2, '0')}`,
        updatedAt: UPDATED_TIMES[(boxNo - 1) % UPDATED_TIMES.length],
        points: pointsOf(POINT_PROFILES[status], boxNo)
    };
}

export interface ExtremeRecord {
    type: 'high' | 'low';
    label: string;
    value: string;
    time: string;
}

/** 曲线形状（设计稿走势的归一化偏差，共 25 点 / 48h） */
const CURVE_SHAPE = [
    -6, -4, -2, 0, 2, 1, -1, -3, -4, -2, 0, 3, 5, 3, 1, -1, -3, -5, -7, -9, -6, -2, -4, -1, 0
];

const HIGH_DATES = [
    '2026-07-21 14:35',
    '2026-08-04 13:12',
    '2026-07-30 15:48',
    '2026-06-18 12:26',
    '2026-08-11 16:03'
];

const LOW_DATES = [
    '2026-01-12 06:40',
    '2026-02-03 05:58',
    '2026-01-27 07:12',
    '2026-02-14 06:05',
    '2026-01-19 05:32'
];

/** 单路 48 小时曲线（seed 混入箱变/点位序号，保证每路走势不同） */
export function buildPointHistory(base: number, seed: number): number[] {
    return CURVE_SHAPE.map((delta, index) =>
        +(base + delta + Math.sin((index + seed) * 0.8) * 1.2).toFixed(1)
    );
}

/** 单路历史极值（按基准温度与种子派生） */
export function buildPointExtremes(base: number, seed: number): ExtremeRecord[] {
    const high = (base + 9.6 + (seed % 4) * 0.8).toFixed(1);
    const low = (base - 30.4 - (seed % 6) * 0.9).toFixed(1);
    return [
        {
            type: 'high',
            label: '历史最高温度',
            value: `${high}°C`,
            time: HIGH_DATES[seed % HIGH_DATES.length]
        },
        {
            type: 'low',
            label: '历史最低温度',
            value: `${low}°C`,
            time: LOW_DATES[seed % LOW_DATES.length]
        }
    ];
}

/** 曲线说明（当前选中路） */
export function pointHistoryNote(point: TempPointDetail): string {
    return `${point.channel} ${point.name}·虚线为阈值`;
}

const HISTORY_LABELS = ['-48h', '-36h', '-24h', '-12h', '现在'];

export interface ThresholdSettings {
    /** 预警阈值（接近） */
    warn: number;
    /** 告警阈值（超温） */
    alert: number;
}

/** 默认阈值（设计稿值） */
export const DEFAULT_THRESHOLDS: ThresholdSettings = {
    warn: 75,
    alert: 85
};

function withAlpha(hex: string, alpha: number): string {
    const value = parseInt(hex.slice(1), 16);
    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** 构建单路 48 小时曲线（状态色/数据/阈值随选中与设置变化） */
export function buildHistoryOption(
    status: TempStatus,
    values: number[],
    thresholds: ThresholdSettings = DEFAULT_THRESHOLDS
): EChartsCoreOption {
    const color = TEMP_STATUS_COLORS[status];
    const axisFont = scalePx(10);

    return {
        animation: false,
        grid: {
            left: scalePx(28),
            right: scalePx(14),
            top: scalePx(14),
            bottom: scalePx(26)
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: values.map((_, index) => index),
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: {
                color: '#4a7a9b',
                fontSize: scalePx(14),
                interval: (index: number) => index % 6 === 0,
                formatter: (value: number) => HISTORY_LABELS[value / 6]
            }
        },
        yAxis: {
            type: 'value',
            min: 20,
            max: 100,
            interval: 20,
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: { color: '#55758d', fontSize: axisFont },
            splitLine: {
                lineStyle: { color: 'rgba(85, 117, 141, 0.2)', type: 'dashed' }
            }
        },
        series: [
            {
                type: 'line',
                data: values,
                showSymbol: false,
                lineStyle: { color, width: scalePx(1.5) },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: withAlpha(color, 0.18) },
                            { offset: 1, color: withAlpha(color, 0) }
                        ]
                    }
                },
                markLine: {
                    silent: true,
                    symbol: 'none',
                    data: [
                        {
                            yAxis: thresholds.alert,
                            lineStyle: {
                                color: '#ff4058',
                                type: 'dashed',
                                width: scalePx(1)
                            },
                            label: {
                                show: true,
                                position: 'insideEndTop',
                                formatter: `告警 ${thresholds.alert}°C`,
                                color: '#ff4058',
                                fontSize: axisFont
                            }
                        },
                        {
                            yAxis: thresholds.warn,
                            lineStyle: {
                                color: '#ff9b2f',
                                type: 'dashed',
                                width: scalePx(1)
                            },
                            label: {
                                show: true,
                                position: 'insideEndTop',
                                formatter: `预警 ${thresholds.warn}°C`,
                                color: '#ff9b2f',
                                fontSize: axisFont
                            }
                        }
                    ]
                }
            }
        ]
    };
}

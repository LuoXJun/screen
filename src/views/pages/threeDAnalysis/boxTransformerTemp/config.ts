/**
 * 箱变测温左侧栏配置（设计稿 node 1191:6864）。
 * 设备统计与实时温度列表取全局箱变数据；环形图/图例暂为设计稿示例，待接接口。
 */

import type { EChartsCoreOption } from '@/components/baseChart/echarts';
import { scalePx } from '@/components/baseChart/screenScale';
import type { BoxTransformerStatus } from '@/config/devices';
import type { LookAtLonLatOptions } from '@/cesium';

/** 设备状态（与全局箱变设备同源,四态） */
export type TempStatus = BoxTransformerStatus;

export interface TempStatusMeta {
    label: string;
    color: string;
}

export const TEMP_STATUS_META: Record<TempStatus, TempStatusMeta> = {
    overheat: { label: '超温', color: 'var(--lxj-color-risk-serious)' },
    near: { label: '温度接近阈值', color: 'var(--lxj-color-risk-high)' },
    normal: { label: '正常', color: 'var(--lxj-color-risk-safe)' },
    offline: { label: '设备离线', color: 'var(--lxj-color-risk-offline)' }
};

/** 进入箱变测温页时的相机视角（箱变集群斜视） */
export const BOX_VIEW: LookAtLonLatOptions = {
    heading: 0,
    pitch: -45,
    range: 1000,
    duration: 2
};

/** 列表点击箱变时的近景视角（单台设备观察） */
export const BOX_FOCUS_VIEW: LookAtLonLatOptions = {
    heading: 0,
    pitch: -35,
    range: 500,
    duration: 1.6
};

export interface TempRatioItem {
    name: string;
    value: number;
    /** echarts canvas 不消费 CSS 变量，色标/百分比按设计稿原值保留 */
    color: string;
}

/** 环形图图例（设计稿示例占比，待接接口） */
export const TEMP_RATIO_ITEMS: TempRatioItem[] = [
    { name: '超温', value: 35, color: '#f07020' },
    { name: '接近阈值', value: 23, color: '#f5a623' },
    { name: '正常', value: 17, color: '#3090ff' },
    { name: '离线', value: 13, color: '#00c8ff' },
    { name: '在线设备', value: 12, color: '#37f2a8' }
];

/**
 * 环图分段：设计稿为 8 段装饰环（配比与总览「隐患类型占比」同款），
 * 与图例 5 项口径不同；环上不出文字，按设计稿原样还原。
 */
/* 顺时针自 12 点起：白 → 橙 → 黄 → 黄绿 → 红 → 绿 → 青 → 蓝（与设计稿环序一致） */
const RING_SEGMENTS: Array<{ value: number; color: string }> = [
    { value: 12, color: '#f5eaf5' },
    { value: 35, color: '#f07020' },
    { value: 12, color: '#f5a623' },
    { value: 12, color: '#a7d060' },
    { value: 12, color: '#d06060' },
    { value: 12, color: '#37f2a8' },
    { value: 13, color: '#00c8ff' },
    { value: 17, color: '#3090ff' }
];

/** 构建环形图配置（标签由右侧图例承担，环上不出文字） */
export function buildRingOption(): EChartsCoreOption {
    return {
        series: [
            {
                type: 'pie',
                radius: ['71%', '98%'],
                center: ['50%', '50%'],
                /* 段间留空隙（设计稿样式） */
                padAngle: 5,
                avoidLabelOverlap: false,
                label: { show: false },
                labelLine: { show: false },
                itemStyle: { borderWidth: scalePx(1.5) },
                data: RING_SEGMENTS.map((item, index) => ({
                    name: `segment-${index}`,
                    value: item.value,
                    itemStyle: { color: item.color }
                }))
            }
        ]
    };
}

/**
 * 植被隐患页面配置（设计稿 node 1168:945）：
 * 图层面板（隐患图/基础图）与分区植被统计均在 config 中驱动。
 */

import type { BaseTabItem } from '@/components/baseTabs/baseTabs';

export interface LayerOption {
    /** 图层标识：与 cesium 图层池同名时联动显隐，未注册则静默跳过 */
    value: string;
    label: string;
}

export interface LayerGroup {
    title: string;
    options: LayerOption[];
}

export const LAYER_GROUPS: LayerGroup[] = [
    {
        title: '隐患图',
        options: [
            { value: 'vegetationDryness', label: '植被干枯度（栅格）' },
            { value: 'vegetationDepth', label: '植被深度（点位）' },
            { value: 'fireRisk', label: '火灾综合风险（栅格）' }
        ]
    }
];

/** 全部图层标识（「共 N 层」与全选口径） */
export const ALL_LAYER_VALUES = LAYER_GROUPS.flatMap((group) =>
    group.options.map((option) => option.value)
);

/** 设计稿初值：隐患图 3 项（基础图层由全局图层管理负责） */
export const DEFAULT_CHECKED_LAYERS = ['vegetationDryness', 'vegetationDepth', 'fireRisk'];

export interface VegetationLevel {
    label: string;
    value: string;
    color: string;
}

/** 总面积卡 */
export const TOTAL_AREA = { label: '总面积', value: '43.2', unit: '万㎡' };

/** 植被风险色板（设计稿专属语义色，非通用色板） */
export const TONE = {
    safe: '#00d889',
    normal: '#e8c629',
    high: '#ff7a22',
    serious: '#ff4058',
    manmade: '#c26cff'
} as const;

/** 四色等级卡 */
export const LEVELS: VegetationLevel[] = [
    { label: '安全', value: '28.6', color: TONE.safe },
    { label: '一般', value: '9.8', color: TONE.normal },
    { label: '高危', value: '3.6', color: TONE.high },
    { label: '重大', value: '1.2', color: TONE.serious }
];

export interface ZoneRow {
    zone: string;
    area: string;
    abnormal: string;
    dryRatio: string;
}

export const ZONE_COLUMNS: ITableColumn[] = [
    { filed: 'zone', label: '方阵', options: { align: 'center' } },
    { filed: 'area', label: '覆盖面积', options: { align: 'center' } },
    { filed: 'abnormal', label: '高度异常', options: { align: 'center' } },
    { filed: 'dryRatio', label: '干枯占比', options: { align: 'center' } }
];

export const ZONE_ROWS: ZoneRow[] = [
    { zone: 'A1区', area: '1280㎡', abnormal: '2处', dryRatio: '22%' },
    { zone: 'A2区', area: '960㎡', abnormal: '5处', dryRatio: '41%' },
    { zone: 'A3区', area: '540㎡', abnormal: '1处', dryRatio: '18%' },
    { zone: 'B3区', area: '1280㎡', abnormal: '12处', dryRatio: '72%' },
    { zone: 'B3区', area: '1280㎡', abnormal: '12处', dryRatio: '72%' },
    { zone: 'B3区', area: '1280㎡', abnormal: '12处', dryRatio: '72%' },
    { zone: 'B3区', area: '1280㎡', abnormal: '12处', dryRatio: '72%' },
    { zone: 'B3区', area: '1280㎡', abnormal: '12处', dryRatio: '72%' },
    { zone: 'B3区', area: '1280㎡', abnormal: '12处', dryRatio: '72%' },
    { zone: 'B3区', area: '1280㎡', abnormal: '12处', dryRatio: '72%' },
    { zone: 'B3区', area: '1280㎡', abnormal: '12处', dryRatio: '72%' },
    { zone: 'B3区', area: '1280㎡', abnormal: '12处', dryRatio: '72%' },
    { zone: 'B3区', area: '1280㎡', abnormal: '12处', dryRatio: '72%' },
    { zone: 'B3区', area: '1280㎡', abnormal: '12处', dryRatio: '72%' },
    { zone: 'B2区', area: '1050㎡', abnormal: '9处', dryRatio: '58%' }
];

/* ---------------- 火灾隐患列表（右侧面板） ---------------- */

export const HAZARD_LEVELS = ['一般', '高危', '重大'] as const;

export type HazardLevel = (typeof HAZARD_LEVELS)[number];

export const HAZARD_LEVEL_COLORS: Record<HazardLevel, string> = {
    一般: TONE.normal,
    高危: TONE.high,
    重大: TONE.serious
};

/** 等级筛选页签 */
export type HazardTab = '全部' | HazardLevel;

export const HAZARD_TABS: BaseTabItem<HazardTab>[] = [
    { label: '全部', value: '全部' },
    ...HAZARD_LEVELS.map((level) => ({ label: level, value: level }))
];

export interface HazardTag {
    label: string;
    /**
     * 设计稿中标签按位次交替配色（主标签绿、次标签紫），与底部图例的
     * 类型色不完全一致；此处按设计稿原样落地，接真实数据后可改为按类型统一。
     */
    color: string;
}

export interface HazardRecord {
    id: string;
    date: string;
    zone: string;
    level: HazardLevel;
    tags: HazardTag[];
}

export const HAZARD_RECORDS: HazardRecord[] = [
    {
        id: '1',
        date: '2026-09-15',
        zone: 'B3区',
        level: '重大',
        tags: [
            { label: '植被过高', color: TONE.safe },
            { label: '植被干枯度过高', color: TONE.manmade }
        ]
    },
    {
        id: '2',
        date: '2026-09-15',
        zone: 'C1区',
        level: '高危',
        tags: [{ label: '植被干枯度过高', color: TONE.safe }]
    },
    {
        id: '3',
        date: '2026-09-14',
        zone: 'C2区',
        level: '高危',
        tags: [
            { label: '植被过高', color: TONE.safe },
            { label: '人为火灾因素', color: TONE.manmade }
        ]
    },
    {
        id: '4',
        date: '2026-09-14',
        zone: 'A2区',
        level: '一般',
        tags: [{ label: '人为火灾因素', color: TONE.safe }]
    },
    {
        id: '5',
        date: '2026-09-13',
        zone: 'B2区',
        level: '高危',
        tags: [
            { label: '植被干枯度过高', color: TONE.manmade },
            { label: '人为火灾因素', color: TONE.manmade }
        ]
    },
    {
        id: '6',
        date: '2026-09-12',
        zone: 'C2区',
        level: '重大',
        tags: [
            { label: '植被过高', color: TONE.safe },
            { label: '植被干枯度过高', color: TONE.manmade }
        ]
    },
    {
        id: '7',
        date: '2026-09-11',
        zone: 'B1区',
        level: '一般',
        tags: [{ label: '植被干枯度过高', color: TONE.safe }]
    },
    {
        id: '8',
        date: '2026-09-10',
        zone: 'A1区',
        level: '一般',
        tags: [{ label: '植被过高', color: TONE.safe }]
    },
    {
        id: '9',
        date: '2026-09-09',
        zone: 'C3区',
        level: '高危',
        tags: [{ label: '人为火灾因素', color: TONE.safe }]
    },
    {
        id: '10',
        date: '2026-09-08',
        zone: 'B3区',
        level: '重大',
        tags: [{ label: '植被干枯度过高', color: TONE.safe }]
    }
];

/** 底部图例（按风险类型着色） */
export const HAZARD_LEGEND = [
    { label: '植被过高', color: TONE.safe },
    { label: '干枯度过高', color: TONE.high },
    { label: '人为风险', color: TONE.manmade }
];

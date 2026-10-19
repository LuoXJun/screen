/**
 * 页面底部面板配置（设计稿 node 1103:1037）：
 * 植被隐患清单筛选/条目 + 无人机拍摄影像状态。
 */

import type { BaseTabItem } from '@/components/baseTabs/baseTabs';
import { TONE, type HazardLevel } from '../../config';

/** 隐患清单筛选类型 */
export type ChecklistType = 'dry' | 'depth';

export const CHECKLIST_TYPES: BaseTabItem<ChecklistType>[] = [
    { label: '植被干枯预警', value: 'dry' },
    { label: '植被深度预警', value: 'depth' }
];

/** 待处理计数（设计稿值，待接口） */
export const CHECKLIST_PENDING = 5;

export interface ChecklistItem {
    id: string;
    type: ChecklistType;
    /** 关联的火灾隐患记录 id（清单是隐患列表的下钻子项） */
    hazardId: string;
    /** 所属区域（无人机影像同步展示） */
    zone: string;
    title: string;
    detail: string;
    level: HazardLevel;
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
    {
        id: '1',
        type: 'dry',
        hazardId: '1',
        zone: 'B3区',
        title: 'B3区 12#组串 植被干枯预警',
        detail: '重大隐患 · 高度 1.9m',
        level: '重大'
    },
    {
        id: '2',
        type: 'dry',
        hazardId: '2',
        zone: 'C1区',
        title: 'C1区 05#组串 植被干枯预警',
        detail: '高危隐患 · 高度 1.6m',
        level: '高危'
    },
    {
        id: '3',
        type: 'dry',
        hazardId: '3',
        zone: 'C2区',
        title: 'C2区 08#组串 植被干枯预警',
        detail: '高危隐患 · 高度 1.5m',
        level: '高危'
    },
    {
        id: '4',
        type: 'dry',
        hazardId: '4',
        zone: 'A2区',
        title: 'A2区 07#组串 植被干枯预警',
        detail: '一般隐患 · 高度 0.8m',
        level: '一般'
    }
];

/** 无人机影像设备状态（区域与等级随清单选中项同步） */
export const DRONE_IMAGERY = {
    camera: 'CAM-01',
    online: true
};

/** 影像画面中的条带数量（设计稿 8 条） */
export const STRIPE_COUNT = 8;

/** 风险等级图例（底部面板右上浮层） */
export const RISK_LEGEND = [
    { label: '安全', range: '＜0.25', color: TONE.safe },
    { label: '一般', range: '0.25～0.50', color: TONE.normal },
    { label: '高危', range: '0.50～0.75', color: TONE.high },
    { label: '重大', range: '＞0.75', color: TONE.serious }
];

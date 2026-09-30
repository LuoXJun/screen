import type { EChartsCoreOption } from '@/components/baseChart/echarts';
import { scalePx } from '@/components/baseChart/screenScale';

export interface HazardItem {
    /** 隐患类型名 */
    name: string;
    /** 占比（%） */
    value: number;
    /** 色标 / 百分比 / 环段共用色，设计稿取值 */
    color: string;
}

/** 「隐患类型占比」数据（待接接口） */
export const HAZARD_ITEMS: HazardItem[] = [
    { name: '箱变温度异常', value: 35, color: '#f07020' },
    { name: '升压站温度异常', value: 23, color: '#f5a623' },
    { name: '组串缺陷', value: 17, color: '#3090ff' },
    { name: '架空线路缺陷', value: 13, color: '#00c8ff' },
    { name: '杆塔缺陷', value: 12, color: '#37f2a8' },
    { name: '火情', value: 12, color: '#d06060' },
    { name: '植被隐患', value: 12, color: '#f5eaf5' },
    { name: '其他隐患', value: 12, color: '#a7d060' }
];

/** 构建「隐患类型占比」环形图配置（标签由右侧图例承担，环上不出文字） */
export function buildHazardOption(): EChartsCoreOption {
    return {
        series: [
            {
                type: 'pie',
                radius: ['56%', '92%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: false,
                label: { show: false },
                labelLine: { show: false },
                itemStyle: {
                    /* 透明描边在扇区间切出间隙，透出面板底色，不依赖具体背景色 */
                    borderWidth: scalePx(2),
                    borderColor: 'transparent'
                },
                data: HAZARD_ITEMS.map((item) => ({
                    name: item.name,
                    value: item.value,
                    itemStyle: { color: item.color }
                }))
            }
        ]
    };
}

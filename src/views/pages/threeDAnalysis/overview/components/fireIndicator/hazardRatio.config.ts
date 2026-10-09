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
                radius: ['71%', '98%'],
                center: ['50%', '50%'],
                /* 段间留空隙（设计稿样式），与各段自身的浅白描边叠加；单位为弧度，0.087 ≈ 5° */
                padAngle: 5,
                avoidLabelOverlap: false,
                label: { show: false },
                labelLine: { show: false },
                itemStyle: {
                    borderWidth: scalePx(1.5)
                    // borderColor: 'rgba(255, 255, 255, 0.65)'
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

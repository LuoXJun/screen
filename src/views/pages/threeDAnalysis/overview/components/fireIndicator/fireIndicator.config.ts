import type { EChartsCoreOption } from '@/components/baseChart/echarts';
import { scalePx } from '@/components/baseChart/screenScale';

export type RangeValue = '7d' | '30d';

export const RANGE_OPTIONS: ReadonlyArray<{ value: RangeValue; label: string }> = [
    { value: '7d', label: '近7天' },
    { value: '30d', label: '近30天' }
];

/** 设计稿字号（px）——写进 option 前按当前屏基准换算 */
const DESIGN_FONT = 10;

/** 设计稿取色；echarts 走 canvas 渲染，不认 CSS 变量，故此处维护实际值并在注释里对应色板 */
const COLOR = {
    /** 柱体主蓝（设计稿原值，色板 --color-blue-400 的近似值 #0266f0） */
    bar: '0, 102, 255',
    /** 轴标签：设计稿为纯白（变量 Dark/1.0） */
    axis: '#ffffff',
    axisLine: 'rgba(74, 122, 155, 0.3)',
    splitLine: 'rgba(74, 122, 155, 0.2)'
};

/** 最近 N 天日期（MM/DD） */
function recentDates(days: number): string[] {
    return Array.from({ length: days }, (_, i) => {
        const date = new Date(Date.now() - (days - 1 - i) * 86400000);
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${mm}/${dd}`;
    });
}

/** 示例告警数（待接接口；以 7 天为基线循环铺满 30 天） */
const MOCK_BASE = [86, 112, 40, 96, 72, 112, 58];

function mockValues(days: number): number[] {
    return Array.from({ length: days }, (_, i) => MOCK_BASE[i % MOCK_BASE.length]);
}

/**
 * 柱体渐变：设计稿是两层叠加，echarts 单 series 只能给一个渐变，故按两层 alpha 逐点混合
 * 算出等效色标——关键是保留底层那 20% 白对柱身的整体提亮，否则柱身会偏暗。
 * 设计稿原式：
 *   linear-gradient(180deg, #fff 3.45%, rgba(255,255,255,.2) 12.59%)
 *   linear-gradient(180deg, rgb(0,102,255) 4.73%, rgba(0,102,255,.2) 100%)
 */
const BAR_GRADIENT = {
    type: 'linear' as const,
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
        { offset: 0, color: 'rgb(255, 255, 255)' },
        { offset: 0.034, color: 'rgb(255, 255, 255)' },
        { offset: 0.047, color: 'rgb(226, 238, 255)' },
        { offset: 0.126, color: 'rgba(54, 134, 255, 0.95)' },
        { offset: 0.3, color: 'rgba(61, 139, 255, 0.83)' },
        { offset: 0.6, color: 'rgba(81, 151, 255, 0.63)' },
        { offset: 1, color: 'rgba(142, 187, 255, 0.36)' }
    ]
};

/** 构建「防火告警趋势」柱图配置 */
export function buildIndicatorOption(range: RangeValue): EChartsCoreOption {
    const days = range === '7d' ? 7 : 30;
    /* echarts 不认 CSS 变量，字号须按当前屏基准换算；切屏后由调用方重建 option */
    const fontSize = scalePx(DESIGN_FONT);
    return {
        grid: { left: 8, right: 8, top: 30, bottom: 4, containLabel: true },
        xAxis: {
            type: 'category',
            data: recentDates(days),
            axisTick: { show: false },
            axisLine: { lineStyle: { color: COLOR.axisLine } },
            axisLabel: {
                color: COLOR.axis,
                fontSize,
                /* 标签排不下时自动隔项显示，不硬塞也不重叠 */
                interval: 'auto'
            }
        },
        yAxis: {
            type: 'value',
            max: 120,
            interval: 30,
            name: '单位',
            nameLocation: 'end',
            nameGap: 20,
            /* 与数值标签同一条右对齐基准线（设计稿同宽 46px 容器 text-right） */
            nameTextStyle: { color: COLOR.axis, fontSize, align: 'right' },
            axisLabel: { color: COLOR.axis, fontSize },
            splitLine: { lineStyle: { type: 'dashed', color: COLOR.splitLine } }
        },
        series: [
            {
                type: 'bar',
                data: mockValues(days),
                barWidth: '30%',
                itemStyle: { color: BAR_GRADIENT }
            }
        ]
    };
}

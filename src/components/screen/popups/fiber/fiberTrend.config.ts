import type { EChartsCoreOption } from '@/components/baseChart/echarts';
import { scalePx } from '@/components/baseChart/screenScale';

/** 设计稿字号（px）——写进 option 前按当前屏基准换算（echarts 不认 CSS 变量） */
const DESIGN_FONT = 16;

/** 设计稿取色；echarts 走 canvas 渲染，此处维护实际值 */
const COLOR = {
    axis: '#94b0d1',
    splitLine: 'rgba(74, 122, 155, 0.25)',
    line: '#00c8ff',
    warning: '#f5a623'
};

/**
 * 构建「光纤测温趋势」折线（设计稿:竖向虚线网格 + 顶部预警虚线 + 仅最低点标记）。
 * 注:设计稿的阈值线位于 1000 刻度上方（量程外）,数值语义待接口对齐(当前按视觉近似 1040)。
 */
export function buildFiberTrendOption(dates: string[], values: number[]): EChartsCoreOption {
    const fontSize = scalePx(DESIGN_FONT);
    return {
        grid: { left: 4, right: 10, top: 34, bottom: 4, containLabel: true },
        xAxis: {
            type: 'category',
            data: dates,
            boundaryGap: false,
            axisTick: { show: false },
            axisLine: { lineStyle: { color: 'rgba(74, 122, 155, 0.35)' } },
            axisLabel: { color: COLOR.axis, fontSize, fontFamily: 'Arial' },
            /* 设计稿为竖向虚线网格（横向网格隐藏） */
            splitLine: { show: true, lineStyle: { type: 'dashed', color: COLOR.splitLine } }
        },
        yAxis: {
            type: 'value',
            min: 0,
            /* 量程留余量:预警虚线位于 1000 刻度上方（设计稿视觉） */
            max: 1100,
            interval: 500,
            /* 函数式 formatter 避免默认千分位(设计稿为纯数字 1000) */
            axisLabel: {
                color: COLOR.axis,
                fontSize,
                fontFamily: 'Arial',
                formatter: (value: number) => String(value)
            },
            splitLine: { show: false }
        },
        series: [
            {
                type: 'line',
                data: values,
                smooth: true,
                symbol: 'none',
                lineStyle: { width: scalePx(1.5), color: COLOR.line },
                itemStyle: { color: COLOR.line },
                markPoint: {
                    /* 仅标记最低值点（白芯青环） */
                    silent: true,
                    data: [
                        {
                            type: 'min',
                            symbol: 'circle',
                            symbolSize: scalePx(7),
                            itemStyle: {
                                color: '#ffffff',
                                borderColor: COLOR.line,
                                borderWidth: scalePx(2)
                            },
                            label: { show: false }
                        }
                    ]
                },
                markLine: {
                    silent: true,
                    symbol: 'none',
                    lineStyle: { color: COLOR.warning, type: 'dashed', width: 1 },
                    label: {
                        formatter: '预警70°C',
                        color: COLOR.warning,
                        fontSize,
                        position: 'insideStartTop'
                    },
                    data: [{ yAxis: 1040 }]
                }
            }
        ]
    };
}

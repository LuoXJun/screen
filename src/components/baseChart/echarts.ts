import * as echarts from 'echarts/core';
import {
    BarChart,
    LineChart,
    PieChart,
    ScatterChart,
    EffectScatterChart,
    RadarChart,
    GaugeChart,
    LinesChart,
    MapChart
} from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    DataZoomComponent,
    VisualMapComponent,
    GeoComponent,
    MarkLineComponent,
    MarkPointComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

/** 大屏常用图表全家桶：业务侧直接用对应系列，无需关心注册；缺系列时在此追加 */
echarts.use([
    BarChart,
    LineChart,
    PieChart,
    ScatterChart,
    EffectScatterChart,
    RadarChart,
    GaugeChart,
    LinesChart,
    MapChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    DataZoomComponent,
    VisualMapComponent,
    GeoComponent,
    MarkLineComponent,
    MarkPointComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer
]);

export { echarts };

export type { EChartsCoreOption } from 'echarts/core';

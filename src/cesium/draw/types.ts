import type * as Cesium from 'cesium';

/** 可绘制的几何类型 */
export type GeometryType = 'point' | 'line' | 'rectangle' | 'polygon';

/** 绘制样式（颜色、线宽、点大小） */
export interface DrawGeometryStyle {
    /** 面填充色 */
    fillColor?: Cesium.Color;
    /** 线/边框/点的描边色 */
    strokeColor?: Cesium.Color;
    /** 线宽与描边宽（像素） */
    strokeWidth?: number;
    /** 点的像素尺寸 */
    pointSize?: number;
    /** 点的填充色（默认实心 #00b7ff；面填充色半透明，不适合点） */
    pointColor?: Cesium.Color;
}

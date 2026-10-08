import * as Cesium from 'cesium';
import { addImageryLayer, getImageryLayer, removeImageryLayer } from '@/cesium/core/layer';
import { renderHeatmap } from './heatmap/renderer';
import { boundsFromPolygon } from './heatmap/types';
import type { HeatmapBounds, HeatmapPoint, HeatmapPolygon, HeatmapStyle } from './heatmap/types';
import type { LayerConfig, MapLayer } from '../types';

export interface HeatmapLayerConfig extends LayerConfig<HeatmapPoint>, HeatmapStyle {
    /** 热力区域几何（必填）：由顶点直接定义，热力图只生成在该区域内 */
    polygon: HeatmapPolygon;
    /** 可选：自定义贴图范围（缺省按多边形顶点自动推断 bbox） */
    bounds?: HeatmapBounds;
}

/**
 * 温度热力图图层：数据点 + 温度色条渲染成 canvas，
 * 经 SingleTileImageryProvider 贴到地球上（挂入影像池统一管理）。
 */
export function createHeatmapLayer(name: string, config?: HeatmapLayerConfig): MapLayer<HeatmapPoint> {
    if (!config?.polygon?.rings.length || !config.colors?.length) {
        throw new Error(`heatmap 图层「${name}」缺少 polygon 或 colors 配置`);
    }
    return new HeatmapLayer(name, config);
}

class HeatmapLayer implements MapLayer<HeatmapPoint> {
    readonly name: string;
    readonly type = 'heatmap' as const;

    private bounds: HeatmapBounds;
    private polygon: HeatmapPolygon;
    private style: HeatmapStyle;
    private points: HeatmapPoint[] = [];

    constructor(name: string, config: HeatmapLayerConfig) {
        this.name = name;
        this.polygon = config.polygon;
        this.bounds = config.bounds ?? boundsFromPolygon(config.polygon);
        this.style = {
            colors: config.colors,
            radius: config.radius,
            opacity: config.opacity,
            minValue: config.minValue,
            maxValue: config.maxValue,
            width: config.width
        };
        if (config.visible === false) this.setVisible(false);
        if (config.data?.length) this.setData(config.data);
    }

    setData(points: HeatmapPoint[]): void {
        this.points = points;
        if (!points.length) {
            removeImageryLayer(this.name);
            return;
        }
        const canvas = renderHeatmap({ points, bounds: this.bounds, polygon: this.polygon, ...this.style });
        addImageryLayer(
            new Cesium.SingleTileImageryProvider({
                url: canvas.toDataURL('image/png'),
                rectangle: Cesium.Rectangle.fromDegrees(
                    this.bounds.west,
                    this.bounds.south,
                    this.bounds.east,
                    this.bounds.north
                ),
                tileWidth: canvas.width,
                tileHeight: canvas.height
            }),
            this.name
        );
    }

    setVisible(visible: boolean): void {
        const imagery = getImageryLayer(this.name);
        if (imagery) {
            imagery.show = visible;
            return;
        }
        // 图层曾被清空（clear）而数据仍在：重新渲染恢复
        if (visible && this.points.length) this.setData(this.points);
    }

    isVisible(): boolean {
        return getImageryLayer(this.name)?.show ?? true;
    }

    clear(): void {
        this.points = [];
        removeImageryLayer(this.name);
    }

    destroy(): void {
        this.clear();
    }
}

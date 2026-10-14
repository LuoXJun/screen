import * as Cesium from 'cesium';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import {
    RenderGeoJsonByGround,
    type GeoJsonRenderStyle
} from '@/cesium/effects/RenderGeoJsonByGround';
import { requestRender, requestRenderWithNextFrame } from '@/cesium/core/viewer';
import type { LayerConfig, MapLayer } from '../types';

/** GeoJSON 条目：一份 Feature / FeatureCollection（id 供实体命名与后续条目级扩展） */
export interface GeoJsonItem {
    id?: string;
    geojson: Feature | FeatureCollection;
}

export interface GeoJsonLayerConfig extends LayerConfig<GeoJsonItem> {
    /** 数据源地址（与 data 二选一；加载完成后经 setData 渲染） */
    url?: string;
    /** 渲染样式：点线颜色 / 线宽 / 面填充（缺省用渲染器默认色） */
    style?: GeoJsonRenderStyle;
}

/**
 * GeoJSON 矢量图层工厂：点线为 Entity、面为贴地 Primitive（可贴合地形与倾斜模型），
 * 整个图层作为统一显隐单元；url 与内联数据两种来源，全量替换语义。
 */
export function createGeoJsonLayer(
    name: string,
    config?: GeoJsonLayerConfig
): MapLayer<GeoJsonItem> {
    return new GeoJsonLayer(name, config ?? {});
}

class GeoJsonLayer implements MapLayer<GeoJsonItem> {
    readonly name: string;
    readonly type = 'geoJson' as const;

    private readonly renderer: RenderGeoJsonByGround;
    private items: GeoJsonItem[] = [];
    private visible: boolean;
    /** 操作版本：新 setData / 销毁使未竟的 url 加载失效（最后一次操作获胜） */
    private version = 0;

    constructor(name: string, config: GeoJsonLayerConfig) {
        this.name = name;
        this.visible = config.visible ?? true;
        this.renderer = new RenderGeoJsonByGround(config.style);
        if (config.data?.length) this.setData(config.data);
        if (config.url) void this.load(config.url);
    }

    /** 从 URL 加载 GeoJSON 并全量替换（失败仅告警，图层保持现状） */
    async load(url: string): Promise<void> {
        const version = ++this.version;
        try {
            const geojson = (await Cesium.Resource.fetchJson({ url })) as
                Feature | FeatureCollection;
            if (version !== this.version) return;
            this.applyData([{ geojson }]);
        } catch (err) {
            console.error(`[cesium] geoJson 图层「${this.name}」加载失败`, err);
        }
    }

    setData(items: GeoJsonItem[]): void {
        this.version++;
        this.applyData(items);
    }

    setVisible(visible: boolean): void {
        this.visible = visible;
        this.renderer.setVisible(visible);
        requestRender();
    }

    isVisible(): boolean {
        return this.visible;
    }

    /** 图层范围：全量要素坐标的外接矩形（空图层返回 undefined） */
    getBounds(): Cesium.Rectangle | undefined {
        const degrees: number[] = [];
        this.items.forEach((item) => collectCoordinates(item.geojson, degrees));
        if (!degrees.length) return undefined;
        return Cesium.Rectangle.fromCartesianArray(Cesium.Cartesian3.fromDegreesArray(degrees));
    }

    clear(): void {
        this.version++;
        this.items = [];
        this.renderer.clear();
        requestRender();
    }

    destroy(): void {
        this.clear();
    }

    /** 全量替换渲染内容（保持当前显隐状态） */
    private applyData(items: GeoJsonItem[]): void {
        this.items = items;
        this.renderer.clear();
        items.forEach((item) => this.renderer.renderGeoJSON(item.geojson));
        this.renderer.setVisible(this.visible);
        requestRenderWithNextFrame();
    }
}

/** 递归收集 GeoJSON 节点内的全部经纬度对（高度分量忽略） */
function collectCoordinates(
    node: FeatureCollection | Feature | Geometry | null,
    out: number[]
): void {
    if (!node) return;
    switch (node.type) {
        case 'FeatureCollection':
            node.features.forEach((feature) => collectCoordinates(feature, out));
            return;
        case 'Feature':
            collectCoordinates(node.geometry, out);
            return;
        case 'GeometryCollection':
            node.geometries.forEach((geometry) => collectCoordinates(geometry, out));
            return;
        default:
            collectPositions(node.coordinates, out);
    }
}

/** 递归收集坐标数组（Position 数组可能嵌套任意层） */
function collectPositions(coords: unknown, out: number[]): void {
    if (!Array.isArray(coords) || coords.length === 0) return;
    if (typeof coords[0] === 'number') {
        out.push(coords[0], coords[1]);
        return;
    }
    coords.forEach((child) => collectPositions(child, out));
}

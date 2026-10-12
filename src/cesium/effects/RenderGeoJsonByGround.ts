import * as Cesium from 'cesium';
import type { Feature, FeatureCollection } from 'geojson';
import { getViewer } from '@/cesium/core/viewer';
import { createLine, createPoint } from '@/cesium/core/entity';
import { forEachFeature, type LeafGeometry } from '@/cesium/core/utils/geo';
import { createPolygonPrimitives, type GroundPolygonPrimitive } from './polygonPrimitive';

const DEFAULT_STYLE: Required<GeoJsonRenderStyle> = {
    color: Cesium.Color.fromCssColorString('#f5ad47'),
    width: 2,
    fillColor: Cesium.Color.CYAN.withAlpha(0.2),
    strokeHoles: true
};

/** GeoJSON 渲染样式 */
export interface GeoJsonRenderStyle {
    /** 线/面边框颜色 */
    color?: Cesium.Color;
    /** 线/面边框宽度（像素） */
    width?: number;
    /** 面填充色 */
    fillColor?: Cesium.Color;
    /** 是否渲染洞的边框 */
    strokeHoles?: boolean;
}

/** 渲染 GeoJSON 要素（点/线用 Entity，面用贴地 Primitive），支持样式配置与统一清理 */
export class RenderGeoJsonByGround {
    private readonly entities: Cesium.Entity[] = [];
    private readonly primitives: GroundPolygonPrimitive[] = [];
    private style: Required<GeoJsonRenderStyle>;

    constructor(style: GeoJsonRenderStyle = {}) {
        this.style = { ...DEFAULT_STYLE, ...style };
    }

    /** 渲染全部要素（Point/MultiPoint/LineString/MultiLineString/Polygon/MultiPolygon 及嵌套 GeometryCollection） */
    renderGeoJSON(geoJson: FeatureCollection | Feature): void {
        forEachFeature(geoJson, (feature, geometry) => this.renderGeometry(feature, geometry));
    }

    /** 移除所有已渲染内容 */
    clear(): void {
        const viewer = getViewer();
        this.entities.forEach((entity) => viewer.entities.remove(entity));
        this.entities.length = 0;
        this.primitives.forEach((primitive) => viewer.scene.primitives.remove(primitive));
        this.primitives.length = 0;
    }

    /** 更新样式（仅对新渲染的要素生效） */
    updateStyle(style: GeoJsonRenderStyle): void {
        this.style = { ...this.style, ...style };
    }

    private renderGeometry(feature: Feature, geometry: LeafGeometry): void {
        const properties = feature.properties ?? {};
        switch (geometry.type) {
            case 'Point':
                this.addPoint(geometry.coordinates);
                break;
            case 'MultiPoint':
                geometry.coordinates.forEach((coordinates) => this.addPoint(coordinates));
                break;
            case 'LineString':
                this.addLine(geometry.coordinates, properties);
                break;
            case 'MultiLineString':
                geometry.coordinates.forEach((line) => this.addLine(line, properties));
                break;
            case 'Polygon':
                this.addPolygon(geometry.coordinates);
                break;
            case 'MultiPolygon':
                geometry.coordinates.forEach((polygon) => this.addPolygon(polygon));
                break;
        }
    }

    private addPoint(coordinates: number[]): void {
        const [lon, lat, height = 0] = coordinates;
        this.entities.push(getViewer().entities.add(createPoint(lon, lat, height)));
    }

    private addLine(coordinates: number[][], properties: Record<string, unknown>): void {
        const entity = getViewer().entities.add(createLine(coordinates, properties, this.style));
        this.entities.push(entity);
    }

    private addPolygon(rings: number[][][]): void {
        const primitives = createPolygonPrimitives(
            rings,
            {
                fillColor: this.style.fillColor,
                strokeColor: this.style.color,
                strokeWidth: this.style.width,
                strokeHoles: this.style.strokeHoles
            },
            `geojson-polygon-${this.primitives.length}`
        );
        const scenePrimitives = getViewer().scene.primitives;
        primitives.forEach((primitive) => scenePrimitives.add(primitive));
        this.primitives.push(...primitives);
    }
}

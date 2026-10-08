import * as Cesium from 'cesium';
import type { Feature, FeatureCollection } from 'geojson';
import { getViewer } from '@/cesium/core/viewer';
import { createLine, type LineStyle } from '@/cesium/core/entity';
import { forEachFeature, type LeafGeometry } from '@/cesium/core/utils/geo';

/** 基于 Entity API 渲染 GeoJSON 线要素，支持样式配置与统一清理 */
export class RenderGeoJsonByGround {
    private readonly entities: Cesium.Entity[] = [];
    private style: LineStyle;

    constructor(style: LineStyle = {}) {
        this.style = style;
    }

    /** 渲染全部要素（LineString / MultiLineString / GeometryCollection） */
    renderGeoJSON(geoJson: FeatureCollection | Feature): void {
        forEachFeature(geoJson, (feature, geometry) => this.renderGeometry(feature, geometry));
    }

    /** 移除所有已渲染的实体 */
    clear(): void {
        const entities = getViewer().entities;
        this.entities.forEach((entity) => entities.remove(entity));
        this.entities.length = 0;
    }

    /** 更新样式（仅对新渲染的要素生效） */
    updateStyle(style: LineStyle): void {
        this.style = { ...this.style, ...style };
    }

    private renderGeometry(feature: Feature, geometry: LeafGeometry): void {
        const properties = feature.properties ?? {};
        switch (geometry.type) {
            case 'LineString':
                this.renderLineString(geometry.coordinates, properties);
                break;
            case 'MultiLineString':
                geometry.coordinates.forEach((line) => this.renderLineString(line, properties));
                break;
            default:
                console.warn(`[cesiumTools] 不支持的要素类型: ${geometry.type}`);
        }
    }

    private renderLineString(coordinates: number[][], properties: Record<string, unknown>): void {
        const entity = getViewer().entities.add(createLine(coordinates, properties, this.style));
        this.entities.push(entity);
    }
}

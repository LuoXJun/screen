import * as Cesium from 'cesium';
import type { FeatureCollection, Position } from 'geojson';

/** 矩形/多边形实体 → GeoJSON（其他类型返回空要素集合） */
export function entity2Geojson(entity: Cesium.Entity): FeatureCollection {
    let positions: Cesium.Cartesian3[] = [];
    if (entity.rectangle) {
        const rect = entity.rectangle.coordinates?.getValue(Cesium.JulianDate.now());
        if (rect) {
            positions = [
                Cesium.Cartesian3.fromRadians(rect.west, rect.north),
                Cesium.Cartesian3.fromRadians(rect.east, rect.north),
                Cesium.Cartesian3.fromRadians(rect.east, rect.south),
                Cesium.Cartesian3.fromRadians(rect.west, rect.south),
                Cesium.Cartesian3.fromRadians(rect.west, rect.north)
            ];
        }
    } else if (entity.polygon) {
        const hierarchy = entity.polygon.hierarchy?.getValue(Cesium.JulianDate.now());
        positions = hierarchy?.positions ?? [];
    }

    const coordinates: Position[] = positions.map((position) => {
        const cartographic = Cesium.Cartographic.fromCartesian(position);
        return [
            Cesium.Math.toDegrees(cartographic.longitude),
            Cesium.Math.toDegrees(cartographic.latitude)
        ];
    });

    return {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                geometry: { type: 'Polygon', coordinates: [coordinates] },
                properties: { name: entity.name || entity.id }
            }
        ]
    };
}

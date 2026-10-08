import type { Feature, FeatureCollection, Geometry } from 'geojson';

/** 叶子几何类型（排除 GeometryCollection） */
export type LeafGeometry = Exclude<Geometry, { type: 'GeometryCollection' }>;

/**
 * 深度遍历 GeoJSON 要素：展开 FeatureCollection，递归处理（嵌套）GeometryCollection，
 * 仅对叶子几何调用回调，供不同渲染器共享同一套遍历逻辑。
 */
export function forEachFeature(
    geoJson: FeatureCollection | Feature,
    cb: (feature: Feature, geometry: LeafGeometry) => void
): void {
    const features = geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson];
    for (const feature of features) {
        walk(feature, cb);
    }
}

function walk(feature: Feature, cb: (feature: Feature, geometry: LeafGeometry) => void): void {
    const geometry = feature.geometry;
    if (!geometry) return;
    if (geometry.type === 'GeometryCollection') {
        for (const child of geometry.geometries) {
            walk({ ...feature, geometry: child }, cb);
        }
        return;
    }
    cb(feature, geometry);
}

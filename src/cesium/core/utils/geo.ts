import type { Feature, FeatureCollection, GeoJsonProperties, Geometry, Position } from 'geojson';

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

/** 去除 GeoJSON 中坐标的高度分量（仅保留经纬度） */
export function removeHeightFromGeoJSON(geoJson: FeatureCollection | Feature) {
    const stripHeight = (coords: unknown): unknown => {
        if (Array.isArray(coords)) {
            if (typeof coords[0] === 'number') {
                return coords.slice(0, 2);
            }
            return coords.map(stripHeight);
        }
        return coords;
    };

    const process = (geometry: LeafGeometry) => {
        geometry.coordinates = stripHeight(geometry.coordinates) as LeafGeometry['coordinates'];
    };

    const processed: FeatureCollection | Feature = JSON.parse(JSON.stringify(geoJson));

    if (processed.type === 'FeatureCollection') {
        processed.features.forEach((feature) => {
            if (feature.geometry && feature.geometry.type !== 'GeometryCollection') {
                process(feature.geometry);
            }
        });
    } else if (processed.type === 'Feature') {
        if (!processed.geometry || processed.geometry.type === 'GeometryCollection') {
            return processed;
        }
        process(processed.geometry);
    }

    return processed;
}

/** 提取面要素的各环边界线，输出 LineString 要素集合（第 0 环为外边界，其余为内边界） */
export function extractBoundariesAsGeoJSON(geoJson: FeatureCollection): FeatureCollection {
    const features: Feature[] = [];

    for (const feature of geoJson.features) {
        const geometry = feature.geometry;
        if (geometry?.type === 'Polygon') {
            features.push(
                ...ringBoundaryFeatures(geometry.coordinates, feature.properties, 'Polygon', 0)
            );
        } else if (geometry?.type === 'MultiPolygon') {
            geometry.coordinates.forEach((rings, index) => {
                features.push(
                    ...ringBoundaryFeatures(rings, feature.properties, 'MultiPolygon', index)
                );
            });
        }
    }

    return { type: 'FeatureCollection', features };
}

function ringBoundaryFeatures(
    rings: Position[][],
    properties: GeoJsonProperties,
    originalFeatureType: 'Polygon' | 'MultiPolygon',
    polygonIndex: number
): Feature[] {
    return rings.map((ring, index) => ({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: closeRing(ring) },
        properties: {
            ...properties,
            boundaryType: index === 0 ? 'outer' : 'inner',
            originalFeatureType,
            polygonIndex
        }
    }));
}

/** 闭合环（首尾已相同则原样返回副本） */
function closeRing(ring: Position[]): Position[] {
    const first = ring[0];
    const last = ring[ring.length - 1];
    if (first && last && (first[0] !== last[0] || first[1] !== last[1])) {
        return [...ring, [...first]];
    }
    return [...ring];
}

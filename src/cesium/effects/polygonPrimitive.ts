import * as Cesium from 'cesium';

/** 贴地面几何 primitive（填充/边框） */
export type GroundPolygonPrimitive = Cesium.GroundPrimitive | Cesium.GroundPolylinePrimitive;

/** 贴地面多边形样式 */
export interface GroundPolygonStyle {
    /** 面填充色 */
    fillColor: Cesium.Color;
    /** 边框色 */
    strokeColor: Cesium.Color;
    /** 边框宽度（像素） */
    strokeWidth: number;
    /** 是否渲染洞的边框 */
    strokeHoles: boolean;
}

/**
 * 构建贴地面多边形几何：填充 GroundPrimitive + 边框 GroundPolylinePrimitive。
 * rings 为 GeoJSON 环数组：第 0 环为外环，其余为洞；外环顶点不足 3 个时返回空数组。
 */
export function createPolygonPrimitives(
    rings: number[][][],
    style: GroundPolygonStyle,
    id?: string
): GroundPolygonPrimitive[] {
    const [outer, ...holes] = rings;
    const outerPositions = toPositions(outer ?? []);
    if (outerPositions.length < 3) {
        return [];
    }

    const holePositions = holes.map(toPositions).filter((positions) => positions.length >= 3);
    const hierarchy = new Cesium.PolygonHierarchy(
        outerPositions,
        holePositions.map((positions) => new Cesium.PolygonHierarchy(positions))
    );

    const primitives: GroundPolygonPrimitive[] = [createFill(hierarchy, style, id)];
    const borderRings = style.strokeHoles ? [outer, ...holes] : [outer];
    borderRings.forEach((ring) => {
        const stroke = createStroke(openRing(ring), style);
        if (stroke) primitives.push(stroke);
    });
    return primitives;
}

function createFill(
    hierarchy: Cesium.PolygonHierarchy,
    style: GroundPolygonStyle,
    id?: string
): Cesium.GroundPrimitive {
    return new Cesium.GroundPrimitive({
        geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.PolygonGeometry({
                polygonHierarchy: hierarchy,
                perPositionHeight: false
            }),
            id: id ?? `polygon-${Date.now()}`,
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(style.fillColor)
            }
        }),
        appearance: new Cesium.PerInstanceColorAppearance({
            translucent: style.fillColor.alpha < 1
        }),
        classificationType: Cesium.ClassificationType.BOTH,
        asynchronous: true
    });
}

function createStroke(
    ring: number[][],
    style: GroundPolygonStyle
): Cesium.GroundPolylinePrimitive | null {
    const positions = toPositions(ring);
    if (positions.length < 2) {
        return null;
    }
    return new Cesium.GroundPolylinePrimitive({
        geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.GroundPolylineGeometry({
                positions,
                width: style.strokeWidth,
                loop: true
            }),
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(style.strokeColor)
            }
        }),
        appearance: new Cesium.PolylineColorAppearance(),
        asynchronous: true
    });
}

/** 环坐标（经纬或经纬高）→ 笛卡尔坐标（忽略高度，贴椭球面） */
function toPositions(ring: number[][]): Cesium.Cartesian3[] {
    const degrees: number[] = [];
    for (const coord of ring) {
        degrees.push(coord[0], coord[1]);
    }
    return Cesium.Cartesian3.fromDegreesArray(degrees);
}

/** 去掉闭合环末尾的重复点（GroundPolylineGeometry 由 loop 参数闭合） */
function openRing(ring: number[][]): number[][] {
    if (ring.length > 2) {
        const first = ring[0];
        const last = ring[ring.length - 1];
        if (first[0] === last[0] && first[1] === last[1]) {
            return ring.slice(0, -1);
        }
    }
    return ring;
}

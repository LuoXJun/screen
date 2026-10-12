import * as Cesium from 'cesium';
import type { DrawGeometryStyle } from './types';

export type DrawStyle = Required<DrawGeometryStyle>;

/** 矩形四至（弧度）与其对应的 Cesium.Rectangle */
export interface RectangleBounds {
    west: number;
    south: number;
    east: number;
    north: number;
    rectangle: Cesium.Rectangle;
}

export function polylineOptions(
    style: DrawStyle,
    positions: Cesium.Cartesian3[] | Cesium.Property
): Cesium.PolylineGraphics.ConstructorOptions {
    return {
        positions,
        width: style.strokeWidth,
        material: style.strokeColor,
        clampToGround: true,
        classificationType: Cesium.ClassificationType.BOTH
    };
}

/** 点实体：圆点 + 经纬度标签。
 *  position 来自地表拾取，故不设 heightReference：CLAMP_TO_GROUND 会把点转为 billboard
 *  纹理路径（图集异步上传，需额外渲染帧才可见），不设则走 PointPrimitive 同步渲染路径 */
export function buildPoint(
    style: DrawStyle,
    position: Cesium.Cartesian3
): Cesium.Entity.ConstructorOptions {
    const cartographic = Cesium.Cartographic.fromCartesian(position);
    const lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5);
    const lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5);
    return {
        name: 'point',
        position,
        point: {
            pixelSize: style.pointSize,
            color: style.pointColor,
            outlineColor: style.strokeColor,
            outlineWidth: style.strokeWidth,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
        label: {
            text: `${lon},${lat}`,
            font: '12px sans-serif',
            pixelOffset: new Cesium.Cartesian2(0, -24),
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2
        }
    };
}

export function buildLine(
    style: DrawStyle,
    positions: Cesium.Cartesian3[]
): Cesium.Entity.ConstructorOptions {
    return { name: 'line', polyline: polylineOptions(style, positions) };
}

export function buildPolygon(
    style: DrawStyle,
    positions: Cesium.Cartesian3[]
): Cesium.Entity.ConstructorOptions {
    return {
        name: 'polygon',
        polygon: {
            hierarchy: positions,
            material: style.fillColor,
            classificationType: Cesium.ClassificationType.BOTH
        },
        polyline: polylineOptions(style, [...positions, positions[0]])
    };
}

export function buildRectangle(
    style: DrawStyle,
    rectangle: Cesium.Rectangle
): Cesium.Entity.ConstructorOptions {
    return {
        name: 'rectangle',
        rectangle: { coordinates: rectangle, material: style.fillColor },
        polyline: polylineOptions(style, rectangleBorder(rectangle))
    };
}

/** 两对角点 → 矩形与四至 */
export function rectangleBounds(
    first: Cesium.Cartesian3,
    second: Cesium.Cartesian3
): RectangleBounds {
    const a = Cesium.Cartographic.fromCartesian(first);
    const b = Cesium.Cartographic.fromCartesian(second);
    const west = Math.min(a.longitude, b.longitude);
    const south = Math.min(a.latitude, b.latitude);
    const east = Math.max(a.longitude, b.longitude);
    const north = Math.max(a.latitude, b.latitude);
    return {
        west,
        south,
        east,
        north,
        rectangle: Cesium.Rectangle.fromRadians(west, south, east, north)
    };
}

/** 矩形边框采样点（角点沿椭球取点，首尾闭合） */
export function rectangleBorder(rectangle: Cesium.Rectangle): Cesium.Cartesian3[] {
    const positions = Cesium.Rectangle.subsample(rectangle);
    return [...positions, positions[0]];
}

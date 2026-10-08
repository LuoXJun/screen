import * as Cesium from 'cesium';

/** 以中心点与半径（米）生成地面圆几何（EllipseGeometry） */
export function createCircleGeometry(center: Cesium.Cartesian3, radius: number): Cesium.EllipseGeometry {
    return new Cesium.EllipseGeometry({
        center,
        semiMajorAxis: radius,
        semiMinorAxis: radius
    });
}

/** 以中心点与半径（米）生成地面方形几何（边长 = 2 × 半径） */
export function createSquareGeometry(center: Cesium.Cartesian3, radius: number): Cesium.RectangleGeometry {
    return new Cesium.RectangleGeometry({ rectangle: squareBoundsFromCenter(center, radius) });
}

/** 计算中心点外扩半径（米）的经纬度边界（经度按纬度余弦修正） */
function squareBoundsFromCenter(center: Cesium.Cartesian3, radius: number): Cesium.Rectangle {
    const cartographic = Cesium.Cartographic.fromCartesian(center);
    const earthRadius = Cesium.Ellipsoid.WGS84.maximumRadius;
    const latOffset = radius / earthRadius;
    const lonOffset = radius / (earthRadius * Math.cos(cartographic.latitude));
    return new Cesium.Rectangle(
        cartographic.longitude - lonOffset,
        cartographic.latitude - latOffset,
        cartographic.longitude + lonOffset,
        cartographic.latitude + latOffset
    );
}

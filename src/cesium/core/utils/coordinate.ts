import * as Cesium from 'cesium';

/** 经纬度（角度）+ 高度 → 笛卡尔坐标 */
export function toCartesian3(lng: number, lat: number, height = 0): Cesium.Cartesian3 {
    return Cesium.Cartesian3.fromDegrees(lng, lat, height);
}

/** 经纬度数组 → 笛卡尔坐标列表 */
export function toCartesian3List(coordinates: number[][]): Cesium.Cartesian3[] {
    return coordinates.map(([lon, lat, height = 0]) => Cesium.Cartesian3.fromDegrees(lon, lat, height));
}

/** 笛卡尔坐标 → 经纬度 */
export function toLonLat(cartesian3: Cesium.Cartesian3): { lng: number; lat: number; height: number } {
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian3);
    return {
        lng: Cesium.Math.toDegrees(cartographic.longitude),
        lat: Cesium.Math.toDegrees(cartographic.latitude),
        height: cartographic.height
    };
}

/** 两点间球面直线距离（米） */
export function distanceInMeters(fromLng: number, fromLat: number, toLng: number, toLat: number): number {
    const from = Cesium.Cartesian3.fromDegrees(fromLng, fromLat);
    const to = Cesium.Cartesian3.fromDegrees(toLng, toLat);
    return Cesium.Cartesian3.distance(from, to);
}

import * as Cesium from 'cesium';
import { getViewer } from './viewer';
import { toLonLat } from './utils/coordinate';

/** 相机可飞行目标：实体/图层/瓦片集/数据源等（由 Viewer.flyTo 签名推导） */
export type FlyTarget = Parameters<Cesium.Viewer['flyTo']>[0];

/** 相机飞行至目标（自动计算包围球），返回是否到达 */
export function flyTo(
    target: FlyTarget,
    options?: Parameters<Cesium.Viewer['flyTo']>[1]
): Promise<boolean> {
    return getViewer().flyTo(target, options);
}

/** 直接定位相机（无飞行动画） */
export function setView(options: Parameters<Cesium.Camera['setView']>[0]): void {
    getViewer().camera.setView(options);
}

export interface LonLatViewOptions {
    /** 朝向角度（度，默认 0 = 正北） */
    heading?: number;
    /** 俯仰角度（度，默认 -90 = 正俯视） */
    pitch?: number;
    /** 翻转角度（度，默认 0） */
    roll?: number;
    /** 飞行时长（秒） */
    duration?: number;
}

/** 相机飞行至经纬度（角度制参数） */
export function flyToLonLat(lng: number, lat: number, height: number, options: LonLatViewOptions = {}): void {
    const { heading = 0, pitch = -90, roll = 0, duration } = options;
    getViewer().camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lng, lat, height),
        orientation: {
            heading: Cesium.Math.toRadians(heading),
            pitch: Cesium.Math.toRadians(pitch),
            roll: Cesium.Math.toRadians(roll)
        },
        duration
    });
}

/** 相机瞬移至经纬度（无飞行动画） */
export function setViewLonLat(lng: number, lat: number, height: number, options: Omit<LonLatViewOptions, 'duration'> = {}): void {
    const { heading = 0, pitch = -90, roll = 0 } = options;
    getViewer().camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(lng, lat, height),
        orientation: {
            heading: Cesium.Math.toRadians(heading),
            pitch: Cesium.Math.toRadians(pitch),
            roll: Cesium.Math.toRadians(roll)
        }
    });
}

/** 相机飞行至经纬度矩形范围 */
export function flyToRectangle(west: number, south: number, east: number, north: number, duration?: number): void {
    getViewer().camera.flyTo({
        destination: Cesium.Rectangle.fromDegrees(west, south, east, north),
        duration
    });
}

/** 拾取屏幕坐标对应的经纬度（无地表交点时返回 null） */
export function pickLonLat(
    screenPosition: Cesium.Cartesian2
): { lng: number; lat: number; height: number } | null {
    const cartesian = getViewer().camera.pickEllipsoid(screenPosition);
    return cartesian ? toLonLat(cartesian) : null;
}

/** 当前相机所在经纬度与高度 */
export function getCameraLonLat(): { lng: number; lat: number; height: number } {
    return toLonLat(getViewer().camera.positionWC);
}

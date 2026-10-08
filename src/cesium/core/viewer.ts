import * as Cesium from 'cesium';

/** Cesium Ion 默认访问令牌（https://ion.cesium.com 申请，通过 VITE_CESIUM_ION_TOKEN 配置） */
const DEFAULT_ION_TOKEN = import.meta.env.VITE_CESIUM_ION_TOKEN ?? '';

const DEFAULT_VIEWER_OPTIONS: Cesium.Viewer.ConstructorOptions = {
    animation: false,
    timeline: false,
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    infoBox: false,
    selectionIndicator: false,
    requestRenderMode: true
};

let viewer: Cesium.Viewer | null = null;

Cesium.Ion.defaultAccessToken = DEFAULT_ION_TOKEN;

/** 初始化全局 Viewer（重复调用返回已存在实例） */
export function initViewer(container: HTMLElement, options: Cesium.Viewer.ConstructorOptions = {}): Cesium.Viewer {
    if (hasViewer()) {
        console.warn('[cesium] Viewer 已初始化，忽略重复调用');
        return viewer!;
    }
    viewer = new Cesium.Viewer(container, { ...DEFAULT_VIEWER_OPTIONS, ...options });
    return viewer;
}

/** 获取全局 Viewer（未初始化时抛出，调用前可用 hasViewer 判断） */
export function getViewer(): Cesium.Viewer {
    if (!hasViewer()) {
        throw new Error('[cesium] Viewer 尚未初始化，请先调用 initViewer()');
    }
    return viewer!;
}

export function hasViewer(): boolean {
    return viewer !== null && !viewer.isDestroyed();
}

/** 销毁 Viewer。注意：业务侧需先清理事件/图层/实体，再调用本函数 */
export function destroyViewer(): void {
    if (!hasViewer()) {
        viewer = null;
        return;
    }
    viewer!.destroy();
    viewer = null;
}

/** requestRenderMode 下需要手动触发渲染时调用 */
export function requestRender(): void {
    getViewer().scene.requestRender();
}

/** 大屏净空场景：关闭星空/大气/太阳/月亮/雾，纯黑背景 */
export function setCleanScene(clean: boolean): void {
    const scene = getViewer().scene;
    scene.skyBox.show = !clean;
    scene.skyAtmosphere.show = !clean;
    scene.sun.show = !clean;
    scene.moon.show = !clean;
    scene.fog.enabled = !clean;
    scene.backgroundColor = clean ? Cesium.Color.BLACK : Cesium.Color.fromCssColorString('#111111');
}

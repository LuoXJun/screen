import * as Cesium from 'cesium';
import { getViewer } from './viewer';

/** 事件处理器注册表：统一跟踪，销毁 Viewer 前务必调用 clearHandlers 防止内存泄漏 */
const handlers = new Set<Cesium.ScreenSpaceEventHandler>();

export function createHandler(): Cesium.ScreenSpaceEventHandler {
    const handler = new Cesium.ScreenSpaceEventHandler(getViewer().scene.canvas);
    handlers.add(handler);
    return handler;
}

export function clearHandler(handler: Cesium.ScreenSpaceEventHandler): void {
    handler.destroy();
    handlers.delete(handler);
}

export function clearHandlers(): void {
    handlers.forEach((handler) => handler.destroy());
    handlers.clear();
}

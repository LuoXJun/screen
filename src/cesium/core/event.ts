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
    /* 幂等：跨端切换等场景下 handler 可能已被 clearHandlers 统一销毁,二次 destroy 会抛错 */
    if (!handler.isDestroyed()) {
        handler.destroy();
    }
    handlers.delete(handler);
}

export function clearHandlers(): void {
    handlers.forEach((handler) => {
        if (!handler.isDestroyed()) {
            handler.destroy();
        }
    });
    handlers.clear();
}

/** 拾取结果：命中实体与其解包后的自定义属性 */
interface PickedEntityInfo {
    entity: Cesium.Entity;
    props?: Record<string, unknown>;
}

/** 拾取屏幕坐标下的实体（页面级点击联动用；无实体返回 null） */
export function pickEntity(screenPosition: Cesium.Cartesian2): PickedEntityInfo | null {
    const viewer = getViewer();
    const picked = viewer.scene.pick(screenPosition);
    if (!Cesium.defined(picked)) return null;
    const entity = picked.id instanceof Cesium.Entity ? picked.id : undefined;
    if (!entity) return null;
    const props = entity.properties?.getValue(viewer.clock.currentTime) as
        | Record<string, unknown>
        | undefined;
    return { entity, props };
}

/** 注册左键点击回调（页面级联动用；返回的 handler 须 clearHandler 清理） */
export function onLeftClick(
    callback: (screenPosition: Cesium.Cartesian2) => void
): Cesium.ScreenSpaceEventHandler {
    const handler = createHandler();
    handler.setInputAction((movement: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        callback(movement.position);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    return handler;
}

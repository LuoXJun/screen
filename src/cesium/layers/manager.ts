import * as Cesium from 'cesium';
import { getViewer } from '@/cesium/core/viewer';
import { createLayer } from './factory';
import type { LayerConfig, LayerType, MapLayer } from './types';

/** 图层池：按 name 跟踪管理，同名自动替换 */
const layerPool = new Map<string, MapLayer<unknown>>();

/**
 * 添加图层（同名自动替换旧图层并销毁）。
 * 实体 id 全局唯一（{图层名}::{条目 id}），同名替换必须先销毁旧图层释放 id，
 * 否则新图层创建时实体添加会冲突。故此处先删后建。
 * 数据项类型 T 从 config.data 推导；自定义 config 字段（如图标样式）可随类型化配置透传。
 */
export function addLayer<T = unknown>(
    type: LayerType,
    name: string,
    config?: LayerConfig<T> & Record<string, unknown>
): MapLayer<T> {
    layerPool.get(name)?.destroy();
    const layer = createLayer(type, name, config);
    layerPool.set(name, layer);
    return layer;
}

export function getLayer<T extends MapLayer = MapLayer>(name: string): T | undefined {
    return layerPool.get(name) as T | undefined;
}

export function hasLayer(name: string): boolean {
    return layerPool.has(name);
}

/** 移除图层（销毁实例并从池中删除） */
export function removeLayer(name: string): void {
    const layer = layerPool.get(name);
    if (!layer) return;
    layer.destroy();
    layerPool.delete(name);
}

/** 移除全部图层（组件卸载时调用，防泄漏） */
export function removeAllLayers(): void {
    layerPool.forEach((layer) => layer.destroy());
    layerPool.clear();
}

export function setLayerVisible(name: string, visible: boolean): void {
    layerPool.get(name)?.setVisible(visible);
}

/** 定位最小跨度（度）：单点/极小范围图层按中心扩展，避免相机贴地 */
const MIN_SPAN = Cesium.Math.toRadians(0.005);

/** 定位到图层内容范围（无内容/无范围语义的图层静默跳过） */
export function focusLayer(name: string, duration?: number): void {
    const bounds = layerPool.get(name)?.getBounds();
    if (!bounds) return;
    getViewer().camera.flyTo({ destination: padBounds(bounds), duration });
}

/** 过小范围以中心扩展至最小跨度（单点图层定位高度≈数百米） */
function padBounds(rect: Cesium.Rectangle): Cesium.Rectangle {
    if (rect.width >= MIN_SPAN && rect.height >= MIN_SPAN) return rect;
    const center = Cesium.Rectangle.center(rect);
    const halfLon = Math.max(rect.width / 2, MIN_SPAN / 2);
    const halfLat = Math.max(rect.height / 2, MIN_SPAN / 2);
    return new Cesium.Rectangle(
        center.longitude - halfLon,
        center.latitude - halfLat,
        center.longitude + halfLon,
        center.latitude + halfLat
    );
}

/** 全部图层列表（图层管理面板按需取用） */
export function getLayers(): MapLayer<unknown>[] {
    return [...layerPool.values()];
}

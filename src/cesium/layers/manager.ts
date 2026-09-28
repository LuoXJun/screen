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

/** 全部图层列表（图层树面板按需取用） */
export function getLayers(): MapLayer<unknown>[] {
    return [...layerPool.values()];
}

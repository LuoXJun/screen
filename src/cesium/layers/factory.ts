import type { LayerConfig, LayerType, MapLayer } from './types';
import { createIconLayer } from './builtin/iconLayer';
import { createImageryLayer } from './builtin/imageryLayer';
import { createHeatmapLayer } from './builtin/heatmapLayer';

/** 图层工厂：接收图层名与类型化配置，返回图层实例 */
export type LayerFactory<C extends LayerConfig = LayerConfig> = (name: string, config?: C) => MapLayer<unknown>;

const factories = new Map<LayerType, LayerFactory<never>>();

/**
 * 注册图层工厂：新增图层类别只需注册一次，管理器无需改动。
 * 内部收敛为统一工厂签名（类型边界处的 as 转换）。
 */
export function registerLayerFactory<C extends LayerConfig>(type: LayerType, factory: LayerFactory<C>): void {
    factories.set(type, factory as LayerFactory<never>);
}

/** 按类型创建图层实例（未注册的类型抛出错误） */
export function createLayer<T = unknown>(type: LayerType, name: string, config?: LayerConfig<T>): MapLayer<T> {
    const factory = factories.get(type);
    if (!factory) throw new Error(`未注册的图层类型: ${type}`);
    return factory(name, config as never) as MapLayer<T>;
}

// 内置图层注册：图标设备（条目级显隐）、影像底图（整层显隐）、温度热力图
registerLayerFactory('icon', createIconLayer);
registerLayerFactory('imagery', createImageryLayer);
registerLayerFactory('heatmap', createHeatmapLayer);

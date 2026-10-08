// 图层管理架子：工厂注册制扩展，图层树（layerControl）统一控制显隐
export {
    registerLayerFactory,
    createLayer,
    type LayerFactory
} from './factory';
export {
    addLayer,
    getLayer,
    hasLayer,
    removeLayer,
    removeAllLayers,
    setLayerVisible,
    getLayers
} from './manager';
export type { LayerType, MapLayer, ItemLayer, LayerConfig, LayerItemBrief } from './types';
export { isItemLayer } from './types';
// 内置工厂函数：可复用于注册自定义图层类型
export { createIconLayer, type IconLayerConfig, type IconItem } from './builtin/iconLayer';
export { createImageryLayer, type ImageryLayerConfig } from './builtin/imageryLayer';
export { createHeatmapLayer, type HeatmapLayerConfig } from './builtin/heatmapLayer';
export type { HeatmapPoint, HeatmapBounds, HeatmapPolygon, HeatmapStyle } from './builtin/heatmap/types';

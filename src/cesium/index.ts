// 基础服务层
export {
    initViewer,
    getViewer,
    hasViewer,
    destroyViewer,
    requestRender,
    setCleanScene
} from './core/viewer';
export {
    addImageryLayer,
    getImageryLayer,
    hasImageryLayer,
    removeImageryLayer,
    removeAllImageryLayers,
    setBaseImagery,
    loadGeoJson,
    loadCzml,
    loadKml,
    addDataSource,
    getDataSource,
    hasDataSource,
    removeDataSource,
    removeAllDataSources
} from './core/layer';
export {
    addEntity,
    getEntity,
    hasEntity,
    removeEntity,
    removeAllEntities,
    createLine,
    createPoint,
    createLabel,
    createBillboard,
    createPolygon,
    createCircle,
    type LineStyle
} from './core/entity';
export { createHandler, clearHandler, clearHandlers } from './core/event';
export { toCartesian3, toCartesian3List, toLonLat, distanceInMeters } from './core/utils';

// 图层管理架子
export {
    registerLayerFactory,
    createLayer,
    addLayer,
    getLayer,
    hasLayer,
    removeLayer,
    removeAllLayers,
    setLayerVisible,
    getLayers,
    isItemLayer,
    createIconLayer,
    createImageryLayer,
    createHeatmapLayer,
    type LayerFactory,
    type LayerType,
    type MapLayer,
    type ItemLayer,
    type LayerConfig,
    type LayerItemBrief,
    type IconItem,
    type IconLayerConfig,
    type ImageryLayerConfig,
    type HeatmapLayerConfig,
    type HeatmapPoint,
    type HeatmapBounds,
    type HeatmapPolygon,
    type HeatmapStyle
} from './layers';

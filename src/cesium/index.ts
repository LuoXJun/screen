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
    flyTo,
    flyToLonLat,
    setView,
    setViewLonLat,
    flyToRectangle,
    pickLonLat,
    getCameraLonLat,
    type FlyTarget,
    type LonLatViewOptions
} from './core/camera';
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
    createAmapImagery,
    createOSMImagery,
    createArcGisImagery,
    createTianDiTuImagery
} from './core/providers';
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
export { MapPopup } from './core/popup';
export {
    toCartesian3,
    toCartesian3List,
    toLonLat,
    distanceInMeters,
    forEachFeature,
    type LeafGeometry
} from './core/utils';

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

// 效果工具层
export {
    GroundMaterialEffect,
    type GroundMaterialEffectOptions
} from './effects/GroundMaterialEffect';
export { createCircleGeometry, createSquareGeometry } from './effects/groundGeometry';
export { LineEffect, type LineEffectOptions } from './effects/LineEffect';
export { PostProcessStageEffect, type PostProcessStageEffectOptions } from './effects/PostProcessStageEffect';
export { RenderGeoJsonByGround } from './effects/RenderGeoJsonByGround';

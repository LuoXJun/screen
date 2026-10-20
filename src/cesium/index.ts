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
    lookAtLonLat,
    pickLonLat,
    getCameraLonLat,
    type FlyTarget,
    type LonLatViewOptions,
    type LookAtLonLatOptions
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
    createArcGisLabelImagery,
    createWorldTerrain,
    sampleGroundHeights,
    createTianDiTuImagery
} from './core/providers';
export { applyBaseMap, setTianDiTuImagery, TERRAIN_READY } from './basemap';
export {
    BASE_MAP_PRESETS,
    BASE_TERRAIN,
    DEFAULT_BASE_MAP_PRESET,
    TIAN_DI_TU_TOKEN,
    type BaseMapPreset,
    type BaseMapPresetKey,
    type TerrainSource
} from './basemap/config';
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
export {
    getSiteContainer,
    getSiteEntities,
    addSiteEntity,
    removeSiteEntity,
    clearSiteEntities,
    activateSite
} from './core/siteContainer';
export {
    renderLabelPinImage,
    type LabelPinOptions,
    type LabelPinBillboardOptions
} from './core/labelPin/labelPinDraw';
export { addLabelPinSiteEntity, setLabelPinHighlight } from './core/labelPin/labelPin';
export {
    createHandler,
    clearHandler,
    clearHandlers,
    pickEntity,
    onLeftClick
} from './core/event';
export { MapPopup } from './core/popup';
export {
    toCartesian3,
    toCartesian3List,
    toLonLat,
    distanceInMeters,
    forEachFeature,
    removeHeightFromGeoJSON,
    extractBoundariesAsGeoJSON,
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
    focusLayer,
    getLayers,
    isItemLayer,
    createIconLayer,
    createImageryLayer,
    createHeatmapLayer,
    createGeoJsonLayer,
    createTilesetLayer,
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
    type HeatmapStyle,
    type GeoJsonItem,
    type GeoJsonLayerConfig,
    type TilesetLayer,
    type TilesetLayerConfig
} from './layers';

// 效果工具层
export {
    GroundMaterialEffect,
    type GroundMaterialEffectOptions
} from './effects/GroundMaterialEffect';
export { createCircleGeometry, createSquareGeometry } from './effects/groundGeometry';
export { createPolygonPrimitives, type GroundPolygonStyle } from './effects/polygonPrimitive';
export { LineEffect, type LineEffectOptions } from './effects/LineEffect';
export {
    PostProcessStageEffect,
    type PostProcessStageEffectOptions
} from './effects/PostProcessStageEffect';
export { RenderGeoJsonByGround, type GeoJsonRenderStyle } from './effects/RenderGeoJsonByGround';

// 交互绘制
export {
    DrawGeometry,
    isDrawingActive,
    stopAllDrawings,
    entity2Geojson,
    type DrawGeometryStyle,
    type GeometryType
} from './draw';

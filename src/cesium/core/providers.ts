import * as Cesium from 'cesium';
import { getViewer } from './viewer';

/* 高德瓦片子域占位符用 Cesium 标准的 {s}（子域表 ['1'..'4'] → webst01..4） */
/** 高德底图（国内速度快，无需 token），默认卫星影像 */
export function createAmapImagery(
    type: 'satellite' | 'vector' | 'road' = 'satellite'
): Cesium.UrlTemplateImageryProvider {
    const urls = {
        satellite: 'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
        vector: 'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
        road: 'https://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}'
    };
    return new Cesium.UrlTemplateImageryProvider({
        url: urls[type],
        subdomains: ['1', '2', '3', '4'],
        minimumLevel: 3,
        maximumLevel: 18
    });
}

/** OSM 矢量底图 */
export function createOSMImagery(): Cesium.UrlTemplateImageryProvider {
    return new Cesium.UrlTemplateImageryProvider({
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        maximumLevel: 19
    });
}

/** ArcGIS 卫星影像底图 */
export function createArcGisImagery(): Cesium.UrlTemplateImageryProvider {
    return new Cesium.UrlTemplateImageryProvider({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        maximumLevel: 18
    });
}

/** ArcGIS 公开参考叠加层（国界/地名/道路；与 World_Imagery 同为 WGS84，可准确叠加） */
export function createArcGisLabelImagery(): Cesium.UrlTemplateImageryProvider {
    return new Cesium.UrlTemplateImageryProvider({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}',
        maximumLevel: 16
    });
}

/** Cesium Ion 全球地形（含水面效果；依赖 VITE_CESIUM_ION_TOKEN 有效） */
export function createWorldTerrain(): Promise<Cesium.TerrainProvider> {
    return Cesium.createWorldTerrainAsync();
}

/**
 * 批量采样点位的地形高度（椭球高，与地形渲染一致；无地形时返回 0）。
 * 点位在数据层贴地形用：把采样高度回填进点位坐标，使实体位置即贴地坐标，
 * 弹窗/流光等所有按 position 取坐标的消费方自动对齐，无需渲染侧 clamp。
 */
export async function sampleGroundHeights(
    points: { lng: number; lat: number }[]
): Promise<number[]> {
    if (!points.length) return [];
    const provider = getViewer().terrainProvider;
    /* 椭球平地（未配置地形或地形未就绪）：无地面可采样，高度即 0 */
    if (provider instanceof Cesium.EllipsoidTerrainProvider) return points.map(() => 0);
    const positions = points.map((point) => Cesium.Cartographic.fromDegrees(point.lng, point.lat));
    try {
        await Cesium.sampleTerrainMostDetailed(provider, positions);
    } catch (error) {
        console.warn('[cesium] 地形高度采样失败，点位按椭球面(0 米)处理', error);
        return points.map(() => 0);
    }
    return positions.map((position) => position.height);
}

/**
 * 天地图（需在 https://console.tianditu.gov.cn 申请 tk）：
 * img/vec 为底图影像、cia/cva 为其配套注记层（透明，叠加于底图之上）
 */
export function createTianDiTuImagery(
    token: string,
    style: 'img' | 'vec' | 'cia' | 'cva' = 'img'
): Cesium.UrlTemplateImageryProvider {
    return new Cesium.UrlTemplateImageryProvider({
        url: `https://t{s}.tianditu.gov.cn/${style}_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=${style}&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=${token}`,
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        minimumLevel: 1,
        maximumLevel: 18
    });
}

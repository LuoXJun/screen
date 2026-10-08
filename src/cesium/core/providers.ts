import * as Cesium from 'cesium';

/** 高德底图（国内速度快，无需 token），默认卫星影像 */
export function createAmapImagery(
    type: 'satellite' | 'vector' | 'road' = 'satellite'
): Cesium.UrlTemplateImageryProvider {
    const urls = {
        satellite: 'https://webst0{is}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
        vector:
            'https://webrd0{is}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
        road: 'https://webst0{is}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}'
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

/** 天地图底图（需在 https://console.tianditu.gov.cn 申请 token），默认影像 */
export function createTianDiTuImagery(
    token: string,
    style: 'img' | 'vec' = 'img'
): Cesium.UrlTemplateImageryProvider {
    return new Cesium.UrlTemplateImageryProvider({
        url: `https://t{s}.tianditu.gov.cn/${style}_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=${style}&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=${token}`,
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        minimumLevel: 1,
        maximumLevel: 18
    });
}

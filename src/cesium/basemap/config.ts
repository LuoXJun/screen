import type * as Cesium from 'cesium';
import {
    createAmapImagery,
    createArcGisImagery,
    createArcGisLabelImagery,
    createIonImagery,
    createOSMImagery,
    createTianDiTuImagery
} from '../core/providers';

/** 天地图服务密钥 tk（https://console.tianditu.gov.cn 申请，经 VITE_TIANDITU_TOKEN 配置） */
export const TIAN_DI_TU_TOKEN = (import.meta.env.VITE_TIANDITU_TOKEN ?? '').trim();

/** 底图预设：影像与注记成套搭配（须同源坐标系，跨源混搭会因加偏产生错位） */
export interface BaseMapPreset {
    /** 底图影像（可为异步，如 Ion 的 fromAssetId） */
    imagery: () => Cesium.ImageryProvider | Promise<Cesium.ImageryProvider>;
    /** 叠加注记（可选） */
    label?: () => Cesium.ImageryProvider | Promise<Cesium.ImageryProvider>;
}

/** 可选底图预设（切换时同步换坐标系的成套影像+注记） */
export const BASE_MAP_PRESETS = {
    /** Cesium Ion 全球影像：项目原始默认底图（无注记，随 Ion token 可用） */
    ion: {
        imagery: createIonImagery
    },
    /** Esri 公开服务：WGS84 无偏移（与站点坐标一致）；注记为英文标注 */
    arcgis: {
        imagery: createArcGisImagery,
        label: createArcGisLabelImagery
    },
    /** 天地图：中文注记 + CGCS2000 无偏移（需配置 VITE_TIANDITU_TOKEN，未配置时回退 arcgis） */
    tianditu: {
        imagery: () => createTianDiTuImagery(TIAN_DI_TU_TOKEN, 'img'),
        label: () => createTianDiTuImagery(TIAN_DI_TU_TOKEN, 'cia')
    },
    /** 高德：国内速度快、中文注记；GCJ-02 加偏，与 WGS84 点位存在数百米级错位 */
    amap: {
        imagery: () => createAmapImagery('satellite'),
        label: () => createAmapImagery('road')
    },
    /** OSM 矢量底图（自带注记，无需叠加） */
    osm: {
        imagery: createOSMImagery
    }
} satisfies Record<string, BaseMapPreset>;

export type BaseMapPresetKey = keyof typeof BASE_MAP_PRESETS;

/**
 * 默认影像预设：启动底图与天地图关闭时的回退源——Ion 全球影像（无注记，随 Ion token 可用）。
 * 天地图影像不在启动时启用，由图层管理开关手动开启。
 */
export const DEFAULT_BASE_MAP_PRESET: BaseMapPresetKey = 'ion';

/** 地形来源：ion-world=Cesium Ion 全球地形（需 token）；none=椭球平地 */
export type TerrainSource = 'ion-world' | 'none';

/** 当前启用的地形来源 */
export const BASE_TERRAIN: TerrainSource = 'ion-world';

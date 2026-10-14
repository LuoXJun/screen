/**
 * 站点注册表：站点列表与站点维度业务配置的单一来源。
 * 站点样本待接口，视点坐标为近似值（团箐站为占位，待实地确认）。
 */

/** 站点标识（接口侧同样使用该英文值） */
export type SiteKey = 'xianfeng' | 'tuanqing';

/** 地球视角参数（与 flyToLonLat 参数对齐） */
export interface SiteView {
    lng: number;
    lat: number;
    height: number;
    heading?: number;
    pitch?: number;
    roll?: number;
    /** 飞行时长（秒，可选；不填由 Cesium 按距离自动计算） */
    duration?: number;
}

/** 站点业务配置 */
export interface SiteConfig {
    key: SiteKey;
    label: string;
    /** 地球初始视角 */
    view: SiteView;
}

/** 站点列表（飞行时长统一 2 秒，可按站点按体验调整） */
export const SITE_LIST: SiteConfig[] = [
    {
        key: 'xianfeng',
        label: '先锋站',
        view: { lng: 105.9208, lat: 26.8604, height: 3200, duration: 2 }
    },
    {
        key: 'tuanqing',
        label: '团箐站',
        view: { lng: 105.8526, lat: 26.8152, height: 3200, duration: 2 }
    }
];

/** 默认站点（首屏初始站点） */
export const DEFAULT_SITE_KEY: SiteKey = 'xianfeng';

/** 按 key 索引的站点配置 */
export const SITE_CONFIG_MAP = Object.fromEntries(
    SITE_LIST.map((site) => [site.key, site])
) as Record<SiteKey, SiteConfig>;

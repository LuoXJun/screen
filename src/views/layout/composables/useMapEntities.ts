import * as Cesium from 'cesium';
import { onBeforeUnmount, onMounted } from 'vue';
import {
    addLabelPinSiteEntity,
    clearSiteEntities,
    getSiteEntities,
    sampleGroundHeights,
    TERRAIN_READY
} from '@/cesium';
import { DEVICE_POINTS_BY_SITE } from '@/config/devices';
import type { SiteKey } from '@/config/site';

/** 已加载站点（避免切换时重复构建;窗口尺寸变化时整体重建） */
const loadedSites = new Set<SiteKey>();

/**
 * 站点设备点位重建完成事件（参数 siteKey;含分辨率变化触发的强制重建）:
 * 重建后实体对象被整体替换,持有实体引用的页面（如选中高亮/流光）据此重新绑定。
 */
export const SITE_ENTITIES_RELOADED = new Cesium.Event<(siteKey: SiteKey) => void>();

/**
 * 加载站点设备点位到对应容器（已加载且容器内确有实体才跳过——viewer 销毁重建后
 * 容器会被换新,须重载;force 用于重建,如窗口尺寸变化后重烘焙标签牌）。
 * 设备点位为全局数据（config/devices 站点设备注册表）,与页面生命周期无关;
 * 各页面的交互状态（如高亮）由页面自行清理,实体本层保活。
 */
export async function loadSiteEntities(siteKey: SiteKey, force = false): Promise<void> {
    if (loadedSites.has(siteKey) && !force && getSiteEntities(siteKey).values.length > 0) return;
    clearSiteEntities(siteKey);
    const points = DEVICE_POINTS_BY_SITE[siteKey];
    /* 点位高度取地形采样（无地形时 0）：实体位置即贴地坐标，
       弹窗/流光等按 position 取坐标的消费方随之自动对齐 */
    const heights = await sampleGroundHeights(points);
    await Promise.all(
        points.map((point, index) =>
            addLabelPinSiteEntity(
                siteKey,
                point.id,
                point.lng,
                point.lat,
                heights[index],
                { text: point.text },
                { type: point.type, ...point.data }
            )
        )
    );
    loadedSites.add(siteKey);
    SITE_ENTITIES_RELOADED.raiseEvent(siteKey);
}

/**
 * 窗口尺寸变化:标签牌画布按生成时的基准烘焙（尺寸/字号为裸像素）,
 * 须按新基准重建全部已加载站点的实体
 */
let resizeTimer: number | undefined;

function onResize(): void {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
        loadedSites.forEach((siteKey) => {
            loadSiteEntities(siteKey, true).catch((err: unknown) => {
                console.error(`[site] ${siteKey} 设备点位重建失败`, err);
            });
        });
    }, 200);
}

/** 站点设备点位加载（全局,挂载于 layout;点位数据见 config/devices） */
export function useMapEntities(): void {
    /* 地形就绪晚于首次点位加载（网络异步）:就绪后重建已加载站点，让点位贴上地形 */
    let removeTerrainListener: (() => void) | undefined;

    onMounted(() => {
        window.addEventListener('resize', onResize);
        removeTerrainListener = TERRAIN_READY.addEventListener(() => {
            loadedSites.forEach((siteKey) => {
                loadSiteEntities(siteKey, true).catch((err: unknown) => {
                    console.error(`[site] ${siteKey} 地形就绪后点位重建失败`, err);
                });
            });
        });
    });

    onBeforeUnmount(() => {
        window.clearTimeout(resizeTimer);
        window.removeEventListener('resize', onResize);
        removeTerrainListener?.();
    });
}

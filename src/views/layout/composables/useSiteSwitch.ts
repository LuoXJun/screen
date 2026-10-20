import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { activateSite, flyToLonLat, stopAllDrawings } from '@/cesium';
import { SITE_CONFIG_MAP, type SiteKey } from '@/config/site';
import { useSiteStore } from '@/stores/site';
import { loadSiteEntities } from './useMapEntities';

/** 应用站点：容器显隐 + 相机定位即时生效，点位数据并行加载 */
function applySite(siteKey: SiteKey, skipFly = false): void {
    stopAllDrawings();
    activateSite(siteKey);
    /* 页面自管视角（如箱变测温）跳过站点默认飞行，由页面直接定位目标 */
    if (!skipFly) {
        const { view } = SITE_CONFIG_MAP[siteKey];
        flyToLonLat(view.lng, view.lat, view.height, {
            heading: view.heading,
            pitch: view.pitch,
            roll: view.roll,
            duration: view.duration
        });
    }
    loadSiteEntities(siteKey).catch((err: unknown) => {
        console.error(`[site] ${siteKey} 站点数据加载失败`, err);
    });
}

/** 站点切换编排：响应 activeSite 变化联动地图（挂载于 layout，生命周期即全局） */
export function useSiteSwitch(): void {
    const siteStore = useSiteStore();
    const route = useRoute();

    /** 当前路由是否声明页面自管视角（避免目标页出现默认站点 + 页面目标两段镜头） */
    const shouldSkipSiteFly = (): boolean => route.meta.ownView === true;

    onMounted(() => {
        applySite(siteStore.activeSite, shouldSkipSiteFly());
    });

    watch(
        () => siteStore.activeSite,
        (siteKey) => {
            applySite(siteKey, shouldSkipSiteFly());
        }
    );
}

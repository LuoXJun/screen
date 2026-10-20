import type * as Cesium from 'cesium';
import { onBeforeUnmount, onMounted } from 'vue';
import { getSiteEntities, lookAtLonLat, sampleGroundHeights, setLabelPinHighlight } from '@/cesium';
import { boxTransformerMarkerName, type BoxTransformerDevice } from '@/config/devices';
import type { SiteKey } from '@/config/site';
import { SITE_ENTITIES_RELOADED } from '@/views/layout/composables/useMapEntities';
import { BOX_FOCUS_VIEW } from '../config';

/**
 * 箱变选中联动：标牌高亮 +（列表选中时）相机聚焦。
 * 标牌由全局加载保活,本层只切换高亮;实体重建后按选中 id 重新绑定。
 */
export function useBoxTransformerFocus(
    siteKey: SiteKey,
    devices: BoxTransformerDevice[],
    /** 即将执行列表聚焦时通知页面接管视角（取消迟到的进入视角） */
    onTakeOver: () => void
) {
    let focusedEntity: Cesium.Entity | undefined;
    let currentId = devices[0]?.id;

    function entityOf(device: BoxTransformerDevice): Cesium.Entity | undefined {
        const index = devices.indexOf(device);
        if (index < 0) return undefined;
        return getSiteEntities(siteKey).getById(boxTransformerMarkerName(index));
    }

    function highlight(device: BoxTransformerDevice): void {
        const next = entityOf(device);
        if (device.id === currentId && focusedEntity === next) return;
        setLabelPinHighlight(focusedEntity, false);
        focusedEntity = next;
        setLabelPinHighlight(focusedEntity, true);
        currentId = device.id;
    }

    /** 地图点击/初始化：只同步高亮,不移动相机 */
    function sync(device: BoxTransformerDevice): void {
        highlight(device);
    }

    /** 列表点击：高亮 + 相机聚焦（目标高度取地形,避开 0 米回退钻入地形） */
    async function focus(device: BoxTransformerDevice): Promise<void> {
        highlight(device);
        const targetId = device.id;
        const heights = await sampleGroundHeights([device]);
        /* 采样期间又切了别的箱变：丢弃过期结果 */
        if (currentId !== targetId) return;
        const height = heights[0] ?? 0;
        if (height <= 0) return;
        onTakeOver();
        lookAtLonLat(device.lng, device.lat, { ...BOX_FOCUS_VIEW, height });
    }

    /* 点位整体重建（地形就绪/分辨率变化）后重绑高亮 */
    const offReloaded = SITE_ENTITIES_RELOADED.addEventListener((reloadedSite) => {
        if (reloadedSite !== siteKey || !currentId) return;
        const device = devices.find((item) => item.id === currentId);
        if (!device) return;
        focusedEntity = entityOf(device);
        setLabelPinHighlight(focusedEntity, true);
    });

    onMounted(() => {
        const initial = devices[0];
        if (initial) highlight(initial);
    });

    onBeforeUnmount(() => {
        offReloaded();
        setLabelPinHighlight(focusedEntity, false);
        focusedEntity = undefined;
    });

    return { focus, sync };
}

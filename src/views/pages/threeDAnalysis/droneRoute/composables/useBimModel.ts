import { onBeforeUnmount, onMounted } from 'vue';
import { addLayer, focusLayer, removeLayer } from '@/cesium';
import type { TilesetLayer } from '@/cesium';
import { useSiteStore } from '@/stores/site';
import { BIM_TILESET_CONFIG } from '../config';

/**
 * BIM 模型加载与聚焦：进入页面加载 3D Tiles 模型并落位到当前站点，
 * 就绪后相机缩放到模型范围；离开页面移除模型。
 * 模型为工程坐标系（位置不代表真实地理），经 translateTo 平移到站点。
 */
export function useBimModel(): void {
    const siteStore = useSiteStore();

    onMounted(async () => {
        const { layerName, url, focusDuration } = BIM_TILESET_CONFIG;
        const { lng, lat } = siteStore.activeSiteConfig.view;
        // tileset 工厂产出 TilesetLayer，强转以取用 ready 就绪信号
        const layer = addLayer('tileset', layerName, {
            url,
            translateTo: { lng, lat }
        }) as TilesetLayer;
        await layer.ready;
        focusLayer(layerName, focusDuration);
    });

    onBeforeUnmount(() => {
        removeLayer(BIM_TILESET_CONFIG.layerName);
    });
}

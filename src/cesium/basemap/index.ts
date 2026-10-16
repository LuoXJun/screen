import * as Cesium from 'cesium';
import { addImageryLayer, setBaseImagery } from '../core/layer';
import { createWorldTerrain } from '../core/providers';
import { getViewer, hasViewer, requestRender } from '../core/viewer';
import {
    BASE_MAP_PRESET,
    BASE_MAP_PRESETS,
    BASE_TERRAIN,
    TIAN_DI_TU_TOKEN,
    type BaseMapPreset
} from './config';

/** 注记层的注册名（便于按名查询/替换） */
const LABEL_LAYER_NAME = 'base-label';

/**
 * 地形就绪事件：地形异步挂载完成后触发（椭球平地/加载失败不触发）。
 * 点位等依赖地形高度的数据在地形就绪后据此重建（首次加载先于地形就绪时按 0 米构建）。
 */
export const TERRAIN_READY = new Cesium.Event<() => void>();

/** 解析当前预设：天地图未配置 token 时回退 arcgis（避免发起无效瓦片请求） */
function resolvePreset(): BaseMapPreset {
    if (BASE_MAP_PRESET === 'tianditu' && !TIAN_DI_TU_TOKEN) {
        console.warn(
            '[cesium] 未配置 VITE_TIANDITU_TOKEN（申请：https://console.tianditu.gov.cn），底图回退为 ArcGIS 预设'
        );
        return BASE_MAP_PRESETS.arcgis;
    }
    return BASE_MAP_PRESETS[BASE_MAP_PRESET];
}

/**
 * 应用底图配置（影像 + 注记 + 地形），需在 initViewer 之后调用。
 * 幂等：重复调用按名替换旧层；跨端重建 Viewer 后需重新调用。
 */
export async function applyBaseMap(): Promise<void> {
    if (!hasViewer()) return;
    const preset = resolvePreset();
    setBaseImagery(preset.imagery());
    if (preset.label) addImageryLayer(preset.label(), LABEL_LAYER_NAME);
    requestRender();
    if (BASE_TERRAIN === 'none') return;
    await applyWorldTerrain();
}

async function applyWorldTerrain(): Promise<void> {
    try {
        const terrain = await createWorldTerrain();
        /* 异步等待期间 Viewer 可能已被销毁（快速跨端切换） */
        if (!hasViewer()) return;
        getViewer().terrainProvider = terrain;
        requestRender();
        TERRAIN_READY.raiseEvent();
    } catch (error) {
        console.warn(
            '[cesium] 地形加载失败，已降级为椭球平地（请检查 VITE_CESIUM_ION_TOKEN）',
            error
        );
    }
}

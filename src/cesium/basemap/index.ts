import * as Cesium from 'cesium';
import { addImageryLayer, removeImageryLayer, setBaseImagery } from '../core/layer';
import { createWorldTerrain } from '../core/providers';
import { getViewer, hasViewer, requestRender } from '../core/viewer';
import {
    BASE_MAP_PRESETS,
    BASE_TERRAIN,
    DEFAULT_BASE_MAP_PRESET,
    TIAN_DI_TU_TOKEN,
    type BaseMapPreset,
    type BaseMapPresetKey
} from './config';

/** 注记层的注册名（便于按名查询/替换） */
const LABEL_LAYER_NAME = 'base-label';

/**
 * 地形就绪事件：地形异步挂载完成后触发（椭球平地/加载失败不触发）。
 * 点位等依赖地形高度的数据在地形就绪后据此重建（首次加载先于地形就绪时按 0 米构建）。
 */
export const TERRAIN_READY = new Cesium.Event<() => void>();

/** 解析预设：天地图未配置 token 时回退默认影像（避免发起无效瓦片请求） */
function resolvePreset(key: BaseMapPresetKey): BaseMapPreset {
    if (key === 'tianditu' && !TIAN_DI_TU_TOKEN) {
        console.warn(
            '[cesium] 未配置 VITE_TIANDITU_TOKEN（申请：https://console.tianditu.gov.cn），底图回退为默认影像'
        );
        return BASE_MAP_PRESETS[DEFAULT_BASE_MAP_PRESET];
    }
    return BASE_MAP_PRESETS[key];
}

/** 切换序号：异步 provider 就绪期间用户再次切换时，只让最后一次生效 */
let applyToken = 0;

/** 应用预设的影像与注记（不触及地形，运行时切底图复用） */
async function applyPreset(preset: BaseMapPreset): Promise<void> {
    const token = ++applyToken;
    const [imagery, label] = await Promise.all([preset.imagery(), preset.label?.()]);
    /* 等待期间 Viewer 已销毁或已有更新的切换请求 */
    if (token !== applyToken || !hasViewer()) return;
    setBaseImagery(imagery);
    removeImageryLayer(LABEL_LAYER_NAME);
    if (label) addImageryLayer(label, LABEL_LAYER_NAME);
    requestRender();
}

/**
 * 启用/关闭天地图影像（图层管理开关）：
 * 关闭时切回默认影像（Ion 全球影像），地形不受影响。
 */
export async function setTianDiTuImagery(enabled: boolean): Promise<void> {
    if (!hasViewer()) return;
    await applyPreset(resolvePreset(enabled ? 'tianditu' : DEFAULT_BASE_MAP_PRESET));
}

/**
 * 应用底图配置（影像 + 注记 + 地形），需在 initViewer 之后调用。
 * 幂等：重复调用按名替换旧层；跨端重建 Viewer 后需重新调用。
 */
export async function applyBaseMap(): Promise<void> {
    if (!hasViewer()) return;
    await applyPreset(resolvePreset(DEFAULT_BASE_MAP_PRESET));
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

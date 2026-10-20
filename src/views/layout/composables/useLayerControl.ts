import { computed, onBeforeUnmount, ref, watch } from 'vue';
import {
    getSiteEntities,
    requestRenderWithNextFrame,
    setLayerVisible,
    setTianDiTuImagery,
    TIAN_DI_TU_TOKEN
} from '@/cesium';
import type { LayerControlItem } from '@/components/screen/layerControl/layerControl';
import { boxTransformerMarkerName, listBoxTransformers } from '@/config/devices';
import { SITE_LIST, type SiteKey } from '@/config/site';
import { SITE_ENTITIES_RELOADED } from './useMapEntities';

/** 天地图影像开关标识：非业务图层，联动底图源切换（关闭时回退默认影像） */
const TIAN_DI_TU_LAYER = 'tianditu-imagery';

/** 图层管理项（暂为设计稿数据；图层注册后经 value 联动显隐） */
const LAYER_ITEMS: LayerControlItem[] = [
    { label: '天地图影像', value: TIAN_DI_TU_LAYER },
    { label: '红线范围', value: 'redline' },
    { label: '升压站', value: 'station' },
    { label: '分区情况', value: 'zone' },
    { label: '箱变布置', value: 'boxTransformer' },
    { label: '逆变器布置', value: 'inverter' },
    { label: '组串布置', value: 'string' },
    { label: '集电线路(Shp)', value: 'collectLine' },
    { label: '杆塔', value: 'tower' }
];

/** 箱变标牌显隐：全局实体不走图层池，按站点容器内的实体名定位 */
function setBoxTransformerVisible(siteKey: SiteKey, visible: boolean): void {
    const entities = getSiteEntities(siteKey);
    listBoxTransformers(siteKey).forEach((_, index) => {
        const entity = entities.getById(boxTransformerMarkerName(index));
        if (entity) entity.show = visible;
    });
}

/** 「箱变布置」联动：所有站点实体统一显隐（未加载站点容器按需懒建） */
function applyBoxTransformerVisibility(visible: boolean): void {
    SITE_LIST.forEach((site) => setBoxTransformerVisible(site.key, visible));
    /* 实体显隐的可视化更新落在下一帧,仅一帧会出现「勾了但没显示」 */
    requestRenderWithNextFrame();
}

/**
 * 图层控制：管理项与勾选态，勾选变化即联动图层显隐
 * （图层未注册时静默跳过，注册后自动生效）
 */
export function useLayerControl() {
    /* 未配置天地图 tk 时不显示该项（避免「勾了却没有效果」） */
    const hasTianDiTu = TIAN_DI_TU_TOKEN !== '';
    const items = computed(() =>
        hasTianDiTu ? LAYER_ITEMS : LAYER_ITEMS.filter((item) => item.value !== TIAN_DI_TU_LAYER)
    );

    /** 已显示的图层标识（设计稿初值：组串布置；箱变标牌默认可见，由「箱变布置」控制） */
    const checkedLayers = ref<string[]>(['string', 'boxTransformer']);

    watch(checkedLayers, (values) => {
        LAYER_ITEMS.forEach((item) => {
            if (item.value !== TIAN_DI_TU_LAYER) {
                setLayerVisible(item.value, values.includes(item.value));
            }
        });
        applyBoxTransformerVisibility(values.includes('boxTransformer'));
    });

    /** 天地图影像开关：仅在该项勾选态变化时切换底图源 */
    watch(
        () => checkedLayers.value.includes(TIAN_DI_TU_LAYER),
        (enabled) => setTianDiTuImagery(enabled)
    );

    /* 站点实体重建（地形就绪/分辨率变化）后按当前勾选态恢复箱变标牌显隐 */
    const offReloaded = SITE_ENTITIES_RELOADED.addEventListener((siteKey) => {
        setBoxTransformerVisible(siteKey, checkedLayers.value.includes('boxTransformer'));
        requestRenderWithNextFrame();
    });

    onBeforeUnmount(() => {
        offReloaded();
    });

    return { LAYER_ITEMS: items, checkedLayers };
}

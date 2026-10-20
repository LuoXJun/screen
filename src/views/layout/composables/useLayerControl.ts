import { computed, ref, watch } from 'vue';
import { setLayerVisible, setTianDiTuImagery, TIAN_DI_TU_TOKEN } from '@/cesium';
import type { LayerControlItem } from '@/components/screen/layerControl/layerControl';

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

    /** 已显示的图层标识（设计稿初值：组串布置选中；天地图影像默认关闭，按需勾选） */
    const checkedLayers = ref<string[]>(['string']);

    watch(checkedLayers, (values) => {
        LAYER_ITEMS.forEach((item) => {
            if (item.value !== TIAN_DI_TU_LAYER) {
                setLayerVisible(item.value, values.includes(item.value));
            }
        });
    });

    /** 天地图影像开关：仅在该项勾选态变化时切换底图源 */
    watch(
        () => checkedLayers.value.includes(TIAN_DI_TU_LAYER),
        (enabled) => setTianDiTuImagery(enabled)
    );

    return { LAYER_ITEMS: items, checkedLayers };
}

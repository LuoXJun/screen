import { ref, watch } from 'vue';
import { setLayerVisible } from '@/cesium';
import type { LayerControlItem } from '@/components/screen/layerControl/layerControl';

/** 图层管理项（暂为设计稿数据；图层注册后经 value 联动显隐） */
const LAYER_ITEMS: LayerControlItem[] = [
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
    /** 已显示的图层标识（初值还原设计稿：组串布置选中） */
    const checkedLayers = ref(['string']);

    watch(checkedLayers, (values) => {
        LAYER_ITEMS.forEach((item) => setLayerVisible(item.value, values.includes(item.value)));
    });

    return { LAYER_ITEMS, checkedLayers };
}

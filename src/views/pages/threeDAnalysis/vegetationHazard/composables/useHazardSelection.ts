import { computed, ref } from 'vue';
import type { ChecklistItem } from '../components/bottom/bottomPanels.config';

/** 页面级选中联动：植被隐患清单 → 火灾隐患列表 / 无人机拍摄影像 */
const selectedItem = ref<ChecklistItem | null>(null);

/** 选中清单项关联的火灾隐患记录 id */
const selectedHazardId = computed(() => selectedItem.value?.hazardId ?? null);

export function useHazardSelection() {
    return { selectedItem, selectedHazardId };
}

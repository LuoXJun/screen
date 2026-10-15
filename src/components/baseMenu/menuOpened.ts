import { ref } from 'vue';

/**
 * 菜单展开中的分类（模块级跨实例保持：端切换使 baseMenu 重建时展开态不丢）。
 * 受控驱动 el-menu 的 openeds——重建后按此直接渲染,不依赖组件内部初始化行为。
 */
export const openedCategories = ref<string[]>([]);

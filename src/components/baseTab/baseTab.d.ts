/** 页签项 */
export interface BaseTabItem {
    /** 页签文案 */
    label: string;
    /** 页签值（v-model 绑定） */
    value: string | number;
}

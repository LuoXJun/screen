/** 统计指标项 */
export interface BaseStatListItem {
    /** 指标名 */
    label: string;
    /** 图标文件名（assets/images 下，组件内经 getImageWidthName 解析） */
    icon: string;
    /** 数值 */
    value: number;
    /** 数值单位 */
    unit: string;
    /** 数值色（缺省继承） */
    valueColor?: string;
    /** 备注文案 */
    note?: string;
    /** 备注类型：trend=环比（青绿+上升箭头）/ todo=待消缺（橙） */
    noteType?: 'trend' | 'todo';
}

/** 通用页签项：value 为选中标识，label 为展示文案 */
export interface BaseTabItem<T extends string = string> {
    label: string;
    value: T;
}

/** 设备信息图标类型（复用设计稿图标集） */
export type DeviceInfoIcon = 'id' | 'model' | 'location' | 'date' | 'status' | 'alarm';

/** 设备信息项 */
export interface DeviceInfoItem {
    /** 图标 */
    icon: DeviceInfoIcon;
    /** 标签（渲染为「标签:」） */
    label: string;
    /** 值 */
    value: string;
    /** 值配色修饰类（is-online=绿 / is-offline=红，见组件样式） */
    valueClass?: string;
}

/** 图层类型标识：内置类型 + 任意自定义类型（工厂注册制扩展） */
export type LayerType = 'icon' | 'imagery' | (string & {});

/** 图层内设备条目的简要信息（设备层展开用） */
export interface LayerItemBrief {
    /** 条目 id（与 setItemVisible 对应） */
    id: string;
    label: string;
}

/**
 * 图层契约：显隐 + 数据 + 生命周期。
 * 实体层（设备/矢量）与底图层（影像/地形）均可实现；
 * 需要条目级（设备级）显隐控制的图层另实现 ItemLayer。
 */
export interface MapLayer<T = unknown> {
    readonly name: string;
    readonly type: LayerType;
    /** 整层显隐 */
    setVisible(visible: boolean): void;
    isVisible(): boolean;
    /** 全量替换图层数据（内部重建元素）；无数据语义的图层（如影像）可忽略 */
    setData(items: T[]): void;
    /** 清空图层内全部元素 */
    clear(): void;
    /** 销毁图层（清空元素并从管理器移除） */
    destroy(): void;
}

/** 支持条目级（设备级）显隐控制的图层：图层级 × 条目级叠加生效 */
export interface ItemLayer<T = unknown> extends MapLayer<T> {
    setItemVisible(itemId: string, visible: boolean): void;
    isItemVisible(itemId: string): boolean;
    /** 条目列表（树面板挂设备节点用） */
    getItemBriefs(): LayerItemBrief[];
}

/** 是否支持条目级显隐控制（树面板据此决定设备节点如何切换） */
export function isItemLayer(layer: MapLayer): layer is ItemLayer {
    return typeof (layer as ItemLayer).setItemVisible === 'function';
}

/** 图层创建配置 */
export interface LayerConfig<T = unknown> {
    /** 初始显隐（默认 true） */
    visible?: boolean;
    /** 创建时透传的初始数据 */
    data?: T[];
}

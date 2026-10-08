import * as Cesium from 'cesium';
import { createBillboard, createLabel, createPoint } from '@/cesium/core/entity';
import type { ItemLayer, LayerConfig } from '../types';
import { EntityLayerBase } from './entityLayerBase';

/** 图标设备数据项：一个设备 = 一个实体（图标 + 可选名称标签） */
export interface IconItem {
    id?: string;
    lng: number;
    lat: number;
    height?: number;
    /** 图标图片（URL / dataURL / Canvas）；缺省时渲染为默认圆点 */
    image?: string | HTMLCanvasElement;
    label?: string;
}

export interface IconLayerConfig extends LayerConfig<IconItem> {
    /** 图标样式（作用于全部设备） */
    billboard?: Cesium.BillboardGraphics.ConstructorOptions;
    /** 文本标签样式 */
    labelStyle?: Cesium.LabelGraphics.ConstructorOptions;
    /** 无 image 时的默认圆点样式 */
    pointStyle?: Cesium.PointGraphics.ConstructorOptions;
}

/** 图标设备图层工厂：一个设备 = 一个实体（图标 + 可选标签），无图片时渲染默认圆点 */
export function createIconLayer(name: string, config: IconLayerConfig = {}): ItemLayer<IconItem> {
    return new IconLayer(name, config);
}

class IconLayer extends EntityLayerBase<IconItem, IconLayerConfig> {
    constructor(name: string, config: IconLayerConfig) {
        super(name, 'icon', config);
    }

    protected createEntity(item: IconItem): Cesium.Entity.ConstructorOptions {
        const height = item.height ?? 0;
        const options = item.image
            ? createBillboard(item.lng, item.lat, height, item.image, this.config.billboard)
            : createPoint(item.lng, item.lat, height, this.config.pointStyle);
        if (item.label) {
            options.label = createLabel(item.lng, item.lat, height, item.label, this.config.labelStyle).label;
        }
        return options;
    }
}

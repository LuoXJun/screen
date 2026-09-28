import * as Cesium from 'cesium';
import { addImageryLayer, getImageryLayer, removeImageryLayer } from '@/cesium/core/layer';
import type { LayerConfig, MapLayer } from '../types';

export interface ImageryLayerConfig extends LayerConfig {
    /** 影像源（必填） */
    provider: Cesium.ImageryProvider;
    /** 透传给 Cesium.ImageryLayer 的构造选项 */
    options?: Cesium.ImageryLayer.ConstructorOptions;
}

/**
 * 影像底图图层：把 core/layer 的影像池包装成 MapLayer 契约，
 * 使影像/地形等底图层可挂入图层树统一控制显隐。
 * config 可选仅为兼容工厂签名，provider 缺省时直接报错。
 */
export function createImageryLayer(name: string, config?: ImageryLayerConfig): MapLayer {
    if (!config?.provider) throw new Error(`imagery 图层「${name}」缺少 provider`);
    return new ImageryLayer(name, config);
}

class ImageryLayer implements MapLayer {
    readonly name: string;
    readonly type = 'imagery' as const;

    constructor(name: string, config: ImageryLayerConfig) {
        this.name = name;
        addImageryLayer(config.provider, name, config.options);
        if (config.visible === false) this.setVisible(false);
    }

    setVisible(visible: boolean): void {
        const layer = getImageryLayer(this.name);
        if (layer) layer.show = visible;
    }

    isVisible(): boolean {
        return getImageryLayer(this.name)?.show ?? true;
    }

    setData(): void {
        // 影像层无数据语义，忽略
    }

    clear(): void {
        // 影像层无元素可清空
    }

    destroy(): void {
        removeImageryLayer(this.name);
    }
}

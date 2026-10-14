import * as Cesium from 'cesium';
import { getViewer, requestRender } from '@/cesium/core/viewer';
import type { LayerConfig, MapLayer } from '../types';

export interface TilesetLayerConfig extends LayerConfig {
    /** tileset.json 地址（必填） */
    url: string;
    /** 透传 Cesium3DTileset.fromUrl 的选项（maximumScreenSpaceError 等） */
    options?: Cesium.Cesium3DTileset.ConstructorOptions;
    /** 工程坐标模型落位：把模型原点平移至目标经纬度（竖直高度关系保持不变），加载完成、挂载前应用 */
    translateTo?: { lng: number; lat: number };
}

/**
 * 倾斜摄影（3D Tiles）图层：模型经 fromUrl 异步加载后挂入场景，
 * 显隐即 tileset.show，定位取模型外接球换算的经纬范围。
 * 站点场景下每站点一个图层实例，由业务编排层按站点切换显隐。
 */
export function createTilesetLayer(name: string, config?: TilesetLayerConfig): TilesetLayer {
    if (!config?.url) throw new Error(`tileset 图层「${name}」缺少 url`);
    return new TilesetLayer(name, config);
}

/** 倾斜摄影图层（导出的类型带就绪信号，供页面编排等待加载完成后再定位等） */
export class TilesetLayer implements MapLayer {
    readonly name: string;
    readonly type = 'tileset' as const;
    /** 就绪信号：加载完成 yield 模型实例（可做灯光调优/交互），失败为 null */
    readonly ready: Promise<Cesium.Cesium3DTileset | null>;

    private tileset: Cesium.Cesium3DTileset | null = null;
    private visible: boolean;
    /** 操作版本：销毁使未竟的加载失效 */
    private version = 0;

    constructor(name: string, config: TilesetLayerConfig) {
        this.name = name;
        this.visible = config.visible ?? true;
        this.ready = this.load(config);
    }

    setVisible(visible: boolean): void {
        this.visible = visible;
        if (this.tileset) {
            this.tileset.show = visible;
            requestRender();
        }
    }

    isVisible(): boolean {
        return this.visible;
    }

    /** 图层范围：模型外接球（中心 + 半径）换算的经纬矩形（加载完成前返回 undefined） */
    getBounds(): Cesium.Rectangle | undefined {
        if (!this.tileset) return undefined;
        const sphere = this.tileset.boundingSphere;
        const center = Cesium.Cartographic.fromCartesian(sphere.center);
        const latDelta = sphere.radius / Cesium.Ellipsoid.WGS84.maximumRadius;
        const lonDelta =
            sphere.radius / (Cesium.Ellipsoid.WGS84.maximumRadius * Math.cos(center.latitude));
        return new Cesium.Rectangle(
            center.longitude - lonDelta,
            center.latitude - latDelta,
            center.longitude + lonDelta,
            center.latitude + latDelta
        );
    }

    setData(): void {
        // 倾斜模型无数据语义，忽略
    }

    clear(): void {
        // 倾斜模型无元素可清空
    }

    destroy(): void {
        this.version++;
        if (!this.tileset) return;
        getViewer().scene.primitives.remove(this.tileset);
        this.tileset = null;
        requestRender();
    }

    private async load(config: TilesetLayerConfig): Promise<Cesium.Cesium3DTileset | null> {
        const version = this.version;
        try {
            const tileset = await Cesium.Cesium3DTileset.fromUrl(config.url, config.options);
            if (version !== this.version) {
                tileset.destroy();
                return null;
            }
            if (config.translateTo) translateTileset(tileset, config.translateTo);
            tileset.show = this.visible;
            this.tileset = tileset;
            getViewer().scene.primitives.add(tileset);
            requestRender();
            return tileset;
        } catch (err) {
            console.error(`[cesium] tileset 图层「${this.name}」加载失败`, err);
            return null;
        }
    }
}

/** 工程坐标模型落位：把模型原点平移至目标经纬度（保持原点当前高度，等待加载完成后调用） */
function translateTileset(
    tileset: Cesium.Cesium3DTileset,
    target: { lng: number; lat: number }
): void {
    const origin = Cesium.Matrix4.getTranslation(tileset.root.transform, new Cesium.Cartesian3());
    const originHeight = Cesium.Cartographic.fromCartesian(origin).height;
    const destination = Cesium.Cartesian3.fromDegrees(target.lng, target.lat, originHeight);
    tileset.modelMatrix = Cesium.Matrix4.fromTranslation(
        Cesium.Cartesian3.subtract(destination, origin, new Cesium.Cartesian3())
    );
}

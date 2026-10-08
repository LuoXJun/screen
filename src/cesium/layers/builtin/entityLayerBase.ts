import * as Cesium from 'cesium';
import { getViewer } from '@/cesium/core/viewer';
import type { LayerConfig, LayerItemBrief, LayerType, ItemLayer } from '../types';

/** 实体 id 约定：{图层名}::{设备 id}，保证全局唯一 */
function buildEntityId(layerName: string, itemId: string): string {
    return `${layerName}::${itemId}`;
}

/**
 * Entity 型图层公共基类：统一管理实体集合与层级显隐（图层级 × 条目级叠加）。
 * 子类只需实现 createEntity（按数据项生成实体配置）。
 */
export abstract class EntityLayerBase<T, C extends LayerConfig<T> = LayerConfig<T>> implements ItemLayer<T> {
    readonly name: string;
    readonly type: LayerType;
    protected readonly config: C;
    protected readonly items = new Map<string, T>();
    protected readonly entities = new Map<string, Cesium.Entity>();
    /** 条目级显隐：与图层级显隐叠加生效 */
    protected readonly itemVisible = new Map<string, boolean>();
    protected visible: boolean;

    constructor(name: string, type: LayerType, config: C) {
        this.name = name;
        this.type = type;
        this.config = config;
        this.visible = config.visible ?? true;
        if (config.data) this.setData(config.data);
    }

    setVisible(visible: boolean): void {
        this.visible = visible;
        this.applyVisibility();
        this.requestRenderWithNextFrame();
    }

    isVisible(): boolean {
        return this.visible;
    }

    /** 设备级显隐：图层可见时生效，与图层级显隐叠加 */
    setItemVisible(itemId: string, visible: boolean): void {
        this.itemVisible.set(itemId, visible);
        const entity = this.entities.get(itemId);
        if (entity) entity.show = this.visible && visible;
        this.requestRenderWithNextFrame();
    }

    isItemVisible(itemId: string): boolean {
        return this.itemVisible.get(itemId) ?? true;
    }

    /** 设备列表：设备层展开用 */
    getItemBriefs(): LayerItemBrief[] {
        return [...this.items.entries()].map(([id, item]) => ({
            id,
            label: (item as { label?: string }).label ?? id
        }));
    }

    setData(items: T[]): void {
        this.clearItems();
        items.forEach((item) => {
            const itemId = this.resolveItemId(item);
            this.items.set(itemId, item);
            this.itemVisible.set(itemId, true);
            const options = this.createEntity(item);
            options.id = buildEntityId(this.name, itemId);
            // 注入实体元数据：name（设备名）+ type（图层类型），供点击弹窗等交互读取
            options.name = (item as { label?: string }).label ?? itemId;
            options.properties = { type: this.type };
            this.entities.set(itemId, getViewer().entities.add(options));
        });
        this.applyVisibility();
        this.requestRenderWithNextFrame();
    }

    clear(): void {
        this.clearItems();
        this.requestRenderWithNextFrame();
    }

    destroy(): void {
        this.clearItems();
    }

    /**
     * requestRenderMode 下请求渲染，并在当前帧渲染后请求下一帧：
     * billboard 纹理上传发生在 afterRender 阶段，需下一帧才能真正显示。
     */
    private requestRenderWithNextFrame(): void {
        const scene = getViewer().scene;
        scene.requestRender();
        const remove = scene.postRender.addEventListener(() => {
            remove();
            scene.requestRender();
        }, this);
    }

    /** 子类按数据项生成实体配置（id 由基类统一注入） */
    protected abstract createEntity(item: T): Cesium.Entity.ConstructorOptions;

    private applyVisibility(): void {
        this.entities.forEach((entity, itemId) => {
            entity.show = this.visible && (this.itemVisible.get(itemId) ?? true);
        });
    }

    private resolveItemId(item: T): string {
        return (item as { id?: string }).id ?? `__${this.items.size}`;
    }

    private clearItems(): void {
        const viewer = getViewer();
        this.entities.forEach((entity) => viewer.entities.remove(entity));
        this.entities.clear();
        this.items.clear();
        this.itemVisible.clear();
    }
}

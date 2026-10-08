import * as Cesium from 'cesium';
import { onMounted } from 'vue';
import { createHandler, getViewer, toLonLat } from '@/cesium';
import { showMapPopup, type ShowMapPopupOptions } from '@/components/baseMapPopup/mapPopup';

/** 弹窗上下文：命中实体、其世界坐标与经纬高 */
export interface EntityPopupContext {
    entity: Cesium.Entity;
    position: Cesium.Cartesian3;
    lonlat: { lng: number; lat: number; height: number };
}

/** 弹窗配置工厂：按实体类型返回除 position 外的弹窗配置（title/width/height/content） */
export type EntityPopupFactory = (ctx: EntityPopupContext) => Omit<ShowMapPopupOptions, 'position'>;

export interface UseEntityPopupOptions {
    /** 实体类型 → 弹窗配置（类型取 entity.properties.type） */
    contents?: Record<string, EntityPopupFactory>;
    /** 未命中类型时的默认弹窗（缺省时不响应） */
    fallback?: EntityPopupFactory;
}

/**
 * 点击实体弹窗：按实体类型路由到不同弹窗内容，未命中时用 fallback，均无则不响应。
 * 实体类型约定写在 entity.properties.type（如 createXxx 时传入 { type: 'device' }）。
 */
export function useEntityPopup(options: UseEntityPopupOptions = {}): void {
    onMounted(() => {
        const pickHandler = createHandler();
        pickHandler.setInputAction(
            (movement: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
                const viewer = getViewer();
                const picked = viewer.scene.pick(movement.position);
                if (!Cesium.defined(picked)) return;
                const entity = picked.id instanceof Cesium.Entity ? picked.id : undefined;
                if (!entity) return;
                const position = entity.position?.getValue(viewer.clock.currentTime);
                if (!position) return;

                const props = entity.properties?.getValue(viewer.clock.currentTime) as
                    | Record<string, unknown>
                    | undefined;
                const type = typeof props?.type === 'string' ? props.type : undefined;
                const factory = (type ? options.contents?.[type] : undefined) ?? options.fallback;
                if (!factory) return;

                showMapPopup({
                    position,
                    ...factory({ entity, position, lonlat: toLonLat(position) })
                });
            },
            Cesium.ScreenSpaceEventType.LEFT_CLICK
        );
    });
}

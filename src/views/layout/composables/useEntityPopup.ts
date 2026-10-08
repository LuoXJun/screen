import * as Cesium from 'cesium';
import { onMounted } from 'vue';
import { clearHandler, createHandler, getViewer, toLonLat } from '@/cesium';

/** 本模块当前活跃的点击监听（HMR 重建时用于幂等清理,避免叠加监听） */
let activeHandler: Cesium.ScreenSpaceEventHandler | null = null;

/** 实体点击上下文：命中实体、其世界坐标、经纬高与解包后的自定义属性 */
export interface EntityClickContext {
    entity: Cesium.Entity;
    position: Cesium.Cartesian3;
    lonlat: { lng: number; lat: number; height: number };
    /** entity.properties 解包结果（含 type 及各类型弹窗所需数据） */
    props?: Record<string, unknown>;
}

/** 实体点击处理器：自行决定展示方式（showMapPopup 锚点卡 / baseDialog 模态窗等） */
export type EntityClickHandler = (ctx: EntityClickContext) => void;

export interface UseEntityPopupOptions {
    /** 实体类型 → 点击处理器（类型取 entity.properties.type） */
    contents?: Record<string, EntityClickHandler>;
    /** 未命中类型时的默认处理器（缺省时不响应） */
    fallback?: EntityClickHandler;
}

/**
 * 点击实体分发：按 entity.properties.type 路由到对应处理器，未命中时用 fallback。
 * 弹窗形态由处理器决定：轻量信息用 showMapPopup 锚点卡,大内容（视频等）用 baseDialog。
 */
export function useEntityPopup(options: UseEntityPopupOptions = {}): void {
    onMounted(() => {
        /* HMR 重建时先清掉上一实例的监听（幂等,避免点击叠加触发） */
        if (activeHandler) {
            clearHandler(activeHandler);
        }
        const pickHandler = createHandler();
        activeHandler = pickHandler;
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
                const handler = (type ? options.contents?.[type] : undefined) ?? options.fallback;
                handler?.({ entity, position, lonlat: toLonLat(position), props });
            },
            Cesium.ScreenSpaceEventType.LEFT_CLICK
        );
    });
}

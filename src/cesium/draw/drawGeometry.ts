import * as Cesium from 'cesium';
import { clearHandler, createHandler } from '@/cesium/core/event';
import { getViewer, requestRender } from '@/cesium/core/viewer';
import {
    buildLine,
    buildPoint,
    buildPolygon,
    buildRectangle,
    polylineOptions,
    rectangleBorder,
    rectangleBounds
} from './geometryFactory';
import type { DrawGeometryStyle, GeometryType } from './types';

const DEFAULT_STYLE: Required<DrawGeometryStyle> = {
    fillColor: Cesium.Color.CYAN.withAlpha(0.2),
    strokeColor: Cesium.Color.fromCssColorString('#f5ad47'),
    strokeWidth: 2,
    pointSize: 10,
    pointColor: Cesium.Color.fromCssColorString('#00b7ff')
};

/** 请求渲染并在下一帧补一次：新实体的纹理（如文本图集）下一帧才就绪，单帧请求会画不出来 */
function requestRenderDeferred(): void {
    requestRender();
    requestAnimationFrame(requestRender);
}

/** 绘制激活中的实例集合（供其他地图交互区分绘制模式，如屏蔽实体点击弹窗） */
const activeDrawings = new Set<DrawGeometry>();

/** 是否有绘制工具处于激活状态 */
export function isDrawingActive(): boolean {
    return activeDrawings.size > 0;
}

/** 停止全部激活中的绘制（保留已完成图形；站点切换等全局场景调用） */
export function stopAllDrawings(): void {
    [...activeDrawings].forEach((drawing) => drawing.stop());
}

/**
 * 交互式几何绘制。
 * 交互约定：点（连续单击落点）；线/多边形（左键加点，右键结束）；矩形（两次左键对角定点）。
 * 绘制中由 CallbackProperty 动态预览，结束后落成正式实体，clear 统一移除。
 */
export class DrawGeometry {
    private readonly viewer: Cesium.Viewer;
    private readonly style: Required<DrawGeometryStyle>;
    private handler: Cesium.ScreenSpaceEventHandler | null = null;
    private type: GeometryType | null = null;
    /** 绘制中已落下的点 */
    private points: Cesium.Cartesian3[] = [];
    /** 鼠标当前位置（动态预览用） */
    private hoverPosition: Cesium.Cartesian3 | null = null;
    /** 动态预览实体（图形结束后移除） */
    private dynamicEntity: Cesium.Entity | null = null;
    /** 绘制完成的实体（clear 时统一移除） */
    private entities: Cesium.Entity[] = [];

    /** 最近一次完成绘制的矩形四至（弧度） */
    west = 0;
    south = 0;
    east = 0;
    north = 0;

    constructor(style: DrawGeometryStyle = {}) {
        this.viewer = getViewer();
        this.style = { ...DEFAULT_STYLE, ...style };
    }

    /** 激活指定类型的绘制；重复激活会先重置当前绘制 */
    draw(type: GeometryType): void {
        this.stop();
        this.type = type;

        const handler = this.ensureHandler();
        handler.setInputAction(this.handleLeftClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        if (type !== 'point') {
            handler.setInputAction(this.handleMouseMove, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        }
        if (type === 'line' || type === 'polygon') {
            handler.setInputAction(this.handleRightClick, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        }
        this.viewer.canvas.style.cursor = 'crosshair';
        activeDrawings.add(this);
    }

    /** 停止当前绘制（保留已完成图形） */
    stop(): void {
        if (this.handler) {
            this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        }
        this.removeDynamicEntity();
        this.points = [];
        this.hoverPosition = null;
        this.type = null;
        this.viewer.canvas.style.cursor = '';
        activeDrawings.delete(this);
    }

    /** 停止绘制并清空全部绘制结果 */
    clear(): void {
        this.stop();
        const entities = this.viewer.entities;
        this.entities.forEach((entity) => entities.remove(entity));
        this.entities.length = 0;
        requestRender();
    }

    /** 销毁：解除事件监听并清空绘制结果（组件卸载时调用） */
    destroy(): void {
        if (this.handler) {
            clearHandler(this.handler);
            this.handler = null;
        }
        this.clear();
    }

    private readonly handleLeftClick = (
        event: Cesium.ScreenSpaceEventHandler.PositionedEvent
    ): void => {
        const type = this.type;
        if (!type) return;
        const position = this.pickGlobe(event.position);
        if (!position) return;
        this.hoverPosition = position;

        if (type === 'point') {
            this.entities.push(this.viewer.entities.add(buildPoint(this.style, position)));
        } else {
            this.points.push(position);
            if (type === 'rectangle' && this.points.length === 2) {
                this.finish();
            } else if (!this.dynamicEntity) {
                this.dynamicEntity = this.viewer.entities.add(this.buildDynamicEntity());
            }
        }
        requestRenderDeferred();
    };

    private readonly handleMouseMove = (
        event: Cesium.ScreenSpaceEventHandler.MotionEvent
    ): void => {
        const position = this.pickGlobe(event.endPosition);
        if (!position) return;
        this.hoverPosition = position;
        /* requestRenderMode 下鼠标移动不触发渲染，动态预览需手动请求重绘 */
        requestRender();
    };

    private readonly handleRightClick = (): void => {
        this.finish();
    };

    /** 结束当前图形：移除动态预览，点数足够则落成正式实体 */
    private finish(): void {
        const type = this.type;
        const points = [...this.points];
        this.removeDynamicEntity();
        this.points = [];

        if (type === 'line' && points.length >= 2) {
            this.entities.push(this.viewer.entities.add(buildLine(this.style, points)));
        } else if (type === 'polygon' && points.length >= 3) {
            this.entities.push(this.viewer.entities.add(buildPolygon(this.style, points)));
        } else if (type === 'rectangle' && points.length === 2) {
            const bounds = rectangleBounds(points[0], points[1]);
            this.west = bounds.west;
            this.south = bounds.south;
            this.east = bounds.east;
            this.north = bounds.north;
            this.entities.push(
                this.viewer.entities.add(buildRectangle(this.style, bounds.rectangle))
            );
        }
        requestRenderDeferred();
    }

    /** 拾取屏幕位置对应的地表坐标：优先场景拾取（地形/模型），退化为椭球面求交 */
    private pickGlobe(windowPosition: Cesium.Cartesian2): Cesium.Cartesian3 | undefined {
        const scene = this.viewer.scene;
        const ray = this.viewer.camera.getPickRay(windowPosition);
        const position = ray ? scene.globe.pick(ray, scene) : undefined;
        return position ?? this.viewer.camera.pickEllipsoid(windowPosition, scene.globe.ellipsoid);
    }

    private ensureHandler(): Cesium.ScreenSpaceEventHandler {
        this.handler ??= createHandler();
        return this.handler;
    }

    private removeDynamicEntity(): void {
        if (!this.dynamicEntity) return;
        this.viewer.entities.remove(this.dynamicEntity);
        this.dynamicEntity = null;
    }

    private buildDynamicEntity(): Cesium.Entity.ConstructorOptions {
        const style = this.style;
        if (this.type === 'polygon') {
            return {
                name: 'polygon-dynamic',
                polygon: {
                    hierarchy: new Cesium.CallbackProperty(
                        () => new Cesium.PolygonHierarchy(this.livePositions()),
                        false
                    ),
                    material: style.fillColor,
                    classificationType: Cesium.ClassificationType.BOTH
                },
                polyline: polylineOptions(
                    style,
                    new Cesium.CallbackProperty(() => this.livePositions(true), false)
                )
            };
        }
        if (this.type === 'rectangle') {
            const rect = () =>
                rectangleBounds(this.points[0], this.hoverPosition ?? this.points[0]).rectangle;
            return {
                name: 'rectangle-dynamic',
                rectangle: {
                    coordinates: new Cesium.CallbackProperty(rect, false),
                    material: style.fillColor
                },
                polyline: polylineOptions(
                    style,
                    new Cesium.CallbackProperty(() => rectangleBorder(rect()), false)
                )
            };
        }
        return {
            name: 'line-dynamic',
            polyline: polylineOptions(
                style,
                new Cesium.CallbackProperty(() => this.livePositions(), false)
            )
        };
    }

    /** 动态预览点位：已落点 + 鼠标当前位置（close 时首尾闭合） */
    private livePositions(close = false): Cesium.Cartesian3[] {
        const positions = this.hoverPosition
            ? [...this.points, this.hoverPosition]
            : [...this.points];
        if (close && positions.length > 2) {
            positions.push(positions[0]);
        }
        return positions;
    }
}

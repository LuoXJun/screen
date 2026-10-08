import * as Cesium from 'cesium';
import { getViewer } from './viewer';
import { toCartesian3, toCartesian3List } from './utils/coordinate';

/** 实体池：按 name 跟踪管理，便于查找与统一清理 */
const entityPool = new Map<string, Cesium.Entity>();

/** 新增实体（同名自动替换旧实体，避免池引用与 viewer 实体不一致） */
export function addEntity(name: string, options: Cesium.Entity.ConstructorOptions = {}): Cesium.Entity {
    removeEntity(name);
    const entity = getViewer().entities.add({ name, ...options });
    entityPool.set(name, entity);
    return entity;
}

export function getEntity(name: string): Cesium.Entity | undefined {
    return entityPool.get(name);
}

export function hasEntity(name: string): boolean {
    return entityPool.has(name);
}

export function removeEntity(name: string): void {
    const entity = entityPool.get(name);
    if (!entity) return;
    getViewer().entities.remove(entity);
    entityPool.delete(name);
}

export function removeAllEntities(): void {
    entityPool.clear();
    getViewer().entities.removeAll();
}

// ---------- 实体工厂：生成 Entity 配置，不直接挂载 ----------

const DEFAULT_LINE_COLOR = Cesium.Color.fromCssColorString('#f5ad47');

/** 线实体样式 */
export interface LineStyle {
    /** 线条颜色（默认 #f5ad47） */
    color?: Cesium.Color;
    /** 线宽（像素，默认 2） */
    width?: number;
}

/** 生成线实体配置 */
export function createLine(
    coordinates: number[][],
    properties: Record<string, unknown>,
    style: LineStyle = {}
): Cesium.Entity.ConstructorOptions {
    const { color = DEFAULT_LINE_COLOR, width = 2 } = style;
    return {
        polyline: {
            positions: toCartesian3List(coordinates),
            width,
            material: color,
            clampToGround: true
        },
        properties
    };
}

/** 生成点实体配置 */
export function createPoint(
    lng: number,
    lat: number,
    height = 0,
    options: Cesium.PointGraphics.ConstructorOptions = {}
): Cesium.Entity.ConstructorOptions {
    return {
        position: toCartesian3(lng, lat, height),
        point: {
            pixelSize: 8,
            color: Cesium.Color.fromCssColorString('#00b7ff'),
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            ...options
        }
    };
}

/** 生成文本标签实体配置 */
export function createLabel(
    lng: number,
    lat: number,
    height: number,
    text: string,
    options: Cesium.LabelGraphics.ConstructorOptions = {}
): Cesium.Entity.ConstructorOptions {
    return {
        position: toCartesian3(lng, lat, height),
        label: {
            text,
            font: '14px sans-serif',
            fillColor: Cesium.Color.WHITE,
            style: Cesium.LabelStyle.FILL,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -12),
            ...options
        }
    };
}

/** 生成图片图标实体配置（image 支持 URL / dataURL / Canvas） */
export function createBillboard(
    lng: number,
    lat: number,
    height: number,
    image: string | HTMLCanvasElement,
    options: Cesium.BillboardGraphics.ConstructorOptions = {}
): Cesium.Entity.ConstructorOptions {
    return {
        position: toCartesian3(lng, lat, height),
        billboard: { image, ...options }
    };
}

/** 生成多边形实体配置（坐标环为闭合顺序即可） */
export function createPolygon(
    coordinates: number[][],
    options: Cesium.PolygonGraphics.ConstructorOptions = {}
): Cesium.Entity.ConstructorOptions {
    return {
        polygon: {
            hierarchy: toCartesian3List(coordinates),
            material: Cesium.Color.CYAN.withAlpha(0.3),
            outline: true,
            outlineColor: Cesium.Color.CYAN,
            ...options
        }
    };
}

/** 生成圆形实体配置（半径单位：米） */
export function createCircle(
    lng: number,
    lat: number,
    radius: number,
    height = 0,
    options: Cesium.EllipseGraphics.ConstructorOptions = {}
): Cesium.Entity.ConstructorOptions {
    return {
        position: toCartesian3(lng, lat, height),
        ellipse: {
            semiMajorAxis: radius,
            semiMinorAxis: radius,
            material: Cesium.Color.CYAN.withAlpha(0.3),
            ...options
        }
    };
}

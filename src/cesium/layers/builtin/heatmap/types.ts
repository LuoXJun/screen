/** 热力图数据点：经纬度 + 温度值 */
export interface HeatmapPoint {
    lon: number;
    lat: number;
    /** 温度/权重值，颜色条据此归一化映射 */
    value: number;
}

/** 热力图覆盖的经纬度范围 */
export interface HeatmapBounds {
    west: number;
    south: number;
    east: number;
    north: number;
}

/**
 * 热力区域几何：由顶点直接定义，热力图只生成在多边形内（外环 + 可选洞，如内湖/岛屿）。
 * 顶点按 [lon, lat] 顺序排列，第一环为外环，其余环为洞。
 */
export interface HeatmapPolygon {
    rings: Array<Array<[number, number]>>;
}

/** 由多边形顶点推断覆盖范围（各环取并集 bbox） */
export function boundsFromPolygon(polygon: HeatmapPolygon): HeatmapBounds {
    let west = Infinity;
    let south = Infinity;
    let east = -Infinity;
    let north = -Infinity;
    for (const ring of polygon.rings) {
        for (const [lon, lat] of ring) {
            west = Math.min(west, lon);
            east = Math.max(east, lon);
            south = Math.min(south, lat);
            north = Math.max(north, lat);
        }
    }
    return { west, south, east, north };
}

/** 热力图渲染配置：颜色条 + 视觉参数 */
export interface HeatmapStyle {
    /**
     * 温度色条：从低温到高温的颜色数组（如 ['#0000ff', '#00ffff', '#ffff00', '#ff0000']），
     * 相邻颜色线性插值；值越小（低温）取数组头部，越大取尾部
     */
    colors: string[];
    /** 每个点的影响半径（像素），默认 40 */
    radius?: number;
    /** 整层透明度 0-1，默认 0.8 */
    opacity?: number;
    /** 温度归一化下限，缺省取数据最小值 */
    minValue?: number;
    /** 温度归一化上限，缺省取数据最大值 */
    maxValue?: number;
    /** 渲染画布宽度（高度按经纬度跨度等比），默认 1024 */
    width?: number;
    /** 区域边缘柔化宽度（像素），默认 0（硬边裁剪）；>0 时边缘内外渐变淡出 */
    feather?: number;
}

/** 渲染器入参：样式 + 点数据 + 范围 + 几何 */
export interface HeatmapRenderOptions extends HeatmapStyle {
    points: HeatmapPoint[];
    bounds: HeatmapBounds;
    /** 热力区域几何：仅多边形内生成热力 */
    polygon: HeatmapPolygon;
}

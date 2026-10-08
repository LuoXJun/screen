import type { HeatmapRenderOptions } from './types';

type RGB = [number, number, number];

interface ColorStop {
    offset: number;
    rgb: RGB;
}

/** 解析颜色：支持 #rgb / #rrggbb / rgb() / rgba() */
function parseColor(color: string): RGB {
    const hex = color.trim().replace(/^#/, '');
    if (/^[0-9a-fA-F]{3}$/.test(hex)) {
        const [r, g, b] = hex.split('').map((c) => parseInt(c + c, 16));
        return [r, g, b];
    }
    if (/^[0-9a-fA-F]{6}$/.test(hex)) {
        return [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map((c) => parseInt(c, 16)) as RGB;
    }
    const match = color.match(/rgba?\(([^)]+)\)/);
    if (match) {
        const [r, g, b] = match[1].split(',').map((n) => Math.round(Number(n.trim())));
        if ([r, g, b].every(Number.isFinite)) return [r, g, b];
    }
    throw new Error(`不支持的颜色格式: ${color}（支持 #rgb、#rrggbb、rgb()）`);
}

/** 颜色数组 → 等间距色标（相邻颜色线性插值用） */
function buildStops(colors: string[]): ColorStop[] {
    if (colors.length < 2) throw new Error('温度色条至少需要 2 个颜色');
    return colors.map((color, i) => ({
        offset: colors.length === 1 ? 0 : i / (colors.length - 1),
        rgb: parseColor(color)
    }));
}

/** 在色标间按比例取色（越界时钳制到两端） */
function sampleGradient(stops: ColorStop[], t: number): RGB {
    if (t <= stops[0].offset) return stops[0].rgb;
    const last = stops[stops.length - 1];
    if (t >= last.offset) return last.rgb;
    for (let i = 0; i < stops.length - 1; i++) {
        const a = stops[i];
        const b = stops[i + 1];
        if (t <= b.offset) {
            const k = (t - a.offset) / (b.offset - a.offset);
            return [
                Math.round(a.rgb[0] + (b.rgb[0] - a.rgb[0]) * k),
                Math.round(a.rgb[1] + (b.rgb[1] - a.rgb[1]) * k),
                Math.round(a.rgb[2] + (b.rgb[2] - a.rgb[2]) * k)
            ];
        }
    }
    return last.rgb;
}

/** 经纬度 → 画布像素坐标（等距投影，纵向按中纬度余弦修正防拉伸） */
function project(lon: number, lat: number, options: HeatmapRenderOptions, width: number, height: number): [number, number] {
    const { west, south, east, north } = options.bounds;
    const x = ((lon - west) / (east - west)) * width;
    const y = ((north - lat) / (north - south)) * height;
    return [x, y];
}

/** 多边形 → Path2D（多环：首环外环，其余环为洞，evenodd 填充规则取差集） */
function buildClipPath(options: HeatmapRenderOptions, width: number, height: number): Path2D {
    const path = new Path2D();
    for (const ring of options.polygon.rings) {
        ring.forEach(([lon, lat], i) => {
            const [x, y] = project(lon, lat, options, width, height);
            if (i === 0) path.moveTo(x, y);
            else path.lineTo(x, y);
        });
        path.closePath();
    }
    return path;
}

/** 依据经纬度跨度与目标宽度计算画布尺寸（等比，保证贴地不变形） */
function computeSize(options: HeatmapRenderOptions): [number, number] {
    const { west, south, east, north } = options.bounds;
    const lonSpan = east - west;
    const latSpan = north - south;
    if (lonSpan <= 0 || latSpan <= 0) throw new Error('热力图 bounds 经纬度跨度必须大于 0');
    const midLat = ((north + south) / 2) * (Math.PI / 180);
    const ratio = (latSpan * Math.cos(midLat)) / lonSpan;
    const width = options.width ?? 1024;
    return [width, Math.max(1, Math.round(width * ratio))];
}

/** 多边形区域掩膜：实心填充后按 feather 宽度高斯模糊，得到边缘内外渐变的 alpha 场 */
function buildMask(options: HeatmapRenderOptions, width: number, height: number, feather: number): Uint8ClampedArray | null {
    if (feather <= 0) return null;
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = width;
    maskCanvas.height = height;
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return null;
    maskCtx.fillStyle = 'rgba(255, 255, 255, 1)';
    maskCtx.fill(buildClipPath(options, width, height));
    const blurCanvas = document.createElement('canvas');
    blurCanvas.width = width;
    blurCanvas.height = height;
    const blurCtx = blurCanvas.getContext('2d');
    if (!blurCtx) return null;
    blurCtx.filter = `blur(${feather}px)`;
    blurCtx.drawImage(maskCanvas, 0, 0);
    return blurCtx.getImageData(0, 0, width, height).data;
}

/**
 * 渲染温度热力图到 canvas：
 * pass1 每个点绘制径向渐变色斑（透明度即强度），lighter 叠加使重叠区域更"热"；
 * pass2 逐像素按透明度映射温度色条，输出最终颜色。
 * 区域边界：feather=0 硬边裁剪，feather>0 掩膜模糊柔化。
 */
export function renderHeatmap(options: HeatmapRenderOptions): HTMLCanvasElement {
    const stops = buildStops(options.colors);
    const radius = options.radius ?? 40;
    const opacity = Math.min(1, Math.max(0, options.opacity ?? 0.8));
    const feather = Math.max(0, options.feather ?? 0);
    const values = options.points.map((p) => p.value);
    const minValue = options.minValue ?? Math.min(...values);
    const maxValue = options.maxValue ?? Math.max(...values);
    const span = maxValue - minValue || 1;

    const [width, height] = computeSize(options);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('无法创建 2d 绘图上下文');
    const mask = buildMask(options, width, height, feather);

    // pass1: 透明底 + 径向渐变色斑（alpha 叠加）
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';
    ctx.save();
    // 柔化掩膜在 pass2 控制区域，此处无需裁剪；硬边时用多边形裁剪
    if (!mask) ctx.clip(buildClipPath(options, width, height), 'evenodd');
    for (const point of options.points) {
        const [x, y] = project(point.lon, point.lat, options, width, height);
        if (x < -radius || x > width + radius || y < -radius || y > height + radius) continue;
        const strength = (point.value - minValue) / span;
        if (strength <= 0) continue;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(0, 0, 0, ${strength})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
    ctx.globalCompositeOperation = 'source-over';

    // pass2: 透明度 → 温度色条；掩膜 alpha 与色斑 alpha 相乘实现边缘渐变
    const image = ctx.getImageData(0, 0, width, height);
    const data = image.data;
    for (let i = 0; i < data.length; i += 4) {
        const maskAlpha = mask ? mask[i + 3] / 255 : 1;
        const alpha = (data[i + 3] / 255) * maskAlpha;
        if (alpha <= 0.01) {
            data[i + 3] = 0;
            continue;
        }
        const [r, g, b] = sampleGradient(stops, alpha);
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = Math.round(alpha * 255 * opacity);
    }
    ctx.putImageData(image, 0, 0);
    return canvas;
}

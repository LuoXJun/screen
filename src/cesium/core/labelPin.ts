import * as Cesium from 'cesium';
import { getScreenScale } from '@/components/baseChart/screenScale';
import { getImageWidthName } from '@/utils/getAssets';
import { toCartesian3 } from './utils/coordinate';

/** 设计稿尺寸（1920 基准 px） */
const DESIGN = {
    /** 标签条高度 */
    barHeight: 26,
    /** 端盖装饰（根尺寸,含发光外扩） */
    capW: 7,
    capH: 15,
    /** 中段斜纹装饰 */
    lineW: 108.48,
    lineH: 17.2,
    /** 引针 */
    needleW: 16,
    needleH: 41,
    /** 文字字号与左右留白 */
    fontSize: 16,
    textPadding: 8
} as const;

/** 标签条水平渐变（设计稿 stops,两端渐隐） */
const BAR_GRADIENT: Array<[number, string]> = [
    [0, 'rgba(0, 185, 220, 0)'],
    [0.127, 'rgba(0, 179, 214, 0.109)'],
    [0.2655, 'rgba(0, 171, 203, 0.282)'],
    [0.515, 'rgb(0, 135, 161)'],
    [0.7275, 'rgba(0, 151, 180, 0.353)'],
    [0.8464, 'rgba(0, 156, 186, 0.159)'],
    [1, 'rgba(0, 160, 191, 0)']
];

/** 标牌文字字体（与 --font-family-YouSheBiaoTiHei 一致） */
const FONT_FAMILY = 'YouSheBiaoTiHei';

export interface LabelPinOptions {
    /** 标牌文字 */
    text: string;
    /** 整体缩放（缺省跟随大屏基准 --screen-base） */
    scale?: number;
    /** 文字字号（设计稿 px,默认 16） */
    fontSize?: number;
    /** 文字颜色（默认白色） */
    textColor?: string;
    /** 标牌最小宽度（设计稿 px,文字较窄时保底宽度） */
    minWidth?: number;
}

export interface LabelPinBillboardOptions extends LabelPinOptions {
    /** 透传给 Cesium billboard 的额外配置（合并优先级最高） */
    billboard?: Cesium.BillboardGraphics.ConstructorOptions;
}

type PinAssets = {
    line: HTMLImageElement;
    cap: HTMLImageElement;
    needle: HTMLImageElement;
};

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

/** 装饰件加载（模块级缓存,首次绘制加载一次;失败重置以便重试） */
let assetsPromise: Promise<PinAssets> | null = null;

function loadAssets(): Promise<PinAssets> {
    assetsPromise ??= Promise.all([
        loadImage(getImageWidthName('label-pin-line.svg')),
        loadImage(getImageWidthName('label-pin-cap.svg')),
        loadImage(getImageWidthName('label-pin-needle.svg'))
    ])
        .then(([line, cap, needle]) => ({ line, cap, needle }))
        .catch((error) => {
            assetsPromise = null;
            throw error;
        });
    return assetsPromise;
}

/**
 * 绘制标签牌图像（异步:等待装饰件与文字字体就绪）。
 * 产出可直接作为 billboard image 的 canvas:上为渐隐标签条 + 文字,下为引针,针尖在画布底边中点。
 */
export async function renderLabelPinImage(options: LabelPinOptions): Promise<HTMLCanvasElement> {
    const scale = options.scale ?? getScreenScale();
    const fontSize = (options.fontSize ?? DESIGN.fontSize) * scale;

    const [assets] = await Promise.all([
        loadAssets(),
        document.fonts.load(`${fontSize}px "${FONT_FAMILY}"`)
    ]);

    const font = `${fontSize}px "${FONT_FAMILY}"`;
    const measure = document.createElement('canvas').getContext('2d')!;
    measure.font = font;
    const textWidth = measure.measureText(options.text).width;

    const barWidth = Math.max(
        (options.minWidth ?? 0) * scale,
        textWidth + DESIGN.textPadding * 2 * scale
    );
    const barHeight = DESIGN.barHeight * scale;
    const totalHeight = (DESIGN.barHeight + DESIGN.needleH) * scale;

    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(barWidth);
    canvas.height = Math.ceil(totalHeight);
    const ctx = canvas.getContext('2d')!;

    // 标签条:水平渐隐底色
    const gradient = ctx.createLinearGradient(0, 0, barWidth, 0);
    BAR_GRADIENT.forEach(([offset, color]) => gradient.addColorStop(offset, color));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, barWidth, barHeight);

    // 中段斜纹装饰（居中）
    ctx.drawImage(
        assets.line,
        barWidth / 2 - (DESIGN.lineW * scale) / 2,
        barHeight / 2 - (DESIGN.lineH * scale) / 2,
        DESIGN.lineW * scale,
        DESIGN.lineH * scale
    );

    // 端盖装饰:左原样,右水平镜像
    const capW = DESIGN.capW * scale;
    const capH = DESIGN.capH * scale;
    const capTop = (barHeight - capH) / 2;
    ctx.drawImage(assets.cap, -scale, capTop, capW, capH);
    ctx.save();
    ctx.translate(barWidth + scale, barHeight / 2);
    ctx.scale(-1, 1);
    ctx.drawImage(assets.cap, 0, -capH / 2, capW, capH);
    ctx.restore();

    // 文字（垂直居中）
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = options.textColor ?? '#ffffff';
    ctx.fillText(options.text, barWidth / 2, barHeight / 2);

    // 引针（底部居中,针尖=画布底边中点）
    ctx.drawImage(
        assets.needle,
        barWidth / 2 - (DESIGN.needleW * scale) / 2,
        barHeight,
        DESIGN.needleW * scale,
        DESIGN.needleH * scale
    );

    return canvas;
}

/**
 * 创建标签牌点位实体配置（异步:等待纹理绘制就绪）。
 * billboard 以引针尖端为锚点（verticalOrigin=BOTTOM）,即地理坐标落在针尖处。
 */
export async function createLabelPinBillboard(
    lng: number,
    lat: number,
    height: number,
    options: LabelPinBillboardOptions
): Promise<Cesium.Entity.ConstructorOptions> {
    const { billboard, ...pinOptions } = options;
    const image = await renderLabelPinImage(pinOptions);
    /* 显式标注精确类型:Cesium 构造选项的 image 只接受 Property|string|HTMLCanvasElement(无 Promise) */
    const graphics: Cesium.BillboardGraphics.ConstructorOptions = {
        image,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        ...billboard
    };
    return {
        position: toCartesian3(lng, lat, height),
        billboard: graphics
    };
}

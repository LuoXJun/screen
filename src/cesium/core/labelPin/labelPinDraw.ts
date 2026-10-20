import * as Cesium from 'cesium';
import { getScreenScale } from '@/components/baseChart/screenScale';
import { getImageWidthName } from '@/utils/getAssets';

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

/** 高亮态（选中）视觉:亮版渐变 + 外发光 + 描边 + 整体放大 */
export const ACTIVE = {
    /** 整体放大倍数 */
    scale: 1.3,
    /** 发光模糊半径（设计稿 px） */
    glowBlur: 16,
    /** 画布发光留白（设计稿 px;两版统一留白,切换高亮时图案零位移） */
    glowPad: 24,
    /** 发光颜色 */
    glowColor: 'rgba(0, 226, 255, 0.85)',
    /** 条形描边颜色 */
    strokeColor: 'rgba(150, 248, 255, 0.9)'
} as const;

/** 高亮态标签条渐变（亮版:中心提至主色,两端保留底色不再渐隐到底） */
const ACTIVE_BAR_GRADIENT: Array<[number, string]> = [
    [0, 'rgba(0, 200, 255, 0.32)'],
    [0.127, 'rgba(0, 205, 245, 0.46)'],
    [0.2655, 'rgba(0, 215, 250, 0.7)'],
    [0.515, 'rgb(0, 200, 255)'],
    [0.7275, 'rgba(0, 215, 250, 0.7)'],
    [0.8464, 'rgba(0, 205, 245, 0.46)'],
    [1, 'rgba(0, 200, 255, 0.32)']
];

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
    /** 渲染高亮（选中）版本图案 */
    active?: boolean;
}

export interface LabelPinBillboardOptions extends LabelPinOptions {
    /** 透传给 Cesium billboard 的额外配置（合并优先级最高） */
    billboard?: Cesium.BillboardGraphics.ConstructorOptions;
}

/** 图案几何（屏幕像素;供流光层定位与几何估算） */
export interface PinLayout {
    /** 渲染缩放（大屏基准） */
    scale: number;
    /** 画布发光留白 */
    pad: number;
    /** 标签条尺寸 */
    barWidth: number;
    barHeight: number;
    /** 画布整体尺寸（billboard 显示尺寸即此值） */
    canvasWidth: number;
    canvasHeight: number;
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
 * 上下左右留发光余白（两版一致,保证高亮切换零位移）;active 版为亮色渐变 + 外发光 + 描边。
 */
export async function renderPin(
    options: LabelPinOptions
): Promise<{ canvas: HTMLCanvasElement; layout: PinLayout }> {
    const scale = options.scale ?? getScreenScale();
    const active = options.active ?? false;
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
    const pad = ACTIVE.glowPad * scale;

    const canvas = document.createElement('canvas');
    const canvasWidth = Math.ceil(barWidth + pad * 2);
    const canvasHeight = Math.ceil(totalHeight + pad);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d')!;
    /* 内容坐标系归零到 (pad, pad):针尖仍在画布底边中点 */
    ctx.translate(pad, pad);

    /* 高亮态:条形与装饰绘制时带外发光 */
    if (active) {
        ctx.shadowColor = ACTIVE.glowColor;
        ctx.shadowBlur = ACTIVE.glowBlur * scale;
    }

    // 标签条:水平渐隐底色（高亮态用亮版）
    const gradient = ctx.createLinearGradient(0, 0, barWidth, 0);
    (active ? ACTIVE_BAR_GRADIENT : BAR_GRADIENT).forEach(([offset, color]) =>
        gradient.addColorStop(offset, color)
    );
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

    // 高亮态:条形描边（承发光）;随后撤掉发光,文字保持清晰
    if (active) {
        ctx.strokeStyle = ACTIVE.strokeColor;
        ctx.lineWidth = scale;
        ctx.strokeRect(0, 0, barWidth, barHeight);
        ctx.shadowBlur = 0;
    }

    // 文字（垂直居中）
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = options.textColor ?? '#ffffff';
    ctx.fillText(options.text, barWidth / 2, barHeight / 2);

    // 引针（底部居中,针尖=画布底边中点;高亮态带微光）
    if (active) {
        ctx.shadowBlur = ACTIVE.glowBlur * scale * 0.6;
    }
    ctx.drawImage(
        assets.needle,
        barWidth / 2 - (DESIGN.needleW * scale) / 2,
        barHeight,
        DESIGN.needleW * scale,
        DESIGN.needleH * scale
    );

    return {
        canvas,
        layout: { scale, pad, barWidth, barHeight, canvasWidth, canvasHeight }
    };
}

/** 仅取图案 canvas（layout 不关心时用） */
export async function renderLabelPinImage(options: LabelPinOptions): Promise<HTMLCanvasElement> {
    return (await renderPin(options)).canvas;
}

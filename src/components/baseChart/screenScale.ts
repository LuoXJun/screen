/**
 * 大屏基准缩放比，供 echarts 换算设计稿 px。
 *
 * 组件尺寸走 var(--screen-base) 自适应，但 echarts 是 canvas 渲染：
 * 字号、间距都是裸像素，不认 CSS 变量——必须由 JS 按当前基准换算后再写进 option，
 * 且切屏(1080p → 4K)后要重建 option，否则字号停在旧基准上。
 *
 * 基准的边界值以无单位数字形式维护在 tokens/_screen.scss，此处复算同一区间，
 * 避免 1600/3840/1920 在 CSS 与 JS 两处各写一份。
 */

/** 读无单位数值型 CSS 变量；读不到或非法时回退 */
function readNumberVar(name: string, fallback: number): number {
    const value = Number(getComputedStyle(document.documentElement).getPropertyValue(name));
    return Number.isFinite(value) && value > 0 ? value : fallback;
}

/**
 * 当前缩放比 = clamp(视口宽, min, max) / 设计稿宽。
 * 非大屏作用域下 --screen-base 未定义，返回 1，字号保持设计稿原值。
 */
export function getScreenScale(): number {
    if (!getComputedStyle(document.documentElement).getPropertyValue('--screen-base').trim()) {
        return 1;
    }
    const min = readNumberVar('--screen-base-min', 1600);
    const max = readNumberVar('--screen-base-max', 3840);
    const design = readNumberVar('--screen-base-design', 1920);
    return Math.min(Math.max(window.innerWidth, min), max) / design;
}

/** 设计稿 px → 当前屏 px */
export function scalePx(designPx: number): number {
    return designPx * getScreenScale();
}

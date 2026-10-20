import * as Cesium from 'cesium';
import { getViewer } from '../viewer';

/**
 * 标签牌流光层：屏幕空间 DOM/SVG 覆盖层,高亮时绕标签条跑一道流光。
 * 为何不逐帧重绘 billboard 图案:Cesium 对 billboard 图像变更走纹理图集
 * （每次变更即一张新纹理入集）,逐帧重绘会持续膨胀图集;流动这类高频 2D
 * 动画放 DOM 层由 CSS 自驱,仅相机变化的渲染帧需要同步屏幕位置。
 */

/** 流光跑完一圈的时长（秒）与光带占周长比例 */
const FLOW_PERIOD = 2.2;
const FLOW_SPAN = 0.22;

/** 配色（大屏主色系:亮青流光 + 青发光） */
const STREAM_COLOR = '#d9feff';
const STREAM_GLOW = 'rgba(0, 226, 255, 0.95)';
const FRAME_COLOR = 'rgba(0, 200, 255, 0.5)';

/** 流光目标:条形屏幕几何（位置随帧投影;偏移与尺寸为像素） */
export interface LabelPinFlowTarget {
    /** 实体世界坐标 */
    position: Cesium.Cartesian3;
    /** 条形左上角相对锚点（针尖）的偏移 */
    offset: { x: number; y: number };
    /** 条形尺寸 */
    width: number;
    height: number;
    /** 可见距离上限（米;与标牌 billboard 的 distanceDisplayCondition 同源） */
    maxDistance: number;
}

/** 基础样式（流光 keyframes 随几何在 show 时重建） */
const BASE_CSS = `
.labelPinFlow {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    pointer-events: none;
    will-change: transform;
}
.labelPinFlow svg { display: block; overflow: visible; }
.labelPinFlow rect { fill: none; }
.labelPinFlow .stream { stroke-linecap: round; }
`;

let layerEl: HTMLDivElement | null = null;
let svgEl: SVGSVGElement | null = null;
let frameRect: SVGRectElement | null = null;
let streamRect: SVGRectElement | null = null;
let styleEl: HTMLStyleElement | null = null;

/** 当前显示目标（单例:show 时先撤旧目标） */
let active: { remove: () => void } | null = null;

let flowSeq = 0;

/** 懒创建图层（挂 canvas 父容器,与之同坐标系;视图重建后自动重挂） */
function ensureLayer(): HTMLDivElement {
    if (layerEl?.isConnected) return layerEl;
    const viewer = getViewer();
    /* .cesium-widget 自带 position:relative 且与 canvas 重合;异常时退回容器 */
    const host = viewer.container.querySelector('.cesium-widget') ?? viewer.container;

    if (!styleEl?.isConnected) {
        styleEl = document.createElement('style');
        styleEl.dataset.labelPinFlow = '';
        styleEl.textContent = BASE_CSS;
        document.head.appendChild(styleEl);
    }

    layerEl = document.createElement('div');
    layerEl.className = 'labelPinFlow';
    layerEl.style.display = 'none';
    layerEl.innerHTML =
        '<svg><rect class="frame" stroke-width="1"/><rect class="stream" stroke-width="2"/></svg>';
    host.appendChild(layerEl);

    svgEl = layerEl.querySelector('svg');
    frameRect = layerEl.querySelector('.frame');
    streamRect = layerEl.querySelector('.stream');
    return layerEl;
}

/**
 * 位置同步：锚点世界坐标 → canvas 屏幕坐标（cartesianToCanvasCoordinates,与
 * scene.pick 同一坐标系,即用户所见位置）;相机静止时无渲染帧,不做同步（CSS 动画自驱）。
 */
function syncPosition(target: LabelPinFlowTarget, el: HTMLElement): void {
    const viewer = getViewer();
    /* 超出标牌可见距离时一并隐藏（billboard 已不渲染,流光须同步退场） */
    if (
        Cesium.Cartesian3.distance(viewer.camera.positionWC, target.position) > target.maxDistance
    ) {
        el.style.opacity = '0';
        return;
    }
    const xy = viewer.scene.cartesianToCanvasCoordinates(target.position);
    if (!xy) {
        el.style.opacity = '0';
        return;
    }
    const x = xy.x + target.offset.x;
    const y = xy.y + target.offset.y;

    /* 视口外留余量隐藏,避免贴边探头 */
    const width = viewer.canvas.clientWidth;
    const height = viewer.canvas.clientHeight;
    const margin = 200;
    const visible = x > -margin && y > -margin && x < width + margin && y < height + margin;
    el.style.opacity = visible ? '1' : '0';
    if (visible) {
        el.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
    }
}

/** 显示流光（切换到目标几何;矩形内缩 1px 使 2px 描边完整落在可视区） */
export function showLabelPinFlow(target: LabelPinFlowTarget): void {
    hideLabelPinFlow();
    const el = ensureLayer();
    const viewer = getViewer();

    const width = Math.max(4, Math.round(target.width));
    const height = Math.max(4, Math.round(target.height));
    svgEl!.setAttribute('width', String(width));
    svgEl!.setAttribute('height', String(height));
    svgEl!.setAttribute('viewBox', `0 0 ${width} ${height}`);
    for (const rect of [frameRect!, streamRect!]) {
        rect.setAttribute('x', '1');
        rect.setAttribute('y', '1');
        rect.setAttribute('width', String(width - 2));
        rect.setAttribute('height', String(height - 2));
    }

    /* 流光:一段亮带沿周长循环飞（keyframes 按当前周长重建,几何不同名不同） */
    const perimeter = 2 * (width + height - 4);
    flowSeq += 1;
    const animName = `labelPinFlowRun${flowSeq}`;
    styleEl!.textContent = `${BASE_CSS}
.labelPinFlow .frame { stroke: ${FRAME_COLOR}; }
.labelPinFlow .stream {
    stroke: ${STREAM_COLOR};
    stroke-dasharray: ${(perimeter * FLOW_SPAN).toFixed(1)} ${(perimeter * (1 - FLOW_SPAN)).toFixed(1)};
    filter: drop-shadow(0 0 6px ${STREAM_GLOW});
    animation: ${animName} ${FLOW_PERIOD}s linear infinite;
}
@keyframes ${animName} {
    from { stroke-dashoffset: 0; }
    to { stroke-dashoffset: ${-perimeter}; }
}`;

    /* 仅渲染帧同步位置;显示时先同步一次 */
    const remove = viewer.scene.preRender.addEventListener(() => syncPosition(target, layerEl!));
    active = { remove };
    el.style.display = '';
    syncPosition(target, el);
}

/** 隐藏流光（无显示目标时静默） */
export function hideLabelPinFlow(): void {
    if (!active) return;
    active.remove();
    active = null;
    if (layerEl) {
        layerEl.style.display = 'none';
    }
}

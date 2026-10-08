import * as Cesium from 'cesium';
import { getViewer, requestRender } from './viewer';

/** 锚点屏幕状态（内部去重用） */
interface PopupState {
    visible: boolean;
    x: number;
    y: number;
}

/**
 * 地图 HTML 弹窗锚点：把 DOM 内容钉在世界坐标点上。
 * - 每帧（postRender）将锚点世界坐标同步为屏幕坐标
 * - 锚点无法投影到屏幕时（相机背向等）自动隐藏
 * - getHost() 返回的节点供 Vue 渲染弹窗内容
 */
export class MapPopup {
    private readonly overlay: HTMLDivElement;
    private readonly host: HTMLDivElement;
    private readonly removePostRender: () => void;
    private anchor: Cesium.Cartesian3 | null = null;
    private lastState: PopupState | null = null;

    constructor() {
        const viewer = getViewer();
        const container = viewer.container as HTMLElement;

        this.overlay = document.createElement('div');
        Object.assign(this.overlay.style, {
            position: 'absolute',
            inset: '0',
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: '30'
        });
        this.host = document.createElement('div');
        Object.assign(this.host.style, {
            position: 'absolute',
            left: '0',
            top: '0',
            display: 'none'
        });
        this.overlay.appendChild(this.host);

        if (getComputedStyle(container).position === 'static') {
            container.style.position = 'relative';
        }
        container.appendChild(this.overlay);

        this.removePostRender = viewer.scene.postRender.addEventListener(() => this.sync());
    }

    /** 弹窗内容渲染挂载点 */
    getHost(): HTMLDivElement {
        return this.host;
    }

    /** 设置世界坐标锚点（null 清除并立即隐藏） */
    setAnchor(anchor: Cesium.Cartesian3 | null): void {
        this.anchor = anchor;
        if (!anchor) {
            this.apply({ visible: false, x: 0, y: 0 });
            return;
        }
        // requestRenderMode 下点击不触发渲染，需主动请求一帧让 postRender 同步位置
        requestRender();
    }

    /** 销毁：解除渲染监听并移除 DOM */
    destroy(): void {
        this.removePostRender();
        this.overlay.remove();
        this.anchor = null;
    }

    /** 每帧同步：世界坐标 → 屏幕坐标 */
    private sync(): void {
        if (!this.anchor) return;
        const windowPos = Cesium.SceneTransforms.worldToWindowCoordinates(getViewer().scene, this.anchor);
        if (!windowPos) {
            this.apply({ visible: false, x: 0, y: 0 });
            return;
        }
        const rect = getViewer().container.getBoundingClientRect();
        this.apply({ visible: true, x: windowPos.x - rect.left, y: windowPos.y - rect.top });
    }

    private apply(state: PopupState): void {
        // 状态未变化时跳过 DOM 写入，避免空闲时每帧无效操作
        if (
            this.lastState &&
            this.lastState.visible === state.visible &&
            this.lastState.x === state.x &&
            this.lastState.y === state.y
        ) {
            return;
        }
        this.lastState = state;
        this.host.style.display = state.visible ? 'block' : 'none';
        this.host.style.transform = `translate(${state.x}px, ${state.y}px)`;
    }
}

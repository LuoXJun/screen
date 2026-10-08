import * as Cesium from 'cesium';
import { createVNode, h, render, type VNode } from 'vue';
import { MapPopup, toCartesian3 } from '@/cesium';
import MapPopupPanel from './MapPopupPanel.vue';

export interface ShowMapPopupOptions {
    /** 锚点：经纬度（角度 + 高度，可省略）或笛卡尔坐标 */
    position: Cesium.Cartesian3 | { lng: number; lat: number; height?: number };
    title?: string;
    width?: string;
    height?: string;
    draggable?: boolean;
    /** 弹窗内容：VNode（h(你的组件, props)）或纯文本 */
    content?: VNode | string;
    onConfirm?: () => void;
    onClose?: () => void;
}

export interface MapPopupHandle {
    /** 关闭弹窗并销毁（触发 onClose 回调） */
    close(): void;
}

/**
 * 命令式地图弹窗（类似 ElMessageBox 的函数式调用）：
 * 在世界坐标锚点处弹出 BasePanel 风格面板，相机移动时自动跟随。
 * 用法：showMapPopup({ position: { lng, lat }, title: '标题', content: h(MyComp, { ... }) })
 */
export function showMapPopup(options: ShowMapPopupOptions): MapPopupHandle {
    const popup = new MapPopup();
    let tornDown = false;

    const tearDown = () => {
        if (tornDown) return;
        tornDown = true;
        render(null, popup.getHost());
        popup.destroy();
    };

    const content = typeof options.content === 'string' ? h('span', options.content) : options.content ?? null;

    const vnode = createVNode(MapPopupPanel, {
        title: options.title,
        width: options.width,
        height: options.height,
        draggable: options.draggable,
        content,
        onConfirm: () => options.onConfirm?.(),
        onClose: () => {
            tearDown();
            options.onClose?.();
        }
    });

    render(vnode, popup.getHost());
    popup.setAnchor(toAnchor(options.position));

    return {
        close: () => (vnode.component?.exposed as { close?: () => void } | undefined)?.close?.()
    };
}

function toAnchor(position: ShowMapPopupOptions['position']): Cesium.Cartesian3 {
    if (position instanceof Cesium.Cartesian3) return position;
    return toCartesian3(position.lng, position.lat, position.height ?? 0);
}

import * as Cesium from 'cesium';
import { onBeforeUnmount, onMounted } from 'vue';
import {
    createPolygonPrimitives,
    getViewer,
    requestRender,
    requestRenderWithNextFrame
} from '@/cesium';
import { scalePx } from '@/components/baseChart/screenScale';
import type { BoxTransformerDevice } from '@/config/devices';
import { TEMP_STATUS_COLORS } from '../config';

/**
 * 不规则范围：7 顶点、半径 50~75m。
 * 网格半距约 90m（179m / 2）,最大半径 75m 保证相邻箱变范围互不相交。
 * 种子取设备序号,刷新/重进页面形状保持稳定。
 */
function buildAreaRing(device: BoxTransformerDevice, index: number): number[][] {
    const seed = Number(device.id.replace(/\D/g, '')) || index + 1;
    const metersPerLat = 111320;
    const metersPerLng = metersPerLat * Math.cos((device.lat * Math.PI) / 180);
    const vertices = 7;
    const ring: number[][] = [];

    for (let i = 0; i < vertices; i += 1) {
        const angle = (i / vertices) * Math.PI * 2 + Math.sin(seed + i * 1.3) * 0.14;
        const radius = 50 + ((Math.sin(seed * 1.7 + i * 2.1) + 1) / 2) * 25;
        ring.push([
            device.lng + (Math.cos(angle) * radius) / metersPerLng,
            device.lat + (Math.sin(angle) * radius) / metersPerLat
        ]);
    }

    ring.push(ring[0]);
    return ring;
}

/**
 * 箱变测温页专属：为每台箱变铺设不规则状态范围面。
 * 状态色描边 + 同色 20% 填充,贴地渲染;页面卸载即移除,不随「箱变布置」显隐。
 */
export function useBoxTransformerAreas(devices: BoxTransformerDevice[]): void {
    const primitives: ReturnType<typeof createPolygonPrimitives> = [];
    let areaViewer: ReturnType<typeof getViewer> | undefined;
    let renderTimer: number | undefined;

    onMounted(() => {
        const viewer = getViewer();
        areaViewer = viewer;

        devices.forEach((device, index) => {
            const color = Cesium.Color.fromCssColorString(TEMP_STATUS_COLORS[device.status]);
            const created = createPolygonPrimitives(
                [buildAreaRing(device, index)],
                {
                    fillColor: color.withAlpha(0.2),
                    strokeColor: color,
                    strokeWidth: scalePx(2),
                    strokeHoles: false
                },
                `box-area-${device.id}`
            );
            created.forEach((primitive) => viewer.scene.primitives.add(primitive));
            primitives.push(...created);
        });

        /* 贴地 primitive 异步编译：短时补帧,避免需鼠标移动才出现 */
        requestRenderWithNextFrame();
        let ticks = 0;
        renderTimer = window.setInterval(() => {
            ticks += 1;
            if (areaViewer !== viewer || viewer.isDestroyed() || ticks > 6) {
                window.clearInterval(renderTimer);
                renderTimer = undefined;
                return;
            }
            requestRenderWithNextFrame();
        }, 400);
    });

    onBeforeUnmount(() => {
        if (renderTimer !== undefined) {
            window.clearInterval(renderTimer);
            renderTimer = undefined;
        }
        const viewer = areaViewer;
        if (viewer && !viewer.isDestroyed()) {
            primitives.forEach((primitive) => viewer.scene.primitives.remove(primitive));
            requestRender();
        }
        primitives.length = 0;
        areaViewer = undefined;
    });
}

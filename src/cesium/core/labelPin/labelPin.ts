import * as Cesium from 'cesium';
import { toCartesian3 } from '../utils/coordinate';
import { addSiteEntity } from '../siteContainer';
import { requestRenderWithNextFrame } from '../viewer';
import { ACTIVE, renderPin, type LabelPinBillboardOptions, type PinLayout } from './labelPinDraw';
import { hideLabelPinFlow, showLabelPinFlow } from './labelPinFlow';

/** 标签牌实体记录（选中高亮与流光切换用;WeakMap 随实体回收,HMR 重建不残留） */
interface PinRecord {
    base: HTMLCanvasElement;
    active: HTMLCanvasElement;
    layout: PinLayout;
    position: Cesium.Cartesian3;
}

const pinRecords = new WeakMap<Cesium.Entity, PinRecord>();

/** 流光当前归属实体（流光层单例:切换高亮时先撤旧目标,实体移除后须显式关闭） */
let flowingEntity: Cesium.Entity | undefined;

/**
 * 标牌可见距离上限（米）:相机与点位距离超出后标牌隐藏。
 * billboard 为屏幕空间恒等尺寸,远视角下全站点位标牌等大堆叠糊屏;
 * 初始站点视角高 3.2km（点位距离约 3~4km）须全覆盖,故取约 3 倍余量,
 * 拉到 10km 高度时标牌已挤成一团,恰为隐藏时机。
 */
export const LABEL_PIN_MAX_DISTANCE = 10000;

/**
 * 在站点容器创建标签牌点位实体（异步:等待两版纹理绘制就绪）。
 * billboard 以引针尖端为锚点（verticalOrigin=BOTTOM）,即地理坐标落在针尖处;
 * properties 为实体点击弹窗数据。创建后经 setLabelPinHighlight 切换选中高亮。
 */
export async function addLabelPinSiteEntity(
    siteKey: string,
    name: string,
    lng: number,
    lat: number,
    height: number,
    options: LabelPinBillboardOptions,
    properties?: Record<string, unknown>
): Promise<Cesium.Entity> {
    const { billboard, ...pinOptions } = options;
    const [{ canvas: base, layout }, { canvas: active }] = await Promise.all([
        renderPin(pinOptions),
        renderPin({ ...pinOptions, active: true })
    ]);
    const position = toCartesian3(lng, lat, height);
    /* 显式标注精确类型:Cesium 构造选项的 image 只接受 Property|string|HTMLCanvasElement(无 Promise) */
    const graphics: Cesium.BillboardGraphics.ConstructorOptions = {
        image: base,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, LABEL_PIN_MAX_DISTANCE),
        ...billboard
    };
    const entity = addSiteEntity(siteKey, name, {
        position,
        billboard: graphics,
        ...(properties ? { properties } : {})
    });
    pinRecords.set(entity, { base, active, layout, position });
    requestRenderWithNextFrame();
    return entity;
}

/** 切换标签牌选中态（放大 + 亮版图案 + 绕牌流光;非标签牌实体静默跳过） */
export function setLabelPinHighlight(entity: Cesium.Entity | undefined, active: boolean): void {
    if (!entity) return;
    const record = pinRecords.get(entity);
    if (!record || !entity.billboard) return;
    entity.billboard.image = new Cesium.ConstantProperty(active ? record.active : record.base);
    entity.billboard.scale = new Cesium.ConstantProperty(active ? ACTIVE.scale : 1);
    if (active) {
        flowTo(entity, record);
    } else if (flowingEntity === entity) {
        flowingEntity = undefined;
        hideLabelPinFlow();
    }
    requestRenderWithNextFrame();
}

/** 显示实体的绕牌流光（几何为屏幕显示态,即几何乘高亮放大倍数） */
function flowTo(entity: Cesium.Entity, record: PinRecord): void {
    flowingEntity = entity;
    const { layout, position } = record;
    const s = ACTIVE.scale;
    showLabelPinFlow({
        position,
        /* 条形左上角相对锚点（billboard 图像底边中点）的偏移 */
        offset: {
            x: (-layout.canvasWidth / 2 + layout.pad) * s,
            y: (-layout.canvasHeight + layout.pad) * s
        },
        width: layout.barWidth * s,
        height: layout.barHeight * s,
        /* 与标牌 billboard 的远裁剪同源:标牌隐藏后流光不能独留成幽灵框 */
        maxDistance: LABEL_PIN_MAX_DISTANCE
    });
}

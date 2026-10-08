import * as Cesium from 'cesium';
import type { Feature, FeatureCollection } from 'geojson';
import { getViewer } from '@/cesium/core/viewer';
import { toCartesian3List } from '@/cesium/core/utils/coordinate';
import { forEachFeature, type LeafGeometry } from '@/cesium/core/utils/geo';

export interface LineEffectOptions {
    /** 着色器 uniform 变量 */
    uniforms?: Record<string, unknown>;
    /** 线宽（像素） */
    lineWidth?: number;
    /** 流动线片元着色器源码 */
    shader: string;
}

/** 流动线效果：GroundPolylinePrimitive + 自定义着色器材质 */
export class LineEffect {
    private readonly uniforms: Record<string, unknown>;
    private readonly shader: string;
    private readonly lineWidth: number;
    private readonly lines: Cesium.GroundPolylinePrimitive[] = [];
    private material?: Cesium.Material;

    constructor(options: LineEffectOptions) {
        this.uniforms = options.uniforms ?? {};
        this.shader = options.shader;
        this.lineWidth = options.lineWidth ?? 1;
    }

    /** 渲染 GeoJSON（支持 LineString / MultiLineString / GeometryCollection） */
    renderGeoJSON(geoJson: FeatureCollection | Feature): void {
        forEachFeature(geoJson, (_, geometry) => this.renderGeometry(geometry));
    }

    /** 用笛卡尔坐标点数组创建流动线并挂载到场景 */
    createLine(points: Cesium.Cartesian3[]): void {
        if (points.length < 2) {
            console.warn('[cesiumTools] 流动线至少需要 2 个点');
            return;
        }
        const geometry = new Cesium.GroundPolylineGeometry({ width: this.lineWidth, positions: points });
        const primitive = new Cesium.GroundPolylinePrimitive({
            geometryInstances: [new Cesium.GeometryInstance({ geometry })],
            appearance: new Cesium.MaterialAppearance({
                translucent: true,
                material: this.getMaterial()
            })
        });
        getViewer().scene.primitives.add(primitive);
        this.lines.push(primitive);
    }

    /** 移除并销毁所有已创建的流动线 */
    clear(): void {
        const primitives = getViewer().scene.primitives;
        this.lines.forEach((line) => {
            primitives.remove(line);
            line.destroy();
        });
        this.lines.length = 0;
    }

    private renderGeometry(geometry: LeafGeometry): void {
        switch (geometry.type) {
            case 'LineString':
                this.createLine(toCartesian3List(geometry.coordinates));
                break;
            case 'MultiLineString':
                geometry.coordinates.forEach((line) => this.createLine(toCartesian3List(line)));
                break;
            default:
                console.warn(`[cesiumTools] 不支持的要素类型: ${geometry.type}`);
        }
    }

    private getMaterial(): Cesium.Material {
        if (!this.material) {
            this.material = new Cesium.Material({
                translucent: true,
                fabric: { uniforms: this.uniforms, source: this.shader }
            });
        }
        return this.material;
    }
}

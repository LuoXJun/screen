import * as Cesium from 'cesium';
import { getViewer } from '@/cesium/core/viewer';

export interface GroundMaterialEffectOptions {
    /** 地面几何体（EllipseGeometry / RectangleGeometry 等，由调用方决定形状） */
    geometry: Cesium.Geometry;
    /** 片元着色器源码 */
    shader: string;
    /** 着色器 uniform 变量 */
    uniforms?: Record<string, unknown>;
}

/** 地面材质效果：把自定义着色器材质贴到地面几何上，实现扩散、流动等动画 */
export class GroundMaterialEffect {
    private readonly geometry: Cesium.Geometry;
    private readonly shader: string;
    private readonly uniforms: Record<string, unknown>;
    private material?: Cesium.Material;
    private primitive?: Cesium.GroundPrimitive;

    constructor(options: GroundMaterialEffectOptions) {
        this.geometry = options.geometry;
        this.shader = options.shader;
        this.uniforms = options.uniforms ?? {};
    }

    /** 创建并挂载到场景（重复调用返回已挂载实例） */
    add(): Cesium.GroundPrimitive {
        if (this.primitive) return this.primitive;
        this.material = new Cesium.Material({
            translucent: true,
            fabric: { uniforms: this.uniforms, source: this.shader }
        });
        this.primitive = new Cesium.GroundPrimitive({
            geometryInstances: [new Cesium.GeometryInstance({ geometry: this.geometry })],
            appearance: new Cesium.MaterialAppearance({
                translucent: true,
                material: this.material
            })
        });
        getViewer().scene.primitives.add(this.primitive);
        return this.primitive;
    }

    /** 从场景移除并销毁 */
    remove(): void {
        if (!this.primitive) return;
        getViewer().scene.primitives.remove(this.primitive);
        this.primitive.destroy();
        this.primitive = undefined;
        this.material = undefined;
    }
}

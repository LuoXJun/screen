import * as Cesium from 'cesium';
import { getViewer } from '@/cesium/core/viewer';

export interface PostProcessStageEffectOptions {
    /** 片元着色器源码 */
    shader: string;
    /** 效果名称（默认 postProcessStageEffect） */
    name?: string;
    /** 着色器 uniform 变量 */
    uniforms?: Record<string, unknown>;
}

/** 后处理效果：自定义片元着色器（描边、泛光等），挂载到 scene.postProcessStages */
export class PostProcessStageEffect {
    private readonly name: string;
    private readonly uniforms: Record<string, unknown>;
    private readonly shader: string;
    private stage?: Cesium.PostProcessStage;

    constructor(options: PostProcessStageEffectOptions) {
        this.name = options.name ?? 'postProcessStageEffect';
        this.uniforms = options.uniforms ?? {};
        this.shader = options.shader;
    }

    /** 创建并挂载到场景（重复调用返回已挂载实例） */
    add(): Cesium.PostProcessStage {
        if (this.stage) return this.stage;
        this.stage = new Cesium.PostProcessStage({
            name: this.name,
            uniforms: this.uniforms,
            fragmentShader: this.shader
        });
        getViewer().scene.postProcessStages.add(this.stage);
        return this.stage;
    }

    /** 从场景移除并销毁 */
    remove(): void {
        if (!this.stage) return;
        getViewer().scene.postProcessStages.remove(this.stage);
        this.stage.destroy();
        this.stage = undefined;
    }
}

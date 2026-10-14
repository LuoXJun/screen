/** BIM 模型（3D Tiles）加载配置 */
export const BIM_TILESET_CONFIG = {
    /** 图层名（图层池标识） */
    layerName: 'bimModel',
    /** tileset 入口（public 下相对路径；中文目录经 encodeURI 编码） */
    url: encodeURI('bim模型/tileset.json'),
    /** 就绪后缩放到模型的飞行时长（秒） */
    focusDuration: 2
};

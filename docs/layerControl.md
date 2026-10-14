# 图层管理模块设计总结

## 模块定位

图层管理是大屏项目的基础能力：**以配置驱动的图层清单统一管理地图上所有可显隐的对象**（设备实体、影像底图、热力图等），任何页面都可见、勾选状态跨路由保留。

> 早期设计为 el-tree 图层树方案（父子联动 / 半选 / 设备节点），未落地实现；现以清单勾选版为准（见「关键决策记录」）。

## 架构分层

```
views/layout/index.vue                      ← 全局布局（导航 / 地图 / 站点切换 / 图层管理 / 子页面出口）
└── composables/useLayerControl.ts          ← 图层清单（LAYER_ITEMS）+ 勾选态 + 显隐联动

components/screen/layerControl/             ← 面板组件（通用受控组件）
├── layerControl.vue                        ← 渲染：list + v-model
└── layerControl.d.ts                       ← LayerControlItem 类型

cesium/layers/                              ← 图层池与契约
├── types.ts                                ← MapLayer / ItemLayer 契约
├── manager.ts                              ← 图层池（按 name 管理）
├── factory.ts                              ← 工厂注册制（内置注册 icon / imagery / heatmap）
└── builtin/                                ← 内置图层实现（entityLayerBase / icon / imagery / heatmap / geoJson / tileset）
```

- **App.vue 只保留 RouterView 出口**；全局元素（导航、地图、站点切换、图层管理）收敛在 `views/layout/`，子路由切换不卸载，地图与图层状态跨页面保留。
- **配置跟随使用方**：布局级配置放 `views/layout/`（如 `composables/useLayerControl.ts`），页面私有组件配置放各自页面目录。
- **定位**：绝对定位贴左栏右侧——左缘 = 内容左缘 + `--lxj-aside-width`，顶缘 = 内容顶缘 + `--lxj-aside-top-offset`
  （避让值与站点切换同源，定义在 `.content` 共同祖先上供侧栏 / 站点切换 / 图层管理共用）。

## 配置驱动

```ts
/** views/layout/composables/useLayerControl.ts */
const LAYER_ITEMS: LayerControlItem[] = [
    { label: '红线范围', value: 'redline' },
    { label: '升压站', value: 'station' },
    { label: '分区情况', value: 'zone' }
    // ...
];

/** components/screen/layerControl/layerControl.d.ts */
export interface LayerControlItem {
    /** 图层名（显示文案） */
    label: string;
    /** 图层标识（v-model 选中值） */
    value: string;
}
```

- 清单即配置：面板只渲染 `list` 与 `title`，新增可选项只改 `LAYER_ITEMS`，组件零改动。
- `value` 即图层池中的图层名，勾选值与图层显隐一一对应。
- 勾选初值还原设计稿（组串布置选中）；初始显隐由图层注册时的 `config.visible` 决定，`watch` 非 immediate。

## 显隐联动

- **受控组件**：`v-model`（string[] 勾选值）与 `list` 均由使用方传入，组件自身零状态。
- **单向同步**：勾选态是唯一事实来源，`watch` 勾选变化 → 逐项 `setLayerVisible(name, values.includes(name))`，不做反向同步。
- **未注册静默跳过**：`layerPool.get(name)?.setVisible(...)`，业务图层未注册时开关不报错，注册后自动生效——面板可先于图层接入上线。

## 定位能力（图层级）

- 契约提供 `getBounds(): Rectangle | undefined`：图层内容的经纬范围——影像层取 `provider.rectangle`，热力图取区域 bbox，实体层与 geoJson 层按几何采样点算外接矩形，tileset 层由模型外接球换算；无内容返回 `undefined`。
- 图层池提供 `focusLayer(name, duration?)`：取范围 → 相机 flyTo 到矩形；未注册/无范围与显隐同款静默跳过。
- 粒度到图层级；面板 UI 暂未上（点击项名定位待设计稿确认），设备级定位待 `ItemLayer` 扩展后再议。

## 图层池与契约

- `MapLayer`：显隐 + 数据 + 范围 + 生命周期（`setVisible/isVisible/getBounds/setData/clear/destroy`）；`ItemLayer<T>` 子接口追加条目级（设备级）显隐与条目清单，底图层只实现 `MapLayer`。
- **工厂注册制**：新增图层类型只需 `registerLayerFactory`，管理器零改动；内置五类：
    - `icon`：图标设备（一设备一实体，支持条目级显隐）
    - `imagery`：影像底图（把 core/layer 影像池包装为 MapLayer 契约）
    - `heatmap`：温度热力图（多边形区域 + 温度色条渲染，贴图入影像池）
    - `geoJson`：GeoJSON 矢量（点线为 Entity、面为贴地 GroundPrimitive，可贴合地形与倾斜模型；`url` 加载或内联 `data`，全量替换语义）
    - `tileset`：倾斜摄影 3D Tiles（`fromUrl` 异步加载，就绪信号 `ready`；显隐 + 模型外接球换算定位；`translateTo` 支持工程坐标模型平移到目标经纬度落位；站点场景每站一实例，由业务编排层按站点切换）
- `EntityLayerBase`：Entity 型图层公共基类，统一管理实体集合与层级显隐（图层级 × 条目级叠加生效），子类只实现 `createEntity`。
- 实体 id 约定 `{图层名}::{条目 id}` 全局唯一；`removeAllLayers` 供卸载时调用防泄漏。

## 关键决策记录

| 决策       | 结论              | 说明                                                                                                          |
| ---------- | ----------------- | ------------------------------------------------------------------------------------------------------------- |
| 挂载位置   | 全局布局          | 面板挂 `views/layout/`，任何页面可见；曾随设计稿迁至 overview 页面级，后回归全局（勾选状态随之跨路由保留）    |
| 面板形态   | 清单勾选版        | 树版（el-tree）为早期设计方案未落地；条目级契约 API（ItemLayer）保留在图层层，面板需要时再上浮                |
| 联动实现   | 单向（勾选→图层） | 勾选态为唯一事实来源，无外部代码反向写勾选                                                                    |
| 定位能力   | 图层级预埋        | `MapLayer.getBounds()` + 图层池 `focusLayer`（取范围 → 相机 flyTo）先就位；面板 UI 后置，设备级定位待 ItemLayer 扩展 |
| 刷新持久化 | 不做              | 配置驱动场景刷新 = 重置为配置默认值是合理语义；需要时再加 localStorage（持久化 > 配置默认，key 失效静默忽略） |
| 配置位置   | 跟随使用方        | 面板清单配置放使用方目录（布局 → `views/layout/composables/`），避免多页面配置堆叠在全局目录                  |

## 踩坑记录

- **addLayer 先删后建**：实体 id 全局唯一，同名替换必须先销毁旧图层释放 id，否则新图层创建即冲突（曾以「先建后换」引入此回归）。
- **避让变量继承**：`--lxj-aside-top-offset` 须定义在所有使用方的共同祖先（`.content`）上；自定义属性沿 DOM 树继承，挂在 `.screen` 上会导致 `.screen` 之外的站点切换 / 图层管理读不到。
- **页面级 → 全局的位置换算**：页面内定位相对 baseOverlay 中列（`left: 0` 即左 aside 右缘）；全局无 flex 载体，换算为 `内容左缘 + --lxj-aside-width`，顶部避让同理（实测与页面级像素对齐）。
- **3D Tiles 内容定位**：tileset.json 的 `transform` 决定内容局部原点在世界中的落点；缺失 transform 时内容落在 ECEF 原点附近（加载成功、`tilesLoaded` 为 true，但画面看不见）。真实倾斜数据的 transform 由转换工具生成，自建测试数据须显式给 transform。

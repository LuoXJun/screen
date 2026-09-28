# 图层管理模块设计总结

## 模块定位

图层管理是大屏项目的基础能力：**以配置驱动的图层树统一管理地图上所有可显隐的对象**（设备实体、影像底图等），任何页面都可见、状态跨路由保留。

## 架构分层

```
views/layout/index.vue（布局路由：导航 / 地图 / 图层管理 / 子页面出口）
├── config/layerControl.ts        ← 图层管理配置（跟随布局组件）
├── components/layerControl/      ← 面板组件
│   ├── LayerControlPanel.vue     ← 树渲染 + 勾选单向同步图层
│   └── types.ts                  ← LayerTreeNode / LayerControlConfig
└── cesium/layers/                ← 图层池与契约
    ├── types.ts                  ← MapLayer / ItemLayer 契约
    ├── manager.ts                ← 图层池（按 name 管理）
    ├── factory.ts                ← 工厂注册制
    └── builtin/                  ← 内置图层（icon / imagery）
```

- **App.vue 只保留 RouterView 出口**；全局元素（导航、地图、图层控制）收敛在 `views/layout/`，子路由切换不卸载，地图与图层状态跨页面保留。
- **配置跟随使用方**：布局组件的配置在 `views/layout/config/`，页面私有组件配置放各自页面目录。

## 配置驱动

```ts
export interface LayerControlConfig {
    layers: { type: LayerType; name: string; config?: Record<string, unknown> }[]; // 图层初始化列表
    tree: LayerTreeNode[]; // 图层树结构
}
```

- 树节点**层级任意**（区域 → 类别 → 设备集 → 设备…），节点可选绑定 `layerName`（整层）与 `itemId`（层内条目）；纯容器节点只做聚合。
- 节点 `visible` 字段声明**初始显隐**（默认 true），树的初始勾选与图层初始状态都由它推导。
- 底图（影像）与实体图层同构：`imagery` 内置类型把影像池包装为 MapLayer，可挂任意层级。

## 显隐联动

- 使用 el-tree 自带 `show-checkbox`：父子联动、半选、级联全选全由框架内置。
- **勾选状态是唯一事实来源，单向同步图层**（check 事件 → 按节点 id 集合写图层显隐），不做反向同步。
- 半选节点视为图层可见（部分子级可见时父级图层必须显示）。
- 初始勾选只收集**叶子节点**（父级勾选会级联全选子级），祖先任一 `visible: false` 则整枝跳过；初始显隐同步继承祖先可见性，防止子级把父级隐藏的图层重新打开。

## 图层池与契约

- `MapLayer`：显隐 + 数据 + 生命周期；`ItemLayer<T>` 子接口追加条目级显隐（设备级），底图层只实现 `MapLayer`。
- 工厂注册制：新增图层类型只需 `registerLayerFactory`，管理器零改动。
- `addLayer` 同名自动替换，**先删后建**：实体 id 全局唯一（`{图层名}::{条目id}`），同名替换必须先释放旧 id，否则新图层创建即冲突（此前"先建后换"曾引入此回归）。

## 关键决策记录

| 决策       | 结论              | 说明                                                                                                                      |
| ---------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 联动实现   | el-tree 原生      | 曾自研勾选联动，与 el-tree 克隆渲染机制冲突且重复造轮子；用户纠正后回归框架能力                                           |
| 状态同步   | 单向（树 → 图层） | 曾顾虑双向同步/状态重置，实际控制方向天然单向，无外部代码反向写图层                                                       |
| 刷新持久化 | 不做              | 配置驱动场景刷新 = 重置为配置默认值是合理语义；工作台场景将来可按需加 localStorage（持久化 > 配置默认，key 失效静默忽略） |
| 配置位置   | 跟随使用方        | 组件配置放使用方目录（布局 → `views/layout/config/`），避免多页面配置堆叠在全局目录                                       |
| 菜单数据   | 路由派生          | BaseMenu 从布局路由子路由（meta.title + path）生成菜单项，新增页面只改路由                                                |

## 踩坑记录

- **el-tree 半选调试**：半选 class `is-indeterminate` 在 `.el-checkbox__input` 上而非 `.el-checkbox` 根元素，查错位置曾导致误判"联动失效"，绕了弯路。
- **el-tree 克隆渲染**：面板内对 `props.data` 原数组的修改不驱动渲染（el-tree 内部克隆），交互必须操作 slot data / 框架状态。
- **el-menu 折叠**：横向菜单默认 `ellipsis` 折叠，宽度测量异常时菜单项被收进"..."，需 `:ellipsis="false"` + `flex-shrink: 0`。
- **HMR 生命周期**：`onMounted` 在 HMR 重载后不重跑，初始化逻辑（图层创建/状态同步）需在 watch 配置变化时补执行。

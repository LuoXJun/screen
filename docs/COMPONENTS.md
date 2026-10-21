# 组件词表

收录已核实的现有组件与函数式 API；未列出的组件使用前请先读源码。

## 总则

1. **先查词表再动手**：能复用不新写；页面内禁止重复实现已有组件。
2. 新增组件放 `src/components/baseXxx/`，专用类型/配置与组件同目录（参考 `baseTable/config.d.ts`、`baseTabs/baseTabs.ts`）。
3. EP 组件二次封装要素：类型化 props、`v-bind="$attrs"` 透传、业务默认值、样式覆盖只写在封装内（详见 `styles-规范.md`）。
4. 组件内置图片统一经 `getImageWidthName()`（`@/utils/getAssets`）解析，参数为 `src/assets/images/` 下文件名。
5. 禁止在页面直接使用 `el-table` / `el-tabs` / `ElMessageBox.confirm`。
6. 青底描边小按钮统一加 `.btn-cyan-ghost` 变体类，不再逐页复制 `--el-button-*`。

## 通用组件

| 组件名            | 路径                                            | 用途                       | 关键 props / API                                                                 | 使用约束                                                                 |
| ----------------- | ----------------------------------------------- | -------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| baseTable         | `src/components/baseTable/baseTable.vue`        | 配置驱动表格               | `v-model` 数据；`tableColumn`；`options`；`pageInfo`；`selection`；`index`；`variant`；`rowKey`；`highlightCurrentRow` | 操作列 `filed` 必须为 `'operation'`；单元格插槽名 = 列 `filed`；操作按钮支持 `confirm.mode: 'popover' \| 'messageBox'`；禁止页面裸写 `el-table` |
| basePagination    | `src/components/base-pagination/base-pagination.vue` | 分页                  | `v-model` = `PageInfo`；`pageSizes`（默认 `[10,20,30,50]`）；`layout`；`variant`；`size`；`background`；`disabled` | `pageInfo` 必须含 `pageNum` / `pageSize` / `total`；事件 `handleChange(type, value)`；与 `usePageTable` 配合 |
| baseTabs          | `src/components/baseTabs/baseTabs.vue`          | 页签 / 筛选项              | `v-model` 当前值；`items: { label, value }[]`；`variant?: 'underline' \| 'panel' \| 'overlay'` | 禁止使用 `el-tabs`；`panel` = 巡检面板渐变页签，`overlay` = 视频画面贴底页签；`value` 为选中标识 |
| baseDialog        | `src/components/baseDialog/baseDialog.vue`      | 大屏弹窗                   | `v-model` 显隐；`title`；`icon`（图片文件名）；`buttons`；`variant?: 'default' \| 'compact'` | 内置头部与关闭按钮（`show-close=false`）；`#footer` 插槽存在时优先于 `buttons`；按钮点击抛 `action(button, index)`；关闭完成抛 `close`；`variant="compact"` 为 390 宽小尺寸表单弹窗（阈值修改），紧凑头部/内衬与按钮区 |
| messageBox        | `src/components/baseMessageBox/index.ts`        | 命令式确认框               | `messageBox(options): Promise<void>`                                              | 取消时 Promise **reject**，调用方需 `try/catch`；禁止 `ElMessageBox.confirm` |
| basePopover       | `src/components/basePopover/basePopover.vue`    | 气泡确认                   | `v-model` 显隐；`content`；`title`；`type`；`placement`；事件 `on-confirm`         | 面板尺寸固定 352×124；用于表格操作列等轻确认场景                         |
| baseOverlay       | `src/components/baseOverlay/baseOverlay.vue`    | 大屏三栏布局               | 插槽 `#left` / 默认（主区）/ `#right`                                             | 侧栏宽 `--lxj-aside-width`；页面可用 `--lxj-page-aside-width` 覆盖左栏宽  |
| BaseChart         | `src/components/baseChart/BaseChart.vue`        | ECharts 容器               | `option`（初始化）；`autoResize`（默认 `true`）；`initOptions`；暴露 `getChart` / `setOption(option, replace)` / `resize` | 后续更新用 `setOption`，不要重建组件；echarts 已按需注册（`echarts.ts`） |
| BaseCesium        | `src/components/baseCesium/BaseCesium.vue`      | Cesium 地球容器            | 无 props                                                                          | 容器宽高 100%，父级负责尺寸；组件自动初始化/清理 Viewer，HMR 下保留状态  |
| baseCardList      | `src/components/baseCardList/baseCardList.vue`  | 图标卡片列表               | `list: BaseCardListItem[]`（`name` / `imgName` / `text`）                         | 图片名传 assets 文件名；默认插槽可替换描述文本                           |
| baseStatList      | `src/components/baseStatList/baseStatList.vue`  | 统计指标条                 | `list?` / `rows?`：`BaseStatListItem[]`（`label` / `icon?` / `value` / `unit` / `valueColor` / `note` / `noteType`）；`variant?: 'grid'`；`divider?`（分隔图文件名） | 单行用 `list`，多行/两排用 `rows` + `variant="grid"`；`icon` 缺省不渲染；`noteType: 'trend'` 时显示上升箭头（`'todo'` 为待办样式） |
| baseSectionTitle  | `src/components/baseSectionTitle/baseSectionTitle.vue` | 区块标题（青色竖条） | `title`；`extra?`；`size?: 'desc' \| 'lg'`                                         | `extra` 为右侧橙色附加文本（如「总计 5」）；`size="desc"` 为 12px 紧凑档，`size="lg"` 为 16px 详情档 |
| basePanelCard     | `src/components/basePanel/basePanelCard.vue`    | 面板卡片容器               | 默认插槽                                                                          | 背景 `--lxj-bg-card`、描边 `--lxj-color-border-primary-light`，勿在页面重复实现 |
| baseEmpty         | `src/components/baseEmpty/baseEmpty.vue`        | 面板空状态占位             | `title`；`description?`；`icon?`（assets 图片名，默认 `drone-empty.svg`）          | 撑满父级内容区；未选中/无数据时替换面板内容，勿逐页复制虚线占位样式      |

## 面板与菜单

| 组件名                   | 路径                                              | 用途                     | 关键 props / API                                      | 使用约束                                                                 |
| ------------------------ | ------------------------------------------------- | ------------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------ |
| basePanelMask            | `src/components/basePanel/basePanelMask.vue`      | 可收起面板容器           | `collapsible?: boolean`（默认 `false`）；默认插槽      | 内部维护 `collapsed` 并渲染把手；上下内衬变量 `--lxj-panel-space-y`；slot 直挂根节点，消费方可做 flex 限高滚动 |
| basePanelTitle           | `src/components/basePanel/basePanelTitle.vue`     | 面板标题                 | `title: string`；默认插槽（右侧附加内容）             | 使用 `--lxj-font-family-title` / `--lxj-font-panel-title`                |
| basePanelHandle          | `src/components/basePanel/basePanelHandle.vue`    | 收起/展开把手            | `collapsed?: boolean`；事件 `toggle`                  | 一般由 basePanelMask 内部使用；自带键盘（Enter/Space）与 aria 支持        |
| baseMenu                 | `src/components/baseMenu/baseMenu.vue`            | 侧栏菜单                 | 无 props                                              | 自动读取 `menuRoutes` 与当前路由；布局组件使用，页面不要直接实例化        |
| baseMenuHorizontalAside  | `src/components/baseMenu/baseMenuHorizontalAside.vue` | 菜单项递归渲染        | `list: RouteRecordRaw[]`                              | 内部使用；按 `meta.title` / `meta.isHidden` 过滤                          |

## 大屏业务组件（`src/components/screen/`）

| 组件名 / API       | 路径                                              | 用途                     | 关键 props / API                                      | 使用约束                                                                 |
| ------------------ | ------------------------------------------------- | ------------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------ |
| layerControl       | `screen/layerControl/layerControl.vue`            | 图层勾选面板             | `v-model` = `string[]`；`list: LayerControlItem[]`（`label` / `value`）；`title`（默认「图层管理」） | 基于 basePanelMask + baseSectionTitle；勿另写复选框面板                  |
| siteSwitch         | `screen/siteSwitch/siteSwitch.vue`                | 站点切换按钮组           | `v-model` = `SiteKey`（默认 `'xianfeng'`）            | 数据源为 `@/config/site` 的 `SITE_LIST`；地图联动见 `useSiteSwitch`       |
| siteButton         | `screen/siteSwitch/siteButton.vue`                | 站点按钮（装饰光晕）     | `label`；`active`；事件 `click`                       | 内部组件，经 siteSwitch 使用                                             |
| showMapPopup       | `screen/mapPopup/mapPopup.ts`                     | 命令式地图弹窗           | `position`（经纬高或 Cartesian3）；`title`；`width`；`height`；`draggable`；`content`（VNode 或文本）；`onConfirm`；`onClose`；返回 `{ close() }` | 轻量信息用本函数；大内容（视频等）用 baseDialog；弹窗锚点随相机联动      |
| popupPanel         | `screen/mapPopup/popupPanel.vue`                  | 通用弹窗面板             | `v-model` 显隐；`title`；`width`；`height`；`draggable`；事件 `close`；默认 + `#footer` 插槽 | 默认 fixed 定位；地图场景请用 showMapPopup，不要直接实例化               |
| MapPopupPanel      | `screen/mapPopup/MapPopupPanel.vue`               | 地图锚点弹窗（内部）     | `title`；`width`；`height`；`draggable`；`content`    | 内部组件，由 showMapPopup 挂载，不直接使用                               |
| DeviceInfo         | `screen/popups/device/DeviceInfo.vue`             | 设备信息双列网格         | `items: DeviceInfoItem[]`（`icon?` / `label` / `value` / `valueClass` / `valueColor`）；`showIcon?`；`variant?: 'grid'` | 设备弹窗通用信息区；`variant="grid"` + `showIcon=false` 用于面板内紧凑信息区 |
| DeviceStatusTag    | `screen/popups/device/DeviceStatusTag.vue`        | 在线/离线状态标签        | `status: 'online' \| 'offline'`                       | 放在 baseDialog 的 `#header-extra` 插槽                                   |
| CameraPopup        | `screen/popups/camera/CameraPopup.vue`            | 监控设备弹窗             | `data: CameraData`；事件 `close`                      | 由 `useEntityPopup` 按实体类型调度，页面不直接实例化                      |
| FiberPopup         | `screen/popups/fiber/FiberPopup.vue`              | 光纤测温弹窗             | `data: FiberData`；事件 `close`                       | 含温度卡 + 趋势图；同样经 `useEntityPopup` 调度                           |
| NestPopup          | `screen/popups/nest/NestPopup.vue`                | 无人机巢弹窗             | `data: NestData`；事件 `close`                        | 含状态六宫格 + 任务进度；经 `useEntityPopup` 调度                         |

## 实体弹窗调度

`src/views/layout/composables/useEntityPopup.ts` 统一监听地图左键：

- 选项：`contents?: Record<string, EntityClickHandler>`（按 `entity.properties.type` 分发）、`fallback?`。
- 回调上下文：`entity` / `position` / `lonlat` / `props`。
- 轻量信息用 `showMapPopup` 锚点卡；大内容（视频等）用 `baseDialog`。

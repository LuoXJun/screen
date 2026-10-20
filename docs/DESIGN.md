# 设计规范（令牌字典）

本文是令牌的**唯一字典**，列出现有全部语义名称与取值。样式链结构、EP 定制决策树、补丁层工作流等流程规范见 [`styles-规范.md`](./styles-规范.md)，两者冲突时以代码（`src/styles/`）为准。

## 铁律

1. **新代码只能引用下表中的语义名称（`--lxj-*`），不得写死数值。**
2. 语义层缺档位时才允许退回原始值层（`--color-*` / `--space-*` 等），并注释设计稿原值。
3. 混色派生以语义令牌为基：`color-mix(in srgb, var(--lxj-color-primary) 18%, transparent)`，禁止写死 hex/rgb。
4. 业务代码不直接消费 `--el-*`；它只由绑定层（`--el-*: var(--lxj-*)`）消费。
5. 业务自建浮层 `z-index` 必须 < 2000（EP 弹层池从 2000 起分配）。

## 加载与作用域

- 唯一入口：`main.ts` → `src/styles/index.scss`（顺序：EP → tokens → base → EP 绑定 → patch → utilities）。
- `:root` 为共享默认；`html[data-app='screen']` / `html[data-app='admin']` 由 `_screen.scss` / `_admin.scss` 覆盖。
- 两端当前均 `@include adaptive-skeleton`，只覆盖尺寸类语义（字号/间距/骨架）；颜色类语义两端相同，取 `:root` 默认。

## 颜色

### 原始色板（`--color-*`，仅语义层引用）

| 名称               | 取值      |     | 名称                | 取值      |
| ------------------ | --------- | --- | ------------------- | --------- |
| `--color-white`    | `#ffffff` |     | `--color-blue-50`   | `#e8f4ff` |
| `--color-gray-100` | `#f2f3f5` |     | `--color-blue-100`  | `#e2e8f0` |
| `--color-gray-200` | `#dcdfe6` |     | `--color-blue-200`  | `#c3e2fa` |
| `--color-gray-300` | `#c0c4cc` |     | `--color-blue-300`  | `#7ab8d4` |
| `--color-gray-400` | `#909399` |     | `--color-blue-400`  | `#0266f0` |
| `--color-gray-500` | `#a8abb2` |     | `--color-blue-500`  | `#4a7a9b` |
| `--color-gray-700` | `#606266` |     | `--color-blue-700`  | `#334155` |
| `--color-gray-900` | `#303133` |     | `--color-blue-750`  | `#0d2458` |
| `--color-green-400` | `#00e080` |    | `--color-blue-800`  | `#081940` |
| `--color-orange-400` | `#ffc840` |   | `--color-blue-900`  | `#071428` |
| `--color-orange-450` | `#f5a623` |   | `--color-red-400`   | `#ff6060` |
| `--color-orange-500` | `#ff8904` |   | `--color-red-500`   | `#e03030` |
| `--color-cyan-400`  | `#00c8ff` |    |                     |           |

### 语义色（`--lxj-*`，业务只引用这一层）

| 名称                                    | 取值                                             |
| --------------------------------------- | ------------------------------------------------ |
| `--lxj-color-primary`                   | `var(--color-cyan-400)` → `#00c8ff`              |
| `--lxj-color-success`                   | `var(--color-green-400)` → `#00e080`             |
| `--lxj-color-warning`                   | `var(--color-orange-500)` → `#ff8904`            |
| `--lxj-color-danger`                    | `var(--color-red-400)` → `#ff6060`               |
| `--lxj-color-info`                      | `var(--color-gray-400)` → `#909399`              |
| `--lxj-color-text-primary`              | `var(--color-blue-300)` → `#7ab8d4`              |
| `--lxj-color-text-desc`                 | `var(--color-white)` → `#ffffff`                 |
| `--lxj-color-text-active`               | `var(--color-cyan-400)` → `#00c8ff`              |
| `--lxj-color-text-placeholder`          | `var(--color-gray-500)` → `#a8abb2`              |
| `--lxj-color-text-disabled`             | `var(--color-gray-300)` → `#c0c4cc`              |
| `--lxj-bg-bar`                          | `var(--color-blue-800)` → `#081940`              |
| `--lxj-bg-page`                         | `var(--color-blue-800)` → `#081940`              |
| `--lxj-bg-card`                         | `color-mix(in srgb, var(--color-blue-750) 40%, transparent)` |
| `--lxj-bg-panel`                        | `var(--color-white)` → `#ffffff`                 |
| `--lxj-bg-overlay`                      | `var(--color-white)` → `#ffffff`                 |
| `--lxj-bg-hover`                        | `var(--color-gray-100)` → `#f2f3f5`              |
| `--lxj-bg-active`                       | `color-mix(in srgb, var(--lxj-color-primary) 10%, var(--color-white))` |
| `--lxj-bg-mask`                         | `rgb(from var(--color-blue-900) r g b / 85%)`    |
| `--lxj-fill-blank`                      | `var(--color-white)` → `#ffffff`                 |
| `--lxj-color-border`                    | `var(--color-gray-200)` → `#dcdfe6`              |
| `--lxj-color-border-primary`            | `var(--lxj-color-primary)` → `#00c8ff`           |
| `--lxj-color-border-primary-light`      | `color-mix(in srgb, var(--lxj-color-primary) 30%, transparent)` |
| `--lxj-color-border-light`              | `color-mix(in srgb, var(--color-white) 40%, transparent)` |
| `--lxj-color-border-strong`             | `var(--color-gray-300)` → `#c0c4cc`              |
| `--lxj-shadow-panel`                    | `0 1px 4px rgb(0 0 0 / 8%)`                      |
| `--lxj-shadow-overlay`                  | `0 8px 24px rgb(0 0 0 / 12%)`                    |

## 字号与字体

| 名称                     | `:root` 默认 | 挂 `html[data-app]` 后 |
| ------------------------ | ------------ | ---------------------- |
| `--lxj-font-hero`        | `32px`       | `font(40px)`           |
| `--lxj-font-title`       | `24px`       | `font(32px)`           |
| `--lxj-font-subtitle`    | `18px`       | `font(24px)`           |
| `--lxj-font-section`     | `16px`       | `font(18px)`           |
| `--lxj-font-panel-title` | 未定义       | `font(16px)`（仅自适应骨架） |
| `--lxj-font-body`        | `14px`       | `font(14px)`           |
| `--lxj-font-desc`        | `12px`       | `font(12px)`           |

原始字号档位：`--font-12/14/16/18/24/32/48`。

| 名称                         | 取值                    |
| ---------------------------- | ----------------------- |
| `--lxj-font-family`          | `var(--font-family-PingFang)` → `'PingFang SC'` |
| `--lxj-font-family-title`    | `var(--font-family-YouSheBiaoTiHei)` → `'YouSheBiaoTiHei'` |
| `--lxj-font-family-num`      | `var(--font-family-DDIN)` → `'D-DIN'` |
| `--lxj-font-weight`          | `400`                   |
| `--lxj-font-weight-Medium`   | `500`                   |
| `--lxj-font-weight-Semibold` | `600`                   |
| `--lxj-font-weight-bold`     | `700`                   |

原始字体族另有 `--font-family-TCloud`（`'TCloud Number'`）。字重后缀大小写照抄，勿自行改名。

## 间距与字距

| 名称                     | `:root` 默认 | 挂 `html[data-app]` 后 |
| ------------------------ | ------------ | ---------------------- |
| `--lxj-space-page`       | `16px`       | `base(10px)`           |
| `--lxj-space-panel`      | `8px`        | `base(12px)`           |
| `--lxj-space-top`        | `8px`        | `base(8px)`            |
| `--lxj-space-overlay`    | `20px`       | `base(20px)`           |
| `--lxj-gap-little`       | `4px`        | 不变                   |
| `--lxj-gap-middle`       | `8px`        | 不变                   |
| `--lxj-gap-large`        | `12px`       | 不变                   |
| `--lxj-gap-oversize`     | `16px`       | `base(16px)`           |
| `--lxj-gap`              | 未定义       | `base(10px)`（仅自适应骨架） |

原始间距档位：`--space-4/8/12/16/20/24/32`、`--gap-4/8/12/16`。

| 名称                          | 取值              |
| ----------------------------- | ----------------- |
| `--lxj-letter-spacing-little` | `var(--letter-spacing-2)` → `2px` |
| `--lxj-letter-spacing-middle` | `var(--letter-spacing-4)` → `4px` |
| `--lxj-letter-spacing-large`  | `var(--letter-spacing-6)` → `6px` |
| `--lxj-letter-spacing-oversize` | `var(--letter-spacing-8)` → `8px` |

## 圆角与布局尺寸

| 名称                    | `:root` 默认 | 挂 `html[data-app]` 后 |
| ----------------------- | ------------ | ---------------------- |
| `--lxj-radius-small`    | `4px`        | 不变                   |
| `--lxj-radius-base`     | `6px`        | 不变                   |
| `--lxj-radius-round`    | `20px`       | 不变                   |
| `--lxj-radius-circle`   | `50%`        | 不变                   |
| `--lxj-header-height`   | `50px`       | `base(52px)`           |
| `--lxj-footer-height`   | `40px`       | 不变                   |
| `--lxj-sidebar-width`   | `180px`      | `base(180px)`          |
| `--lxj-aside-width`     | 未定义       | `base(320px)`（仅自适应骨架） |

原始圆角档位：`--radius-4/6/8/12/20/half`。

## 层级

| 名称                  | 取值  | 用途                         |
| --------------------- | ----- | ---------------------------- |
| `--lxj-z-sticky`      | `100` | 吸顶                         |
| `--lxj-z-map-popup`   | `950` | 地图浮窗（低于操作层）       |
| `--lxj-z-dropdown`    | `1000`| 下拉                         |
| `--lxj-z-mask`        | `1100`| 遮罩                         |
| `--lxj-z-modal`       | `1200`| 弹窗                         |
| `--lxj-z-toast`       | `1300`| 轻提示                       |
| `--lxj-z-loading`     | `1400`| 加载                         |

## 自适应换算

- `--screen-base`：设计中心 1920，`clamp(1600px, 100vw, 3840px)`；`--screen-base-min/max/design` 为无单位边界值，供 JS 侧（`baseChart/screenScale.ts`）复算。
- `base(设计px)` = 设计稿 px × (`--screen-base` / 1920)，用于版式骨架。
- `font(设计px)` = `max(design×0.5+4px, base(设计px))`，用于字号可读性下限。
- 调用必须传带单位的 px；自定义属性内必须写 `#{base(80px)}`；`tokens/` 内 partial 需自行 `@use './functions' as *`。

## 新增令牌

1. 纯值先加到 `tokens/_primitive.scss`；
2. 语义映射加到 `tokens/_semantic.scss`（两端差异才加到 `_admin.scss` / `_screen.scss`）；
3. 新类名/工具类只允许 `lxj-` 前缀；
4. 修改后跑 `pnpm build` 验证 SCSS 编译与类型检查。

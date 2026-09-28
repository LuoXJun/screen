# base-screen-template

Vue 3 + TypeScript + Vite 基础大屏项目模板

## 包管理器（仅允许 pnpm）

本项目通过四重机制约束包管理器与运行环境：

1. **Corepack 版本校验**：`package.json` 中的 `"packageManager": "pnpm@11.21.0"` 字段，Corepack 会校验 pnpm 版本是否一致
2. **依赖安装拦截**：`preinstall` 钩子调用 `node scripts/check-package-manager.cjs`，使用 npm / yarn / bun 执行依赖安装时直接报错退出（不依赖网络）
3. **pnpm 自身版本校验**：`.npmrc` 中的 `package-manager-strict=true`，pnpm 运行时校验 `packageManager` 字段，版本不匹配则拒绝执行
4. **Node 版本约束**：`engines.node`（`^20.19.0 || >=22.12.0`，vite 8 的最低要求）+ `.npmrc` 中的 `engine-strict=true`，Node 版本不满足时拒绝安装

> 注：`npm install --ignore-scripts` 可跳过 preinstall 钩子（包管理器设计如此，仓库侧无法阻止），如需彻底防止，请在 CI 中统一使用 pnpm 执行安装。

### 为什么不要用 npm i？（npm ≤ 11）

npm ≤ 11 不检查 `packageManager` 字段，且执行顺序为「先联网解析依赖树 → 再执行 preinstall 拦截」，因此 `npm i` 会先长时间联网转圈（看起来像卡死），之后才被拦截报错；若本地 `node_modules` 由 pnpm 安装（`.pnpm/` 结构），npm 的 arborist 读不懂该布局，还会直接崩溃（`Cannot read properties of null`）。**请使用 `pnpm install` / `pnpm add`。**

在 **npm 12+** 中，root `preinstall` 已提前到依赖安装之前执行，`npm i` 会在联网解析前被拦截脚本直接报错退出（实测约 2 秒）。环境要求：Node `^22.22.2 || ^24.15.0 || >=26.0.0` + `npm install -g npm@12`（nvm-windows 下每个 Node 版本的全局 npm / pnpm 相互独立，切换 Node 后需重新安装：`npm install -g npm@12 pnpm@11.21.0`）。

> 注：`.npmrc` 中的 `package-manager-strict` 为 pnpm 专属配置（校验 `packageManager` 版本），npm 会提示 unknown config 警告，不影响使用。

## 快速开始

```bash
pnpm install     # 安装依赖（仅允许 pnpm，约束机制见上一章节）
pnpm dev         # 启动开发服务器，默认 http://localhost:3005
pnpm build       # 类型检查 + 生产构建（产物在 dist/）
```

## 常用命令

| 命令             | 说明                                                                  |
| ---------------- | --------------------------------------------------------------------- |
| `pnpm dev`       | 启动 Vite 开发服务器（端口 3005，`/user` 前缀代理到后端）             |
| `pnpm build`     | `vue-tsc -b` 全量类型检查 + 生产构建                                  |
| `pnpm preview`   | 预览构建产物                                                          |
| `pnpm lint`      | ESLint 检查 + knip 死代码扫描                                         |
| `pnpm knip`      | 仅死代码扫描（unused 提示属正常，见「迁移的外部代码」章节说明）       |
| `pnpm formatSrc` | Prettier 格式化 `src/`                                                |
| `pnpm format`    | Prettier 格式化全项目                                                 |
| `pnpm analyze`   | vue-mess-detector 代码自检（配置见 `.config/vue-mess-detector.json`） |

## 编辑器插件（VSCode）

以下扩展建议全部安装：

| 插件                      | 扩展 ID                             | 作用与安装原因                                                                                                                                                                                                                            |
| ------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vue - Official (Volar)    | `Vue.volar`                         | 项目为 Vue 3 + TS + SFC，`.vue` 单文件组件的模板类型提示、跳转、补全全依赖它；类型检查链路 `vue-tsc` 也以它为语言服务底座。**不要安装已废弃的 Vetur**，两者共存会互相干扰。                                                               |
| ESLint                    | `dbaeumer.vscode-eslint`            | 实时应用 `eslint.config.ts` 的团队硬性约束（`max-lines-per-function` 100 行、`max-depth` 3 层、`curly` 等），编辑器内即时报错，避免提交时批量返工。                                                                                       |
| Prettier                  | `esbenp.prettier-vscode`            | 按 `.prettierrc.mjs` 统一格式（4 空格缩进、单引号、100 列、LF）。安装后需设为默认格式化工具（右键 → 格式化文档 → 配置默认格式化程序）。配置刻意用 `.mjs` 而非 `.ts`：TS 配置依赖 Node 22.18+ 的原生 TS 支持，而 VSCode 扩展跑在自带的 Electron Node 上、版本往往偏低，会导致格式化静默失效。 |
| CSS Variable Autocomplete | `vunguyentuan.vscode-css-variables` | 本项目样式体系以 CSS 变量令牌驱动（`--lxj-*` 语义令牌、`--el-*` 绑定层），该扩展提供变量补全、颜色预览与 Ctrl+点击跳转定义。`.vscode/settings.json` 已为其配置：补全语言含 `vue`、扫描范围限定 `src/**`（排除 `dist` 避免命中压缩产物）。 |

> `.vscode/extensions.json` 已内置 Vue / ESLint / Prettier 三项推荐，打开项目会自动提示；CSS Variable Autocomplete 需手动搜索安装。
> 除上表外无需其他样式类插件：SCSS 语法高亮为 VSCode 内置；`vue-mess-detector` 为 CLI 工具（`pnpm analyze`），不依赖编辑器扩展。

## 目录结构

| 路径               | 职责                                                                                                 |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| `src/api/`         | 接口层：`fh2/` 为司空 2 OpenAPI 客户端（请求封装、拦截器、按域生成的类型）                           |
| `src/cesium/`      | 地图引擎封装：`core/` 工具、`effects/` 效果、`layers/` 图层（含 builtin 内置实现）                   |
| `src/components/`  | 对 UI 框架的二次封装：baseXxx 基础组件、`screen/` 大屏组件、`charts/` 图表、`layerControl/` 图层控制 |
| `src/composables/` | 组合式函数                                                                                           |
| `src/router/`      | 路由引擎：`route-admin.ts` / `route-screen.ts` 声明双端菜单，`rebuild.ts` 按模式动态注册             |
| `src/stores/`      | Pinia 状态：`useMenuStore` 驱动菜单、路由重建与「管理端 ⇄ 大屏」切换                                 |
| `src/styles/`      | 样式体系（令牌分层，见下节）                                                                         |
| `src/utils/`       | 工具函数（`request/` 为请求封装）                                                                    |
| `src/views/`       | 页面：`index.vue`（管理端布局）、`layout/`（大屏布局）、`pages/`（按端分目录），布局经动态路由挂载   |

## 样式体系（令牌分层）

样式全部收敛在 `src/styles/`，`main.ts` 只引入 `styles/index.scss` 唯一入口：EP 组件样式（SCSS 源）→ 令牌 → 基础层 → EP 绑定层 → 补丁层 → 工具层依次串联，**加载顺序即层叠优先级**。

### 目录与摆放位置

| 路径                      | 层                           | 放什么                                                                                                        |
| ------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `tokens/_primitive.scss`  | 原始值层                     | 纯色板与数值尺度（"值仓库"，无消费语义）：新增品牌色、字号/间距档位放这里                                     |
| `tokens/_semantic.scss`   | 语义层 · 共享默认（`:root`） | 两端同值的尺寸型语义：字号、间距、圆角、层级 `--lxj-z-*`                                                      |
| `tokens/_admin.scss`      | 语义层 · 管理端              | `html[data-app="admin"]` 下管理端专属：颜色、背景、填充、阴影                                                 |
| `tokens/_screen.scss`     | 语义层 · 大屏                | `html[data-app="screen"]` 下大屏专属：颜色类 + 尺寸语义的 vw 换算覆盖                                         |
| `tokens/_functions.scss`  | 编译期函数                   | `base()` / `font()` 数值换算，经 vite `additionalData` 全局注入                                               |
| `base/`                   | 全局基础层                   | 元素级归置（reset）与 `@font-face` 字体声明，零类选择器                                                       |
| `elementplus/_theme.scss` | EP 绑定层                    | `--el-*: var(--lxj-*)` 全量绑定，EP 色阶用 `color-mix()` 运行时推导                                           |
| `elementplus/patch/`      | 组件补丁层                   | 一个组件一个文件，按样式维护视角分类：`base/` `form/` `display/` `overlay/` `nav/`（浮层类统一归 `overlay/`） |
| `utilities/`              | 工具层                       | 通用工具类，只允许 `lxj-` 前缀，禁止触碰 `el-*`                                                               |

> 分层原则：**仅在单目录文件数逼近 8（硬约束上限）时才拆子目录**——`patch/` 因 EP 组件数量多已按维护视角分类预留，其余层保持扁平，避免过度分层。

### 命名规则

| 层        | 规则                                       | 示例                                                                                               |
| --------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| 原始值层  | 无前缀，数值即 px                          | `--color-blue-400`、`--font-16`、`--space-16`、`--radius-6`                                        |
| 语义层    | `--lxj-<语义>`                             | `--lxj-color-primary`、`--lxj-bg-panel`、`--lxj-font-panel`、`--lxj-space-16`、`--lxj-radius-base` |
| EP 绑定层 | 沿用 `--el-*`（业务不直接写，EP 内部消费） | `--el-color-primary`、`--el-bg-color`                                                              |
| 工具类    | `.lxj-<名>`                                | `.lxj-flex-center`、`.lxj-flex-between`                                                            |

### 应用硬约束

1. **组件/页面样式只允许引用语义层 `--lxj-*`**，零 `@use`，`var()` 即用；语义层缺档位时才退回原始值层
2. 能用 `--el-*` / `--lxj-*` 变量解决的，不写属性规则（EP 定制优先级：变量绑定 → 属性规则）
3. 页面独有覆盖留在组件内 `scoped` + `:deep()`，不放补丁层
4. `!important` 仅限补丁层，且必须同行注释业务原因
5. 仅一端需要的定制 → 选择器挂 `html[data-app='xxx']` 前缀；禁止「全局定制 + 另一端还原」
6. 新增语义遵循单向引用：原始值 → 语义 → 组件

### 主题作用域与切换

- 语义层按 `html[data-app="admin" | "screen"]` 解析，两端各自完整声明颜色/背景类语义
- 切换由布局组件挂载时设置（`views/index.vue` → `admin`，`views/layout/index.vue` → `screen`）；login 等无布局页自行设置
- 挂在 `<html>` 而非布局根：EP 弹层 teleport 到 body 后依然命中，无需 body 类桥接

### 大屏自适应

- 基准 `--screen-base`（默认 `100vw`，可按部署形态调整为 `min(100vw, 2560px)` 等封顶策略）
- `base(设计px)`：线性换算 = 设计稿 px × (基准 / 1920)，宽高等比缩放
- `font(设计px)`：在 `base` 上叠加 `clamp` 限幅（默认下限 design×0.5+4px、上限 design×1.1），小屏保可读、大屏防臃肿
- 函数经 vite `additionalData` 注入，组件 scoped 样式内直接裸调；`tokens/` 内 partial 需自写 `@use './functions' as *`

## 迁移的外部代码一律不计入检查范围

### 代码自检

- 使用vue-mess-detector进行代码自检，可根据提示进行相应的代码调整
- 配置文件为.config/vue-mess-detector.json
- 目前已忽略else的条件审查
- 关闭script代码行数检查，使用eslint进行单页面的总代码行数检查

### 类型文件相关

- 组件、工具函数等专用的类型文件可和文件放在同一文件夹下，其余放在types文件夹下
- 后台数据相关的类型文件按照接口文档模块进行分类放在types/service文件夹下，以接口前缀为文件夹名
- 全局类型写在window.global.d.ts中
- 对elementplus类型的扩写写在elementplusType.type.d.ts中

### vue常见问题

- .vue页面中使用router时，通过useRouter()获取而不是从router文件中导入，因为可能会导致使用了新旧的不同router实例。eg：当前文件同过引入的方式使用router，热更新后当前页面触发的路由跳转会失效，因为此时的router实例发生了变化，但是这个变化是局部的，useRouter没有这个问题，因为useRouter始终会返回当前vue实例中正在使用的router实例。

### 持续更新中

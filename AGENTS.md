# AGENTS.md

给编码代理的项目约定。每条都有仓库证据；改规则前先改对应配置或代码。

## 命令

仅允许 pnpm（`package.json` 的 preinstall 会拒绝 npm/yarn/bun）。

| 目的        | 命令                                                                      |
| ----------- | ------------------------------------------------------------------------- |
| 安装依赖    | `pnpm install`                                                            |
| 启动开发    | `scripts/dev.sh start`（stop / restart / status；日志 logs/dev.log）      |
| 类型检查    | `pnpm typeCheck`（vue-tsc -b）                                            |
| 构建        | `pnpm build`（类型检查 + vite build，产物 dist/）                         |
| Lint + 死代码 | `pnpm lint`（eslint ./src && knip）                                     |
| 格式化      | `pnpm formatSrc` 或 `scripts/format.sh {src\|all\|check}`                 |
| 测试        | 无。仓库未接入测试框架，也没有 test 脚本；交付验证以 typeCheck + lint 为准 |

开发服务器固定 http://localhost:3005（`vite.config.ts`）。不要直接后台挂 `pnpm dev`。

## 目录职责

| 目录                                        | 职责                                                                 |
| ------------------------------------------- | -------------------------------------------------------------------- |
| `src/components/`                           | EP 二次封装（baseXxx）与大屏业务组件（screen/）；写页面前先查这里   |
| `src/views/pages/<分类>/<叶子>/index.vue`   | 业务页面；目录名必须与 `src/router/menu.ts` 的 name 一致             |
| `src/api/`                                  | 接口模块，按业务分文件                                               |
| `src/utils/request/`                        | BaseRequest、拦截器、token 刷新；全局唯一请求实例                    |
| `src/stores/`                               | Pinia setup store（当前 site）                                       |
| `src/styles/`                               | 样式唯一入口与令牌分层，见 `docs/DESIGN.md`                          |
| `src/cesium/`                               | 地图引擎封装（core / layers / basemap / effects / draw）             |
| `src/config/`                               | 横切配置（站点注册表等），优先配置驱动                               |
| `src/types/`                                | 全局类型；autoImport.d.ts、components.d.ts 由插件生成                |

## 红线

1. **禁止硬编码颜色、间距、字号、圆角**：新代码只引 `--lxj-*` 语义令牌；缺档位才退回原始值 `--color-*` / `--space-*`；混色用 `color-mix()` 以语义令牌为基。确需设计稿原值时同行注释 `/* 设计稿取值 */`。
2. **禁止页面内重复实现已有组件**：表格 → baseTable、分页 → basePagination、页签 → baseTabs、确认 → messageBox、图表 → BaseChart、地图 → BaseCesium。禁止在页面直接写 `el-table` / `el-tabs` / `ElMessageBox.confirm`。词表见 `docs/COMPONENTS.md`。
3. **禁止修改**：
   - `src/types/autoImport.d.ts`、`src/types/components.d.ts`（unplugin 自动生成）
   - `dist/`（构建产物）
   - `src/styles/index.scss` 的加载顺序与 `src/styles/elementplus/_theme.scss` 的 `--el-* → --lxj-*` 绑定链
4. **尺寸换算**：组件/页面 scoped 样式内的设计稿 px 必须用 `base()` / `font()`（已全局注入）；自定义属性内写成 `#{base(80px)}`；`tokens/` 下 partial 需自行 `@use './functions' as *`。
5. **路由**：Hash 模式；页面跳转用 `useRouter()`，禁止 import router 实例；路由由 `src/router/menu.ts` 配置生成，不手写 routes。

## 页面交付协议

1. 实现前先列出复用组件清单（对照 `docs/COMPONENTS.md`），并标出确需新增的组件；新增组件放 `src/components/baseXxx/`，类型/配置与组件同目录。
2. 页面 `index.vue` 只做布局编排与数据装配；业务子组件放同级 `components/`，复杂配置放同级 `config.ts`（参考 `views/pages/threeDAnalysis/overview/`）。
3. 完成后必须通过 `pnpm typeCheck`；提交前跑 `pnpm lint`。
4. 新增样式前先查 `docs/DESIGN.md` 是否已有语义令牌；缺令牌先加在令牌层，不在页面写死。
5. 交付后同步规范资产，只更新现有文件、不新建：本页新引入的组件追加到 `docs/COMPONENTS.md`；新出现的语义化样式值追加到 `docs/DESIGN.md`；新暴露的约束追加到本文件。若实现推翻了既有规范，先改规范再交付，并在交付说明中列出被推翻的条目。

## 证据索引

package.json · vite.config.ts · eslint.config.ts · src/router/index.ts · src/styles/** · src/components/** · docs/styles-规范.md

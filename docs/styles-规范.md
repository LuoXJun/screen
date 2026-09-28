# 样式规范

权威样式链约定：补丁层铁律、令牌引用规则、EP 定制决策树均以此为准（`patch/_index.scss` 注释所引"详见"即本文档）。

## 样式链结构

`main.ts` 只引 `src/styles/index.scss`；该入口只做 `@use` 编排、零具体规则。加载顺序即层叠优先级（越靠后越有权）：

```
① EP 全量样式(theme-chalk/src/index.scss)
② tokens:primitive(原始值) → semantic(语义默认) → admin / screen(端级覆盖)
③ base(元素级默认:盒模型 / 根继承 / 滚动条)
④ elementplus/theme(EP 变量绑定层,--el-* ← var(--lxj-*))
⑤ elementplus/patch(组件补丁层,一组件一文件)
⑥ utilities(工具类,lxj- 前缀)
```

## 令牌三层

| 层       | 文件                               | 职责                                                                               |
| -------- | ---------------------------------- | ---------------------------------------------------------------------------------- |
| 原始值层 | `tokens/_primitive.scss`           | 纯值仓库（`--color-*` / `--font-*` / `--space-*` / `--radius-*`…），换品牌只改这里 |
| 语义层   | `tokens/_semantic.scss` + 两端覆盖 | `--lxj-*`；`:root` 共享默认 + `html[data-app]` 差异覆盖                            |
| 绑定层   | `elementplus/_theme.scss`          | `--el-*: var(--lxj-*)`，EP 全量随令牌联动                                          |

铁律：

- 组件/页面样式只引用 `--lxj-*` 语义层，**禁止碰原始值层**（`--color-*` / `--radius-*` 等）
- 自创类名、工具类一律 `lxj-` 前缀，不污染 `el-` 命名空间
- 单端独有语义先写共享默认，另一端需要时再补覆盖（避免令牌层出现空洞）
- 业务自建浮层 z-index 必须 < 2000（EP 弹层池从 `--el-index-popper`(2000) 起动态分配）
- 圆角体系示例：原始值 `--radius-4/6/8/12/20/half` → 语义 `--lxj-radius-small(4px)/base(6px)/round(20px)/circle(50%)` → EP 四档全绑定

## 大屏自适应函数

vite `additionalData` 全局注入，组件 scoped 样式内裸调：

- `base(80px)`：设计稿 px × (`--screen-base` / 1920)，只缩放版式骨架（间距/圆角等小尺寸不缩放）
- `font(24px)`：字号专用，在 base 上叠加可读性下限（默认 `design × 0.5 + 4px`）
- 自定义属性内必须插值：`--x: #{base(80px)}`
- 百分比插值写成 `#{100% - $n * 10%}`，禁写 `#{...}%`——`}%` 相邻会让 VSCode SCSS 语言服务整文件报错
- `tokens/` 内 partial 不经注入，须自写 `@use './functions' as *`

## EP 定制优先级决策树（从上往下，能停就停）

1. `--el-*` / `--lxj-*` CSS 变量能解决 → 只做变量绑定，不写属性规则
2. EP 无对应变量但需全局统一 → 写补丁 `patch/<分类>/_<组件>.scss`
3. 仅一端需要的定制 → 选择器挂 `html[data-app='xxx']` 前缀（另一端零代码保持默认）；禁止「全局定制 + 另一端还原」
4. 页面独有覆盖 → 留在页面组件内 `scoped` + `:deep()`，不进补丁层
5. `!important` 仅限补丁层使用，且必须同行注释业务原因

## 补丁层工作流

- 分类：`base/`(按钮/图标/链接等) `form/` `display/`(数据展示) `overlay/`(teleport 浮层：dialog/tooltip/message 等) `nav/`；一个组件一个文件；新增后在 `patch/_index.scss` 登记 `@use`
- 断链核对口径：组件级 `--el-xxx` 是否最终链到全局变量（如 `--el-border-radius-base`）
  ⚠️ **静态值陷阱**：EP 组件 map 里写死的值不引用全局链，只查「链式引用断点」会漏——如 `el-tag` 的 `--el-tag-border-radius: 4px`（编译产物静态值，已在 `display/_tag.scss` 绑定语义层）；同类还有 `el-menu` 弹出面板消费的 `--el-border-radius-small`（已并入 theme 绑定层）
- 定制作用域：组件自身 → 各子组件文件（全局生效）；仅容器内跨子组件统一（如 `.el-form`）→ 容器组件文件作用域；页面独有 → 组件内 scoped
- 补丁文件结构范式：① 变量绑定（`--el-*` 纯净绑定，DevTools 调试入口）② 属性规则（EP 没有变量的结构项），见 `base/_button.scss` / `display/_card.scss` 注释头

## EP 组件二次封装（硬性要求）

- 会被复用的 EP 组件先封装再用（tree → BaseTree、table → BaseTable…），同类场景禁止散落裸用
- 位置：`src/components/<端>/<组件名>/`；两端共用放共享目录
- 封装要素：
    - `defineProps<...>()` 类型化业务 props，只暴露需要定制的子集
    - `v-bind="$attrs"` 透传原生属性与事件；`<slot>` / 具名插槽透传
    - 业务默认值在封装内给定（如默认 size、默认分页行为）
    - 样式覆盖只写在封装组件内部（`scoped` + `:deep()`），消费方零覆盖
- 复杂组件的配置（表格列、表单字段）抽到同级 `config.ts`，组件只做渲染

## 常见坑

- `importStyle: false` 项目（本项目）**勿再**单引组件样式（`element-plus/es/components/xxx/style/css`），EP 样式已全量引入
- 服务式组件（ElMessage / ElMessageBox / ElNotification / ElLoading）：`.vue` 内可裸用（unplugin-auto-import 接管）；`.ts` 内显式 `import { ElMessage } from 'element-plus'`
- ElMessageBox 取消/关闭会 **reject**（`'cancel'` / `'close'`），`await` 必须 try/catch，否则控制台报 unhandled rejection
- el-table 需显式 `height` / `max-height` 才有固定表头与滚动
- `autoImport.d.ts` / `components.d.ts` 是生成文件，不手改
- 字体族：EP 组件字体靠 inherit（其产物零消费 `var(--el-font-family)`），根上一处设置全站生效——含 teleport 到 body 的弹层

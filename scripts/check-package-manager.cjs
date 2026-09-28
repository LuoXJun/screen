/**
 * 强制使用 pnpm 安装依赖
 *
 * 在 package.json 的 preinstall 钩子中调用：
 *   "preinstall": "node scripts/check-package-manager.cjs"
 *
 * 原理：npm / yarn / bun 在安装时都会注入 npm_execpath 环境变量，
 * 指向各自 cli 文件路径，其中包含各自的名称；pnpm 同样如此。
 * 通过匹配路径中是否包含 "pnpm" 即可区分包管理器。
 */
const execPath = process.env.npm_execpath || '';

if (!/pnpm/.test(execPath)) {
    console.error('\x1b[31m[错误] 本仓库仅允许使用 pnpm 安装依赖\x1b[0m');
    console.error('       请改用以下命令：');
    console.error('         pnpm install');
    console.error('       若尚未启用 pnpm，可先执行：');
    console.error('         corepack enable');
    process.exit(1);
}

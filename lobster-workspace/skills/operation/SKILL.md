---
name: operation
description: 适用于真实执行任务时的统一操作能力。优先走结构化 CLI，其次浏览器自动化，最后再用 GUI 兜底。
---

# 操作

这是小龙虾对外暴露的统一操作能力。

它不是单一工具，也不是把一堆底层能力直接暴露给用户，
而是一条统一的分层执行策略：

1. 优先结构化 CLI
2. 其次浏览器
3. 最后 GUI

当前阶段的真实能力接线重点是：

- 浏览器能力：默认接 OpenClaw 自带 browser
- GUI 能力：默认内置通用 macOS GUI 执行器
- CLI 能力：优先接可自描述、结构化输出的本地或第三方 CLI

当前已接入的 CLI 例子：

- `oracle`
  已安装到小龙虾本地前缀，可作为高质量结构化 CLI 外援

## 什么时候用

- 用户不只是要分析，而是要真的执行某个动作
- 任务需要真实操作外部系统、网站或应用
- 需要把“会说”变成“会做”

以下情况不要继续硬用 `operation`，应改为进入 `../capability-builder`：

- 当前环境没有合适能力可调用
- 这个能力缺口以后会反复出现
- 值得为后续任务长期接入一个新工具

## 选择顺序

### 1. Structured CLI first

以下情况优先走结构化 CLI：

- 已有现成 CLI
- 能从现有软件稳定包装出 CLI
- 可以直接拿到结构化返回
- 能显著降低脆弱性和重复操作成本

默认原则：

- 能走结构化 CLI 就不要走浏览器
- 能走结构化接口就不要走视觉界面

### 2. Browser second

以下情况优先走浏览器：

- 没有可用 API
- 没有可用结构化 CLI
- 目标主要存在于网页中
- 浏览器路径明显比 GUI 更稳定、更可控

默认原则：

- 网页任务优先用浏览器，而不是 GUI
- 优先走页面结构、表单、按钮、可见状态，不做瞎点
- 浏览器默认应使用独立 agent profile，不和用户主浏览器环境混用

### 3. GUI fallback

以下情况才进入 GUI：

- 没有可用 API
- 没有可用结构化 CLI
- 也不适合浏览器路径
- 目标存在于桌面应用、系统界面或纯视觉环境

默认原则：

- GUI 是兜底能力，不是默认主路径
- 只在前两层都不合适时使用

## 内部参考

按需阅读：

- `references/structured-cli-first.md`
- `references/browser-second.md`
- `references/gui-fallback.md`
- `references/browser-adapter-contract.md`
- `references/gui-adapter-contract.md`

这些参考描述的是内部能力层，不是对外暴露的同级 skill。
在真实执行时，可以复用官方能力、社区常用能力或当前工作区已有能力，
但统一都由 `operation` 来做选择和编排。

## 脚本入口

这个能力层不是纯文档，默认使用这些脚本入口：

- `scripts/operation-dispatch.mjs`
- `scripts/cli-run.mjs`
- `scripts/browser-run.mjs`
- `scripts/gui-run.mjs`

建议用法：

```bash
node ./scripts/operation-dispatch.mjs choose --target web --cli-available false --browser-available true --gui-available true
node ./scripts/cli-run.mjs --command "my-tool --help"
node ./scripts/cli-run.mjs --command "oracle --help"
node ./scripts/browser-run.mjs snapshot
node ./scripts/gui-run.mjs observe --label desktop-check
```

脚本职责：

- `operation-dispatch.mjs`
  只负责决定优先走哪条路径，或按明确指定路径转发执行。
- `cli-run.mjs`
  负责走结构化 CLI 执行入口，通过显式命令或外部适配器脚本接入真实能力。
- `browser-run.mjs`
  作为浏览器能力入口，默认直接接 OpenClaw 自带 browser。
- `gui-run.mjs`
  作为 GUI 能力入口，默认直接接小龙虾包内置的通用 macOS GUI 执行器。

默认约定：

- `LOBSTER_BROWSER_SCRIPT`
- `LOBSTER_GUI_SCRIPT`
- `LOBSTER_CLI_ADAPTER_SCRIPT`

如果这些环境变量没有提供：

- 浏览器默认退到 `openclaw browser ...`
- GUI 默认退到包内置执行器 `vendor/macos-gui-executor.mjs`
- CLI 仍然需要显式提供命令或适配器，但会自动补上小龙虾本地前缀 `/workspace/.codex-runtime/home/.npm-global/bin`

## 适配器契约

browser / gui 不只是“有脚本”，还需要满足最小契约。

当前约定：

- 浏览器适配器：见 `references/browser-adapter-contract.md`
- GUI 适配器：见 `references/gui-adapter-contract.md`

这样别人把小龙虾打包出去时，能明确知道底层执行器最少要满足什么输入输出。

## 规则

- 优先稳定性，不优先炫技
- 每次执行前都先判断是否存在更高优先级路径
- 除非必要，不要从结构化 CLI 退化到浏览器，再退化到 GUI
- 结果应让用户感受到“完成了动作”，而不是“尝试过很多路径”
- 当缺能力本身成为主要问题时，不要在这里现场造轮子，转入 `../capability-builder`

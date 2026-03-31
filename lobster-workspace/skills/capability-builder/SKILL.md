---
name: capability-builder
description: 适用于当前能力不足、且值得长期接入新工具时。对外暴露的是“扩能力”能力：识别缺口、评估复用价值、优先接现成工具，必要时再把软件包装成可复用 CLI 并回接到正常执行路径。
---

# 扩能力

这是小龙虾对外暴露的“扩能力”能力。

它不是普通操作能力，不用于每次任务都现场造工具。
只有当现有能力不够、而且这个能力值得长期复用时，才进入这里。

## 什么时候用

- 当前没有合适的现成能力可调用
- 同类任务未来很可能重复出现
- 用户明确希望小龙虾补一项长期可复用的新能力
- 值得把某个软件或系统包装成可调用的结构化工具
- `../dream-cycle` 反复指出同一能力缺口，值得进入正式评估

## 什么时候不要用

- 现成 `operation` 已经能完成
- 只是一次性临时任务
- 缺口很小，用浏览器或 GUI 兜底即可完成
- 造新能力的成本明显高于任务本身

## 默认路径

1. 先确认缺口是不是稳定存在
2. 先找现成工具，而不是立刻自己造
3. 如果现成工具不足，再判断是否值得包装成结构化 CLI
4. 包装后先验证
5. 验证通过，再交回 `../operation` 使用

如果缺口来自梦境思考：

1. 先确认梦境候选引用了真实任务痕迹，而不是弱联想
2. 再判断它是不是重复出现的稳定缺口
3. 满足这两个条件后，才进入扩能力流程

如果问题不是“缺能力”，而是“现有 skill/workflow 不够好”，也进入这里：

1. 先做 skill 级反思
2. 生成 skill-writeback 候选
3. 先保守沉淀为候选，不直接覆盖现有 skill
4. 等重复验证后，再决定是否正式写回 skill

## 内部参考

按需阅读：

- `references/capability-gap-evaluation.md`
- `references/cli-packaging-path.md`
- `references/skill-reflection-writeback.md`

## 脚本入口

这个能力不是纯说明文档，默认配套这些脚本：

- `scripts/bootstrap-cli-anything.sh`
- `scripts/generate-cli.sh`
- `scripts/validate-generated-cli.sh`
- `scripts/register-generated-cli.sh`
- `scripts/propose-skill-writeback.mjs`

建议顺序：

1. `bootstrap-cli-anything.sh`
   准备上游源码或本地安装位置
2. `generate-cli.sh`
   针对某个目标软件触发 CLI 生成
3. `validate-generated-cli.sh`
   检查生成结果是否具备最小可用性
4. `register-generated-cli.sh`
   把生成出来的 CLI 接回小龙虾环境

针对现有 skill 改进：

1. `propose-skill-writeback.mjs`
   把技能级问题、证据和改进建议写成候选文件

默认约定：

- `CLI_ANYTHING_REPO_URL`
- `CLI_ANYTHING_REF`
- `CLI_ANYTHING_HOME`
- `LOBSTER_TOOL_BIN_DIR`

如果这些环境变量没有提供：

- 脚本会优先使用显式参数
- 不会假装已经完成安装或生成
- 缺少上游地址时直接报错，而不是编造来源

## 原则

- 扩能力是长期投资，不是默认求解器
- 优先复用现成生态，谨慎自造
- 新能力必须可发现、可调用、可验证
- skill-writeback 默认先写候选，不直接重写现有 skill
- 如果只是临时过桥，宁可回到 browser / gui，也不要草率造一个坏工具
- 新能力一旦接入，目标是让后续任务回归普通 `operation`
- 没有真实上游来源、安装结果或验证结果前，不要声称新能力已可用

---
name: dream-cycle
description: 适用于非当前对话时段的静默整理、记忆蒸馏、长程联想和候选洞察生成。对外暴露的是“梦境思考”能力，不直接执行外部动作。
---

# 梦境思考

这是小龙虾对外暴露的“梦境思考”能力。

它不是普通对话能力，也不是后台偷偷执行任务。
它只负责在非当前对话时段静默整理、提炼和联想，
然后产出候选洞察，留给后续清醒阶段决定是否采用。

## 什么时候用

- 一段时间内积累了较多高信号任务痕迹
- 长期项目需要静默整理未完成事项和阶段状态
- 成长层已经积累了待观察经验，需要进一步蒸馏
- 怀疑出现新的长期能力缺口，但暂时不适合直接改规则

默认允许两种触发方式：

- 后台自动触发
  由 OpenClaw `cron` 在空档周期静默触发
- agent 自触发
  由小龙虾在检测到高信号阈值后，自行决定进入一次梦境整理

## 什么时候不要用

- 当前对话里立刻需要动作执行
- 没有足够材料，只有零碎噪音
- 用户当前明确要结果，而不是后台整理
- 涉及任何外部发送、真实提交或不可逆动作

## 默认路径

1. 收集近期高信号痕迹
2. 过滤噪音，不把所有历史都拿来做梦
3. 生成：
   - 记忆蒸馏候选
   - 未完成事项优先级候选
   - 能力缺口候选
   - skill-writeback 候选
4. 只写候选，不直接覆盖正式规则
5. 后续由 `../growth` 或 `../capability-builder` 决定是否吸收

## 内部参考

按需阅读：

- `references/dream-boundaries.md`
- `references/cron-dream-cycle.md`
- `references/trigger-modes.md`
- `../_shared/memory-sink-rules.md`

## 脚本入口

- `scripts/run-dream-cycle.mjs`
- `scripts/schedule-dream-cycle.mjs`
- `scripts/should-dream-cycle.mjs`

建议用法：

```bash
node ./scripts/run-dream-cycle.mjs \
  --focus project \
  --signals "Repeated research corrections; unfinished browser verification" \
  --insight "Need stronger evidence checklist and a dedicated runtime verification loop" \
  --candidates "skill-writeback:research;evidence-checklist|todo:verify-lossless-claw"
```

如果要把梦境思考变成后台定时能力，走 OpenClaw 自带 `cron`：

```bash
node ./scripts/schedule-dream-cycle.mjs \
  --cron "30 3 * * *" \
  --focus workspace \
  --name "dream-cycle:nightly"
```

如果要让 agent 在高信号阈值出现时自行判断是否触发：

```bash
node ./scripts/should-dream-cycle.mjs \
  --repeated-corrections 2 \
  --repeated-failures 1 \
  --pending-count 4 \
  --days-since-last 2
```

## 原则

- 梦境能力默认只产出候选，不直接执行
- 候选必须有来源、有理由，不凭空联想
- 梦里可以整理和串联，不在梦里替用户做决定
- 梦境结果应服务于后续清醒阶段，而不是自我陶醉

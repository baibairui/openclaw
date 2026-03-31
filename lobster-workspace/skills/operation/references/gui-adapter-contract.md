# GUI Adapter Contract

GUI 适配器至少应满足以下要求：

## 目标

- 提供桌面视觉观察与基础交互能力
- 作为 API / browser 之后的兜底执行层
- 保持证据优先，而不是盲点操作

## 最小命令面

至少应支持：

- `observe`
- `act`
- `click`
- `type-text`
- `press-key`
- `screenshot`

推荐支持：

- `doctor`
- `activate-app`
- `list-windows`

## 最小行为约束

- `observe` 必须能返回当前视觉证据
- GUI 默认走 `observe -> act -> observe`
- 如果环境依赖不足，适配器应能给出明确 blocker
- 不可逆动作前应允许上层先停下来确认

## 错误语义

至少应能区分：

- 前台应用不正确
- 权限不足
- 坐标或目标不明确
- act 不可用
- 人工确认需要

## 推荐返回

优先返回结构化结果，例如：

- `ok`
- `path` / `local_image_path`
- `frontmost_app`
- `blockers`
- `next_hint`

不要求字段名完全一致，但至少要让上层知道“看到了什么、做成了没有、卡在哪里”。

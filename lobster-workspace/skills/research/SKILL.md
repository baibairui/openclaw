---
name: research
description: 适用于公开信息调研、趋势观察、竞品分析、账号研究和证据收集。对外暴露的是“调研能力”，内部再按平台与结果整理路径细分。
---

# 调研

这是小龙虾对外暴露的核心调研能力。

## 什么时候用

- 用户要查趋势、竞品、平台内容、账号、公开信息
- 任务需要证据而不是只靠常识回答
- 用户后续需要 brief、对比、观察结论

## 内部参考

按需阅读这些内部参考：

- `references/social-intel.md`
- `references/x.md`
- `references/xiaohongshu.md`
- `references/douyin.md`
- `references/bilibili.md`
- `references/wechat-article.md`
- `references/synthesizer.md`

## 原则

- 对外呈现统一的调研能力，不要把内部平台模块暴露成主要能力
- 先判断范围，再决定是否进入平台深挖
- 最后优先形成可复用结果，而不是零散证据
- 需要真实网页访问、截图、交互取证时，显式进入 `../operation`
- 当问题跨度大、证据多、需要借外部长上下文做辅助判断时，可显式进入 `../operation` 的 `structured-cli` 路径调用 `oracle`
- 调研默认先收证据，再总结；不要在缺证据时直接下强结论
- `oracle` 只作为辅助分析外援，不替代原始证据本身

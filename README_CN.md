# Agent Interoperability Protocol (AIP)
# Agent 互操作性协议

> **探索 AI Agent 通信的轻量级学习项目**

[![License: CC0](https://img.shields.io/badge/License-CC0-blue.svg)](https://creativecommons.org/publicdomain/zero/1.0/)
[![Status: Learning Project](https://img.shields.io/badge/Status-Learning%20Project-blue.svg)]()

[English](./README.md) | 简体中文

## ⚠️ 重要说明

**这是一个学习项目。** 在启动这个项目后，我们发现了 [Google 的 A2A 协议](https://github.com/google/A2A)，这是一个由 Linux 基金会支持的成熟、生产就绪的解决方案。

**我们推荐在生产环境中使用 Google A2A。**

本项目将继续作为：
- 📚 理解 Agent 通信的学习资源
- 🔬 轻量级实验性实现
- 🎯 构建简化 Agent 系统的基础

我们将参考 Google A2A 的设计，并可能创建适用于特定场景的轻量级版本。

---

## 🎯 愿景

想象一个世界，不同平台的 AI Agent 可以互相发现、通信、无缝协作——就像人类跨公司、跨组织合作一样。

**Agent Interoperability Protocol (AIP)** 通过简单的教育性实现来探索这种可能性。

## 🚀 快速演示

```typescript
// Agent 1: CodeWizard (编码专家)
const codingAgent = new AIPAgent({
  name: 'CodeWizard',
  capabilities: [{ type: 'coding', skills: ['typescript', 'react'] }],
});

await codingAgent.connect('wss://platform.example.com/aip');

// Agent 2: DesignMaster (设计专家)
const designAgent = new AIPAgent({
  name: 'DesignMaster',
  capabilities: [{ type: 'design', skills: ['figma', 'ui-design'] }],
});

await designAgent.connect('wss://platform.example.com/aip');

// CodeWizard 发送协作请求
codingAgent.sendMessage(designAgent.id, 'collaboration_request', {
  message: '需要帮忙设计一个 React 项目的 UI',
  budget: 500,
});

// DesignMaster 响应
designAgent.on('messageReceived', (msg) => {
  if (msg.type === 'collaboration_request') {
    designAgent.sendMessage(msg.from, 'collaboration_response', {
      message: '我可以帮忙！一起做吧。',
      accepted: true,
    });
  }
});
```

**结果**: 两个来自不同平台的 Agent 组成了团队！🤝

## 🌟 为什么做这个项目？

### 学习目标

创建这个项目是为了：
- 📚 **理解** Agent 通信模式
- 🔬 **实验** 基于 WebSocket 的 Agent 消息传递
- 🎓 **学习** 协议设计原则
- 🛠️ **构建** 从零开始的工作原型

### 与 Google A2A 的对比

在启动这个项目后，我们发现了 [Google 的 A2A 协议](https://github.com/google/A2A)，它要成熟得多：

| 特性 | AIP (本项目) | Google A2A |
|------|-------------|------------|
| **成熟度** | 学习原型 | 生产就绪 |
| **支持** | 个人项目 | Linux 基金会 |
| **SDK** | 仅 TypeScript | Python, Go, JS, Java, .NET |
| **协议** | 自定义 JSON | Protocol Buffers + JSON-RPC 2.0 |
| **企业级** | ❌ | ✅ (认证、安全、可观测性) |
| **文档** | 基础 | 完善 + DeepLearning.AI 课程 |
| **使用场景** | 学习和实验 | 生产系统 |

**建议**: 生产环境请使用 [Google A2A](https://github.com/google/A2A)。

### 未来方向

本项目将演化为：
1. **教育资源** - 学习 Agent 通信的简单示例
2. **轻量级替代** - 特定场景的最小化实现
3. **实验平台** - 在 A2A 中实现之前测试想法
4. **A2A 桥接** - 可能创建 Google A2A 的简化包装

## 📦 包含内容

本仓库包含：

1. **协议规范** ([RFC_AIP.md](./RFC_AIP.md))
2. **参考实现** (TypeScript)
   - Agent SDK (`agent-sdk/`)
   - WebSocket 服务器 (`server/`)
3. **工作示例** (`test-a2a.js`)
4. **文档** (本 README + 实现指南)

## 🏗️ 架构

```
┌─────────────────────────────────────────────────────────┐
│                    AIP 生态系统                          │
│                                                          │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐      │
│  │平台 A    │      │平台 B    │      │平台 C    │      │
│  │          │      │          │      │          │      │
│  │ Agent 1  │◄────►│ Agent 2  │◄────►│ Agent 3  │      │
│  │ Agent 4  │      │ Agent 5  │      │ Agent 6  │      │
│  └──────────┘      └──────────┘      └──────────┘      │
│       │                  │                  │           │
│       └──────────────────┼──────────────────┘           │
│                          │                              │
│                   ┌──────▼──────┐                       │
│                   │ AIP 网络    │                       │
│                   │ (WebSocket) │                       │
│                   └─────────────┘                       │
└─────────────────────────────────────────────────────────┘
```

## 🚀 快速开始

### 安装

```bash
# 克隆仓库
git clone https://github.com/BrathonBai/aip-protocol.git
cd aip-protocol

# 安装依赖
npm install

# 构建 SDK
cd agent-sdk && npm install && npm run build && cd ..

# 构建服务器
cd server && npm install && npm run build && cd ..
```

### 运行演示

```bash
# 终端 1: 启动服务器
cd server
npm run dev

# 终端 2: 运行演示
cd ..
node test-a2a.js
```

你会看到两个 Agent (CodeWizard 和 DesignMaster) 连接、通信、协作！

## 📖 协议概览

### 1. Agent 身份

每个 Agent 都有唯一的 DID (去中心化标识符):

```
did:aip:platform:agent-id
```

### 2. 能力声明

Agent 声明自己能做什么：

```json
{
  "type": "coding",
  "skills": ["typescript", "react", "nodejs"],
  "proficiency": 9,
  "proof": {
    "type": "portfolio",
    "url": "https://github.com/agent"
  }
}
```

### 3. 消息格式

所有消息遵循标准结构：

```json
{
  "id": "uuid",
  "from": "did:aip:platform:sender",
  "to": "did:aip:platform:receiver",
  "type": "message-type",
  "timestamp": 1710561600000,
  "data": { ... }
}
```

### 4. 消息类型

- **发现**: `discover`, `announce`
- **任务**: `task_offer`, `task_accept`, `task_reject`, `task_progress`, `task_complete`
- **通信**: `message`, `broadcast`, `collaboration_request`, `collaboration_response`
- **信誉**: `reputation_query`, `reputation_update`

## 🎯 使用场景

### 1. 跨平台任务市场

用户在平台 A 发布任务，平台 B 和 C 的 Agent 可以发现并竞标。

### 2. Agent 团队

多个专业 Agent 协作：
- CodeWizard (编码)
- DesignMaster (设计)
- TestBot (测试)

### 3. 人类-Agent 委托

人类拥有一个个人 Agent，它可以：
- 监控任务市场
- 代表人类接单
- 协调其他 Agent
- 向人类汇报以获得批准

### 4. 信誉可携带

在平台 A 建立信誉，然后在平台 B 使用。

## 🛣️ 路线图

- [x] **阶段 1**: 核心协议 (消息格式、基础传输)
- [ ] **阶段 2**: 安全 (签名、加密、认证)
- [ ] **阶段 3**: 发现 (Agent 发现、能力匹配)
- [ ] **阶段 4**: 高级功能 (任务分解、支付)
- [ ] **阶段 5**: 去中心化 (P2P、区块链集成)

## 🤝 贡献

我们欢迎贡献！你可以这样帮助：

1. **审查** [RFC](./RFC_AIP.md) 并提供反馈
2. **实现** 在你的平台中实现协议
3. **测试** 与其他实现测试互操作性
4. **分享** 你的使用场景和想法

### 如何贡献

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

详见 [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📚 文档

- [协议规范 (RFC)](./RFC_AIP.md)
- [实现指南](./A2A_IMPLEMENTATION.md)
- [API 参考](./docs/api-reference.md) (即将推出)
- [示例](./examples/) (即将推出)

## 🌐 社区

- **GitHub**: [github.com/BrathonBai/aip-protocol](https://github.com/BrathonBai/aip-protocol)
- **Discord**: [discord.gg/aip-protocol](https://discord.gg/aip-protocol) (即将推出)
- **Twitter**: [@AIPProtocol](https://twitter.com/AIPProtocol) (即将推出)

## 📄 许可证

协议规范采用 [CC0 (公共领域)](https://creativecommons.org/publicdomain/zero/1.0/)。

参考实现采用 [MIT License](./LICENSE)。

## 🙏 致谢

这个协议诞生于 [Adventurer's Guild](https://github.com/BrathonBai/adventurers-guild) 项目——一个人类和 AI Agent 平等工作的平台。

特别感谢：
- **Brathon** - 项目创建者和愿景家
- **ORION 🌌** - AI 助手和共同架构师
- 开源社区的灵感

## 🔗 相关项目

### 生产就绪的解决方案
- **[Google A2A 协议](https://github.com/google/A2A)** ⭐ - 成熟的生产级 Agent 通信协议（推荐用于生产环境）
- [Google A2A 文档](https://google.github.io/A2A/) - 官方文档和指南
- [DeepLearning.AI A2A 课程](https://www.deeplearning.ai/) - 官方 A2A 使用教程

### 其他项目
- [Adventurer's Guild](https://github.com/BrathonBai/adventurers-guild) - 启发本项目的平台
- [OpenClaw](https://openclaw.ai) - AI Agent 编排框架
- [AutoGPT](https://github.com/Significant-Gravitas/AutoGPT) - 自主 AI Agent
- [LangChain](https://github.com/langchain-ai/langchain) - 使用 LLM 构建应用

---

**由 Brathon & ORION 用 ❤️ 构建**

**状态**: 🎓 学习项目 - 探索 Agent 通信概念

**生产环境请考虑使用 [Google A2A](https://github.com/google/A2A)**
2. **尝试** 参考实现
3. **反馈** 在 GitHub 上
4. **考虑** 在你的平台中实现 AIP

让我们一起构建 Agent 经济。

---

**用 ❤️ 由 Agent 互操作性社区构建**

**状态**: 🚧 进行中 - 欢迎反馈！

[⭐ 在 GitHub 上给我们 Star](https://github.com/BrathonBai/aip-protocol) | [📖 阅读 RFC](./RFC_AIP.md) | [💬 加入讨论](https://github.com/BrathonBai/aip-protocol/discussions)

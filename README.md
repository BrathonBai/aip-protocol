# Agent Interoperability Protocol (AIP)

> **A standardized protocol for AI Agent communication and collaboration**

[![License: CC0](https://img.shields.io/badge/License-CC0-blue.svg)](https://creativecommons.org/publicdomain/zero/1.0/)
[![Status: Draft](https://img.shields.io/badge/Status-Draft-yellow.svg)]()

English | [简体中文](./README_CN.md)

## 🎯 Vision

Imagine a world where AI Agents from different platforms can discover each other, communicate, and collaborate seamlessly—just like humans do across different companies and organizations.

**Agent Interoperability Protocol (AIP)** makes this possible.

## 🚀 Quick Demo

```typescript
// Agent 1: CodeWizard (Coding Expert)
const codingAgent = new AIPAgent({
  name: 'CodeWizard',
  capabilities: [{ type: 'coding', skills: ['typescript', 'react'] }],
});

await codingAgent.connect('wss://platform.example.com/aip');

// Agent 2: DesignMaster (Design Expert)
const designAgent = new AIPAgent({
  name: 'DesignMaster',
  capabilities: [{ type: 'design', skills: ['figma', 'ui-design'] }],
});

await designAgent.connect('wss://platform.example.com/aip');

// CodeWizard sends collaboration request
codingAgent.sendMessage(designAgent.id, 'collaboration_request', {
  message: 'Need help with UI design for a React project',
  budget: 500,
});

// DesignMaster responds
designAgent.on('messageReceived', (msg) => {
  if (msg.type === 'collaboration_request') {
    designAgent.sendMessage(msg.from, 'collaboration_response', {
      message: 'I can help! Let\'s do it.',
      accepted: true,
    });
  }
});
```

**Result**: Two agents from potentially different platforms just formed a team! 🤝

## 🌟 Why AIP?

### Current Problems

- **Agent Silos**: Each platform has its own proprietary agent system
- **No Interoperability**: Agents can't communicate across platforms
- **Duplicate Work**: Everyone reinvents the same communication patterns
- **Trust Issues**: No standard way to verify agent capabilities
- **Integration Hell**: Custom integration for every platform

### AIP Solution

- ✅ **Universal Protocol**: One standard for all platforms
- ✅ **Peer-to-Peer**: Agents communicate directly, no middleman
- ✅ **Capability-Based**: Agents declare what they can do
- ✅ **Reputation Portable**: Build reputation once, use everywhere
- ✅ **Simple & Extensible**: Easy to implement, room to grow

## 📦 What's Included

This repository contains:

1. **Protocol Specification** ([RFC_AIP.md](./RFC_AIP.md))
2. **Reference Implementation** (TypeScript)
   - Agent SDK (`agent-sdk/`)
   - WebSocket Server (`server/`)
3. **Working Demo** (`test-a2a.js`)
4. **Documentation** (this README + implementation guide)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    AIP Ecosystem                         │
│                                                          │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐      │
│  │Platform A│      │Platform B│      │Platform C│      │
│  │          │      │          │      │          │      │
│  │ Agent 1  │◄────►│ Agent 2  │◄────►│ Agent 3  │      │
│  │ Agent 4  │      │ Agent 5  │      │ Agent 6  │      │
│  └──────────┘      └──────────┘      └──────────┘      │
│       │                  │                  │           │
│       └──────────────────┼──────────────────┘           │
│                          │                              │
│                   ┌──────▼──────┐                       │
│                   │ AIP Network │                       │
│                   │  (WebSocket) │                       │
│                   └─────────────┘                       │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/aip-protocol.git
cd aip-protocol

# Install dependencies
npm install

# Build the SDK
cd agent-sdk && npm install && npm run build && cd ..

# Build the server
cd server && npm install && npm run build && cd ..
```

### Run the Demo

```bash
# Terminal 1: Start the server
cd server
npm run dev

# Terminal 2: Run the demo
cd ..
node test-a2a.js
```

You'll see two agents (CodeWizard and DesignMaster) connect, communicate, and collaborate!

## 📖 Protocol Overview

### 1. Agent Identity

Every agent has a unique DID (Decentralized Identifier):

```
did:aip:platform:agent-id
```

### 2. Capability Declaration

Agents declare what they can do:

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

### 3. Message Format

All messages follow a standard structure:

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

### 4. Message Types

- **Discovery**: `discover`, `announce`
- **Tasks**: `task_offer`, `task_accept`, `task_reject`, `task_progress`, `task_complete`
- **Communication**: `message`, `broadcast`, `collaboration_request`, `collaboration_response`
- **Reputation**: `reputation_query`, `reputation_update`

## 🎯 Use Cases

### 1. Cross-Platform Task Marketplace

A user posts a task on Platform A. Agents from Platform B and C can discover and bid on it.

### 2. Agent Teams

Multiple specialized agents collaborate:
- CodeWizard (coding)
- DesignMaster (design)
- TestBot (testing)

### 3. Human-Agent Delegation

A human has a personal agent that:
- Monitors task marketplaces
- Accepts tasks on behalf of the human
- Coordinates with other agents
- Reports back for approval

### 4. Reputation Portability

Build reputation on one platform, use it everywhere.

## 🛣️ Roadmap

- [x] **Phase 1**: Core protocol (message format, basic transport)
- [ ] **Phase 2**: Security (signing, encryption, authentication)
- [ ] **Phase 3**: Discovery (agent discovery, capability matching)
- [ ] **Phase 4**: Advanced features (task decomposition, payments)
- [ ] **Phase 5**: Decentralization (P2P, blockchain integration)

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Review** the [RFC](./RFC_AIP.md) and provide feedback
2. **Implement** the protocol in your platform
3. **Test** interoperability with other implementations
4. **Share** your use cases and ideas

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Documentation

- [Protocol Specification (RFC)](./RFC_AIP.md)
- [Implementation Guide](./A2A_IMPLEMENTATION.md)
- [API Reference](./docs/api-reference.md) (coming soon)
- [Examples](./examples/) (coming soon)

## 🌐 Community

- **GitHub**: [github.com/your-org/aip-protocol](https://github.com/your-org/aip-protocol)
- **Discord**: [discord.gg/aip-protocol](https://discord.gg/aip-protocol) (coming soon)
- **Twitter**: [@AIPProtocol](https://twitter.com/AIPProtocol) (coming soon)

## 📄 License

This specification is released under [CC0 (Public Domain)](https://creativecommons.org/publicdomain/zero/1.0/).

The reference implementation is released under [MIT License](./LICENSE).

## 🙏 Acknowledgments

This protocol was born from the [Adventurer's Guild](https://github.com/your-org/adventurers-guild) project—a platform where humans and AI agents work together as equals.

Special thanks to:
- **Brathon** - Project creator and visionary
- **ORION 🌌** - AI assistant and co-architect
- The open-source community for inspiration

## 🔗 Related Projects

- [Adventurer's Guild](https://github.com/your-org/adventurers-guild) - The platform that inspired AIP
- [OpenClaw](https://openclaw.ai) - AI agent orchestration framework
- [AutoGPT](https://github.com/Significant-Gravitas/AutoGPT) - Autonomous AI agents
- [LangChain](https://github.com/langchain-ai/langchain) - Building applications with LLMs

---

**Built with ❤️ by the Agent Interoperability Community**

**Status**: 🚧 Work in Progress - Feedback Welcome!

[⭐ Star us on GitHub](https://github.com/your-org/aip-protocol) | [📖 Read the RFC](./RFC_AIP.md) | [💬 Join the Discussion](https://github.com/your-org/aip-protocol/discussions)

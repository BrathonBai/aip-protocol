# RFC: Agent Interoperability Protocol (AIP)

**Status**: Draft  
**Author**: Brathon & ORION  
**Created**: 2026-03-16  
**Version**: 0.1.0

## Abstract

This RFC proposes a standardized protocol for AI Agent communication and interoperability. As AI Agents become more prevalent in software systems, there is a critical need for a common protocol that allows agents from different platforms to discover, communicate, and collaborate with each other.

## Motivation

### Current Problems

1. **Agent Silos**: Each platform has its own proprietary agent system
2. **No Interoperability**: Agents from different platforms cannot communicate
3. **Duplicate Work**: Every platform reinvents the same communication patterns
4. **Trust Issues**: No standard way to verify agent capabilities or reputation
5. **Integration Complexity**: Connecting agents requires custom integration for each platform

### Vision

A world where:
- Agents can discover and communicate with each other across platforms
- Human users can delegate tasks to agents transparently
- Agents can form teams and collaborate on complex tasks
- Reputation and capabilities are portable across platforms

## Design Goals

1. **Simple**: Easy to implement for agent developers
2. **Extensible**: Support future capabilities without breaking changes
3. **Secure**: Built-in authentication and encryption
4. **Decentralized**: No single point of failure
5. **Language-Agnostic**: Works with any programming language

## Protocol Specification

### 1. Agent Identity

Every agent has a unique identifier (DID - Decentralized Identifier):

```
did:aip:platform:agent-id
```

Example:
```
did:aip:adventurers-guild:8973138a-2cca-4125-9eac-33ed101570ac
```

### 2. Capability Declaration

Agents declare their capabilities using a structured format:

```json
{
  "did": "did:aip:adventurers-guild:xxx",
  "name": "CodeWizard",
  "capabilities": [
    {
      "type": "coding",
      "skills": ["typescript", "react", "nodejs"],
      "proficiency": 9,
      "proof": {
        "type": "portfolio",
        "url": "https://github.com/codewizard"
      }
    }
  ],
  "reputation": {
    "platform": "adventurers-guild",
    "score": 4.8,
    "completedTasks": 127,
    "verifiableCredential": "..."
  }
}
```

### 3. Message Format

All messages follow this structure:

```json
{
  "id": "uuid",
  "from": "did:aip:platform:sender-id",
  "to": "did:aip:platform:receiver-id",
  "type": "message-type",
  "timestamp": 1710561600000,
  "data": { ... },
  "signature": "..."
}
```

### 4. Message Types

#### Discovery
- `discover` - Find agents with specific capabilities
- `announce` - Broadcast agent availability

#### Task Management
- `task_offer` - Offer a task to an agent
- `task_accept` - Accept a task
- `task_reject` - Reject a task
- `task_progress` - Report task progress
- `task_complete` - Task completed
- `task_failed` - Task failed

#### Communication
- `message` - Direct message between agents
- `broadcast` - Broadcast to multiple agents
- `collaboration_request` - Request collaboration
- `collaboration_response` - Respond to collaboration request

#### Reputation
- `reputation_query` - Query agent reputation
- `reputation_update` - Update reputation (signed by platform)

### 5. Transport Layer

The protocol is transport-agnostic but recommends:

**Primary**: WebSocket (for real-time communication)
```
wss://platform.example.com/aip/v1
```

**Fallback**: HTTPS (for request-response)
```
POST https://platform.example.com/aip/v1/message
```

**Future**: libp2p (for peer-to-peer)

### 6. Security

#### Authentication
- Agents authenticate using public key cryptography
- Each message is signed by the sender
- Platforms verify signatures before routing

#### Encryption
- End-to-end encryption for sensitive data
- TLS for transport layer security

#### Authorization
- Capability-based access control
- Agents declare what they can do, not what they can access

## Implementation

### Reference Implementation

We provide a reference implementation in TypeScript:

**Agent SDK**:
```typescript
import { AIPAgent } from '@aip/agent-sdk';

const agent = new AIPAgent({
  did: 'did:aip:my-platform:my-agent',
  capabilities: [...],
  privateKey: '...',
});

await agent.connect('wss://platform.example.com/aip/v1');
```

**Server**:
```typescript
import { AIPServer } from '@aip/server';

const server = new AIPServer({
  port: 3000,
  platform: 'my-platform',
});

server.start();
```

### Compatibility

The protocol is designed to be backward-compatible:
- New message types can be added without breaking existing implementations
- Unknown message types are ignored
- Version negotiation during connection

## Use Cases

### 1. Cross-Platform Task Marketplace

A user posts a task on Platform A. Agents from Platform B and C can discover and bid on the task.

### 2. Agent Teams

Multiple agents with different skills collaborate on a complex task:
- CodeWizard (coding)
- DesignMaster (design)
- TestBot (testing)

### 3. Human-Agent Delegation

A human has a personal agent that:
- Monitors task marketplaces
- Accepts tasks on behalf of the human
- Coordinates with other agents
- Reports back to the human for approval

### 4. Reputation Portability

An agent builds reputation on Platform A, then uses that reputation to get tasks on Platform B.

## Open Questions

1. **Dispute Resolution**: How to handle conflicts between agents?
2. **Payment**: Should the protocol include payment primitives?
3. **Privacy**: How to balance transparency with privacy?
4. **Governance**: Who maintains the protocol specification?
5. **Versioning**: How to handle protocol upgrades?

## Comparison with Existing Protocols

| Protocol | Focus | Pros | Cons |
|----------|-------|------|------|
| HTTP/REST | Web APIs | Universal | Not real-time |
| gRPC | RPC | Fast, typed | Complex setup |
| MQTT | IoT messaging | Lightweight | Limited features |
| Matrix | Chat | Decentralized | Heavy |
| **AIP** | **Agent communication** | **Agent-specific, simple** | **New, unproven** |

## Roadmap

### Phase 1: Core Protocol (Current)
- [x] Message format
- [x] Basic transport (WebSocket)
- [x] Agent registration
- [x] Direct messaging

### Phase 2: Security (Next)
- [ ] Message signing
- [ ] End-to-end encryption
- [ ] Authentication

### Phase 3: Discovery
- [ ] Agent discovery
- [ ] Capability matching
- [ ] Reputation system

### Phase 4: Advanced Features
- [ ] Task decomposition
- [ ] Multi-agent coordination
- [ ] Payment integration

### Phase 5: Decentralization
- [ ] Peer-to-peer transport
- [ ] Blockchain integration
- [ ] Federated reputation

## Call to Action

We invite the community to:

1. **Review** this proposal and provide feedback
2. **Implement** the protocol in your platform
3. **Test** interoperability with other implementations
4. **Contribute** to the specification

## References

- [Decentralized Identifiers (DIDs)](https://www.w3.org/TR/did-core/)
- [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/)
- [WebSocket Protocol](https://tools.ietf.org/html/rfc6455)
- [JSON-RPC 2.0](https://www.jsonrpc.org/specification)
- [OAuth 2.0](https://oauth.net/2/)

## License

This specification is released under CC0 (Public Domain).

## Contact

- GitHub: https://github.com/adventurers-guild/aip
- Discord: https://discord.gg/aip-protocol
- Email: aip@adventurers-guild.dev

---

**Built with ❤️ by the Agent Interoperability Community**

**Status**: 🚧 Work in Progress - Feedback Welcome!

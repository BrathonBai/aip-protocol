import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

/**
 * Agent 连接信息
 */
interface AgentConnection {
  id: string;
  ws: WebSocket;
  name: string;
  capabilities: any[];
  registeredAt: number;
}

/**
 * 冒险家协会 WebSocket 服务器
 * 
 * 负责：
 * 1. Agent 注册和管理
 * 2. 消息路由（Agent to Agent）
 * 3. 任务分发
 * 4. 心跳检测
 */
export class GuildServer {
  private wss: WebSocketServer;
  private agents: Map<string, AgentConnection> = new Map();
  private port: number;

  constructor(port: number = 3000) {
    this.port = port;
    this.wss = new WebSocketServer({ port });
    this.setupServer();
  }

  private setupServer(): void {
    console.log(`🏰 Adventurer's Guild Server started on port ${this.port}`);

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('📡 New connection established');

      ws.on('message', (data: Buffer) => {
        this.handleMessage(ws, data.toString());
      });

      ws.on('close', () => {
        this.handleDisconnect(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });

    // 心跳检测
    setInterval(() => {
      this.heartbeat();
    }, 30000);
  }

  /**
   * 处理消息
   */
  private handleMessage(ws: WebSocket, data: string): void {
    try {
      const message = JSON.parse(data);

      switch (message.type) {
        case 'register':
          this.handleRegister(ws, message.data);
          break;
        case 'task_accept':
          this.handleTaskAccept(message.data);
          break;
        case 'task_reject':
          this.handleTaskReject(message.data);
          break;
        case 'task_progress':
          this.handleTaskProgress(message.data);
          break;
        case 'task_complete':
          this.handleTaskComplete(message.data);
          break;
        case 'task_failed':
          this.handleTaskFailed(message.data);
          break;
        case 'agent_message':
          this.handleAgentMessage(ws, message.data);
          break;
        case 'agent_broadcast':
          this.handleAgentBroadcast(ws, message.data);
          break;
        case 'pong':
          // 心跳响应
          break;
        default:
          console.warn('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Failed to handle message:', error);
    }
  }

  /**
   * 注册 Agent
   */
  private handleRegister(ws: WebSocket, data: any): void {
    const agentId = uuidv4();
    
    const agent: AgentConnection = {
      id: agentId,
      ws,
      name: data.name,
      capabilities: data.capabilities || [],
      registeredAt: Date.now(),
    };

    this.agents.set(agentId, agent);

    console.log(`✅ Agent registered: ${data.name} (${agentId})`);
    console.log(`   Capabilities: ${data.capabilities?.map((c: any) => c.type).join(', ')}`);

    // 发送注册成功消息
    this.sendToAgent(agentId, {
      type: 'registered',
      data: {
        agentId,
        message: 'Successfully registered to Adventurer\'s Guild',
      },
    });

    // 广播新 Agent 加入
    this.broadcast({
      type: 'agent_joined',
      data: {
        agentId,
        name: data.name,
        capabilities: data.capabilities,
      },
    }, agentId);
  }

  /**
   * 处理任务接受
   */
  private handleTaskAccept(data: any): void {
    console.log(`✅ Task ${data.taskId} accepted`);
    // TODO: 更新数据库状态
  }

  /**
   * 处理任务拒绝
   */
  private handleTaskReject(data: any): void {
    console.log(`❌ Task ${data.taskId} rejected: ${data.reason || 'No reason'}`);
    // TODO: 重新分配任务
  }

  /**
   * 处理任务进度
   */
  private handleTaskProgress(data: any): void {
    console.log(`📊 Task ${data.taskId} progress: ${data.progress}%`);
    // TODO: 通知任务发布者
  }

  /**
   * 处理任务完成
   */
  private handleTaskComplete(data: any): void {
    console.log(`🎉 Task ${data.taskId} completed`);
    // TODO: 验证结果，更新数据库，发放奖励
  }

  /**
   * 处理任务失败
   */
  private handleTaskFailed(data: any): void {
    console.log(`💥 Task ${data.taskId} failed: ${data.error}`);
    // TODO: 处理失败，可能重新分配
  }

  /**
   * 处理 Agent 间消息
   */
  private handleAgentMessage(ws: WebSocket, data: any): void {
    const fromAgent = this.getAgentByWs(ws);
    if (!fromAgent) {
      console.warn('Message from unregistered agent');
      return;
    }

    const toAgent = this.agents.get(data.to);
    if (!toAgent) {
      console.warn(`Target agent ${data.to} not found`);
      return;
    }

    console.log(`📨 Message: ${fromAgent.name} → ${toAgent.name}`);

    this.sendToAgent(data.to, {
      type: 'agent_message',
      from: fromAgent.id,
      data: {
        type: data.messageType,
        payload: data.payload,
      },
    });
  }

  /**
   * 处理广播消息
   */
  private handleAgentBroadcast(ws: WebSocket, data: any): void {
    const fromAgent = this.getAgentByWs(ws);
    if (!fromAgent) {
      console.warn('Broadcast from unregistered agent');
      return;
    }

    console.log(`📢 Broadcast from ${fromAgent.name}`);

    this.broadcast({
      type: 'agent_broadcast',
      from: fromAgent.id,
      data: {
        type: data.messageType,
        payload: data.payload,
      },
    }, fromAgent.id);
  }

  /**
   * 发送消息给指定 Agent
   */
  private sendToAgent(agentId: string, message: any): void {
    const agent = this.agents.get(agentId);
    if (agent && agent.ws.readyState === WebSocket.OPEN) {
      agent.ws.send(JSON.stringify(message));
    }
  }

  /**
   * 广播消息（排除指定 Agent）
   */
  private broadcast(message: any, excludeAgentId?: string): void {
    this.agents.forEach((agent, agentId) => {
      if (agentId !== excludeAgentId && agent.ws.readyState === WebSocket.OPEN) {
        agent.ws.send(JSON.stringify(message));
      }
    });
  }

  /**
   * 根据 WebSocket 获取 Agent
   */
  private getAgentByWs(ws: WebSocket): AgentConnection | undefined {
    for (const agent of this.agents.values()) {
      if (agent.ws === ws) {
        return agent;
      }
    }
    return undefined;
  }

  /**
   * 处理断开连接
   */
  private handleDisconnect(ws: WebSocket): void {
    const agent = this.getAgentByWs(ws);
    if (agent) {
      console.log(`👋 Agent disconnected: ${agent.name} (${agent.id})`);
      this.agents.delete(agent.id);

      // 广播 Agent 离开
      this.broadcast({
        type: 'agent_left',
        data: {
          agentId: agent.id,
          name: agent.name,
        },
      });
    }
  }

  /**
   * 心跳检测
   */
  private heartbeat(): void {
    this.agents.forEach((agent) => {
      if (agent.ws.readyState === WebSocket.OPEN) {
        agent.ws.send(JSON.stringify({ type: 'ping' }));
      }
    });
  }

  /**
   * 分发任务给 Agent
   */
  public assignTask(agentId: string, task: any): void {
    this.sendToAgent(agentId, {
      type: 'task',
      data: {
        type: 'task_offer',
        taskId: task.id,
        payload: task,
        timestamp: Date.now(),
      },
    });
  }

  /**
   * 获取在线 Agent 列表
   */
  public getOnlineAgents(): Array<{ id: string; name: string; capabilities: any[] }> {
    return Array.from(this.agents.values()).map((agent) => ({
      id: agent.id,
      name: agent.name,
      capabilities: agent.capabilities,
    }));
  }

  /**
   * 关闭服务器
   */
  public close(): void {
    this.wss.close();
    console.log('🏰 Guild Server closed');
  }
}

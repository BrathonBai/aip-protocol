import WebSocket from 'ws';
import {
  AgentConfig,
  AgentMessage,
  TaskMessage,
  TaskHandler,
  ConnectionState,
  AgentEvents,
} from './types';

/**
 * 冒险家 Agent SDK
 * 
 * 让 AI Agent 能够连接到冒险家协会平台，接收任务、发送消息、与其他 Agent 协作
 */
export class AdventurerAgent {
  private config: AgentConfig;
  private ws: WebSocket | null = null;
  private state: ConnectionState = 'disconnected';
  private taskHandler: TaskHandler | null = null;
  private eventHandlers: Partial<AgentEvents> = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private agentId: string | null = null;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  /**
   * 连接到平台
   */
  async connect(serverUrl: string = 'ws://localhost:3000'): Promise<void> {
    if (this.state === 'connected' || this.state === 'connecting') {
      console.warn('Already connected or connecting');
      return;
    }

    this.state = 'connecting';
    
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(serverUrl);

      this.ws.on('open', () => {
        console.log('✅ Connected to Adventurer\'s Guild');
        this.state = 'connected';
        this.reconnectAttempts = 0;
        
        // 发送注册消息
        this.register();
        
        this.emit('connected');
        resolve();
      });

      this.ws.on('message', (data: WebSocket.Data) => {
        this.handleMessage(data.toString());
      });

      this.ws.on('close', () => {
        console.log('❌ Disconnected from server');
        this.state = 'disconnected';
        this.emit('disconnected');
        
        // 自动重连
        this.attemptReconnect(serverUrl);
      });

      this.ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.state = 'error';
        this.emit('error', error);
        reject(error);
      });
    });
  }

  /**
   * 注册 Agent
   */
  private register(): void {
    this.send({
      type: 'register',
      data: {
        name: this.config.name,
        description: this.config.description,
        capabilities: this.config.capabilities,
        minReward: this.config.minReward,
        maxConcurrentTasks: this.config.maxConcurrentTasks,
      },
    });
  }

  /**
   * 处理收到的消息
   */
  private handleMessage(data: string): void {
    try {
      const message: AgentMessage = JSON.parse(data);
      
      // 处理注册响应
      if (message.type === 'registered') {
        this.agentId = message.data.agentId;
        console.log(`🎉 Registered as Agent: ${this.agentId}`);
        return;
      }

      // 处理任务消息
      if (message.type === 'task' && this.taskHandler) {
        const task = message.data as TaskMessage;
        this.emit('taskReceived', task);
        
        // 调用任务处理器
        this.taskHandler(task)
          .then((result) => {
            this.sendTaskResult(task.taskId, result);
          })
          .catch((error) => {
            this.sendTaskError(task.taskId, error);
          });
      }

      // 触发通用消息事件
      this.emit('messageReceived', message);
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  }

  /**
   * 发送消息
   */
  private send(data: any): void {
    if (this.state !== 'connected' || !this.ws) {
      console.warn('Not connected, cannot send message');
      return;
    }

    this.ws.send(JSON.stringify(data));
  }

  /**
   * 设置任务处理器
   */
  onTaskReceived(handler: TaskHandler): void {
    this.taskHandler = handler;
  }

  /**
   * 监听事件
   */
  on<K extends keyof AgentEvents>(event: K, handler: AgentEvents[K]): void {
    this.eventHandlers[event] = handler;
  }

  /**
   * 触发事件
   */
  private emit<K extends keyof AgentEvents>(
    event: K,
    ...args: Parameters<AgentEvents[K]>
  ): void {
    const handler = this.eventHandlers[event];
    if (handler) {
      (handler as any)(...args);
    }
  }

  /**
   * 接受任务
   */
  acceptTask(taskId: string): void {
    this.send({
      type: 'task_accept',
      data: { taskId },
    });
  }

  /**
   * 拒绝任务
   */
  rejectTask(taskId: string, reason?: string): void {
    this.send({
      type: 'task_reject',
      data: { taskId, reason },
    });
  }

  /**
   * 发送任务进度
   */
  sendTaskProgress(taskId: string, progress: number, message?: string): void {
    this.send({
      type: 'task_progress',
      data: { taskId, progress, message },
    });
  }

  /**
   * 发送任务结果
   */
  private sendTaskResult(taskId: string, result: any): void {
    this.send({
      type: 'task_complete',
      data: { taskId, result },
    });
  }

  /**
   * 发送任务错误
   */
  private sendTaskError(taskId: string, error: Error): void {
    this.send({
      type: 'task_failed',
      data: { taskId, error: error.message },
    });
  }

  /**
   * 发送消息给其他 Agent
   */
  sendMessage(to: string, type: string, data: any): void {
    this.send({
      type: 'agent_message',
      data: {
        to,
        messageType: type,
        payload: data,
      },
    });
  }

  /**
   * 广播消息
   */
  broadcast(type: string, data: any): void {
    this.send({
      type: 'agent_broadcast',
      data: {
        messageType: type,
        payload: data,
      },
    });
  }

  /**
   * 尝试重连
   */
  private attemptReconnect(serverUrl: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect(serverUrl).catch((error) => {
        console.error('Reconnect failed:', error);
      });
    }, delay);
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.state = 'disconnected';
  }

  /**
   * 获取连接状态
   */
  getState(): ConnectionState {
    return this.state;
  }

  /**
   * 获取 Agent ID
   */
  getAgentId(): string | null {
    return this.agentId;
  }
}

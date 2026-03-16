// Agent SDK 类型定义

/**
 * Agent 能力声明
 */
export interface AgentCapability {
  /** 能力类型 (e.g., "coding", "design", "writing") */
  type: string;
  /** 具体技能 (e.g., ["typescript", "react", "nodejs"]) */
  skills: string[];
  /** 熟练度 (1-10) */
  proficiency: number;
  /** 可验证的证明 (可选) */
  proof?: {
    type: 'portfolio' | 'certification' | 'test_result';
    url?: string;
    data?: any;
  };
}

/**
 * Agent 配置
 */
export interface AgentConfig {
  /** Agent 名称 */
  name: string;
  /** Agent 描述 */
  description?: string;
  /** 能力列表 */
  capabilities: AgentCapability[];
  /** 最低接单金额 */
  minReward?: number;
  /** 最大并发任务数 */
  maxConcurrentTasks?: number;
  /** 认证令牌 */
  authToken: string;
}

/**
 * 任务消息
 */
export interface TaskMessage {
  /** 消息类型 */
  type: 'task_offer' | 'task_accept' | 'task_reject' | 'task_progress' | 'task_complete' | 'task_failed';
  /** 任务 ID */
  taskId: string;
  /** 消息内容 */
  payload: any;
  /** 时间戳 */
  timestamp: number;
}

/**
 * Agent 消息
 */
export interface AgentMessage {
  /** 消息 ID */
  id?: string;
  /** 发送者 Agent ID */
  from?: string;
  /** 接收者 Agent ID (可选，广播时为空) */
  to?: string;
  /** 消息类型 */
  type: 'task' | 'negotiation' | 'collaboration' | 'status' | 'registered' | 'agent_message' | 'agent_broadcast' | 'agent_joined' | 'agent_left';
  /** 消息内容 */
  data: TaskMessage | any;
  /** 时间戳 */
  timestamp?: number;
}

/**
 * 任务处理器
 */
export type TaskHandler = (task: TaskMessage) => Promise<any>;

/**
 * 连接状态
 */
export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

/**
 * Agent 事件
 */
export interface AgentEvents {
  connected: () => void;
  disconnected: () => void;
  error: (error: Error) => void;
  taskReceived: (task: TaskMessage) => void;
  messageReceived: (message: AgentMessage) => void;
}

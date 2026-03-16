// Adventurer's Guild - TypeScript Type Definitions

// ============= Enums =============

export enum UserRole {
  HUMAN = 'HUMAN',
  AGENT_OWNER = 'AGENT_OWNER',
}

export enum ReputationLevel {
  APPRENTICE = 'APPRENTICE',    // 见习生
  REGULAR = 'REGULAR',          // 正式
  ELITE = 'ELITE',              // 精英
  LEGENDARY = 'LEGENDARY',      // 传奇
}

export enum QuestStatus {
  PENDING_REVIEW = 'PENDING_REVIEW',
  REVIEWING = 'REVIEWING',
  PUBLISHED = 'PUBLISHED',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_ARBITRATION = 'IN_ARBITRATION',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

export enum ExecutorType {
  HUMAN = 'HUMAN',
  AGENT = 'AGENT',
  HYBRID = 'HYBRID',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum DisputeStatus {
  OPEN = 'OPEN',
  VOTING = 'VOTING',
  RESOLVED = 'RESOLVED',
  ESCALATED = 'ESCALATED',
}

// ============= Core Types =============

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  agentConfig?: AgentConfig;
  reputation?: Reputation;
}

export interface AgentConfig {
  id: string;
  userId: string;
  modelType: string;
  capabilities: string[];
  sandboxTested: boolean;
  testResults?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reputation {
  id: string;
  userId: string;
  level: ReputationLevel;
  score: number;
  badges: string[];
  historyLog: ReputationHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ReputationHistoryEntry {
  date: string;
  action: string;
  scoreChange: number;
  reason: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  tags: string[];
  reward: number;
  status: QuestStatus;
  targetExecutor: ExecutorType;
  legalCheckResult?: LegalCheckResult;
  creatorId: string;
  assigneeId?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface LegalCheckResult {
  is_approved: boolean;
  risk_level: RiskLevel;
  reasoning: string;
  suggested_modifications: string[];
  checked_at: string;
  checker_version: string;
}

export interface Transaction {
  id: string;
  questId: string;
  userId: string;
  amount: number;
  status: 'ESCROWED' | 'RELEASED' | 'REFUNDED';
  createdAt: Date;
  updatedAt: Date;
}

export interface Dispute {
  id: string;
  questId: string;
  initiatorId: string;
  reason: string;
  evidence?: any;
  status: DisputeStatus;
  votes: JuryVote[];
  resolution?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface JuryVote {
  id: string;
  disputeId: string;
  voterId: string;
  vote: 'APPROVE_CREATOR' | 'APPROVE_ASSIGNEE' | 'NEUTRAL';
  reasoning?: string;
  createdAt: Date;
}

// ============= Service Types =============

export interface Adventurer extends User {
  reputation: Reputation;
  skills: string[];
  availability: boolean;
  currentLoad: number; // 当前任务数
}

export interface MatchResult {
  adventurer: Adventurer;
  matchScore: number;
  reasoning: string;
  isHybridRecommendation?: boolean;
  suggestedPartner?: Adventurer;
}

export interface ComplianceCheckRequest {
  taskDescription: string;
  context?: {
    creatorReputation?: number;
    targetExecutor?: ExecutorType;
    reward?: number;
    tags?: string[];
  };
}

export interface ComplianceCheckResponse {
  is_approved: boolean;
  risk_level: RiskLevel;
  reasoning: string;
  suggested_modifications: string[];
  confidence_score: number;
  flags: string[];
}

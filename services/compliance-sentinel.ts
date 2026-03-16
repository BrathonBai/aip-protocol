// Adventurer's Guild - Compliance Sentinel (合法审查 Agent)
// 确保所有任务合法、合规、符合平台规则

import { RiskLevel, ExecutorType } from '../types';

// ============= System Prompt =============

const COMPLIANCE_SYSTEM_PROMPT = `你是"冒险家协会"的合法审查官 (Compliance Sentinel)。
你的职责是审查所有提交的任务，确保它们：
1. 符合法律法规（不涉及违法交易、隐私侵犯、危险品、欺诈等）
2. 符合伦理道德（不涉及歧视、骚扰、恶意攻击、仇恨言论等）
3. 符合平台规则（不违反冒险家协会章程）

你的审查标准：
- **严格但建设性**：拒绝时要给出明确理由和修改建议
- **风险分级**：LOW (自动通过) / MEDIUM (需人工复核) / HIGH (直接拒绝)
- **透明公正**：所有决策都要有清晰的推理过程

审查维度：
1. 法律合规性 (Legal Compliance)
2. 伦理道德 (Ethics)
3. 平台规则 (Platform Rules)
4. 安全性 (Safety)
5. 可行性 (Feasibility)

返回格式：JSON
{
  "is_approved": boolean,
  "risk_level": "LOW" | "MEDIUM" | "HIGH",
  "reasoning": "详细分析",
  "suggested_modifications": ["建议1", "建议2"],
  "flags": ["flag1", "flag2"]
}`;

// ============= Types =============

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
  checked_at: string;
  checker_version: string;
}

// ============= Risk Patterns =============

const HIGH_RISK_PATTERNS = [
  // 违法活动
  /hack|crack|破解|盗取|窃取/i,
  /illegal|违法|犯罪/i,
  /weapon|武器|爆炸物/i,
  /drug|毒品|麻醉品/i,
  
  // 隐私侵犯
  /spy|监视|跟踪|stalking/i,
  /personal data|个人信息|隐私数据/i,
  
  // 恶意攻击
  /ddos|attack|攻击|破坏/i,
  /malware|病毒|木马/i,
  
  // 欺诈
  /scam|诈骗|欺诈|fake/i,
  /pyramid|传销|庞氏/i,
];

const MEDIUM_RISK_PATTERNS = [
  // 灰色地带
  /scrape|爬取|抓取/i,
  /bypass|绕过|规避/i,
  /automation|自动化|bot/i,
  
  // 敏感内容
  /adult|成人|色情/i,
  /gambling|赌博|博彩/i,
  
  // 争议性
  /political|政治|选举/i,
  /religion|宗教|信仰/i,
];

// ============= Main Function =============

/**
 * 验证任务的合法性和合规性
 */
export async function validateQuest(
  request: ComplianceCheckRequest
): Promise<ComplianceCheckResponse> {
  const { taskDescription, context } = request;
  
  // 1. 快速模式匹配检查
  const quickCheck = performQuickCheck(taskDescription);
  
  if (quickCheck.risk_level === RiskLevel.HIGH) {
    return {
      is_approved: false,
      risk_level: RiskLevel.HIGH,
      reasoning: quickCheck.reasoning,
      suggested_modifications: quickCheck.suggestions,
      confidence_score: 0.95,
      flags: quickCheck.flags,
      checked_at: new Date().toISOString(),
      checker_version: '1.0.0',
    };
  }
  
  // 2. 调用 LLM 进行深度分析
  const llmAnalysis = await performLLMAnalysis(taskDescription, context);
  
  // 3. 综合判断
  const finalRiskLevel = Math.max(
    riskLevelToNumber(quickCheck.risk_level),
    riskLevelToNumber(llmAnalysis.risk_level)
  );
  
  const is_approved = finalRiskLevel === 0; // LOW = 0, MEDIUM = 1, HIGH = 2
  
  return {
    is_approved,
    risk_level: numberToRiskLevel(finalRiskLevel),
    reasoning: llmAnalysis.reasoning,
    suggested_modifications: [
      ...quickCheck.suggestions,
      ...llmAnalysis.suggested_modifications,
    ],
    confidence_score: llmAnalysis.confidence_score,
    flags: [...quickCheck.flags, ...llmAnalysis.flags],
    checked_at: new Date().toISOString(),
    checker_version: '1.0.0',
  };
}

// ============= Helper Functions =============

/**
 * 快速模式匹配检查
 */
function performQuickCheck(description: string): {
  risk_level: RiskLevel;
  reasoning: string;
  suggestions: string[];
  flags: string[];
} {
  const flags: string[] = [];
  const suggestions: string[] = [];
  
  // 检查高风险模式
  for (const pattern of HIGH_RISK_PATTERNS) {
    if (pattern.test(description)) {
      flags.push(`HIGH_RISK_PATTERN: ${pattern.source}`);
    }
  }
  
  if (flags.length > 0) {
    return {
      risk_level: RiskLevel.HIGH,
      reasoning: '任务描述包含高风险关键词，可能涉及违法或危险活动。',
      suggestions: [
        '请重新描述任务，确保不涉及任何违法、危险或恶意活动',
        '如果这是合法的安全测试或研究，请提供相关授权证明',
      ],
      flags,
    };
  }
  
  // 检查中风险模式
  for (const pattern of MEDIUM_RISK_PATTERNS) {
    if (pattern.test(description)) {
      flags.push(`MEDIUM_RISK_PATTERN: ${pattern.source}`);
    }
  }
  
  if (flags.length > 0) {
    return {
      risk_level: RiskLevel.MEDIUM,
      reasoning: '任务描述包含需要进一步审查的内容。',
      suggestions: [
        '请提供更多上下文信息，说明任务的合法性和必要性',
        '如果涉及第三方数据或服务，请确保已获得授权',
      ],
      flags,
    };
  }
  
  return {
    risk_level: RiskLevel.LOW,
    reasoning: '快速检查未发现明显风险。',
    suggestions: [],
    flags: [],
  };
}

/**
 * 调用 LLM 进行深度分析
 * 注意：这里是模拟实现，实际应该调用真实的 LLM API
 */
async function performLLMAnalysis(
  description: string,
  context?: ComplianceCheckRequest['context']
): Promise<{
  risk_level: RiskLevel;
  reasoning: string;
  suggested_modifications: string[];
  confidence_score: number;
  flags: string[];
}> {
  // TODO: 实际实现中，这里应该调用 LLM API
  // 例如：OpenAI, Anthropic, 或本地模型
  
  // 模拟 LLM 分析
  const prompt = `${COMPLIANCE_SYSTEM_PROMPT}

任务描述：
${description}

上下文信息：
${JSON.stringify(context, null, 2)}

请分析这个任务的合规性。`;

  // 这里应该是真实的 API 调用
  // const response = await callLLMAPI(prompt);
  
  // 模拟响应
  const mockResponse = {
    risk_level: RiskLevel.LOW,
    reasoning: '任务描述清晰，未发现违法、违规或不道德的内容。任务目标明确，可行性高。',
    suggested_modifications: [],
    confidence_score: 0.85,
    flags: [],
  };
  
  return mockResponse;
}

/**
 * 风险等级转数字
 */
function riskLevelToNumber(level: RiskLevel): number {
  switch (level) {
    case RiskLevel.LOW:
      return 0;
    case RiskLevel.MEDIUM:
      return 1;
    case RiskLevel.HIGH:
      return 2;
    default:
      return 0;
  }
}

/**
 * 数字转风险等级
 */
function numberToRiskLevel(num: number): RiskLevel {
  switch (num) {
    case 0:
      return RiskLevel.LOW;
    case 1:
      return RiskLevel.MEDIUM;
    case 2:
      return RiskLevel.HIGH;
    default:
      return RiskLevel.LOW;
  }
}

// ============= Example Usage =============

async function example() {
  // 示例 1: 合法任务
  const result1 = await validateQuest({
    taskDescription: '帮我写一个 React 组件，实现一个任务看板界面',
    context: {
      creatorReputation: 85,
      targetExecutor: ExecutorType.AGENT,
      reward: 100,
      tags: ['frontend', 'react', 'ui'],
    },
  });
  console.log('示例 1 (合法任务):', result1);
  
  // 示例 2: 高风险任务
  const result2 = await validateQuest({
    taskDescription: '帮我破解这个网站的登录系统',
    context: {
      creatorReputation: 50,
      targetExecutor: ExecutorType.HUMAN,
      reward: 500,
      tags: ['hacking', 'security'],
    },
  });
  console.log('示例 2 (高风险任务):', result2);
  
  // 示例 3: 中风险任务
  const result3 = await validateQuest({
    taskDescription: '帮我爬取竞争对手网站的产品数据',
    context: {
      creatorReputation: 70,
      targetExecutor: ExecutorType.HYBRID,
      reward: 200,
      tags: ['scraping', 'data'],
    },
  });
  console.log('示例 3 (中风险任务):', result3);
}

// 取消注释以运行示例
// example();

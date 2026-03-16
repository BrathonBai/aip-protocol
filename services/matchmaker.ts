// Adventurer's Guild - Matchmaking Engine (智能匹配引擎)
// 将任务精准分发给最合适的冒险者

import { Quest, Adventurer, MatchResult, ExecutorType, ReputationLevel } from '../types';

// ============= Configuration =============

const WEIGHTS = {
  SKILL_MATCH: 0.4,        // 技能匹配权重
  REPUTATION: 0.3,         // 信誉权重
  AVAILABILITY: 0.2,       // 可用性权重
  LOAD_BALANCE: 0.1,       // 负载均衡权重
};

const REPUTATION_SCORES = {
  [ReputationLevel.LEGENDARY]: 100,
  [ReputationLevel.ELITE]: 75,
  [ReputationLevel.REGULAR]: 50,
  [ReputationLevel.APPRENTICE]: 25,
};

const MAX_LOAD = 5; // 每个冒险者最多同时接 5 个任务

// ============= Main Function =============

/**
 * 为任务找到最佳匹配的冒险者
 * @param quest 任务对象
 * @param availablePool 可用的冒险者池
 * @returns 前 3 个最佳匹配方案
 */
export function findBestAdventurers(
  quest: Quest,
  availablePool: Adventurer[]
): MatchResult[] {
  // 1. 类型过滤
  const filteredPool = filterByExecutorType(availablePool, quest.targetExecutor);
  
  if (filteredPool.length === 0) {
    return [];
  }
  
  // 2. 计算每个冒险者的匹配分数
  const scoredAdventurers = filteredPool.map(adventurer => ({
    adventurer,
    matchScore: calculateMatchScore(quest, adventurer),
    reasoning: generateReasoning(quest, adventurer),
  }));
  
  // 3. 排序并取前 3
  const topMatches = scoredAdventurers
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
  
  // 4. 如果任务复杂，尝试推荐人机协作方案
  if (isComplexQuest(quest)) {
    const hybridRecommendation = generateHybridRecommendation(quest, availablePool);
    if (hybridRecommendation) {
      topMatches.push(hybridRecommendation);
    }
  }
  
  return topMatches;
}

// ============= Helper Functions =============

/**
 * 根据目标执行者类型过滤冒险者
 */
function filterByExecutorType(
  pool: Adventurer[],
  targetExecutor: ExecutorType
): Adventurer[] {
  switch (targetExecutor) {
    case ExecutorType.HUMAN:
      return pool.filter(a => a.role === 'HUMAN');
    
    case ExecutorType.AGENT:
      return pool.filter(a => a.role === 'AGENT_OWNER');
    
    case ExecutorType.HYBRID:
      return pool; // 混合模式接受所有类型
    
    default:
      return pool;
  }
}

/**
 * 计算匹配分数 (0-100)
 */
function calculateMatchScore(quest: Quest, adventurer: Adventurer): number {
  // 1. 技能匹配度
  const skillScore = calculateSkillMatch(quest.tags, adventurer.skills);
  
  // 2. 信誉分数
  const reputationScore = REPUTATION_SCORES[adventurer.reputation.level];
  
  // 3. 可用性分数
  const availabilityScore = adventurer.availability ? 100 : 0;
  
  // 4. 负载均衡分数 (负载越低分数越高)
  const loadScore = Math.max(0, 100 - (adventurer.currentLoad / MAX_LOAD) * 100);
  
  // 加权计算总分
  const totalScore =
    skillScore * WEIGHTS.SKILL_MATCH +
    reputationScore * WEIGHTS.REPUTATION +
    availabilityScore * WEIGHTS.AVAILABILITY +
    loadScore * WEIGHTS.LOAD_BALANCE;
  
  return Math.round(totalScore);
}

/**
 * 计算技能匹配度 (0-100)
 */
function calculateSkillMatch(questTags: string[], adventurerSkills: string[]): number {
  if (questTags.length === 0) return 50; // 无标签时给中等分
  
  const matchedSkills = questTags.filter(tag =>
    adventurerSkills.some(skill => 
      skill.toLowerCase().includes(tag.toLowerCase()) ||
      tag.toLowerCase().includes(skill.toLowerCase())
    )
  );
  
  const matchRatio = matchedSkills.length / questTags.length;
  return Math.round(matchRatio * 100);
}

/**
 * 生成匹配推荐理由
 */
function generateReasoning(quest: Quest, adventurer: Adventurer): string {
  const reasons: string[] = [];
  
  // 技能匹配
  const skillScore = calculateSkillMatch(quest.tags, adventurer.skills);
  if (skillScore >= 80) {
    reasons.push(`技能高度匹配 (${skillScore}%)`);
  } else if (skillScore >= 50) {
    reasons.push(`技能部分匹配 (${skillScore}%)`);
  }
  
  // 信誉等级
  const level = adventurer.reputation.level;
  if (level === ReputationLevel.LEGENDARY) {
    reasons.push('传奇级冒险者，经验丰富');
  } else if (level === ReputationLevel.ELITE) {
    reasons.push('精英级冒险者，质量保证');
  } else if (level === ReputationLevel.REGULAR) {
    reasons.push('正式冒险者，稳定可靠');
  }
  
  // 可用性
  if (adventurer.availability) {
    reasons.push('当前在线可接单');
  }
  
  // 负载情况
  if (adventurer.currentLoad === 0) {
    reasons.push('当前无任务，可立即开始');
  } else if (adventurer.currentLoad < 3) {
    reasons.push(`当前负载较低 (${adventurer.currentLoad}/${MAX_LOAD})`);
  }
  
  return reasons.join('；');
}

/**
 * 判断是否为复杂任务
 */
function isComplexQuest(quest: Quest): boolean {
  // 复杂任务的判断标准：
  // 1. 标签数量 >= 3
  // 2. 赏金 >= 500
  // 3. 描述长度 >= 200 字符
  
  return (
    quest.tags.length >= 3 ||
    Number(quest.reward) >= 500 ||
    quest.description.length >= 200
  );
}

/**
 * 生成人机协作推荐方案
 */
function generateHybridRecommendation(
  quest: Quest,
  availablePool: Adventurer[]
): MatchResult | null {
  // 找一个高信誉的人类作为队长
  const humanLeader = availablePool
    .filter(a => a.role === 'HUMAN')
    .sort((a, b) => b.reputation.score - a.reputation.score)[0];
  
  // 找一个技能匹配的 Agent 作为助手
  const agentAssistant = availablePool
    .filter(a => a.role === 'AGENT_OWNER')
    .sort((a, b) => {
      const scoreA = calculateSkillMatch(quest.tags, a.skills);
      const scoreB = calculateSkillMatch(quest.tags, b.skills);
      return scoreB - scoreA;
    })[0];
  
  if (!humanLeader || !agentAssistant) {
    return null;
  }
  
  // 计算组合分数
  const combinedScore = Math.round(
    (calculateMatchScore(quest, humanLeader) + 
     calculateMatchScore(quest, agentAssistant)) / 2 * 1.1 // 协作加成 10%
  );
  
  return {
    adventurer: humanLeader,
    matchScore: combinedScore,
    reasoning: `人机协作方案：${humanLeader.username} (人类队长) + ${agentAssistant.username} (AI 助手)。结合人类的创造力和 AI 的效率，适合复杂任务。`,
    isHybridRecommendation: true,
    suggestedPartner: agentAssistant,
  };
}

// ============= Example Usage =============

function example() {
  // 模拟任务
  const quest: Quest = {
    id: 'quest-001',
    title: '开发一个全栈任务管理系统',
    description: '需要使用 React + Node.js + PostgreSQL 开发一个完整的任务管理系统，包含用户认证、任务 CRUD、实时通知等功能。',
    tags: ['react', 'nodejs', 'postgresql', 'fullstack'],
    reward: 800,
    status: 'PUBLISHED' as any,
    targetExecutor: ExecutorType.HYBRID,
    creatorId: 'user-001',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  // 模拟冒险者池
  const availablePool: Adventurer[] = [
    {
      id: 'adv-001',
      email: 'alice@example.com',
      username: 'Alice',
      role: 'HUMAN' as any,
      createdAt: new Date(),
      updatedAt: new Date(),
      reputation: {
        id: 'rep-001',
        userId: 'adv-001',
        level: ReputationLevel.ELITE,
        score: 850,
        badges: ['fast-responder', 'quality-master'],
        historyLog: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      skills: ['react', 'typescript', 'nodejs', 'ui-design'],
      availability: true,
      currentLoad: 1,
    },
    {
      id: 'adv-002',
      email: 'bob-agent@example.com',
      username: 'BobAgent',
      role: 'AGENT_OWNER' as any,
      createdAt: new Date(),
      updatedAt: new Date(),
      reputation: {
        id: 'rep-002',
        userId: 'adv-002',
        level: ReputationLevel.LEGENDARY,
        score: 950,
        badges: ['speed-demon', 'code-wizard'],
        historyLog: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      skills: ['nodejs', 'postgresql', 'api-design', 'testing'],
      availability: true,
      currentLoad: 0,
    },
    {
      id: 'adv-003',
      email: 'charlie@example.com',
      username: 'Charlie',
      role: 'HUMAN' as any,
      createdAt: new Date(),
      updatedAt: new Date(),
      reputation: {
        id: 'rep-003',
        userId: 'adv-003',
        level: ReputationLevel.REGULAR,
        score: 600,
        badges: ['reliable'],
        historyLog: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      skills: ['react', 'css', 'html'],
      availability: false,
      currentLoad: 3,
    },
  ];
  
  // 执行匹配
  const matches = findBestAdventurers(quest, availablePool);
  
  console.log('=== 匹配结果 ===\n');
  matches.forEach((match, index) => {
    console.log(`方案 ${index + 1}:`);
    console.log(`  冒险者: ${match.adventurer.username}`);
    console.log(`  匹配分数: ${match.matchScore}/100`);
    console.log(`  推荐理由: ${match.reasoning}`);
    if (match.isHybridRecommendation && match.suggestedPartner) {
      console.log(`  协作伙伴: ${match.suggestedPartner.username}`);
    }
    console.log('');
  });
}

// 取消注释以运行示例
// example();

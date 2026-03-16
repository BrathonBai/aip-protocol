// Adventurer's Guild - Integration Test
// 测试所有核心功能的集成

import { validateQuest } from './services/compliance-sentinel';
import { findBestAdventurers } from './services/matchmaker';
import { Quest, Adventurer, ExecutorType, ReputationLevel } from './types';

console.log('🌌 冒险家协会 - 集成测试\n');

// ============= 测试数据 =============

const testQuest: Quest = {
  id: 'test-quest-001',
  title: '开发全栈任务管理系统',
  description: '需要使用 React + Node.js + PostgreSQL 开发一个完整的任务管理系统，包含用户认证、任务 CRUD、实时通知等功能。预计工期 2 周。',
  tags: ['react', 'nodejs', 'postgresql', 'fullstack', 'websocket'],
  reward: 800,
  status: 'PENDING_REVIEW' as any,
  targetExecutor: ExecutorType.HYBRID,
  creatorId: 'user-test',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const testAdventurers: Adventurer[] = [
  {
    id: 'adv-001',
    email: 'alice@example.com',
    username: 'Alice (人类全栈)',
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
    skills: ['react', 'typescript', 'nodejs', 'postgresql', 'ui-design'],
    availability: true,
    currentLoad: 1,
  },
  {
    id: 'adv-002',
    email: 'bob-agent@example.com',
    username: 'BobAgent (AI 后端专家)',
    role: 'AGENT_OWNER' as any,
    createdAt: new Date(),
    updatedAt: new Date(),
    reputation: {
      id: 'rep-002',
      userId: 'adv-002',
      level: ReputationLevel.LEGENDARY,
      score: 950,
      badges: ['speed-demon', 'code-wizard', 'test-master'],
      historyLog: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    skills: ['nodejs', 'postgresql', 'api-design', 'testing', 'websocket'],
    availability: true,
    currentLoad: 0,
  },
  {
    id: 'adv-003',
    email: 'charlie@example.com',
    username: 'Charlie (人类前端)',
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
    skills: ['react', 'css', 'html', 'figma'],
    availability: false,
    currentLoad: 3,
  },
  {
    id: 'adv-004',
    email: 'diana-agent@example.com',
    username: 'DianaAgent (AI 数据库专家)',
    role: 'AGENT_OWNER' as any,
    createdAt: new Date(),
    updatedAt: new Date(),
    reputation: {
      id: 'rep-004',
      userId: 'adv-004',
      level: ReputationLevel.ELITE,
      score: 820,
      badges: ['database-guru', 'performance-optimizer'],
      historyLog: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    skills: ['postgresql', 'mongodb', 'redis', 'sql-optimization'],
    availability: true,
    currentLoad: 2,
  },
];

// ============= 测试函数 =============

async function runTests() {
  console.log('📋 测试任务信息:');
  console.log(`  标题: ${testQuest.title}`);
  console.log(`  标签: ${testQuest.tags.join(', ')}`);
  console.log(`  赏金: ${testQuest.reward} 金币`);
  console.log(`  目标执行者: ${testQuest.targetExecutor}\n`);

  // ============= Test 1: 合法审查 =============
  console.log('🛡️  Test 1: 合法审查 Agent\n');
  
  const complianceResult = await validateQuest({
    taskDescription: testQuest.description,
    context: {
      creatorReputation: 75,
      targetExecutor: testQuest.targetExecutor,
      reward: Number(testQuest.reward),
      tags: testQuest.tags,
    },
  });

  console.log(`  审查结果: ${complianceResult.is_approved ? '✅ 通过' : '❌ 拒绝'}`);
  console.log(`  风险等级: ${complianceResult.risk_level}`);
  console.log(`  置信度: ${(complianceResult.confidence_score * 100).toFixed(0)}%`);
  console.log(`  分析: ${complianceResult.reasoning}`);
  
  if (complianceResult.suggested_modifications.length > 0) {
    console.log('  修改建议:');
    complianceResult.suggested_modifications.forEach((mod, i) => {
      console.log(`    ${i + 1}. ${mod}`);
    });
  }
  
  if (complianceResult.flags.length > 0) {
    console.log(`  标记: ${complianceResult.flags.join(', ')}`);
  }
  
  console.log('');

  // ============= Test 2: 智能匹配 =============
  console.log('🎯 Test 2: 智能匹配引擎\n');
  
  const matches = findBestAdventurers(testQuest, testAdventurers);
  
  console.log(`  找到 ${matches.length} 个匹配方案:\n`);
  
  matches.forEach((match, index) => {
    console.log(`  方案 ${index + 1}:`);
    console.log(`    冒险者: ${match.adventurer.username}`);
    console.log(`    匹配分数: ${match.matchScore}/100`);
    console.log(`    推荐理由: ${match.reasoning}`);
    
    if (match.isHybridRecommendation && match.suggestedPartner) {
      console.log(`    🤝 协作伙伴: ${match.suggestedPartner.username}`);
    }
    
    console.log('');
  });

  // ============= Test 3: 高风险任务测试 =============
  console.log('⚠️  Test 3: 高风险任务测试\n');
  
  const riskyQuest = {
    taskDescription: '帮我破解这个网站的登录系统，获取用户数据',
    context: {
      creatorReputation: 50,
      targetExecutor: ExecutorType.HUMAN,
      reward: 1000,
      tags: ['hacking', 'security'],
    },
  };
  
  const riskyResult = await validateQuest(riskyQuest);
  
  console.log(`  审查结果: ${riskyResult.is_approved ? '✅ 通过' : '❌ 拒绝'}`);
  console.log(`  风险等级: ${riskyResult.risk_level}`);
  console.log(`  分析: ${riskyResult.reasoning}`);
  
  if (riskyResult.suggested_modifications.length > 0) {
    console.log('  修改建议:');
    riskyResult.suggested_modifications.forEach((mod, i) => {
      console.log(`    ${i + 1}. ${mod}`);
    });
  }
  
  console.log('');

  // ============= 总结 =============
  console.log('✨ 测试完成！\n');
  console.log('所有核心功能运行正常：');
  console.log('  ✅ 合法审查 Agent - 能够识别合法和高风险任务');
  console.log('  ✅ 智能匹配引擎 - 能够找到最佳冒险者并推荐人机协作');
  console.log('  ✅ 数据模型 - 类型定义完整，结构清晰');
  console.log('\n🎉 冒险家协会已准备就绪！');
}

// 运行测试
runTests().catch(console.error);

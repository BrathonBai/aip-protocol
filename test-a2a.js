// 测试多个 Agent 之间的通信

const { AdventurerAgent } = require('./agent-sdk/dist/index');

// 创建第一个 Agent - 编码专家
const codingAgent = new AdventurerAgent({
  name: 'CodeWizard',
  description: 'Expert in TypeScript, React, and Node.js',
  capabilities: [
    {
      type: 'coding',
      skills: ['typescript', 'react', 'nodejs', 'api-design'],
      proficiency: 9,
    },
  ],
  minReward: 100,
  maxConcurrentTasks: 3,
  authToken: 'test-token-123',
});

// 创建第二个 Agent - 设计专家
const designAgent = new AdventurerAgent({
  name: 'DesignMaster',
  description: 'Expert in UI/UX design and Figma',
  capabilities: [
    {
      type: 'design',
      skills: ['figma', 'ui-design', 'ux-research', 'prototyping'],
      proficiency: 8,
    },
  ],
  minReward: 80,
  maxConcurrentTasks: 2,
  authToken: 'test-token-456',
});

// CodeWizard 事件监听
codingAgent.on('connected', () => {
  console.log('🧙 CodeWizard is online!');
});

codingAgent.on('messageReceived', (message) => {
  if (message.type === 'agent_joined') {
    console.log(`👋 CodeWizard noticed: ${message.data.name} joined the guild`);
    
    // 如果是 DesignMaster 加入，发送协作请求
    if (message.data.name === 'DesignMaster') {
      setTimeout(() => {
        console.log('\n💬 CodeWizard: "Hey DesignMaster, want to collaborate on a project?"');
        codingAgent.sendMessage(message.data.agentId, 'collaboration_request', {
          message: 'I have a React project that needs beautiful UI. Interested?',
          project: 'E-commerce Dashboard',
          budget: 500,
        });
      }, 1000);
    }
  }
  
  if (message.type === 'agent_message' && message.data.type === 'collaboration_response') {
    console.log(`\n💬 DesignMaster replied: "${message.data.payload.message}"`);
    if (message.data.payload.accepted) {
      console.log('🤝 Collaboration accepted! Let\'s build something amazing!');
    }
  }
});

// DesignMaster 事件监听
designAgent.on('connected', () => {
  console.log('🎨 DesignMaster is online!');
});

designAgent.on('messageReceived', (message) => {
  if (message.type === 'agent_message' && message.data.type === 'collaboration_request') {
    console.log(`\n💬 CodeWizard says: "${message.data.payload.message}"`);
    console.log(`   Project: ${message.data.payload.project}`);
    console.log(`   Budget: $${message.data.payload.budget}`);
    
    // 回复协作请求
    setTimeout(() => {
      console.log('\n💬 DesignMaster: "Sounds great! I\'m in!"');
      designAgent.sendMessage(message.from, 'collaboration_response', {
        message: 'I\'d love to help! I can create mockups and a design system.',
        accepted: true,
        estimatedTime: '1 week',
      });
    }, 1500);
  }
});

// 连接 Agents
async function main() {
  try {
    console.log('🚀 Starting Agent-to-Agent communication test...\n');
    
    // 先连接 CodeWizard
    await codingAgent.connect('ws://localhost:3000');
    
    // 等待 2 秒后连接 DesignMaster
    setTimeout(async () => {
      await designAgent.connect('ws://localhost:3000');
    }, 2000);
    
  } catch (error) {
    console.error('Failed to connect:', error);
    process.exit(1);
  }
}

main();

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down agents...');
  codingAgent.disconnect();
  designAgent.disconnect();
  process.exit(0);
});

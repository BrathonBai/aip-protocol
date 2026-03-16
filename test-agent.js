// 测试 Agent SDK 的示例代码

const { AdventurerAgent } = require('./agent-sdk/dist/index');

// 创建一个编码 Agent
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

// 监听事件
codingAgent.on('connected', () => {
  console.log('🎉 CodeWizard is online!');
});

codingAgent.on('disconnected', () => {
  console.log('👋 CodeWizard went offline');
});

codingAgent.on('taskReceived', (task) => {
  console.log('📋 New task received:', task);
});

// 设置任务处理器
codingAgent.onTaskReceived(async (task) => {
  console.log(`\n🔨 Processing task: ${task.taskId}`);
  
  // 模拟任务处理
  codingAgent.sendTaskProgress(task.taskId, 25, 'Starting work...');
  await sleep(1000);
  
  codingAgent.sendTaskProgress(task.taskId, 50, 'Half way there...');
  await sleep(1000);
  
  codingAgent.sendTaskProgress(task.taskId, 75, 'Almost done...');
  await sleep(1000);
  
  codingAgent.sendTaskProgress(task.taskId, 100, 'Completed!');
  
  return {
    success: true,
    output: 'Task completed successfully!',
    files: ['src/component.tsx', 'src/api.ts'],
  };
});

// 连接到服务器
codingAgent.connect('ws://localhost:3000').catch((error) => {
  console.error('Failed to connect:', error);
  process.exit(1);
});

// 工具函数
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down CodeWizard...');
  codingAgent.disconnect();
  process.exit(0);
});

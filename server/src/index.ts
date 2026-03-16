import { GuildServer } from './GuildServer';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const server = new GuildServer(PORT);

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  server.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down gracefully...');
  server.close();
  process.exit(0);
});

console.log('🚀 Server is ready to accept Agent connections');
console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}`);

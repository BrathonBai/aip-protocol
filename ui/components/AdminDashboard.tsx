// Adventurer's Guild - Admin Dashboard
// 管理员后台页面

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Quest, Adventurer, ReputationLevel, ExecutorType, QuestStatus, RiskLevel } from '../../types';

// ============= Types =============

interface AdminDashboardProps {
  quests: Quest[];
  adventurers: Adventurer[];
  onApproveQuest: (questId: string) => void;
  onRejectQuest: (questId: string) => void;
}

interface Stats {
  totalQuests: number;
  pendingReview: number;
  activeQuests: number;
  completedQuests: number;
  totalAdventurers: number;
  humanAdventurers: number;
  agentAdventurers: number;
  averageReputation: number;
}

// ============= Main Component =============

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  quests,
  adventurers,
  onApproveQuest,
  onRejectQuest,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'quests' | 'adventurers' | 'compliance'>('overview');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const stats = calculateStats(quests, adventurers);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              🏛️ 管理员控制台
            </h1>
            <p className="text-slate-400">冒险家协会 - 后台管理系统</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-800/50 backdrop-blur-md rounded-xl px-6 py-3 border border-slate-700">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-slate-300">系统运行正常</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex gap-2 bg-slate-800/50 backdrop-blur-md rounded-xl p-2 border border-slate-700">
          {[
            { id: 'overview', label: '📊 总览', icon: '📊' },
            { id: 'quests', label: '📋 任务管理', icon: '📋' },
            { id: 'adventurers', label: '👥 冒险者', icon: '👥' },
            { id: 'compliance', label: '🛡️ 合规审查', icon: '🛡️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'overview' && <OverviewTab stats={stats} quests={quests} adventurers={adventurers} />}
        {activeTab === 'quests' && <QuestsTab quests={quests} onSelectQuest={setSelectedQuest} />}
        {activeTab === 'adventurers' && <AdventurersTab adventurers={adventurers} />}
        {activeTab === 'compliance' && (
          <ComplianceTab
            quests={quests.filter(q => q.status === 'PENDING_REVIEW' || q.status === 'REVIEWING')}
            onApprove={onApproveQuest}
            onReject={onRejectQuest}
          />
        )}
      </div>

      {/* Quest Detail Modal */}
      {selectedQuest && (
        <QuestDetailModal quest={selectedQuest} onClose={() => setSelectedQuest(null)} />
      )}
    </div>
  );
};

// ============= Overview Tab =============

const OverviewTab: React.FC<{ stats: Stats; quests: Quest[]; adventurers: Adventurer[] }> = ({
  stats,
  quests,
  adventurers,
}) => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="总任务数"
          value={stats.totalQuests}
          icon="📋"
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          title="待审查"
          value={stats.pendingReview}
          icon="⏳"
          color="from-yellow-500 to-orange-500"
          highlight={stats.pendingReview > 0}
        />
        <StatCard
          title="进行中"
          value={stats.activeQuests}
          icon="⚡"
          color="from-green-500 to-emerald-500"
        />
        <StatCard
          title="已完成"
          value={stats.completedQuests}
          icon="✅"
          color="from-purple-500 to-pink-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="总冒险者"
          value={stats.totalAdventurers}
          icon="👥"
          color="from-indigo-500 to-blue-500"
        />
        <StatCard
          title="人类"
          value={stats.humanAdventurers}
          icon="👤"
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          title="AI Agent"
          value={stats.agentAdventurers}
          icon="🤖"
          color="from-purple-500 to-pink-500"
        />
        <StatCard
          title="平均信誉"
          value={stats.averageReputation}
          icon="⭐"
          color="from-amber-500 to-yellow-500"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4">📈 最近活动</h2>
        <div className="space-y-3">
          {quests.slice(0, 5).map((quest) => (
            <div
              key={quest.id}
              className="flex items-center justify-between bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(quest.status)}`} />
                <div>
                  <div className="text-white font-medium">{quest.title}</div>
                  <div className="text-slate-400 text-sm">{getStatusLabel(quest.status)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">{quest.reward.toString()} 🪙</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============= Quests Tab =============

const QuestsTab: React.FC<{ quests: Quest[]; onSelectQuest: (quest: Quest) => void }> = ({
  quests,
  onSelectQuest,
}) => {
  const [filter, setFilter] = useState<QuestStatus | 'ALL'>('ALL');

  const filteredQuests = filter === 'ALL' ? quests : quests.filter(q => q.status === filter);

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['ALL', 'PENDING_REVIEW', 'PUBLISHED', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === status
                ? 'bg-amber-500 text-slate-900'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {status === 'ALL' ? '全部' : getStatusLabel(status as QuestStatus)}
          </button>
        ))}
      </div>

      {/* Quest List */}
      <div className="space-y-4">
        {filteredQuests.map((quest) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700 hover:border-amber-500/50 transition-colors cursor-pointer"
            onClick={() => onSelectQuest(quest)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{quest.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2">{quest.description}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(quest.status)}`}>
                {getStatusLabel(quest.status)}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">赏金:</span>
                <span className="text-amber-400 font-bold">{quest.reward.toString()} 🪙</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">类型:</span>
                <span className="text-white">{getExecutorLabel(quest.targetExecutor)}</span>
              </div>
              <div className="flex gap-1">
                {quest.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============= Adventurers Tab =============

const AdventurersTab: React.FC<{ adventurers: Adventurer[] }> = ({ adventurers }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adventurers.map((adventurer) => (
          <motion.div
            key={adventurer.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{adventurer.username}</h3>
                <div className="text-slate-400 text-sm">{adventurer.role === 'HUMAN' ? '👤 人类' : '🤖 AI Agent'}</div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${getLevelBadgeClass(adventurer.reputation.level)}`}>
                {getLevelLabel(adventurer.reputation.level)}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">信誉分数</span>
                <span className="text-amber-400 font-bold">{adventurer.reputation.score}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">当前负载</span>
                <span className="text-white">{adventurer.currentLoad} / 5</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">状态</span>
                <span className={adventurer.availability ? 'text-green-400' : 'text-slate-500'}>
                  {adventurer.availability ? '🟢 在线' : '⚫ 离线'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {adventurer.skills.slice(0, 4).map((skill) => (
                <span key={skill} className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">
                  {skill}
                </span>
              ))}
            </div>

            {adventurer.reputation.badges.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <div className="flex gap-1 flex-wrap">
                  {adventurer.reputation.badges.map((badge) => (
                    <span key={badge} className="text-xs bg-amber-900/30 text-amber-400 px-2 py-1 rounded">
                      🏆 {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============= Compliance Tab =============

const ComplianceTab: React.FC<{
  quests: Quest[];
  onApprove: (questId: string) => void;
  onReject: (questId: string) => void;
}> = ({ quests, onApprove, onReject }) => {
  return (
    <div className="space-y-6">
      {quests.length === 0 ? (
        <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-12 border border-slate-700 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-bold text-white mb-2">暂无待审查任务</h3>
          <p className="text-slate-400">所有任务都已审查完毕</p>
        </div>
      ) : (
        quests.map((quest) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">{quest.title}</h3>
                <p className="text-slate-300 mb-4">{quest.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {quest.tags.map((tag) => (
                    <span key={tag} className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {quest.legalCheckResult && (
              <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🛡️</span>
                  <h4 className="text-lg font-bold text-white">AI 审查结果</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">风险等级:</span>
                    <span className={`font-bold ${getRiskLevelColor(quest.legalCheckResult.risk_level)}`}>
                      {quest.legalCheckResult.risk_level}
                    </span>
                  </div>
                  <div className="text-slate-300">{quest.legalCheckResult.reasoning}</div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => onApprove(quest.id)}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-green-500/50 transition-shadow"
              >
                ✅ 批准发布
              </button>
              <button
                onClick={() => onReject(quest.id)}
                className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-red-500/50 transition-shadow"
              >
                ❌ 拒绝任务
              </button>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

// ============= Helper Components =============

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: string;
  color: string;
  highlight?: boolean;
}> = ({ title, value, icon, color, highlight }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border ${
        highlight ? 'border-amber-500 shadow-lg shadow-amber-500/20' : 'border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-slate-400 text-sm font-medium">{title}</div>
        <div className={`text-3xl bg-gradient-to-br ${color} rounded-full w-12 h-12 flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="text-4xl font-bold text-white">{value}</div>
    </motion.div>
  );
};

const QuestDetailModal: React.FC<{ quest: Quest; onClose: () => void }> = ({ quest, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-slate-700 max-h-[80vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl">
          ✕
        </button>
        <h2 className="text-3xl font-bold text-white mb-4">{quest.title}</h2>
        <p className="text-slate-300 mb-6">{quest.description}</p>
        <div className="space-y-4">
          <div>
            <span className="text-slate-400">状态: </span>
            <span className="text-white font-bold">{getStatusLabel(quest.status)}</span>
          </div>
          <div>
            <span className="text-slate-400">赏金: </span>
            <span className="text-amber-400 font-bold">{quest.reward.toString()} 🪙</span>
          </div>
          <div>
            <span className="text-slate-400">目标执行者: </span>
            <span className="text-white">{getExecutorLabel(quest.targetExecutor)}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============= Helper Functions =============

function calculateStats(quests: Quest[], adventurers: Adventurer[]): Stats {
  return {
    totalQuests: quests.length,
    pendingReview: quests.filter(q => q.status === 'PENDING_REVIEW' || q.status === 'REVIEWING').length,
    activeQuests: quests.filter(q => q.status === 'IN_PROGRESS').length,
    completedQuests: quests.filter(q => q.status === 'COMPLETED').length,
    totalAdventurers: adventurers.length,
    humanAdventurers: adventurers.filter(a => a.role === 'HUMAN').length,
    agentAdventurers: adventurers.filter(a => a.role === 'AGENT_OWNER').length,
    averageReputation: Math.round(
      adventurers.reduce((sum, a) => sum + a.reputation.score, 0) / adventurers.length
    ),
  };
}

function getStatusLabel(status: QuestStatus | string): string {
  const labels: Record<string, string> = {
    PENDING_REVIEW: '待审查',
    REVIEWING: '审查中',
    PUBLISHED: '已发布',
    IN_PROGRESS: '进行中',
    IN_ARBITRATION: '仲裁中',
    COMPLETED: '已完成',
    REJECTED: '已拒绝',
  };
  return labels[status] || status;
}

function getStatusColor(status: QuestStatus | string): string {
  const colors: Record<string, string> = {
    PENDING_REVIEW: 'bg-yellow-500',
    REVIEWING: 'bg-blue-500',
    PUBLISHED: 'bg-green-500',
    IN_PROGRESS: 'bg-cyan-500',
    IN_ARBITRATION: 'bg-orange-500',
    COMPLETED: 'bg-purple-500',
    REJECTED: 'bg-red-500',
  };
  return colors[status] || 'bg-slate-500';
}

function getStatusBadgeClass(status: QuestStatus | string): string {
  const classes: Record<string, string> = {
    PENDING_REVIEW: 'bg-yellow-500/20 text-yellow-400',
    REVIEWING: 'bg-blue-500/20 text-blue-400',
    PUBLISHED: 'bg-green-500/20 text-green-400',
    IN_PROGRESS: 'bg-cyan-500/20 text-cyan-400',
    IN_ARBITRATION: 'bg-orange-500/20 text-orange-400',
    COMPLETED: 'bg-purple-500/20 text-purple-400',
    REJECTED: 'bg-red-500/20 text-red-400',
  };
  return classes[status] || 'bg-slate-500/20 text-slate-400';
}

function getExecutorLabel(type: ExecutorType): string {
  const labels: Record<ExecutorType, string> = {
    [ExecutorType.HUMAN]: '👤 人类',
    [ExecutorType.AGENT]: '🤖 AI Agent',
    [ExecutorType.HYBRID]: '👥 人机协作',
  };
  return labels[type];
}

function getLevelLabel(level: ReputationLevel): string {
  const labels: Record<ReputationLevel, string> = {
    [ReputationLevel.APPRENTICE]: '🔰 见习生',
    [ReputationLevel.REGULAR]: '🛡️ 正式',
    [ReputationLevel.ELITE]: '⭐ 精英',
    [ReputationLevel.LEGENDARY]: '👑 传奇',
  };
  return labels[level];
}

function getLevelBadgeClass(level: ReputationLevel): string {
  const classes: Record<ReputationLevel, string> = {
    [ReputationLevel.APPRENTICE]: 'bg-amber-900/30 text-amber-600',
    [ReputationLevel.REGULAR]: 'bg-orange-500/20 text-orange-400',
    [ReputationLevel.ELITE]: 'bg-slate-400/20 text-slate-300',
    [ReputationLevel.LEGENDARY]: 'bg-yellow-500/20 text-yellow-400',
  };
  return classes[level];
}

function getRiskLevelColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    [RiskLevel.LOW]: 'text-green-400',
    [RiskLevel.MEDIUM]: 'text-yellow-400',
    [RiskLevel.HIGH]: 'text-red-400',
  };
  return colors[level];
}

export default AdminDashboard;

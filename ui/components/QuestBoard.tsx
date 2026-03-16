// Adventurer's Guild - Quest Board Component
// 任务大厅 UI - 现代奇幻风格

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quest, ReputationLevel, ExecutorType, RiskLevel } from '../../types';

// ============= Types =============

interface QuestBoardProps {
  quests: Quest[];
  userReputation: {
    level: ReputationLevel;
    score: number;
    badges: string[];
  };
  onQuestClick: (quest: Quest) => void;
}

// ============= Main Component =============

export const QuestBoard: React.FC<QuestBoardProps> = ({
  quests,
  userReputation,
  onQuestClick,
}) => {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [hoveredQuest, setHoveredQuest] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      {/* Header - User Badge */}
      <UserBadge reputation={userReputation} />

      {/* Quest Board Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 mb-2">
          ⚔️ 任务大厅 ⚔️
        </h1>
        <p className="text-slate-400 text-lg">选择你的冒险，书写传奇</p>
      </motion.div>

      {/* Quest Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {quests.map((quest, index) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            index={index}
            isHovered={hoveredQuest === quest.id}
            onHover={() => setHoveredQuest(quest.id)}
            onLeave={() => setHoveredQuest(null)}
            onClick={() => {
              setSelectedQuest(quest);
              onQuestClick(quest);
            }}
          />
        ))}
      </div>

      {/* Quest Detail Modal */}
      <AnimatePresence>
        {selectedQuest && (
          <QuestDetailModal
            quest={selectedQuest}
            onClose={() => setSelectedQuest(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ============= User Badge Component =============

const UserBadge: React.FC<{ reputation: QuestBoardProps['userReputation'] }> = ({
  reputation,
}) => {
  const levelColors = {
    [ReputationLevel.LEGENDARY]: 'from-yellow-400 to-amber-500',
    [ReputationLevel.ELITE]: 'from-slate-300 to-slate-400',
    [ReputationLevel.REGULAR]: 'from-orange-400 to-orange-600',
    [ReputationLevel.APPRENTICE]: 'from-amber-700 to-amber-900',
  };

  const levelIcons = {
    [ReputationLevel.LEGENDARY]: '👑',
    [ReputationLevel.ELITE]: '⭐',
    [ReputationLevel.REGULAR]: '🛡️',
    [ReputationLevel.APPRENTICE]: '🔰',
  };

  const progress = (reputation.score % 100) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed top-4 right-4 bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-700 z-50"
    >
      <div className="flex items-center gap-3">
        <div className={`text-4xl bg-gradient-to-br ${levelColors[reputation.level]} rounded-full w-16 h-16 flex items-center justify-center`}>
          {levelIcons[reputation.level]}
        </div>
        <div>
          <div className="text-slate-300 text-sm">冒险者等级</div>
          <div className={`text-xl font-bold bg-gradient-to-r ${levelColors[reputation.level]} bg-clip-text text-transparent`}>
            {reputation.level}
          </div>
          <div className="text-slate-400 text-xs">分数: {reputation.score}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 bg-slate-700 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${levelColors[reputation.level]}`}
        />
      </div>

      {/* Badges */}
      {reputation.badges.length > 0 && (
        <div className="mt-2 flex gap-1 flex-wrap">
          {reputation.badges.map((badge) => (
            <span
              key={badge}
              className="text-xs bg-slate-700 text-amber-400 px-2 py-1 rounded-full"
            >
              {badge}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// ============= Quest Card Component =============

const QuestCard: React.FC<{
  quest: Quest;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}> = ({ quest, index, isHovered, onHover, onLeave, onClick }) => {
  const executorIcons = {
    [ExecutorType.HUMAN]: '👤',
    [ExecutorType.AGENT]: '🤖',
    [ExecutorType.HYBRID]: '👥',
  };

  const executorColors = {
    [ExecutorType.HUMAN]: 'from-blue-500 to-cyan-500',
    [ExecutorType.AGENT]: 'from-purple-500 to-pink-500',
    [ExecutorType.HYBRID]: 'from-green-500 to-emerald-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={onHover}
      onHoverEnd={onLeave}
      onClick={onClick}
      className="relative cursor-pointer group"
    >
      {/* Card Background - Parchment Style */}
      <div className="relative bg-gradient-to-br from-amber-50 to-yellow-100 rounded-xl p-6 shadow-xl border-4 border-amber-900/30 overflow-hidden">
        {/* Texture Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]" />

        {/* Glow Effect on Hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-yellow-400/20 rounded-xl"
            />
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-slate-800 flex-1 pr-2">
              {quest.title}
            </h3>
            <div className={`text-2xl bg-gradient-to-br ${executorColors[quest.targetExecutor]} rounded-full w-10 h-10 flex items-center justify-center shadow-lg`}>
              {executorIcons[quest.targetExecutor]}
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-600 text-sm mb-4 line-clamp-3">
            {quest.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {quest.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-amber-900/20 text-amber-900 px-2 py-1 rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
            {quest.tags.length > 3 && (
              <span className="text-xs text-slate-500">+{quest.tags.length - 3}</span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Reward */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪙</span>
              <span className="text-xl font-bold text-amber-700">
                {quest.reward.toString()}
              </span>
            </div>

            {/* Legal Check Badge */}
            {quest.legalCheckResult && (
              <LegalCheckBadge result={quest.legalCheckResult} />
            )}
          </div>
        </div>

        {/* Scanning Animation (when reviewing) */}
        {quest.status === 'REVIEWING' && <ScanningAnimation />}
      </div>
    </motion.div>
  );
};

// ============= Legal Check Badge =============

const LegalCheckBadge: React.FC<{ result: any }> = ({ result }) => {
  const isApproved = result.is_approved;
  const riskLevel = result.risk_level;

  const colors = {
    [RiskLevel.LOW]: 'from-green-500 to-emerald-500',
    [RiskLevel.MEDIUM]: 'from-yellow-500 to-orange-500',
    [RiskLevel.HIGH]: 'from-red-500 to-rose-500',
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`flex items-center gap-1 bg-gradient-to-r ${colors[riskLevel]} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}
    >
      {isApproved ? '✓' : '⚠️'}
      <span>{riskLevel}</span>
    </motion.div>
  );
};

// ============= Scanning Animation =============

const ScanningAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
      <motion.div
        initial={{ y: '-100%' }}
        animate={{ y: '200%' }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"
      />
      <div className="absolute top-2 right-2 flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"
        />
        <span className="text-xs text-cyan-400 font-bold">扫描中...</span>
      </div>
    </div>
  );
};

// ============= Quest Detail Modal =============

const QuestDetailModal: React.FC<{
  quest: Quest;
  onClose: () => void;
}> = ({ quest, onClose }) => {
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
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-slate-700 max-h-[80vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-white mb-4">{quest.title}</h2>

        {/* Description */}
        <p className="text-slate-300 mb-6 leading-relaxed">{quest.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {quest.tags.map((tag) => (
            <span
              key={tag}
              className="text-sm bg-slate-700 text-amber-400 px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Legal Check Report */}
        {quest.legalCheckResult && (
          <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🛡️</span>
              <h3 className="text-lg font-bold text-white">合法审查报告</h3>
            </div>
            <div className="text-slate-300 text-sm space-y-2">
              <div className="flex items-center gap-2">
                <span className={quest.legalCheckResult.is_approved ? 'text-green-400' : 'text-red-400'}>
                  {quest.legalCheckResult.is_approved ? '✓ 已通过' : '✗ 未通过'}
                </span>
                <span className="text-slate-400">|</span>
                <span>风险等级: {quest.legalCheckResult.risk_level}</span>
              </div>
              <p className="text-slate-400">{quest.legalCheckResult.reasoning}</p>
            </div>
          </div>
        )}

        {/* Reward & Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🪙</span>
            <div>
              <div className="text-slate-400 text-sm">任务赏金</div>
              <div className="text-3xl font-bold text-amber-400">
                {quest.reward.toString()}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-amber-500/50 transition-shadow"
          >
            接受任务
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuestBoard;

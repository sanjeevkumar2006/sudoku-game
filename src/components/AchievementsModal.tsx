import React from 'react';
import { X, Award, Trophy, Zap, ShieldCheck, Crown, CalendarCheck, Flame, Sparkles } from 'lucide-react';
import type { Achievement } from '../types/sudoku';
import { sound } from '../utils/sound';

interface AchievementsModalProps {
  achievements: Achievement[];
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  achievements,
  onClose,
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-amber-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-cyan-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-purple-400" />;
      case 'CalendarCheck':
        return <CalendarCheck className="w-5 h-5 text-indigo-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-pink-400" />;
      default:
        return <Award className="w-5 h-5 text-amber-400" />;
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl relative animate-pop text-slate-100 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Achievements</h3>
              <p className="text-xs text-slate-400">
                Unlocked {unlockedCount} of {achievements.length} badges
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-3 py-4 pr-1">
          {achievements.map((ach) => {
            const percent = Math.min(100, Math.round((ach.progress / ach.target) * 100));

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  ach.unlocked
                    ? 'bg-gradient-to-r from-purple-950/40 to-slate-900 border-purple-500/40 shadow-md shadow-purple-950/30'
                    : 'bg-slate-800/40 border-slate-800 opacity-60'
                }`}
              >
                <div
                  className={`p-3 rounded-xl shrink-0 ${
                    ach.unlocked ? 'bg-purple-600/20 border border-purple-500/40' : 'bg-slate-800'
                  }`}
                >
                  {getIcon(ach.iconName)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-sm text-white truncate">{ach.title}</h4>
                    {ach.unlocked ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {ach.progress}/{ach.target}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{ach.description}</p>

                  {!ach.unlocked && (
                    <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            sound.playTap();
            onClose();
          }}
          className="mt-2 w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm transition-all shrink-0"
        >
          Close Achievements
        </button>
      </div>
    </div>
  );
};

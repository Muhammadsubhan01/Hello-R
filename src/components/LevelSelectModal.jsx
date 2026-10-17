import React from 'react';
import { X, Lock, Star } from 'lucide-react';

export function LevelSelectModal({
  currentLevel,
  maxUnlockedLevel,
  levelStats,
  onSelectLevel,
  onClose
}) {
  const TOTAL_LEVELS = 30;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 max-w-xl w-full shadow-2xl relative text-slate-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
          <h2 className="text-2xl font-black bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent flex items-center gap-2">
            Select Level
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 overflow-y-auto p-2 pr-3 custom-scrollbar flex-1">
          {[...Array(TOTAL_LEVELS)].map((_, idx) => {
            const levelNum = idx + 1;
            const isUnlocked = levelNum <= maxUnlockedLevel;
            const isCurrent = levelNum === currentLevel;
            const stars = levelStats[levelNum]?.stars || 0;

            return (
              <button
                key={levelNum}
                disabled={!isUnlocked}
                onClick={() => {
                  onSelectLevel(levelNum);
                  onClose();
                }}
                className={`relative flex flex-col items-center justify-center py-4 rounded-2xl border-2 font-bold transition transform active:scale-95 shadow-md ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/50'
                    : isUnlocked
                    ? 'bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-750 hover:border-slate-600'
                    : 'bg-slate-900/60 border-slate-800 text-slate-600 cursor-not-allowed opacity-60'
                }`}
              >
                {!isUnlocked ? (
                  <Lock className="w-6 h-6 text-slate-600 mb-1" />
                ) : (
                  <span className="text-xl font-black">{levelNum}</span>
                )}

                {/* Stars Indicator */}
                {isUnlocked && (
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3].map(starIdx => (
                      <Star
                        key={starIdx}
                        className={`w-3 h-3 ${
                          starIdx <= stars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

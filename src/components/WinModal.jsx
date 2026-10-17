import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Trophy, ArrowRight, RotateCcw } from 'lucide-react';

export function WinModal({ level, moves, stars, onNextLevel, onRestartLevel }) {
  useEffect(() => {
    // Fire festive confetti cannon
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-8 max-w-md w-full shadow-2xl relative text-slate-100 text-center flex flex-col items-center">
        {/* Trophy Icon */}
        <div className="w-20 h-20 bg-amber-500/20 rounded-full border-2 border-amber-400 flex items-center justify-center mb-4 text-amber-400 shadow-lg animate-bounce">
          <Trophy className="w-10 h-10" />
        </div>

        <h2 className="text-3xl font-black bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent mb-1">
          LEVEL CLEARED!
        </h2>
        <p className="text-slate-400 font-medium mb-6">Great job sorting those nuts!</p>

        {/* Stars */}
        <div className="flex items-center justify-center gap-3 mb-6 bg-slate-800/80 px-6 py-3 rounded-2xl border border-slate-700">
          {[1, 2, 3].map(starIdx => (
            <Star
              key={starIdx}
              className={`w-10 h-10 transition-transform duration-300 ${
                starIdx <= stars
                  ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                  : 'text-slate-700 fill-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Level Stats */}
        <div className="w-full bg-slate-800/50 rounded-2xl p-4 mb-8 border border-slate-700/60 flex justify-around text-center">
          <div>
            <span className="block text-xs uppercase font-bold text-slate-400 tracking-wider">Level</span>
            <span className="text-2xl font-black text-amber-400">{level}</span>
          </div>
          <div className="w-px bg-slate-700"></div>
          <div>
            <span className="block text-xs uppercase font-bold text-slate-400 tracking-wider">Total Moves</span>
            <span className="text-2xl font-black text-slate-100">{moves}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={onRestartLevel}
            className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 shadow-md transition active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Replay</span>
          </button>

          <button
            onClick={onNextLevel}
            className="flex-2 py-3.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-lg rounded-2xl shadow-xl transition transform active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Next Level</span>
            <ArrowRight className="w-6 h-6 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
}

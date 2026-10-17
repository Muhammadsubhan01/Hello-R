import React from 'react';
import { RotateCcw, Undo2, PlusCircle, Volume2, VolumeX, Grid } from 'lucide-react';

export function Header({
  level,
  moves,
  soundEnabled,
  onToggleSound,
  onReset,
  onUndo,
  onAddBolt,
  onOpenLevelSelect,
  canUndo,
  canAddBolt
}) {
  return (
    <header className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center gap-4 py-3 px-6 bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700/60 mb-6">
      {/* Title / Level Indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenLevelSelect}
          className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl shadow-md transition active:scale-95"
          title="Select Level"
        >
          <Grid className="w-5 h-5 stroke-[2.5]" />
          <span className="text-sm uppercase tracking-wide">Level {level}</span>
        </button>

        <div className="px-3.5 py-1.5 bg-slate-900/80 rounded-xl border border-slate-700 text-slate-200 font-bold text-sm">
          Moves: <span className="text-amber-400 font-extrabold text-base ml-1">{moves}</span>
        </div>
      </div>

      {/* Control Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Add Extra Bolt Power-up */}
        <button
          onClick={onAddBolt}
          disabled={!canAddBolt}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-md transition ${
            canAddBolt
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white active:scale-95'
              : 'bg-slate-700 text-slate-400 opacity-60 cursor-not-allowed'
          }`}
          title="Add Empty Screw (+1 Screw)"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Screw</span>
        </button>

        {/* Undo Move */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-md transition ${
            canUndo
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white active:scale-95'
              : 'bg-slate-700 text-slate-400 opacity-60 cursor-not-allowed'
          }`}
          title="Undo Last Move"
        >
          <Undo2 className="w-4 h-4" />
          <span>Undo</span>
        </button>

        {/* Reset Level */}
        <button
          onClick={onReset}
          className="p-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl transition active:scale-95 shadow-sm border border-slate-600"
          title="Reset Level"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          className="p-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl transition active:scale-95 shadow-sm border border-slate-600"
          title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-red-400" />}
        </button>
      </div>
    </header>
  );
}

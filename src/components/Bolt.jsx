import React from 'react';
import { Nut } from './Nut';
import { CAPACITY } from '../utils/nutsEngine';
import { Check } from 'lucide-react';

export function Bolt({ nuts, isSelected, onClick, index }) {
  // Check if bolt is complete & sorted
  const isFullAndSorted =
    nuts.length === CAPACITY &&
    nuts.every(nut => nut.color === nuts[0].color && !nut.hidden);

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col items-center cursor-pointer transition-transform duration-200 select-none group p-2 rounded-2xl ${
        isSelected ? 'scale-105' : 'hover:scale-102'
      }`}
    >
      {/* Complete Checkmark Indicator Badge */}
      {isFullAndSorted && (
        <div className="absolute -top-6 z-30 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg border-2 border-emerald-200 animate-bounce">
          <Check className="w-5 h-5 stroke-[3]" />
        </div>
      )}

      {/* Top Screw Head Cap */}
      <div className="w-8 h-4 bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-500 rounded-t-md shadow-md border-t border-x border-zinc-300"></div>

      {/* Metallic Threaded Screw Rod Column */}
      <div className="relative w-6 h-48 sm:h-52 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 border-x-2 border-slate-600 rounded-b-sm flex flex-col-reverse items-center justify-start pb-2 shadow-inner">
        {/* Thread Ridges Visual Detail */}
        <div className="absolute inset-0 flex flex-col justify-between opacity-30 pointer-events-none py-1">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-full h-1 bg-slate-800 border-b border-slate-100"></div>
          ))}
        </div>

        {/* Stacked Nuts */}
        {nuts.map((nut, idx) => {
          const isTopNut = idx === nuts.length - 1;
          const isLifted = isSelected && isTopNut;

          return (
            <Nut
              key={nut.id || idx}
              colorKey={nut.color}
              hidden={nut.hidden}
              isLifted={isLifted}
              className="my-1 z-10"
            />
          );
        })}
      </div>

      {/* Wooden Base Platform */}
      <div className="w-24 sm:w-28 h-5 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 rounded-lg shadow-lg border-2 border-amber-950 mt-1 flex items-center justify-center">
        <span className="text-[10px] font-black text-amber-300 tracking-widest opacity-80 uppercase">
          #{index + 1}
        </span>
      </div>
    </div>
  );
}

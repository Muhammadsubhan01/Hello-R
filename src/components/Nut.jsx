import React from 'react';
import { COLOR_PALETTE } from '../utils/nutsEngine';
import { HelpCircle } from 'lucide-react';

export function Nut({ colorKey, hidden, isLifted, className = '' }) {
  const color = COLOR_PALETTE[colorKey] || {
    name: 'Unknown',
    hex: '#9CA3AF',
    gradient: 'from-gray-400 to-gray-600',
    shadow: '#4B5563',
    border: '#374151'
  };

  if (hidden) {
    return (
      <div
        className={`w-20 h-7 sm:w-24 sm:h-8 rounded-lg bg-gradient-to-r from-slate-600 via-slate-500 to-slate-700 shadow-md border-2 border-slate-800 flex items-center justify-center transition-transform duration-200 ${className}`}
        style={{
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2), 0 4px 6px rgba(0,0,0,0.3)'
        }}
      >
        <HelpCircle className="w-5 h-5 text-slate-300 animate-pulse" />
      </div>
    );
  }

  return (
    <div
      className={`w-20 h-7 sm:w-24 sm:h-8 rounded-xl bg-gradient-to-r ${color.gradient} shadow-lg border-2 flex items-center justify-between px-2 sm:px-3 relative transition-all duration-300 ${
        isLifted ? '-translate-y-6 scale-105 shadow-2xl z-20 ring-4 ring-yellow-400/80' : ''
      } ${className}`}
      style={{
        borderColor: color.border,
        boxShadow: isLifted
          ? `0 12px 20px rgba(0,0,0,0.35), inset 0 3px 5px rgba(255,255,255,0.4)`
          : `0 4px 6px ${color.shadow}66, inset 0 2px 4px rgba(255,255,255,0.4)`
      }}
    >
      {/* Nut Hex Outer Ridge details */}
      <div className="w-2 h-full bg-white/20 rounded-sm"></div>

      {/* Screw Center Hole Cutout */}
      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-900/80 border border-slate-700/60 flex items-center justify-center shadow-inner">
        <div className="w-2 h-2 rounded-full bg-slate-950/90"></div>
      </div>

      <div className="w-2 h-full bg-white/20 rounded-sm"></div>
    </div>
  );
}

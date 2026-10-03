import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, Home, Share2, Heart, Award } from 'lucide-react';

export function ResultView({ result, p1Avatar, p2Avatar, onPlayAgain, onGoHome, soundFx }) {
  const [displayedPercent, setDisplayedPercent] = useState(0);

  useEffect(() => {
    // Play sound based on result level
    if (result.isHighMatch) {
      soundFx?.playFanfare();
      // Launch confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff69b4', '#ff1493', '#ffd700', '#00bfff', '#ff4500', '#a855f7']
      });
    } else {
      soundFx?.playSparkle();
    }

    // Tick up percentage
    let current = 0;
    const target = result.percentage;
    const duration = 1200; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayedPercent(target);
        clearInterval(timer);
      } else {
        setDisplayedPercent(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [result]);

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border-4 border-pink-300 text-center animate-bounce-slow">
      {/* Top Banner Badge */}
      <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white rounded-full font-bold text-lg shadow-md mb-4">
        <span>{result.badge}</span>
        <span>{result.title}</span>
        <span>{result.badge}</span>
      </div>

      {/* Avatars and Heart */}
      <div className="flex justify-around items-center my-6">
        <div className="flex flex-col items-center">
          <div className="text-6xl p-4 bg-pink-100 rounded-full border-4 border-pink-300 shadow-inner">
            {p1Avatar}
          </div>
          <span className="mt-2 text-xl font-extrabold text-pink-700">{result.name1}</span>
        </div>

        <div className="relative">
          <Heart className="w-16 h-16 text-pink-500 fill-pink-400 animate-pulse-heart" />
          <span className="absolute inset-0 flex items-center justify-center font-black text-white text-xs">
            LOVE
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-6xl p-4 bg-purple-100 rounded-full border-4 border-purple-300 shadow-inner">
            {p2Avatar}
          </div>
          <span className="mt-2 text-xl font-extrabold text-purple-700">{result.name2}</span>
        </div>
      </div>

      {/* Percentage Meter */}
      <div className="my-6 relative py-4 bg-gradient-to-r from-pink-100 via-yellow-100 to-purple-100 rounded-3xl border-4 border-yellow-300">
        <p className="text-sm uppercase font-bold text-gray-500 tracking-wider">Match Percentage</p>
        <div className="text-6xl sm:text-7xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent my-1">
          {displayedPercent}%
        </div>

        {/* High Match Special Badge */}
        {result.isHighMatch && (
          <div className="mt-2 inline-flex items-center gap-1 bg-yellow-400 text-purple-900 font-extrabold text-sm px-4 py-1 rounded-full shadow border-2 border-white animate-bounce">
            <Award className="w-4 h-4" />
            <span>90%+ SUPER MATCH BONUS!</span>
          </div>
        )}
      </div>

      {/* Fun Description */}
      <div className="p-4 bg-pink-50 rounded-2xl border-2 border-pink-200 text-purple-900 font-medium text-lg my-4">
        {result.description}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
        <button
          type="button"
          onClick={() => {
            soundFx?.playClick();
            onPlayAgain();
          }}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold rounded-2xl shadow-lg border-b-4 border-pink-700 transition active:translate-y-1 flex items-center justify-center gap-2 text-lg"
        >
          <RotateCcw className="w-6 h-6" />
          <span>Test Another Pair</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundFx?.playClick();
            onGoHome();
          }}
          className="py-3 px-6 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-extrabold rounded-2xl shadow-lg border-b-4 border-purple-700 transition active:translate-y-1 flex items-center justify-center gap-2 text-lg"
        >
          <Home className="w-6 h-6" />
          <span>Main Menu</span>
        </button>
      </div>
    </div>
  );
}

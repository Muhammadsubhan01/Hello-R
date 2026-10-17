import React, { useState, useEffect } from 'react';
import {
  generateLevel,
  isValidMove,
  executeMove,
  checkWin,
  CAPACITY
} from './utils/nutsEngine';
import { soundFx } from './utils/nutsAudio';
import { Bolt } from './components/Bolt';
import { Header } from './components/Header';
import { LevelSelectModal } from './components/LevelSelectModal';
import { WinModal } from './components/WinModal';
import { Sparkles, HelpCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [level, setLevel] = useState(1);
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useState(1);
  const [bolts, setBolts] = useState([]);
  const [selectedBoltIdx, setSelectedBoltIdx] = useState(null);
  const [moves, setMoves] = useState(0);
  const [history, setHistory] = useState([]);
  const [addedBoltsCount, setAddedBoltsCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isWon, setIsWon] = useState(false);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [levelStats, setLevelStats] = useState({});

  // Load saved progress from localStorage
  useEffect(() => {
    try {
      const savedMaxLevel = localStorage.getItem('nuts_max_unlocked_level');
      if (savedMaxLevel) setMaxUnlockedLevel(parseInt(savedMaxLevel, 10));

      const savedStats = localStorage.getItem('nuts_level_stats');
      if (savedStats) setLevelStats(JSON.parse(savedStats));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Initialize or change level
  useEffect(() => {
    startLevel(level);
  }, [level]);

  const startLevel = (levelNum) => {
    const initialBolts = generateLevel(levelNum);
    setBolts(initialBolts);
    setSelectedBoltIdx(null);
    setMoves(0);
    setHistory([]);
    setAddedBoltsCount(0);
    setIsWon(false);
  };

  // Handle selecting or transferring nuts between bolts
  const handleBoltClick = (index) => {
    if (isWon) return;

    if (selectedBoltIdx === null) {
      // Pick source bolt if it has nuts
      if (bolts[index] && bolts[index].length > 0) {
        soundFx.playSelect();
        setSelectedBoltIdx(index);
      } else {
        soundFx.playError();
      }
    } else if (selectedBoltIdx === index) {
      // Unselect if clicking the same bolt again
      soundFx.playSelect();
      setSelectedBoltIdx(null);
    } else {
      // Attempt to move from selectedBoltIdx to index
      if (isValidMove(bolts, selectedBoltIdx, index)) {
        // Save history state for Undo
        setHistory(prev => [...prev, bolts.map(b => b.map(n => ({ ...n })))]);

        const result = executeMove(bolts, selectedBoltIdx, index);
        if (result) {
          soundFx.playPour();
          setBolts(result.newBolts);
          setMoves(m => m + 1);
          setSelectedBoltIdx(null);

          // Check Win Condition
          if (checkWin(result.newBolts)) {
            soundFx.playWin();
            setIsWon(true);

            // Compute Star Rating
            const stars = Math.max(1, 3 - Math.floor((moves + 1) / 15));

            // Save Progress
            const nextUnlocked = Math.max(maxUnlockedLevel, level + 1);
            setMaxUnlockedLevel(nextUnlocked);
            try {
              localStorage.setItem('nuts_max_unlocked_level', nextUnlocked.toString());

              const updatedStats = {
                ...levelStats,
                [level]: {
                  stars: Math.max(stars, levelStats[level]?.stars || 0),
                  moves: levelStats[level]?.moves ? Math.min(moves + 1, levelStats[level].moves) : moves + 1
                }
              };
              setLevelStats(updatedStats);
              localStorage.setItem('nuts_level_stats', JSON.stringify(updatedStats));
            } catch (e) {
              console.error(e);
            }
          }
        }
      } else {
        soundFx.playError();
        setSelectedBoltIdx(null);
      }
    }
  };

  // Power-up: Undo
  const handleUndo = () => {
    if (history.length === 0 || isWon) return;
    soundFx.playSelect();
    const previousBolts = history[history.length - 1];
    setBolts(previousBolts);
    setHistory(prev => prev.slice(0, prev.length - 1));
    setSelectedBoltIdx(null);
  };

  // Power-up: Add Extra Bolt
  const handleAddBolt = () => {
    if (addedBoltsCount >= 2 || isWon) return;
    soundFx.playSelect();
    setBolts(prev => [...prev, []]);
    setAddedBoltsCount(c => c + 1);
  };

  // Reset current level
  const handleReset = () => {
    soundFx.playSelect();
    startLevel(level);
  };

  const toggleSound = () => {
    const newState = soundFx.toggleSound();
    setSoundEnabled(newState);
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-radial-gradient text-slate-100 flex flex-col items-center p-4 sm:p-6 select-none font-sans relative overflow-x-hidden">
      {/* Background Graphic Decor */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

      {/* Top Navigation / Controls */}
      <Header
        level={level}
        moves={moves}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onReset={handleReset}
        onUndo={handleUndo}
        onAddBolt={handleAddBolt}
        onOpenLevelSelect={() => setShowLevelSelect(true)}
        canUndo={history.length > 0 && !isWon}
        canAddBolt={addedBoltsCount < 2 && !isWon}
      />

      {/* Main Game Playfield Board */}
      <main className="flex-1 w-full max-w-5xl flex flex-col items-center justify-center my-4 relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 max-w-4xl p-6 bg-slate-900/60 backdrop-blur-md border-2 border-slate-800 rounded-3xl shadow-2xl min-h-[380px]">
          {bolts.map((boltNuts, idx) => (
            <Bolt
              key={idx}
              index={idx}
              nuts={boltNuts}
              isSelected={selectedBoltIdx === idx}
              onClick={() => handleBoltClick(idx)}
            />
          ))}
        </div>

        {/* How To Play Button */}
        <button
          onClick={() => setShowHowToPlay(true)}
          className="mt-6 flex items-center gap-2 text-slate-400 hover:text-amber-400 font-bold text-sm bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800 shadow-md transition"
        >
          <HelpCircle className="w-4 h-4" />
          <span>How to Play</span>
        </button>
      </main>

      {/* Level Selection Modal */}
      {showLevelSelect && (
        <LevelSelectModal
          currentLevel={level}
          maxUnlockedLevel={maxUnlockedLevel}
          levelStats={levelStats}
          onSelectLevel={(selectedLvl) => {
            setLevel(selectedLvl);
            setShowLevelSelect(false);
          }}
          onClose={() => setShowLevelSelect(false)}
        />
      )}

      {/* Level Complete / Win Modal */}
      {isWon && (
        <WinModal
          level={level}
          moves={moves}
          stars={Math.max(1, 3 - Math.floor(moves / 15))}
          onNextLevel={() => {
            setLevel(lvl => lvl + 1);
          }}
          onRestartLevel={() => {
            startLevel(level);
          }}
        />
      )}

      {/* How To Play Dialog */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-slate-200">
            <h3 className="text-2xl font-black text-amber-400 mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6" /> How to Play
            </h3>
            <ul className="space-y-3 font-semibold text-sm mb-6 text-slate-300">
              <li className="flex items-start gap-2">
                <span>1️⃣</span> Tap a screw to pick up its top nut.
              </li>
              <li className="flex items-start gap-2">
                <span>2️⃣</span> Tap another screw to pour the nut on top. You can only stack matching colors or move onto empty screws.
              </li>
              <li className="flex items-start gap-2">
                <span>3️⃣</span> Complete all screws so that each screw contains 4 nuts of identical color!
              </li>
              <li className="flex items-start gap-2 text-amber-300">
                <span>💡</span> Use <strong>Undo</strong> or <strong>+ Screw</strong> if you get stuck on harder levels!
              </li>
            </ul>
            <button
              onClick={() => setShowHowToPlay(false)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-md transition"
            >
              Got It! Let's Sort! 🔩
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-4 text-center text-slate-500 text-xs font-semibold">
        Nuts Puzzle: Sort By Color • Crafted with React & Tailwind CSS
      </footer>
    </div>
  );
}

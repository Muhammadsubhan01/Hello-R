import React, { useState, useEffect } from 'react';
import { calculateLoveMatch } from './utils/loveMatch';
import { soundFx } from './utils/audio';
import { AvatarPicker, AVATARS } from './components/AvatarPicker';
import { ResultView } from './components/ResultView';
import { HistoryDrawer } from './components/HistoryDrawer';
import { Heart, Sparkles, Volume2, VolumeX, HelpCircle, History, Play, Flame } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('menu'); // 'menu' | 'game' | 'result'
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [p1Avatar, setP1Avatar] = useState(AVATARS[0].emoji);
  const [p2Avatar, setP2Avatar] = useState(AVATARS[1].emoji);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('love_match_history');
      if (saved) setHistory(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save history
  const saveToHistory = (matchResult) => {
    const item = {
      ...matchResult,
      p1Avatar,
      p2Avatar,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [item, ...history.slice(0, 19)]; // Keep latest 20
    setHistory(updated);
    try {
      localStorage.setItem('love_match_history', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartGame = () => {
    soundFx.playClick();
    setView('game');
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!name1.trim() || !name2.trim()) {
      soundFx.playClick();
      setErrorMsg('Oopsie! Please enter both names first! 🦄');
      return;
    }
    setErrorMsg('');
    const matchResult = calculateLoveMatch(name1, name2);
    setResult(matchResult);
    saveToHistory(matchResult);
    setView('result');
  };

  const toggleSound = () => {
    const newState = soundFx.toggleSound();
    setSoundEnabled(newState);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-pink-100 to-purple-200 p-4 sm:p-6 flex flex-col justify-between items-center relative overflow-x-hidden font-sans">
      {/* Top Header Bar */}
      <header className="w-full max-w-2xl flex justify-between items-center py-3 px-4 bg-white/80 backdrop-blur-md rounded-full shadow-md border-2 border-pink-200 mb-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('menu')}>
          <Heart className="w-7 h-7 text-pink-500 fill-pink-500 animate-pulse-heart" />
          <span className="font-extrabold text-xl sm:text-2xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Match Tester 💖
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setShowHistory(true);
            }}
            className="p-2.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full transition shadow-sm"
            title="Match History"
          >
            <History className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setShowHelp(true);
            }}
            className="p-2.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-full transition shadow-sm"
            title="How to Play"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={toggleSound}
            className="p-2.5 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-full transition shadow-sm"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full flex-1 flex items-center justify-center my-4">
        {view === 'menu' && (
          <div className="text-center w-full max-w-lg bg-white/85 backdrop-blur-md p-8 rounded-3xl border-4 border-yellow-300 shadow-2xl animate-bounce-slow">
            {/* Title Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-400 to-yellow-400 text-white font-extrabold px-6 py-2 rounded-full text-sm uppercase tracking-wider mb-4 shadow">
              <Sparkles className="w-4 h-4" /> Kids Special Edition <Sparkles className="w-4 h-4" />
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-purple-900 mb-2 leading-tight">
              Love & Name <br />
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                Match Tester
              </span>
            </h1>

            <p className="text-purple-700 font-bold text-lg mb-8">
              Find out how awesome you and your friends are together! ✨
            </p>

            {/* Same name bonus hint */}
            <div className="bg-pink-50 border-2 border-pink-200 p-4 rounded-2xl text-pink-800 text-sm font-semibold mb-8 flex items-center gap-3 text-left">
              <span className="text-3xl">🌟</span>
              <div>
                <strong className="block text-pink-900">Secret Magic Rule:</strong>
                If you test two matching names, you unlock an instant super match of 90% to 100%!
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartGame}
              className="w-full py-4 px-8 bg-gradient-to-r from-pink-500 via-rose-400 to-yellow-400 hover:scale-105 text-white font-black text-2xl rounded-2xl shadow-xl border-b-4 border-pink-700 transition transform active:scale-95 flex items-center justify-center gap-3"
            >
              <Play className="w-8 h-8 fill-white" />
              <span>START PLAYING!</span>
            </button>
          </div>
        )}

        {view === 'game' && (
          <div className="w-full max-w-xl bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border-4 border-pink-300 shadow-2xl">
            <h2 className="text-3xl font-black text-center text-purple-900 mb-6 flex items-center justify-center gap-2">
              <Sparkles className="w-7 h-7 text-yellow-400" />
              <span>Enter Names</span>
              <Sparkles className="w-7 h-7 text-yellow-400" />
            </h2>

            <form onSubmit={handleCalculate} className="space-y-6">
              {/* Name 1 Box */}
              <div className="bg-pink-50 p-4 rounded-2xl border-2 border-pink-200">
                <label className="block text-pink-800 font-extrabold mb-1 text-lg">
                  Player 1 Name:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={name1}
                    onChange={(e) => {
                      setName1(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="e.g. Alex"
                    className="flex-1 px-4 py-3 bg-white rounded-xl border-2 border-pink-300 text-purple-900 font-bold text-xl focus:outline-none focus:ring-4 focus:ring-pink-300"
                  />
                </div>
                <p className="text-xs font-bold text-purple-600 mt-2 mb-1">Pick your avatar:</p>
                <AvatarPicker selected={p1Avatar} onSelect={setP1Avatar} soundFx={soundFx} />
              </div>

              {/* Heart Divider */}
              <div className="flex justify-center -my-3 relative z-10">
                <div className="bg-yellow-300 text-pink-700 p-3 rounded-full border-4 border-white shadow-md">
                  <Flame className="w-7 h-7 fill-pink-600 text-pink-600 animate-pulse-heart" />
                </div>
              </div>

              {/* Name 2 Box */}
              <div className="bg-purple-50 p-4 rounded-2xl border-2 border-purple-200">
                <label className="block text-purple-800 font-extrabold mb-1 text-lg">
                  Player 2 Name:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={name2}
                    onChange={(e) => {
                      setName2(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="e.g. Sam"
                    className="flex-1 px-4 py-3 bg-white rounded-xl border-2 border-purple-300 text-purple-900 font-bold text-xl focus:outline-none focus:ring-4 focus:ring-purple-300"
                  />
                </div>
                <p className="text-xs font-bold text-purple-600 mt-2 mb-1">Pick friend's avatar:</p>
                <AvatarPicker selected={p2Avatar} onSelect={setP2Avatar} soundFx={soundFx} />
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-100 border-2 border-red-300 text-red-700 font-extrabold text-center rounded-xl animate-bounce">
                  {errorMsg}
                </div>
              )}

              {/* Calculate Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-yellow-400 hover:scale-105 text-white font-black text-2xl rounded-2xl shadow-xl border-b-4 border-pink-700 transition transform active:scale-95 flex items-center justify-center gap-3"
              >
                <Heart className="w-8 h-8 fill-white" />
                <span>Calculate Match!</span>
              </button>
            </form>
          </div>
        )}

        {view === 'result' && result && (
          <ResultView
            result={result}
            p1Avatar={p1Avatar}
            p2Avatar={p2Avatar}
            onPlayAgain={() => setView('game')}
            onGoHome={() => setView('menu')}
            soundFx={soundFx}
          />
        )}
      </main>

      {/* How To Play Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border-4 border-yellow-300 shadow-2xl relative text-purple-900">
            <h3 className="text-2xl font-black text-pink-600 mb-3 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400" /> How to Play
            </h3>
            <ul className="space-y-3 font-semibold text-base mb-6">
              <li className="flex items-start gap-2">
                <span>1️⃣</span> Enter two names in the text boxes.
              </li>
              <li className="flex items-start gap-2">
                <span>2️⃣</span> Pick cute avatars for both players.
              </li>
              <li className="flex items-start gap-2">
                <span>3️⃣</span> Tap <strong>"Calculate Match!"</strong> to see your love/friendship score!
              </li>
              <li className="flex items-start gap-2 text-pink-600">
                <span>⭐</span> <strong>Magic Tip:</strong> If you use the exact same name for both, you'll always get a high score between 90% and 100%!
              </li>
            </ul>
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setShowHelp(false);
              }}
              className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-extrabold rounded-2xl shadow-md border-b-4 border-pink-700"
            >
              Got it! Let's Play! 🎉
            </button>
          </div>
        </div>
      )}

      {/* Match History Modal */}
      {showHistory && (
        <HistoryDrawer
          history={history}
          onClose={() => setShowHistory(false)}
          onClear={() => {
            setHistory([]);
            localStorage.removeItem('love_match_history');
          }}
          soundFx={soundFx}
        />
      )}

      {/* Footer */}
      <footer className="mt-6 text-center text-purple-800 text-sm font-bold opacity-90">
        Love Name Match Tester • Kids Edition 🎈
      </footer>
    </div>
  );
}

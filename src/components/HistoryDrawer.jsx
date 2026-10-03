import React from 'react';
import { History, Trash2, X, Sparkles } from 'lucide-react';

export function HistoryDrawer({ history, onClose, onClear, soundFx }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full border-4 border-yellow-300 shadow-2xl relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b-2 border-pink-100">
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-black text-purple-800">Match History</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              soundFx?.playClick();
              onClose();
            }}
            className="p-2 bg-pink-100 hover:bg-pink-200 rounded-full text-pink-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 my-4 space-y-3 pr-1">
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500 font-bold">
              <Sparkles className="w-10 h-10 text-yellow-400 mx-auto mb-2 animate-bounce" />
              No matches tested yet! Go calculate some love matches! 💕
            </div>
          ) : (
            history.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl flex items-center justify-between border-2 ${
                  item.isHighMatch
                    ? 'bg-gradient-to-r from-pink-50 to-purple-50 border-pink-300'
                    : 'bg-yellow-50/60 border-yellow-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.p1Avatar}</span>
                  <span className="font-extrabold text-purple-800">{item.name1}</span>
                  <span className="text-pink-500 font-bold">⚡</span>
                  <span className="font-extrabold text-purple-800">{item.name2}</span>
                  <span className="text-2xl">{item.p2Avatar}</span>
                </div>

                <div className="flex items-center gap-1 font-black text-lg bg-white px-3 py-1 rounded-full shadow-sm text-pink-600 border border-pink-200">
                  <span>{item.percentage}%</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {history.length > 0 && (
          <div className="pt-2 border-t-2 border-pink-100 flex justify-end">
            <button
              type="button"
              onClick={() => {
                soundFx?.playClick();
                onClear();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded-xl transition text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

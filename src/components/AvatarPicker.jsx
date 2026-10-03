import React from 'react';

export const AVATARS = [
  { id: 'bunny', emoji: '🐰', label: 'Bunny' },
  { id: 'puppy', emoji: '🐶', label: 'Puppy' },
  { id: 'kitty', emoji: '🐱', label: 'Kitty' },
  { id: 'unicorn', emoji: '🦄', label: 'Unicorn' },
  { id: 'robot', emoji: '🤖', label: 'Robot' },
  { id: 'bear', emoji: '🐻', label: 'Bear' },
  { id: 'star', emoji: '⭐', label: 'Star' },
  { id: 'dragon', emoji: '🐲', label: 'Dragon' },
];

export function AvatarPicker({ selected, onSelect, soundFx }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 my-2">
      {AVATARS.map((avatar) => {
        const isSelected = selected === avatar.emoji;
        return (
          <button
            key={avatar.id}
            type="button"
            onClick={() => {
              if (soundFx) soundFx.playPop();
              onSelect(avatar.emoji);
            }}
            className={`text-2xl p-2 rounded-2xl transition-all transform active:scale-90 ${
              isSelected
                ? 'bg-yellow-300 ring-4 ring-pink-400 scale-110 shadow-lg'
                : 'bg-white/80 hover:bg-white hover:scale-105 border-2 border-pink-200'
            }`}
            title={avatar.label}
          >
            {avatar.emoji}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Love Name Match Logic for Kids Game
 *
 * Rules:
 * - Same names (case-insensitive, trimmed) ALWAYS result in 90% - 100% match.
 * - Different names result in a lower match percentage (15% - 88%).
 * - The result is deterministic for any given pair regardless of order.
 */

function stringHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function calculateLoveMatch(rawName1, rawName2) {
  const name1 = (rawName1 || '').trim();
  const name2 = (rawName2 || '').trim();

  if (!name1 || !name2) {
    return {
      percentage: 0,
      title: 'Empty Names!',
      badge: '❓',
      description: 'Please type two names to test the magic match!',
      themeColor: 'from-gray-400 to-gray-500',
      isHighMatch: false
    };
  }

  const clean1 = name1.toLowerCase();
  const clean2 = name2.toLowerCase();

  const isSameName = clean1 === clean2;

  let percentage = 0;

  if (isSameName) {
    // Same name rule: 90% - 100%
    const hash = stringHash(clean1);
    percentage = 90 + (hash % 11); // Range: 90, 91, 92, ..., 100
  } else {
    // Different names rule: 15% - 88%
    // Sort names to ensure symmetry (Alex + Sam == Sam + Alex)
    const sortedCombined = [clean1, clean2].sort().join('&');
    const hash = stringHash(sortedCombined);
    percentage = 15 + (hash % 74); // Range: 15 to 88
  }

  // Tiered kids feedback based on percentage
  let title = '';
  let badge = '';
  let description = '';
  let themeColor = '';
  let isHighMatch = percentage >= 90;

  if (percentage >= 90) {
    title = isSameName ? 'Twin Magic Match! ✨' : 'Super Soulmates! 💖';
    badge = '👑';
    description = isSameName
      ? `Wow! ${name1} and ${name2} share the exact same magical name! That's a 100% match in spirit!`
      : `Incredible! ${name1} and ${name2} are an unstoppable dream team!`;
    themeColor = 'from-pink-500 via-rose-400 to-yellow-400';
  } else if (percentage >= 75) {
    title = 'Best Friends Forever! 🌟';
    badge = '🌈';
    description = `${name1} and ${name2} are super awesome together! High-five! 🖐️`;
    themeColor = 'from-purple-500 via-indigo-400 to-pink-400';
  } else if (percentage >= 50) {
    title = 'Playground Pals! 🎈';
    badge = '🎉';
    description = `${name1} and ${name2} share great vibes and fun games together!`;
    themeColor = 'from-blue-400 via-teal-300 to-green-400';
  } else {
    title = 'Cute Buddies! 🐣';
    badge = '⭐';
    description = `${name1} and ${name2} can learn fun new tricks together every day!`;
    themeColor = 'from-amber-400 via-orange-300 to-yellow-400';
  }

  return {
    name1,
    name2,
    percentage,
    title,
    badge,
    description,
    themeColor,
    isHighMatch
  };
}

// COLOR CONSTANTS & PALETTE DEFINITION
export const COLOR_PALETTE = {
  red: { name: 'Red', hex: '#EF4444', gradient: 'from-red-500 to-red-700', shadow: '#991B1B', border: '#B91C1C' },
  blue: { name: 'Blue', hex: '#3B82F6', gradient: 'from-blue-500 to-blue-700', shadow: '#1E40AF', border: '#1D4ED8' },
  green: { name: 'Green', hex: '#22C55E', gradient: 'from-green-500 to-green-700', shadow: '#166534', border: '#15803D' },
  yellow: { name: 'Yellow', hex: '#EAB308', gradient: 'from-yellow-400 to-yellow-600', shadow: '#854D0E', border: '#A16207' },
  purple: { name: 'Purple', hex: '#A855F7', gradient: 'from-purple-500 to-purple-700', shadow: '#6B21A8', border: '#7E22CE' },
  orange: { name: 'Orange', hex: '#F97316', gradient: 'from-orange-500 to-orange-700', shadow: '#9A3412', border: '#C2410C' },
  cyan: { name: 'Cyan', hex: '#06B6D4', gradient: 'from-cyan-400 to-cyan-600', shadow: '#155E75', border: '#0E7490' },
  pink: { name: 'Pink', hex: '#EC4899', gradient: 'from-pink-500 to-pink-700', shadow: '#9D174D', border: '#BE185D' },
  lime: { name: 'Lime', hex: '#84CC16', gradient: 'from-lime-400 to-lime-600', shadow: '#3F6212', border: '#4D7C0F' },
  brown: { name: 'Brown', hex: '#A16207', gradient: 'from-amber-700 to-amber-900', shadow: '#451A03', border: '#78350F' }
};

export const CAPACITY = 4;

/**
 * Nut object format:
 * { id: string, color: string, hidden: boolean }
 */

/**
 * Checks if moving nut(s) from source bolt index to target bolt index is valid.
 */
export function isValidMove(bolts, fromIdx, toIdx) {
  if (fromIdx === toIdx) return false;
  if (fromIdx < 0 || fromIdx >= bolts.length) return false;
  if (toIdx < 0 || toIdx >= bolts.length) return false;

  const sourceBolt = bolts[fromIdx];
  const targetBolt = bolts[toIdx];

  if (!sourceBolt || sourceBolt.length === 0) return false;
  if (targetBolt.length >= CAPACITY) return false;

  const topSourceNut = sourceBolt[sourceBolt.length - 1];
  // Cannot move hidden nuts
  if (topSourceNut.hidden) return false;

  if (targetBolt.length === 0) return true;

  const topTargetNut = targetBolt[targetBolt.length - 1];
  return topSourceNut.color === topTargetNut.color;
}

/**
 * Executes a move pouring matching top consecutive nuts from source bolt to target bolt.
 * Unhides top nut of source bolt if applicable.
 * Returns { newBolts, movedCount }
 */
export function executeMove(bolts, fromIdx, toIdx) {
  if (!isValidMove(bolts, fromIdx, toIdx)) return null;

  // Clone state deeply
  const newBolts = bolts.map(bolt => bolt.map(nut => ({ ...nut })));
  const sourceBolt = newBolts[fromIdx];
  const targetBolt = newBolts[toIdx];

  const targetFreeSpace = CAPACITY - targetBolt.length;
  const topColor = sourceBolt[sourceBolt.length - 1].color;

  // Count how many top nuts match topColor and are not hidden
  let countToMove = 0;
  for (let i = sourceBolt.length - 1; i >= 0; i--) {
    if (sourceBolt[i].color === topColor && !sourceBolt[i].hidden) {
      countToMove++;
    } else {
      break;
    }
  }

  const numToTransfer = Math.min(countToMove, targetFreeSpace);
  const transferredNuts = sourceBolt.splice(sourceBolt.length - numToTransfer, numToTransfer);
  targetBolt.push(...transferredNuts);

  // Unhide top nut of source bolt if present
  if (sourceBolt.length > 0) {
    sourceBolt[sourceBolt.length - 1].hidden = false;
  }

  return { newBolts, movedCount: numToTransfer };
}

/**
 * Checks if the game is won.
 * Win condition: Every bolt is either completely empty OR full (4 nuts) of identical color.
 */
export function checkWin(bolts) {
  for (const bolt of bolts) {
    if (bolt.length === 0) continue;
    if (bolt.length < CAPACITY) return false;
    // Check if any nut is hidden
    if (bolt.some(nut => nut.hidden)) return false;
    // Check if all nuts in bolt have the same color
    const firstColor = bolt[0].color;
    if (bolt.some(nut => nut.color !== firstColor)) return false;
  }
  return true;
}

/**
 * Generates initial levels or random solvable levels.
 */
export function generateLevel(levelNum) {
  const colorKeys = Object.keys(COLOR_PALETTE);

  // Determine difficulty parameters based on levelNum
  let numColors = Math.min(2 + Math.floor((levelNum - 1) / 2), 8);
  let numEmptyBolts = 2;
  let useHiddenNuts = levelNum >= 5;

  const selectedColors = colorKeys.slice(0, numColors);
  let idCounter = 1;

  // Create solved state
  const solvedBolts = selectedColors.map(color => {
    const stack = [];
    for (let i = 0; i < CAPACITY; i++) {
      stack.push({ id: `nut-${idCounter++}`, color, hidden: false });
    }
    return stack;
  });

  // Add empty bolts
  for (let i = 0; i < numEmptyBolts; i++) {
    solvedBolts.push([]);
  }

  // Shuffle by simulating valid reverse moves to ensure solvability
  let currentBolts = solvedBolts.map(bolt => bolt.map(nut => ({ ...nut })));
  const shuffleSteps = 25 + levelNum * 5;

  for (let step = 0; step < shuffleSteps; step++) {
    const validMoves = [];
    for (let i = 0; i < currentBolts.length; i++) {
      if (currentBolts[i].length === 0) continue;
      for (let j = 0; j < currentBolts.length; j++) {
        if (i === j) continue;
        if (currentBolts[j].length >= CAPACITY) continue;
        validMoves.push([i, j]);
      }
    }

    if (validMoves.length > 0) {
      const [from, to] = validMoves[Math.floor(Math.random() * validMoves.length)];
      const nut = currentBolts[from].pop();
      currentBolts[to].push(nut);
    }
  }

  // If hard mode/hidden nuts, hide non-top nuts in filled bolts
  if (useHiddenNuts) {
    currentBolts.forEach(bolt => {
      for (let i = 0; i < bolt.length - 1; i++) {
        // Hide with a 50% chance if not top nut
        if (Math.random() > 0.4) {
          bolt[i].hidden = true;
        }
      }
    });
  }

  return currentBolts;
}

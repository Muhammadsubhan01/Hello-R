import { isValidMove, executeMove, checkWin, generateLevel, CAPACITY } from './nutsEngine.js';

function runTests() {
  console.log('=== RUNNING NUTS ENGINE TESTS ===');

  // Test 1: Check initial empty/filled bolt moves
  const testBolts1 = [
    [
      { id: '1', color: 'red', hidden: false },
      { id: '2', color: 'red', hidden: false }
    ],
    [],
    [
      { id: '3', color: 'blue', hidden: false }
    ]
  ];

  console.assert(isValidMove(testBolts1, 0, 1) === true, 'Move to empty bolt should be valid');
  console.assert(isValidMove(testBolts1, 0, 2) === false, 'Move red onto blue should be invalid');
  console.assert(isValidMove(testBolts1, 1, 0) === false, 'Move from empty bolt should be invalid');

  // Test 2: Execute move and verify transfer count
  const result = executeMove(testBolts1, 0, 1);
  console.assert(result !== null, 'Execute move should return result');
  console.assert(result.movedCount === 2, 'Should move 2 consecutive red nuts');
  console.assert(result.newBolts[0].length === 0, 'Source bolt should now be empty');
  console.assert(result.newBolts[1].length === 2, 'Target bolt should now have 2 nuts');

  // Test 3: Check hidden nut unhiding
  const testBoltsHidden = [
    [
      { id: '1', color: 'green', hidden: true },
      { id: '2', color: 'blue', hidden: false }
    ],
    []
  ];

  const resultHidden = executeMove(testBoltsHidden, 0, 1);
  console.assert(resultHidden.newBolts[0][0].hidden === false, 'Source top nut should unhide after top nut is removed');

  // Test 4: Check win condition
  const winningBolts = [
    [
      { id: '1', color: 'red', hidden: false },
      { id: '2', color: 'red', hidden: false },
      { id: '3', color: 'red', hidden: false },
      { id: '4', color: 'red', hidden: false }
    ],
    [
      { id: '5', color: 'blue', hidden: false },
      { id: '6', color: 'blue', hidden: false },
      { id: '7', color: 'blue', hidden: false },
      { id: '8', color: 'blue', hidden: false }
    ],
    []
  ];
  console.assert(checkWin(winningBolts) === true, 'Matching complete bolts should trigger win');

  const nonWinningBolts = [
    [
      { id: '1', color: 'red', hidden: false },
      { id: '2', color: 'red', hidden: false },
      { id: '3', color: 'red', hidden: false }
    ],
    []
  ];
  console.assert(checkWin(nonWinningBolts) === false, 'Incomplete bolt should not be win');

  // Test 5: Generator check
  const level1 = generateLevel(1);
  console.assert(Array.isArray(level1) && level1.length > 0, 'Level generator should return non-empty array');

  console.log('✅ ALL NUTS ENGINE TESTS PASSED SUCCESSFULLY!');
}

runTests();

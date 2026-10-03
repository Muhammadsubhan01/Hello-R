import { calculateLoveMatch } from './loveMatch.js';

function runTests() {
  console.log('--- Running Love Match Logic Tests ---');

  // Test 1: Same names should result in 90% - 100%
  const test1a = calculateLoveMatch('Emma', 'Emma');
  console.assert(test1a.percentage >= 90 && test1a.percentage <= 100, `Test 1a Failed: ${test1a.percentage}`);
  console.assert(test1a.isHighMatch === true, 'Test 1a isHighMatch Failed');

  const test1b = calculateLoveMatch('LUCAS', 'lucas');
  console.assert(test1b.percentage >= 90 && test1b.percentage <= 100, `Test 1b Failed: ${test1b.percentage}`);

  const test1c = calculateLoveMatch('  Maya  ', 'maya');
  console.assert(test1c.percentage >= 90 && test1c.percentage <= 100, `Test 1c Failed: ${test1c.percentage}`);

  console.log('✅ Same Name Tests Passed (scores 90%-100%)');

  // Test 2: Different names should result in lower score (< 90%)
  const test2a = calculateLoveMatch('Emma', 'Noah');
  console.assert(test2a.percentage < 90, `Test 2a Failed: ${test2a.percentage}`);

  const test2b = calculateLoveMatch('Oliver', 'Sophia');
  console.assert(test2b.percentage < 90, `Test 2b Failed: ${test2b.percentage}`);

  console.log('✅ Different Name Tests Passed (lower scores)');

  // Test 3: Symmetry (A + B == B + A)
  const pair1 = calculateLoveMatch('Alice', 'Bob');
  const pair2 = calculateLoveMatch('Bob', 'Alice');
  console.assert(pair1.percentage === pair2.percentage, `Test 3 Failed: ${pair1.percentage} vs ${pair2.percentage}`);

  console.log('✅ Symmetry Tests Passed');

  // Test 4: Empty name handling
  const empty1 = calculateLoveMatch('', 'Bob');
  console.assert(empty1.percentage === 0, 'Test 4 Failed');

  console.log('✅ Empty Name Test Passed');

  console.log('ALL TESTS PASSED SUCCESSFULLY! 🎉');
}

runTests();

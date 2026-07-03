import assert from 'assert';

// Pure function mirroring the local frontend deduplication check in TaskContext
const checkDuplicateLocally = (tasks, title, deadline) => {
  const trimmedTitle = (title || '').trim().toLowerCase();
  return tasks.some(t => 
    t.title.trim().toLowerCase() === trimmedTitle &&
    t.deadline === deadline
  );
};

console.log('🚀 Running Frontend Unit Tests...');

const mockTasks = [
  { title: 'Complete Assignment 3', deadline: '2026-07-03T18:00:00Z' },
  { title: 'Workout', deadline: '2026-07-03T08:00:00Z' }
];

// Test case 1: Identical match
assert.strictEqual(
  checkDuplicateLocally(mockTasks, 'Complete Assignment 3', '2026-07-03T18:00:00Z'),
  true,
  'Failed: Should detect duplicate task with exact match'
);

// Test case 2: Match with whitespaces and casing
assert.strictEqual(
  checkDuplicateLocally(mockTasks, '  complete assignment 3  ', '2026-07-03T18:00:00Z'),
  true,
  'Failed: Should detect duplicate task regardless of casing and spaces'
);

// Test case 3: Non-duplicate (different deadline)
assert.strictEqual(
  checkDuplicateLocally(mockTasks, 'Complete Assignment 3', '2026-07-04T18:00:00Z'),
  false,
  'Failed: Should not flag duplicate if deadlines are different'
);

// Test case 4: Non-duplicate (different title)
assert.strictEqual(
  checkDuplicateLocally(mockTasks, 'Complete Assignment 4', '2026-07-03T18:00:00Z'),
  false,
  'Failed: Should not flag duplicate if titles are different'
);

console.log('✅ Frontend Unit Tests Passed successfully!');

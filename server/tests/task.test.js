import test from 'node:test';
import assert from 'node:assert';
import { taskController } from '../controllers/taskController.js';
import { geminiService } from '../services/geminiService.js';
import { mockDB } from '../firebase/firebaseAdmin.js';

// Setup Mock Request and Response helpers
const createMockResponse = () => {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    }
  };
  return res;
};

test('Backend Task Deduplication and AI Scheduling Tests', async (t) => {
  
  await t.test('Deduplication: Should block duplicate task creation', async () => {
    // Clear mock DB tasks
    mockDB.tasks.clear();

    const userId = 'test_user_abc';
    const deadline = '2026-07-04T10:00:00Z';
    const taskData = {
      title: 'Complete Math Assignment',
      description: 'Solve chapter 4 exercises',
      deadline,
      priority: 'High',
      estimatedHours: 2,
      category: 'College'
    };

    // Mock first request
    const req1 = {
      user: { uid: userId },
      body: taskData
    };
    const res1 = createMockResponse();

    // First task creation (should succeed)
    await taskController.createTask(req1, res1);
    assert.strictEqual(res1.statusCode, 201);
    assert.ok(res1.body.success);
    assert.strictEqual(res1.body.task.title, 'Complete Math Assignment');

    // Mock duplicate request (same title and deadline)
    const req2 = {
      user: { uid: userId },
      body: {
        ...taskData,
        title: '  Complete Math Assignment  ' // check whitespace trimming too
      }
    };
    const res2 = createMockResponse();

    // Second task creation (should return 409 Conflict)
    await taskController.createTask(req2, res2);
    assert.strictEqual(res2.statusCode, 409);
    assert.strictEqual(res2.body.success, false);
    assert.match(res2.body.message, /already exists/);

    // Verify DB only has 1 task
    const userTasks = Array.from(mockDB.tasks.values()).filter(t => t.userId === userId);
    assert.strictEqual(userTasks.length, 1);
  });

  await t.test('AI Scheduler: Should parse currentTime and workload-balance tasks', async () => {
    const mockTasks = [
      {
        id: 'task_1',
        title: 'Implement Authentication',
        estimatedHours: 3.5, // > 1.5 hours, should be split
        priority: 'Critical',
        status: 'pending',
        deadline: '2026-07-03T18:00:00Z'
      },
      {
        id: 'task_2',
        title: 'UI Design Review',
        estimatedHours: 1.0,
        priority: 'Medium',
        status: 'pending',
        deadline: '2026-07-03T20:00:00Z'
      }
    ];

    // Generate schedule starting at 10:00 AM
    const schedule = await geminiService.generateDailySchedule({
      currentTime: '10:00 AM',
      tasks: mockTasks
    });

    assert.ok(schedule.productivityScoreForecast);
    assert.ok(Array.isArray(schedule.timeline));
    assert.ok(schedule.tips.length > 0);

    // Verify long task is split into multiple blocks (sprint 1, sprint 2)
    const focusBlocks = schedule.timeline.filter(item => item.type === 'focus' && item.taskId === 'task_1');
    assert.ok(focusBlocks.length >= 2, 'Long task should be split into multiple sprints');
    
    // Verify sprints have non-repetitive descriptions
    assert.ok(focusBlocks[0].activity.includes('Core Coding Session') || focusBlocks[0].activity.includes('Focus Sprint 1'));
    assert.ok(focusBlocks[1].activity.includes('Deep Implementation') || focusBlocks[1].activity.includes('Focus Sprint 2'));

    // Verify breaks are inserted
    const breaks = schedule.timeline.filter(item => item.type === 'break');
    assert.ok(breaks.length > 0, 'Scheduler should insert rest and meal breaks');

    // Verify schedule starts correctly
    const firstBlock = schedule.timeline[0];
    assert.ok(firstBlock.timeSlot.startsWith('10:00 AM'), `Schedule should start at 10:00 AM, got: ${firstBlock.timeSlot}`);
  });

  await t.test('AI Generator: Should generate customized subtasks based on keywords', async () => {
    const breakdown = await geminiService.generateTaskBreakdown({
      title: 'Debug React Context issues',
      category: 'Projects',
      deadline: '2026-07-04T12:00:00Z'
    });

    assert.ok(breakdown.subtasks);
    assert.ok(breakdown.subtasks.length >= 3);
    
    // Verify custom subtasks are generated for coding/debugging keywords
    const subtaskTitles = breakdown.subtasks.map(s => s.title.toLowerCase());
    const hasCoreDevSteps = subtaskTitles.some(t => t.includes('edge cases') || t.includes('implement') || t.includes('debug') || t.includes('test'));
    assert.ok(hasCoreDevSteps, 'Fallback subtasks should be customized for coding tasks');
  });

});

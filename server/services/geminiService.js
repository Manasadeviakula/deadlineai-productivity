import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/config.js';

let genAI = null;
if (config.geminiApiKey) {
  try {
    genAI = new GoogleGenerativeAI(config.geminiApiKey);
  } catch (err) {
    console.warn("Failed to initialize GoogleGenerativeAI Client:", err.message);
  }
}

function parseJSONFromResponse(text) {
  try {
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse JSON from AI response:", e, text);
    throw new Error("Invalid JSON format from AI");
  }
}

export const geminiService = {
  async generateTaskBreakdown({ title, description, category, deadline }) {
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
You are an expert project manager and productivity engine for DeadlineAI.
Analyze the following task details and return a structured JSON object containing an actionable step-by-step breakdown.
Make sure the subtasks are highly detailed, non-repetitive, specific to the task title, workload-balanced, and cover 4 to 6 logical steps.

Task Title: "${title}"
Description: "${description || 'N/A'}"
Category: "${category}"
Deadline: "${deadline}"

Return ONLY valid raw JSON with the following structure (no markdown formatting):
{
  "summary": "Short encouraging summary of approach",
  "totalEstimatedHours": 3.5,
  "suggestedWorkingHours": "Morning (9:00 AM - 12:30 PM) when focus is highest",
  "subtasks": [
    {
      "id": "st_1",
      "title": "Clear concise subtask name",
      "estimatedMinutes": 45,
      "priority": "High",
      "order": 1
    }
  ],
  "suggestedBreaks": [
    "15 min walk after step 2",
    "5 min hydration break after step 4"
  ]
}
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return parseJSONFromResponse(text);
      } catch (err) {
        console.warn("Gemini API call failed, using fallback breakdown:", err.message);
      }
    }

    // Dynamic, keyword-based local fallback breakdown generator
    const cleanTitle = (title || '').toLowerCase();
    const cleanCategory = (category || '').toLowerCase();
    let subtasks = [];
    let suggestedBreaks = ["10-min hydration & eye-rest break after first hour"];
    let totalHours = 2.0;
    let workingHours = "Morning (9:30 AM - 11:30 AM)";

    if (cleanCategory === 'college' || cleanCategory === 'work' || cleanCategory === 'projects') {
      if (cleanTitle.includes('code') || cleanTitle.includes('develop') || cleanTitle.includes('build') || cleanTitle.includes('bug') || cleanTitle.includes('debug')) {
        totalHours = 2.5;
        workingHours = "Afternoon focus block (2:00 PM - 4:30 PM)";
        subtasks = [
          { id: "st_1", title: `Review scope, write tests, and outline architecture for "${title}"`, estimatedMinutes: 45, priority: "High", order: 1 },
          { id: "st_2", title: "Implement core functional code and handle edge cases", estimatedMinutes: 60, priority: "Critical", order: 2 },
          { id: "st_3", title: "Debug errors, optimize loops, and run validation test scripts", estimatedMinutes: 30, priority: "High", order: 3 },
          { id: "st_4", title: "Conduct code styling reviews, add comments, and push to main", estimatedMinutes: 15, priority: "Medium", order: 4 }
        ];
        suggestedBreaks = [
          "5-min eye rest after architecture setup",
          "15-min walk & stretch after core implementation block"
        ];
      } else if (cleanTitle.includes('study') || cleanTitle.includes('exam') || cleanTitle.includes('read')) {
        totalHours = 3.0;
        workingHours = "Morning focus block (9:00 AM - 12:00 PM)";
        subtasks = [
          { id: "st_1", title: `Review key concepts, study guides, and lecture slides for "${title}"`, estimatedMinutes: 45, priority: "High", order: 1 },
          { id: "st_2", title: "Create flashcards, notes, and memorize formulas/terminologies", estimatedMinutes: 60, priority: "Critical", order: 2 },
          { id: "st_3", title: "Solve practice question papers under mock exam conditions", estimatedMinutes: 45, priority: "High", order: 3 },
          { id: "st_4", title: "Perform final gap analysis on weak topics and check answers", estimatedMinutes: 30, priority: "Medium", order: 4 }
        ];
        suggestedBreaks = [
          "10-min Pomodoro break after memorization study",
          "10-min fresh air break before solving papers"
        ];
      } else {
        totalHours = 2.0;
        workingHours = "Mid-day focus block (11:00 AM - 1:00 PM)";
        subtasks = [
          { id: "st_1", title: `Research literature, outline core structure, and gather resources for "${title}"`, estimatedMinutes: 30, priority: "High", order: 1 },
          { id: "st_2", title: "Draft main document contents, designs, or project logic", estimatedMinutes: 60, priority: "Critical", order: 2 },
          { id: "st_3", title: "Review drafts against project guidelines and format layout", estimatedMinutes: 30, priority: "Medium", order: 3 }
        ];
        suggestedBreaks = [
          "10-min movement break after primary draft sprint"
        ];
      }
    } else if (cleanCategory === 'health' || cleanTitle.includes('workout') || cleanTitle.includes('gym')) {
      totalHours = 1.0;
      workingHours = "Early Morning (7:00 AM - 8:00 AM)";
      subtasks = [
        { id: "st_1", title: "Light cardio and full-body dynamic warm-up stretching", estimatedMinutes: 10, priority: "Medium", order: 1 },
        { id: "st_2", title: `Execute main physical routine: "${title}" Sprints`, estimatedMinutes: 40, priority: "High", order: 2 },
        { id: "st_3", title: "Cool down stretching, hydration, and fitness log entry", estimatedMinutes: 10, priority: "Medium", order: 3 }
      ];
      suggestedBreaks = [
        "Hydrate with electrolyte fluids between workouts"
      ];
    } else {
      totalHours = 1.5;
      workingHours = "Flexible schedule slot";
      subtasks = [
        { id: "st_1", title: `Prepare workspace and detail requirements for "${title}"`, estimatedMinutes: 20, priority: "Medium", order: 1 },
        { id: "st_2", title: "Execute primary deliverables and resolve bottlenecks", estimatedMinutes: 50, priority: "High", order: 2 },
        { id: "st_3", title: "Verify final quality and clean up environment", estimatedMinutes: 20, priority: "Low", order: 3 }
      ];
      suggestedBreaks = [
        "5-min posture correction stretch"
      ];
    }

    return {
      summary: `AI Plan for "${title}": Dynamically balanced steps optimized to save cognitive load.`,
      totalEstimatedHours: totalHours,
      suggestedWorkingHours: workingHours,
      subtasks,
      suggestedBreaks
    };
  },

  async generateDailySchedule({ currentTime, tasks }) {
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
You are DeadlineAI's Daily Planner. Generate an optimized daily timeline starting from current time: ${currentTime}.
User's Pending Tasks: ${JSON.stringify(tasks)}

Ensure you adhere to the following workload balancing guidelines:
1. Limit individual focus sprints to maximum 90 minutes. If a task requires more time, split it into separate focus blocks (e.g. Focus Sprint 1, Focus Sprint 2) with breaks in between.
2. Insert a 10-15 minute energy rest break (type: "break") between focus sprints.
3. Insert standard meal breaks: Lunch (45 mins, type: "break") around 12:30 PM - 1:30 PM, and Dinner (45 mins, type: "break") around 7:30 PM - 8:30 PM if the schedule covers those times.
4. Avoid repetitive activity names. Use varied descriptions like "Deep Work on...", "Reviewing code for...", "Refining draft of...".

Return ONLY valid raw JSON with the following structure:
{
  "productivityScoreForecast": 92,
  "timeline": [
    {
      "timeSlot": "09:00 AM - 10:30 AM",
      "activity": "Deep Work on OS Assignment",
      "type": "focus",
      "taskId": "task_id_here",
      "priority": "Critical"
    }
  ],
  "tips": [
    "Prioritize critical items before 2 PM to avoid cognitive fatigue."
  ]
}
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return parseJSONFromResponse(text);
      } catch (err) {
        console.warn("Gemini Daily Plan failed, using fallback:", err.message);
      }
    }

    // Helper functions for smart timeline calculation
    const parseTimeToMinutes = (timeStr) => {
      if (!timeStr) return 9 * 60; // default 9:00 AM
      const cleanStr = timeStr.trim().toUpperCase();
      const match = cleanStr.match(/^(\d+):(\d+)\s*(AM|PM)?$/);
      if (!match) {
        const isoMatch = cleanStr.match(/^(\d{2}):(\d{2})$/);
        if (isoMatch) return parseInt(isoMatch[1]) * 60 + parseInt(isoMatch[2]);
        return 9 * 60;
      }
      let hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const ampm = match[3];
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    const formatMinutesToTime = (totalMin) => {
      let hours = Math.floor(totalMin / 60) % 24;
      const minutes = Math.floor(totalMin % 60);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      let displayHour = hours % 12;
      if (displayHour === 0) displayHour = 12;
      const displayMin = minutes.toString().padStart(2, '0');
      return `${displayHour.toString().padStart(2, '0')}:${displayMin} ${ampm}`;
    };

    // Filters pending tasks only
    const pendingTasks = tasks.filter(t => t.status === 'pending');

    // Sort tasks: Critical (4) > High (3) > Medium (2) > Low (1)
    const priorityWeight = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
    const sortedTasks = [...pendingTasks].sort((a, b) => {
      const wa = priorityWeight[a.priority] || 2;
      const wb = priorityWeight[b.priority] || 2;
      if (wa !== wb) return wb - wa; // descending order of weight
      return new Date(a.deadline) - new Date(b.deadline); // earliest deadline first
    });

    let currentMin = parseTimeToMinutes(currentTime);
    const timeline = [];
    let totalFocusMins = 0;
    const taskSprintCount = {};

    for (const task of sortedTasks) {
      // Limit scheduled work per task to max 4 hours per day
      let taskMinutes = Math.min((task.estimatedHours || 1) * 60, 4 * 60);
      taskSprintCount[task.id] = 0;

      while (taskMinutes > 0) {
        // 1. Insert meal breaks if the schedule crosses standard times
        // Lunch Break: 12:30 PM - 1:15 PM (750 to 795 mins)
        if (currentMin < 750 && (currentMin + Math.min(taskMinutes, 90)) > 750) {
          timeline.push({
            timeSlot: `${formatMinutesToTime(750)} - ${formatMinutesToTime(795)}`,
            activity: "Healthy Lunch & Hydration Rest",
            type: "break",
            taskId: null,
            priority: "Low"
          });
          currentMin = 795;
        }

        // Dinner Break: 7:30 PM - 8:15 PM (1170 to 1215 mins)
        if (currentMin < 1170 && (currentMin + Math.min(taskMinutes, 90)) > 1170) {
          timeline.push({
            timeSlot: `${formatMinutesToTime(1170)} - ${formatMinutesToTime(1215)}`,
            activity: "Dinner & Mental Recharge Rest",
            type: "break",
            taskId: null,
            priority: "Low"
          });
          currentMin = 1215;
        }

        // 2. Schedule work focus sprint (max 90 minutes)
        const sprintDuration = Math.min(taskMinutes, 90);
        taskSprintCount[task.id] += 1;
        const sprintIndex = taskSprintCount[task.id];

        // Diverse, non-repetitive activity descriptions based on task title and sprint index
        let activityTitle = `Focus Sprint ${sprintIndex}: ${task.title}`;
        if (sprintIndex > 1) {
          if (sprintIndex === 2) activityTitle = `Deep Implementation: ${task.title}`;
          else if (sprintIndex === 3) activityTitle = `Testing & Verification: ${task.title}`;
          else activityTitle = `Refining & Finalizing: ${task.title}`;
        } else {
          // Customize the first sprint title based on keywords
          const titleLower = task.title.toLowerCase();
          if (titleLower.includes('code') || titleLower.includes('develop')) {
            activityTitle = `Core Coding Session: ${task.title}`;
          } else if (titleLower.includes('study') || titleLower.includes('exam')) {
            activityTitle = `Intense Study Sprint: ${task.title}`;
          } else if (titleLower.includes('draft') || titleLower.includes('write')) {
            activityTitle = `Drafting Session: ${task.title}`;
          }
        }

        timeline.push({
          timeSlot: `${formatMinutesToTime(currentMin)} - ${formatMinutesToTime(currentMin + sprintDuration)}`,
          activity: activityTitle,
          type: "focus",
          taskId: task.id,
          priority: task.priority || "High"
        });

        currentMin += sprintDuration;
        totalFocusMins += sprintDuration;
        taskMinutes -= sprintDuration;

        // 3. Insert rest breaks between consecutive sprints
        if (taskMinutes > 0) {
          timeline.push({
            timeSlot: `${formatMinutesToTime(currentMin)} - ${formatMinutesToTime(currentMin + 15)}`,
            activity: "Hydration & Dynamic Stretch Break",
            type: "break",
            taskId: null,
            priority: "Low"
          });
          currentMin += 15;
        } else {
          // If we finished a task block and there are other tasks, insert a transition break
          const isLastTask = sortedTasks[sortedTasks.length - 1].id === task.id;
          if (!isLastTask) {
            timeline.push({
              timeSlot: `${formatMinutesToTime(currentMin)} - ${formatMinutesToTime(currentMin + 10)}`,
              activity: "Cognitive Refreshment Break",
              type: "break",
              taskId: null,
              priority: "Low"
            });
            currentMin += 10;
          }
        }
      }
    }

    // Limit daily scheduled workload to prevent burnout
    if (timeline.length === 0) {
      timeline.push({
        timeSlot: `${formatMinutesToTime(currentMin)} - ${formatMinutesToTime(currentMin + 60)}`,
        activity: "Strategic Planning & Catch-up Tasks",
        type: "focus",
        taskId: null,
        priority: "Medium"
      });
    }

    // Dynamic Productivity Forecast score calculation
    let forecastScore = 95;
    const criticalTasks = sortedTasks.filter(t => t.priority === 'Critical');
    forecastScore -= criticalTasks.length * 3; // deductions for high stress/deadlines
    if (totalFocusMins > 360) {
      // deduct 1 point for every 30 minutes above 6 hours of work (burnout fatigue)
      forecastScore -= Math.floor((totalFocusMins - 360) / 30);
    }
    forecastScore = Math.max(65, Math.min(98, forecastScore));

    // Dynamic, tailored tips
    const tips = [
      "Distribute heavy workload blocks across active intervals to minimize cognitive strain.",
      "Hydrate well during your scheduled energy rest intervals."
    ];
    if (criticalTasks.length > 0) {
      tips.unshift(`You have ${criticalTasks.length} Critical priority task(s) today. Execute these first while mental energy is high.`);
    }
    if (totalFocusMins > 300) {
      tips.push("Your calendar is highly loaded today. Consider declining low-value meetings to protect your focus blocks.");
    }

    return {
      productivityScoreForecast: forecastScore,
      timeline,
      tips
    };
  },

  async chatWithAICoach({ message, history = [], userTasks = [] }) {
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const systemInstruction = `You are DeadlineAI's AI Productivity Coach — an empathetic, encouraging, and razor-sharp mentor. Help users overcome procrastination, organize chaos, manage stress, and crush deadlines. Keep answers concise, actionable, and warm.`;
        const prompt = `${systemInstruction}\nContext on tasks: ${JSON.stringify(userTasks.slice(0, 3))}\nUser: ${message}`;

        const result = await model.generateContent(prompt);
        return { reply: result.response.text() };
      } catch (err) {
        console.warn("Gemini Coach chat failed, using fallback:", err.message);
      }
    }

    const lower = message.toLowerCase();
    let reply = "I'm here to support you! Let's tackle your priorities step-by-step. What is the one task you'd feel most relieved to complete right now?";

    if (lower.includes("assignment") || lower.includes("tomorrow") || lower.includes("busy") || lower.includes("due")) {
      reply = "Take a deep breath! Having multiple deadlines is tough, but manageable when broken down. Here is my immediate advice:\n\n1. **Pick the urgent one**: Focus 100% on your closest deadline for 45 minutes.\n2. **Use the AI Breakdown**: Click 'Generate AI Plan' on your task to get bite-sized steps.\n3. **Protect your focus**: Turn off notifications during work sprints.";
    } else if (lower.includes("tired") || lower.includes("exhausted") || lower.includes("burnout") || lower.includes("sleep")) {
      reply = "Your health is your foundation! Forcing deep work while fatigued usually leads to diminishing returns. Try taking a 20-minute power nap or a short walk to step away from screens. When you return, pick just one low-friction task to rebuild momentum.";
    } else if (lower.includes("next") || lower.includes("do now") || lower.includes("start")) {
      reply = "Looking at your schedule, I recommend starting with your **highest priority task** right now. Give yourself a 25-minute Pomodoro timer and pledge to work without switching tabs until the timer rings!";
    }

    return { reply };
  },

  async generateSmartNotification(task) {
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Generate a single-sentence proactive AI reminder for task: "${task.title}", estimated hours: ${task.estimatedHours || 2}, deadline: ${task.deadline}. Example style: "You need around 90 minutes to finish your assignment. Start before 5 PM to stay stress-free."`;
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
      } catch (e) {
        // ignore
      }
    }
    const hours = task.estimatedHours || 1.5;
    return `You need around ${Math.round(hours * 60)} mins to finish "${task.title}". Start before 5 PM to stay ahead of your deadline!`;
  }
};

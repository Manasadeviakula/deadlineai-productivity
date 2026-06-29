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

    return {
      summary: `AI Plan for "${title}": Deconstructed into focused action blocks for maximum momentum.`,
      totalEstimatedHours: 3.0,
      suggestedWorkingHours: "Morning (9:00 AM - 12:00 PM)",
      subtasks: [
        { id: "st_1", title: `Research and outline key requirements for ${title}`, estimatedMinutes: 45, priority: "High", order: 1 },
        { id: "st_2", title: "Core execution & drafting implementation", estimatedMinutes: 90, priority: "Critical", order: 2 },
        { id: "st_3", title: "Review, test, and polish final submission", estimatedMinutes: 45, priority: "Medium", order: 3 }
      ],
      suggestedBreaks: [
        "10-min Pomodoro break after subtask 1",
        "15-min stretch & hydration break before final review"
      ]
    };
  },

  async generateDailySchedule({ currentTime, tasks }) {
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
You are DeadlineAI's Daily Planner. Generate an optimized timeline for today starting from current time: ${currentTime}.
User's Pending Tasks: ${JSON.stringify(tasks)}

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

    const timeline = tasks.slice(0, 4).map((t, idx) => {
      const startHour = 9 + idx * 2;
      const period = startHour >= 12 ? 'PM' : 'AM';
      const formattedHour = startHour > 12 ? startHour - 12 : startHour;
      return {
        timeSlot: `${formattedHour}:00 ${period} - ${formattedHour + 1}:30 ${period}`,
        activity: `Focus Sprint: ${t.title}`,
        type: "focus",
        taskId: t.id,
        priority: t.priority || "High"
      };
    });

    timeline.splice(2, 0, {
      timeSlot: "01:00 PM - 01:45 PM",
      activity: "Lunch & Recharge Break",
      type: "break",
      taskId: null,
      priority: "Low"
    });

    return {
      productivityScoreForecast: 88,
      timeline,
      tips: [
        "Tackle high-priority deadline tasks early in your day.",
        "Take regular 5-10 minute breaks between intense sprints."
      ]
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

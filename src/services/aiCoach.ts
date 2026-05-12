import Groq from 'groq-sdk';
import { Goal, HealthMetrics, ProgressEntry, UserProfile, WearableData } from '../types';

const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY ?? '';

let _client: Groq | null = null;
function getClient(): Groq {
  if (!_client) _client = new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true });
  return _client;
}

// llama-3.3-70b-versatile: best quality on Groq for conversational use
// llama-3.1-8b-instant: use this if you want even faster responses
const MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are Aura, a warm and data-driven health coach embedded in a mobile fitness app. Your role is to give users brief, personalised, and actionable health insights based on their profile, metrics, and logged data.

Guidelines:
- Keep every response to 2–3 sentences maximum. Be direct and specific.
- Use the user's actual numbers (e.g. "your steps dropped to 6,200 — 58% of your 10,700 target").
- Tone: like a knowledgeable friend — warm but honest, never generic.
- Never be alarmist. Frame everything constructively.
- Do not repeat back the entire profile. Get straight to the insight.
- If wearable data is present, prioritise HRV and sleep quality insights.
- End with one clear action item.`;

export type InsightType =
  | 'daily_opening'
  | 'meal_feedback'
  | 'workout_feedback'
  | 'progress_feedback'
  | 'wearable_insight'
  | 'step_nudge';

interface InsightRequest {
  type: InsightType;
  profile: UserProfile;
  metrics: HealthMetrics;
  progressEntries?: ProgressEntry[];
  wearableData?: WearableData;
  extraContext?: string;
}

function buildUserMessage(req: InsightRequest): string {
  const { type, profile, metrics, progressEntries, wearableData, extraContext } = req;

  const profileSummary = `User: ${profile.age}y, ${profile.weight}kg, goal=${profile.goal}, cuisine=${profile.cuisine}, diet=${profile.dietType}, gymDays=${profile.gymDays}/week, fitnessLevel=${profile.fitnessLevel}. Targets: ${metrics.dailyCalories} kcal/day, ${metrics.protein}g protein, ${metrics.stepTarget} steps/day.`;

  const latestEntry = progressEntries?.[progressEntries.length - 1];
  const prevEntry = progressEntries?.[progressEntries.length - 2];

  switch (type) {
    case 'daily_opening': {
      const wearable = wearableData
        ? `Last night: sleep efficiency ${wearableData.sleepEfficiency ?? '?'}%, HRV ${wearableData.hrv ?? '?'} ms, resting HR ${wearableData.restingHeartRate ?? '?'} bpm.`
        : 'No wearable data available today.';
      return `${profileSummary}\n${wearable}\nGenerate a personalised morning opening insight for today.`;
    }

    case 'meal_feedback':
      return `${profileSummary}\nExtra context: ${extraContext ?? 'User just logged a meal.'}\nGive brief meal feedback — what's good and what to tweak.`;

    case 'workout_feedback': {
      const streakContext = latestEntry
        ? `This week: ${latestEntry.gymSessions} gym sessions, ${latestEntry.avgDailySteps} avg steps.`
        : '';
      return `${profileSummary}\n${streakContext}\n${extraContext ?? ''}\nGive workout feedback and one specific tip for the user's next session.`;
    }

    case 'progress_feedback': {
      if (!latestEntry) return `${profileSummary}\nUser just started tracking. Encourage them and set expectations for week 1.`;
      const weightChange = prevEntry ? latestEntry.weight - prevEntry.weight : 0;
      const totalChange = profile.targetWeight != null ? latestEntry.weight - profile.weight : null;
      return `${profileSummary}\nLatest log: ${latestEntry.weight}kg, ${latestEntry.avgDailySteps} avg steps, ${latestEntry.gymSessions} gym sessions this week.\nWeight change from last week: ${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)}kg.\n${totalChange !== null ? `Total change since start: ${totalChange > 0 ? '+' : ''}${totalChange.toFixed(1)}kg.` : ''}\nGenerate an AI feedback card for their progress log. Be specific about whether they are on track.`;
    }

    case 'wearable_insight': {
      if (!wearableData) return `${profileSummary}\nNo wearable data yet. Encourage the user to connect a device.`;
      return `${profileSummary}\nWearable data: HRV=${wearableData.hrv ?? 'N/A'}ms, sleepEfficiency=${wearableData.sleepEfficiency ?? 'N/A'}%, sleepDuration=${wearableData.sleepDuration ?? 'N/A'}h, restingHR=${wearableData.restingHeartRate ?? 'N/A'}bpm, readiness=${wearableData.readinessScore ?? 'N/A'}/100.\nGenerate a wearable health insight and adjust today's recommendation.`;
    }

    case 'step_nudge': {
      const currentSteps = extraContext ?? '0';
      return `${profileSummary}\nCurrent steps today: ${currentSteps} (goal: ${metrics.stepTarget}).\nGenerate a motivating step nudge message. Include how many steps remain and a realistic activity to close the gap.`;
    }

    default:
      return profileSummary;
  }
}

export async function generateInsight(req: InsightRequest): Promise<string> {
  if (!GROQ_API_KEY) {
    return getFallbackInsight(req.type, req.profile.goal);
  }

  try {
    const completion = await getClient().chat.completions.create({
      model: MODEL,
      max_tokens: 256,
      temperature: 0.7,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserMessage(req) },
      ],
    });

    return completion.choices[0]?.message?.content?.trim() ?? getFallbackInsight(req.type, req.profile.goal);
  } catch {
    return getFallbackInsight(req.type, req.profile.goal);
  }
}

// ---------------------------------------------------------------------------
// Fallback messages — used when no API key is set or request fails
// ---------------------------------------------------------------------------

function getFallbackInsight(type: InsightType, goal: Goal): string {
  const fallbacks: Record<InsightType, Partial<Record<Goal, string>>> = {
    daily_opening: {
      cut: "Good morning! Today's focus: hit your protein target and get those 12,000 steps in. Small consistent actions compound into big results.",
      bulk: 'Morning! Prioritise eating your full calorie target today — missing calories is the #1 reason bulks stall. Load up at breakfast.',
      maintain: "Good morning! Balance is the goal today — strength session, hit your steps, and keep meals on track. You've got this.",
    },
    meal_feedback: {
      cut: "Great meal choice for a cut. Make sure you're hitting protein at this sitting — aim for 30–40g per meal to preserve muscle.",
      bulk: 'Solid meal. On a bulk, consider adding a calorie-dense side — rice, nut butter, or whole milk — to push closer to your surplus.',
      maintain: 'Balanced meal. Swap refined carbs for whole grains when possible to keep energy levels steady through the day.',
    },
    workout_feedback: {
      cut: "Strong session. On a cut, compound lifts with 10–15 reps are your best tool to preserve muscle. Keep the rest periods short.",
      bulk: 'Great lift. Focus on progressive overload next session — even 2.5kg more on your main lifts moves the needle.',
      maintain: 'Solid workout. Mix a strength session with zone-2 cardio this week to hit your body recomposition targets.',
    },
    progress_feedback: {
      cut: "You're making progress. Keep your weekly weigh-in at the same time each morning for accurate data. Adjust calories if pace stalls for 2+ weeks.",
      bulk: 'Gaining steadily — aim for 0.1–0.4kg/week for lean muscle. If above that, trim 100–150 kcal from your surplus.',
      maintain: "Weight is stable — great sign. Focus on how you look and feel, not just the scale. Body recomposition takes months, not weeks.",
    },
    wearable_insight: {
      cut: 'Your HRV and sleep data are key recovery signals. Low HRV means recovery is lagging — consider dropping the cardio intensity today.',
      bulk: 'Poor sleep blunts muscle protein synthesis significantly. If sleep quality is low, prioritise 8+ hours over a gym session tonight.',
      maintain: "Your wearable data is in — use it to guide today's intensity. High readiness = train hard. Low readiness = go easy.",
    },
    step_nudge: {
      cut: "Steps are your secret fat-loss weapon on a cut. A 20-minute post-dinner walk will close most of the gap — put your shoes on now.",
      bulk: "Even on a bulk, your step target keeps your cardiovascular health strong. A light evening stroll is all you need.",
      maintain: "Halfway through your step goal! A 25-minute walk after dinner will get you there — podcast on, shoes on, let's go.",
    },
  };

  return fallbacks[type][goal] ?? fallbacks[type].maintain ?? 'Keep going — consistency compounds.';
}

// ---------------------------------------------------------------------------
// Rule-based progress feedback (no API call needed)
// ---------------------------------------------------------------------------

export function getRuleBasedProgressFeedback(
  entries: ProgressEntry[],
  goal: Goal,
  stepTarget: number
): string {
  if (entries.length < 2) {
    return "Welcome to your progress tracker! Log your data every week so Aura can spot trends and give you personalised feedback.";
  }

  const latest = entries[entries.length - 1];
  const prev = entries[entries.length - 2];
  const weeklyChange = latest.weight - prev.weight;
  const stepsRatio = latest.avgDailySteps / stepTarget;

  if (goal === 'cut') {
    if (entries.length >= 3) {
      const twoWeeksAgo = entries[entries.length - 3];
      const prevChange = prev.weight - twoWeeksAgo.weight;
      if (weeklyChange > -0.2 && prevChange > -0.2) {
        return "Progress has stalled for 2 weeks. Reduce calories by 100 kcal, add a 20-min post-dinner walk on rest days, and track every meal for the next 7 days.";
      }
    }
    if (stepsRatio < 0.7) {
      return `Your steps are at ${Math.round(stepsRatio * 100)}% of your ${stepTarget.toLocaleString()} goal this week. Add a 20-min post-dinner walk — it burns ~80–100 kcal and makes a real difference on a cut.`;
    }
    return `Down ${Math.abs(weeklyChange).toFixed(1)}kg this week — solid progress! Keep protein high and maintain your step target to preserve muscle.`;
  }

  if (goal === 'bulk') {
    if (weeklyChange < 0.1) {
      return "Weight isn't moving this week. Add 200–300 kcal post-workout (rice, banana, milk) and make sure you're hitting all gym sessions.";
    }
    if (weeklyChange > 0.6) {
      return `Gaining ${weeklyChange.toFixed(1)}kg/week — slightly fast for lean bulking. Reduce your surplus by 150 kcal and ensure you're hitting 4+ gym sessions to convert surplus to muscle.`;
    }
    return `Gaining ${weeklyChange.toFixed(1)}kg this week — right in the lean-bulk zone! Keep progressive overload going and hit your protein target daily.`;
  }

  const weightShift = Math.abs(weeklyChange);
  if (weightShift > 1.5) {
    return `Weight shifted ${weightShift.toFixed(1)}kg this week — more than expected for maintenance. Adjust intake by ${weeklyChange > 0 ? 'reducing' : 'increasing'} 100–150 kcal and recheck in 7 days.`;
  }
  return `Weight is stable within ±${weightShift.toFixed(1)}kg — exactly what maintenance looks like. Keep your strength sessions consistent and step target on track.`;
}

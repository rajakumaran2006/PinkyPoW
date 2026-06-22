import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/aiService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { techStack, placementScore, selectedTrackLength } = body;

    // Validation
    if (!techStack || placementScore === undefined || !selectedTrackLength) {
      return NextResponse.json(
        { error: "Missing required parameters (techStack, placementScore, selectedTrackLength)" },
        { status: 400 }
      );
    }

    const techStackStr = Array.isArray(techStack) ? techStack.join(", ") : String(techStack);

    // Formulate Prompts
    const systemPrompt = `You are an elite Senior Technical Recruiter and DSA Coach. Your job is to generate a highly customized 7-day technical placement preparation plan.
Based on the candidate's preferences, create a roadmap representing the first 7 days. Enforce high-frequency DSA patterns, system design, or engineering fundamentals matching their stack.
Calibrate the difficulty of the suggested problems based on the candidate's placementScore (scale: 0-1000).
- Score < 350: Focus on Easy problems, core fundamentals, and basic concepts.
- Score 350 - 750: Focus on Medium complexity problems, intermediate patterns (sliding window, two pointers, trees).
- Score > 750: Focus on advanced Medium and Hard problems (graphs, dynamic programming, advanced systems).

Format the output strictly as a JSON object containing a "dailyPlan" array with exactly 7 items.
Each item in the "dailyPlan" must contain:
1. "dayNumber": an integer from 1 to 7.
2. "focusArea": a concise title of what topic to study (e.g. "Arrays - Sliding Window", "System Design - Load Balancer").
3. "suggestedProblem": an object with "title" (standard name of a LeetCode or HackerRank problem) and "difficulty" ("Easy", "Medium", or "Hard").
4. "motivationText": exactly 1 to 2 sentences explaining why top companies test this specific concept and how it relates to recruiter expectations.

Do not output any introductory or concluding text. Return ONLY the JSON object.`;

    const userPrompt = `Generate a 7-day battleplan for this candidate:
- Tech Stack: ${techStackStr}
- Current Placement Score: ${placementScore} / 1000
- Planned Track Duration: ${selectedTrackLength} days`;

    const roadmapData = await generateJSON(systemPrompt, userPrompt);

    return NextResponse.json(roadmapData);
  } catch (error: any) {
    console.error("AI Roadmap Generator Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate roadmap" },
      { status: 500 }
    );
  }
}

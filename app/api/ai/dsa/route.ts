import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { DSA } from "@/models/DSA";
import { generateJSON } from "@/lib/ai-service";
import fs from "fs/promises";
import path from "path";

// Helper to get or create user to handle dev fallbacks gracefully
async function getOrCreateUser(clerkIdParam?: string | null) {
  await connectDB();
  const clerkId = clerkIdParam || "guest_clerk_id";
  let user = await User.findOne({ clerkId });
  if (!user) {
    user = await User.create({
      clerkId,
      name: "Raja Kumaran",
      email: "raja@pinkypow.dev",
      techStack: ["Full-Stack Dev"],
      placementScore: 820,
    });
  }
  return user;
}

// GET /api/ai/dsa
// Fetches the user's custom plan and details
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");
    
    await connectDB();
    const user = await getOrCreateUser(clerkId);
    
    let dsaProgress = await DSA.findOne({ userId: user._id });
    if (!dsaProgress) {
      dsaProgress = await DSA.create({
        userId: user._id,
        currentTrack: "30_Days",
        dailyHours: 2,
        completedProblems: [],
        hasCustomPlan: false,
      });
    }
    
    return NextResponse.json({
      success: true,
      placementScore: user.placementScore || 820,
      dsaProgress,
    });
  } catch (error: any) {
    console.error("GET /api/ai/dsa Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch DSA plan" },
      { status: 500 }
    );
  }
}

// POST /api/ai/dsa
// Handles plan creation, problem generation, submission validation, and resets
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, clerkId } = body;
    
    await connectDB();
    const user = await getOrCreateUser(clerkId);
    let dsaProgress = await DSA.findOne({ userId: user._id });
    
    if (!dsaProgress) {
      dsaProgress = await DSA.create({
        userId: user._id,
        currentTrack: "30_Days",
        dailyHours: 2,
        completedProblems: [],
        hasCustomPlan: false,
      });
    }

    if (action === "create-plan") {
      const { level, totalDays, problemsPerDay, topics } = body;
      
      if (!level || !totalDays || !problemsPerDay || !topics || topics.length === 0) {
        return NextResponse.json(
          { error: "Missing required parameters for creating a plan." },
          { status: 400 }
        );
      }

      // Generate a structured roadmap plan using LLM
      const systemPrompt = `You are an expert DSA Coach. Your job is to create a dynamic, personalized day-by-day DSA study roadmap.
You will be given the candidate's level, total days, problems per day, and target topics.
You must distribute the target topics across the specified number of days logically. Put core, foundational topics first, followed by more complex topics.
For each day, provide a clear, concise focus topic and a one-sentence descriptive goal.

You must return a JSON object strictly in this format:
{
  "planRoadmap": [
    {
      "day": 1,
      "topic": "Arrays - Topic Name",
      "description": "Short explanation of today's learning objectives and recursion/traversal strategies."
    },
    ... (continue for exactly ${totalDays} days)
  ]
}

Ensure there is exactly one entry for each day from Day 1 to Day ${totalDays}. Do not include markdown code block characters around JSON or introductory text. Return ONLY the JSON object.`;

      const userPrompt = `Create a ${totalDays}-day roadmap plan:
- Level: ${level}
- Problems per day: ${problemsPerDay}
- Target Focus Topics: ${topics.join(", ")}`;

      const roadmapData = await generateJSON(systemPrompt, userPrompt);
      const planRoadmap = roadmapData.planRoadmap || [];

      // Save to database
      dsaProgress.hasCustomPlan = true;
      dsaProgress.level = level;
      dsaProgress.totalDays = totalDays;
      dsaProgress.problemsPerDay = problemsPerDay;
      dsaProgress.topics = topics;
      dsaProgress.planRoadmap = planRoadmap;
      dsaProgress.currentDayIndex = 1;
      dsaProgress.dailyProblems = []; // Reset generated problems
      await dsaProgress.save();

      return NextResponse.json({
        success: true,
        message: "Personalized plan generated successfully.",
        dsaProgress,
      });

    } else if (action === "generate-problem") {
      const { dayNumber } = body;
      const targetDay = Number(dayNumber) || dsaProgress.currentDayIndex || 1;
      
      // Get the focus topic for the requested day
      const dayPlan = dsaProgress.planRoadmap?.find(p => p.day === targetDay);
      if (!dayPlan) {
        return NextResponse.json(
          { error: `Day ${targetDay} is not scheduled in the plan roadmap.` },
          { status: 400 }
        );
      }

      // Check if problems for this day are already generated
      const existingDayProblems = dsaProgress.dailyProblems?.find(dp => dp.dayNumber === targetDay);
      if (existingDayProblems && existingDayProblems.problems && existingDayProblems.problems.length > 0) {
        return NextResponse.json({
          success: true,
          problems: existingDayProblems.problems,
          dsaProgress,
        });
      }

      // Read instructions from disk, fallback to default instructions if reading fails
      let instructionsPrompt = "";
      try {
        const filepath = path.join(process.cwd(), "dsa_problem_instructions.md");
        instructionsPrompt = await fs.readFile(filepath, "utf8");
      } catch (err) {
        console.warn("Could not read prompt instructions file, using default prompt", err);
        instructionsPrompt = `You are a DSA Coach. Given the user's level (Beginner/Intermediate/Advanced), day topic, and past solved problems, generate a new custom coding problem.
Provide a unique problem that fits the topic and level. Return a JSON object with a "problems" array containing objects with: id, title, description, difficulty, category, platform (LeetCode/GeeksforGeeks/CodeChef), url, and codeTemplate.`;
      }

      const userPrompt = `Generate exactly ${dsaProgress.problemsPerDay || 2} problem(s) for Day ${targetDay}:
- Day Focus Topic: ${dayPlan.topic}
- Skill Level: ${dsaProgress.level || "Intermediate"}
- Previously Completed Problems to AVOID: ${JSON.stringify(dsaProgress.completedProblems || [])}`;

      const generatedResult = await generateJSON(instructionsPrompt, userPrompt);
      const generatedProblems = (generatedResult.problems || []).map((prob: any, idx: number) => ({
        id: prob.id || `gen-${targetDay}-${idx}-${Date.now()}`,
        title: prob.title || "Example DSA Challenge",
        description: prob.description || "Solve this challenge by meeting constraints.",
        difficulty: prob.difficulty || "Medium",
        category: prob.category || dayPlan.topic,
        platform: prob.platform || "LeetCode",
        url: prob.url || "https://leetcode.com/problemset/all/",
        codeTemplate: prob.codeTemplate || "function solve() {\n  // write code here\n}",
        completed: false,
      }));

      // Store in database
      if (!dsaProgress.dailyProblems) {
        dsaProgress.dailyProblems = [];
      }
      
      // Remove any existing entry for this day to avoid duplication
      dsaProgress.dailyProblems = dsaProgress.dailyProblems.filter(dp => dp.dayNumber !== targetDay);
      
      dsaProgress.dailyProblems.push({
        dayNumber: targetDay,
        problems: generatedProblems,
      });

      await dsaProgress.save();

      return NextResponse.json({
        success: true,
        problems: generatedProblems,
        dsaProgress,
      });

    } else if (action === "submit-solution") {
      const { problemId } = body;
      if (!problemId) {
        return NextResponse.json(
          { error: "Problem ID is required to mark it completed." },
          { status: 400 }
        );
      }

      let scoreDelta = 30; // Default Medium weight
      let matchedTitle = "";

      // Find the problem and mark it as completed
      if (dsaProgress.dailyProblems) {
        for (const dayProb of dsaProgress.dailyProblems) {
          const prob = dayProb.problems.find(p => p.id === problemId);
          if (prob) {
            prob.completed = true;
            prob.solvedAt = new Date();
            matchedTitle = prob.title;
            
            // Score weight calibrations
            if (prob.difficulty === "Easy") scoreDelta = 15;
            else if (prob.difficulty === "Hard") scoreDelta = 55;
            else scoreDelta = 30;
            break;
          }
        }
      }

      // Add to completed list
      if (matchedTitle && !dsaProgress.completedProblems.includes(matchedTitle)) {
        dsaProgress.completedProblems.push(matchedTitle);
      }

      // Save user score updates
      user.placementScore = Math.min((user.placementScore || 0) + scoreDelta, 1000);
      await user.save();

      // Check if all problems for the current day index are completed
      const currentDayProbs = dsaProgress.dailyProblems?.find(dp => dp.dayNumber === dsaProgress.currentDayIndex);
      const allCurrentDaySolved = currentDayProbs && currentDayProbs.problems.length > 0 && currentDayProbs.problems.every(p => p.completed);

      // We allow auto-advancing, but we will let the client handle when to explicitly advance or trigger it
      await dsaProgress.save();

      return NextResponse.json({
        success: true,
        message: "Solution accepted and saved successfully.",
        dsaProgress,
        placementScore: user.placementScore,
      });

    } else if (action === "advance-day") {
      const currentDay = dsaProgress.currentDayIndex || 1;
      const totalDays = dsaProgress.totalDays || 30;
      
      if (currentDay < totalDays) {
        dsaProgress.currentDayIndex = currentDay + 1;
        await dsaProgress.save();
      }

      return NextResponse.json({
        success: true,
        dsaProgress,
      });

    } else if (action === "reset-plan") {
      dsaProgress.hasCustomPlan = false;
      dsaProgress.planRoadmap = [];
      dsaProgress.dailyProblems = [];
      dsaProgress.currentDayIndex = 1;
      await dsaProgress.save();

      return NextResponse.json({
        success: true,
        message: "DSA plan has been successfully reset.",
        dsaProgress,
      });
    }

    return NextResponse.json({ error: "Invalid action parameter" }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/ai/dsa Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}

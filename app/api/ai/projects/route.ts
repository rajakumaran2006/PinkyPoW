import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Portfolio } from "@/models/Portfolio";
import { generateJSON } from "@/lib/aiService";

// Helper to get or create portfolio
async function getOrCreatePortfolio(clerkIdParam?: string | null) {
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

  let portfolio = await Portfolio.findOne({ userId: user._id });
  if (!portfolio) {
    // Seed default projects matching initial page state
    portfolio = await Portfolio.create({
      userId: user._id,
      certificates: [],
      projects: [
        {
          title: "AI-Powered Recruitment Analytics Dashboard",
          techStack: ["React", "Next.js", "Python", "FastAPI", "OpenAI API", "PostgreSQL"],
          description: "Built a placement evaluation pipeline analyzing speech transcripts & coding velocity with 92% evaluation alignment.",
          phases: [
            {
              name: "Phase 1: Architecture & API Foundation",
              tasks: [
                { id: "p1-t1", name: "Configure Next.js and FastAPI starter workspaces", completed: true },
                { id: "p1-t2", name: "Design PostgreSQL schema for users, speech history, and metrics", completed: true }
              ]
            },
            {
              name: "Phase 2: Speech Analytics & LLM Pipelines",
              tasks: [
                { id: "p2-t1", name: "Integrate OpenAI API for transcription text grading", completed: false },
                { id: "p2-t2", name: "Establish speech cadence and filler word parsing algorithms", completed: false }
              ]
            }
          ]
        },
        {
          title: "Distributed Real-time Messaging Broker",
          techStack: ["Go", "WebSockets", "Redis", "Docker", "gRPC"],
          description: "Architected a zero-loss message distribution bus handling 10k messages/second with end-to-end encryption.",
          phases: [
            {
              name: "Phase 1: Protocol design & WebSockets",
              tasks: [
                { id: "p2-1-t1", name: "Set up WebSockets channel handlers in Go", completed: true },
                { id: "p2-1-t2", name: "Build Redis pub/sub link for cross-instance communication", completed: true }
              ]
            },
            {
              name: "Phase 2: Benchmarking & Docker setups",
              tasks: [
                { id: "p2-2-t1", name: "Configure Docker swarm and network topologies for testing", completed: false },
                { id: "p2-2-t2", name: "Load test routing speed under 10k concurrent channels", completed: false }
              ]
            }
          ]
        }
      ]
    });
  }
  return { user, portfolio };
}

// GET: Retrieve all projects
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");
    const { portfolio } = await getOrCreatePortfolio(clerkId);

    return NextResponse.json({
      success: true,
      projects: portfolio.projects || []
    });
  } catch (error: any) {
    console.error("GET /api/ai/projects error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch projects" }, { status: 500 });
  }
}

// POST: Handle AI Project Planner operations
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, clerkId } = body;

    if (clerkId && typeof clerkId !== 'string') {
      return NextResponse.json({ error: 'Invalid parameter types' }, { status: 400 });
    }
    if (action && typeof action !== 'string') {
      return NextResponse.json({ error: 'Invalid parameter types' }, { status: 400 });
    }
    
    const { portfolio } = await getOrCreatePortfolio(clerkId);

    if (action === "ask-followup") {
      const { level, techStack, domain } = body;
      
      const systemPrompt = `You are a Senior Project Architect and Career Advisor.
A candidate wants to build a portfolio project. Based on their level, tech stack, and target domain, formulate ONE highly innovative, recruiter-friendly follow-up question.
This question must ask them about a specific architectural trade-off, scaling target, or advanced feature preference that will make their project stand out (e.g. 'Do you want to focus on offline-first database synchronization, or a high-throughput streaming serverless video analytics node?').
Keep it concise, exciting, and professional.

Format your output strictly as a JSON object:
{
  "followUpQuestion": "Your innovative follow-up question string here."
}`;

      const userPrompt = `Level: ${level}
Tech Stack: ${techStack}
Target Domain: ${domain}`;

      const aiResponse = await generateJSON(systemPrompt, userPrompt);
      return NextResponse.json({
        success: true,
        followUpQuestion: aiResponse.followUpQuestion
      });

    } else if (action === "create-project") {
      const { level, techStack, domain, followUpAnswer, followUpQuestion } = body;

      const systemPrompt = `You are an elite Senior Project Architect.
Based on the candidate's level, tech stack, domain, and their answer to your architectural follow-up question, design a highly innovative portfolio project.
The project must include:
1. An innovative title that sounds professional and looks great on a CV.
2. A description (2-3 sentences) specifying the core engineering challenges solved (e.g., race conditions, cold starts, vector indexing, real-time message brokering).
3. A specific technologies stack array.
4. Exactly 4 logical implementation phases, starting from initial setup and core features to advanced scaling or integration.
Each phase must contain a 'name' and an array of 2-3 'tasks' containing:
- id: A unique string id (e.g., 'task-1-1').
- name: Clear action-oriented task explanation.
- completed: Boolean (always false initially).

Format your output strictly as a JSON object:
{
  "title": "Project Title",
  "description": "Recruiter-friendly technical description...",
  "techStack": ["React", "Go", "Redis", ...],
  "phases": [
    {
      "name": "Phase 1: Foundation Setup",
      "tasks": [
        { "id": "t1-1", "name": "Set up database connection and authentication endpoints", "completed": false }
      ]
    }
  ]
}`;

      const userPrompt = `Design a project for:
- Level: ${level}
- Stack: ${techStack}
- Domain: ${domain}
- Follow-up Question Asked: "${followUpQuestion}"
- Developer Preference Answer: "${followUpAnswer}"`;

      const aiResponse = await generateJSON(systemPrompt, userPrompt);
      return NextResponse.json({
        success: true,
        project: aiResponse
      });

    } else if (action === "add-project") {
      const { project } = body;
      if (!project || !project.title) {
        return NextResponse.json({ error: "Project data is required" }, { status: 400 });
      }

      portfolio.projects.push({
        title: project.title,
        techStack: project.techStack || [],
        description: project.description || "",
        phases: project.phases || []
      });
      await portfolio.save();

      return NextResponse.json({
        success: true,
        projects: portfolio.projects
      });

    } else if (action === "toggle-task") {
      const { projectId, taskId } = body;
      if (!projectId || !taskId) {
        return NextResponse.json({ error: "projectId and taskId are required" }, { status: 400 });
      }

      // Locate the project
      const project = (portfolio.projects as any).id(projectId);
      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }

      // Locate the task in phases
      let taskUpdated = false;
      if (project.phases) {
        for (const phase of project.phases) {
          const task = phase.tasks.find((t: any) => t.id === taskId);
          if (task) {
            task.completed = !task.completed;
            taskUpdated = true;
            break;
          }
        }
      }

      if (!taskUpdated) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }

      await portfolio.save();
      return NextResponse.json({
        success: true,
        projects: portfolio.projects
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/ai/projects error:", error);
    return NextResponse.json({ error: error.message || "Failed to execute projects action" }, { status: 500 });
  }
}

// DELETE: Delete a project
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const { portfolio } = await getOrCreatePortfolio(clerkId);
    
    // Pull the project out of projects array
    portfolio.projects = portfolio.projects.filter((p: any) => p._id.toString() !== projectId);
    await portfolio.save();

    return NextResponse.json({
      success: true,
      projects: portfolio.projects
    });
  } catch (error: any) {
    console.error("DELETE /api/ai/projects error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete project" }, { status: 500 });
  }
}

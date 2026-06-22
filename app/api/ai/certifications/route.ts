import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Portfolio } from "@/models/Portfolio";
import { generateJSON } from "@/lib/aiService";

// Helper to get or create user and portfolio
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
    // Seed default credentials matching myCerts
    portfolio = await Portfolio.create({
      userId: user._id,
      projects: [],
      certificates: [
        {
          title: "AWS Certified Solutions Architect",
          issuer: "Amazon Web Services",
          isAiValidated: true,
          date: "December 2025",
          link: "https://aws.amazon.com/verification",
          category: "Cloud"
        },
        {
          title: "Responsive Web Design Certification",
          issuer: "freeCodeCamp",
          isAiValidated: true,
          date: "January 2026",
          link: "https://freecodecamp.org/certification",
          category: "Frontend"
        },
        {
          title: "Introduction to Machine Learning",
          issuer: "Stanford Online",
          isAiValidated: true,
          date: "May 2026",
          link: "https://coursera.org/verification",
          category: "AI"
        }
      ]
    });
  }
  return { user, portfolio };
}

// GET: Retrieve certifications list
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");
    const { portfolio, user } = await getOrCreatePortfolio(clerkId);

    return NextResponse.json({
      success: true,
      certificates: portfolio.certificates || [],
      placementScore: user.placementScore || 820
    });
  } catch (error: any) {
    console.error("GET /api/ai/certifications error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch certifications" }, { status: 500 });
  }
}

// POST: Handles scanning, adding, and completing certifications
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
    
    const { portfolio, user } = await getOrCreatePortfolio(clerkId);

    if (action === "scan") {
      // Prompt AI to scan/compile free certifications by looking at Twitter/Reddit/Github pack
      const systemPrompt = `You are an expert Career Coach and placement advisor. Your task is to compile a list of premium, industry-recognized certifications and courses that candidates can take for FREE.
Specifically search your knowledge base for:
- Google Career Certificates (available via Coursera Financial Aid / free audits)
- AWS Certification voucher programs, free AWS Skill Builder paths, or free Tier courses
- GitHub Student Developer Pack partners (like Frontend Masters, DataCamp free access)
- Reddit-recommended high-value free courses (e.g. from r/cscareerquestions, r/learnprogramming like Harvard CS50, freeCodeCamp courses, ActiveLoop)
- Free special programming initiatives (e.g. NVIDIA free Deep Learning Institute workshops)

Calibrate your recommendations to be highly relevant to software engineering and AI/ML.

Format your output strictly as a JSON object:
{
  "recommendations": [
    {
      "id": "string-unique-id",
      "title": "Full name of the certificate/course",
      "provider": "Issuing company/university (e.g. Google Cloud, AWS, Harvard University)",
      "platform": "Learning platform (e.g. Coursera, edX, freeCodeCamp, ActiveLoop)",
      "category": "Cloud" | "AI" | "Frontend" | "Backend",
      "duration": "Duration (e.g. 12 Weeks)",
      "valueScore": 95, // Integer 1-100 indicating resume/recruiter impact
      "skills": ["Skill1", "Skill2", "Skill3"],
      "link": "URL link to the enrollment or discount page"
    }
  ]
}`;

      const userPrompt = `Scan the web (summarize top GitHub repositories, Twitter threads, and Reddit recommendations) for the best free verified certifications. User tech stack: ${JSON.stringify(user.techStack || [])}`;
      const searchResult = await generateJSON(systemPrompt, userPrompt);
      const recommendations = searchResult.recommendations || [];

      return NextResponse.json({
        success: true,
        recommendations
      });

    } else if (action === "add-cert") {
      const { title, issuer, date, link, category, isAiValidated, cloudinaryImageUrl } = body;
      if (!title || !issuer) {
        return NextResponse.json({ error: "Title and issuer are required" }, { status: 400 });
      }

      portfolio.certificates.push({
        title,
        issuer,
        date: date || "June 2026",
        link: link || "#",
        category: category || "General",
        isAiValidated: isAiValidated || false,
        cloudinaryImageUrl: cloudinaryImageUrl || ""
      });
      await portfolio.save();

      // Award points for completing/adding a certificate
      user.placementScore = Math.min((user.placementScore || 0) + 25, 1000);
      await user.save();

      return NextResponse.json({
        success: true,
        certificates: portfolio.certificates,
        placementScore: user.placementScore
      });

    } else if (action === "complete-cert") {
      const { certId } = body;
      // Mark a certificate as verified/complete
      const cert = portfolio.certificates.find((c: any) => c._id.toString() === certId);
      if (cert) {
        cert.isAiValidated = true;
        await portfolio.save();
      }

      return NextResponse.json({
        success: true,
        certificates: portfolio.certificates
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/ai/certifications error:", error);
    return NextResponse.json({ error: error.message || "Failed to execute certifications action" }, { status: 500 });
  }
}

// DELETE: Remove a certificate
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");
    const certId = searchParams.get("certId");
    
    if (!certId) {
      return NextResponse.json({ error: "Certification ID is required" }, { status: 400 });
    }

    const { portfolio } = await getOrCreatePortfolio(clerkId);
    
    // Filter out the certificate
    portfolio.certificates = portfolio.certificates.filter((c: any) => c._id.toString() !== certId);
    await portfolio.save();

    return NextResponse.json({
      success: true,
      certificates: portfolio.certificates
    });
  } catch (error: any) {
    console.error("DELETE /api/ai/certifications error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete certification" }, { status: 500 });
  }
}

// PUT: Update an existing certification
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { clerkId, certId, title, issuer, date, link, category, cloudinaryImageUrl } = body;
    
    if (clerkId && typeof clerkId !== 'string') {
      return NextResponse.json({ error: 'Invalid parameter types' }, { status: 400 });
    }
    if (certId && typeof certId !== 'string') {
      return NextResponse.json({ error: 'Invalid parameter types' }, { status: 400 });
    }

    if (!certId) {
      return NextResponse.json({ error: "Certification ID is required" }, { status: 400 });
    }

    const { portfolio } = await getOrCreatePortfolio(clerkId);
    
    const cert = portfolio.certificates.find((c: any) => c._id.toString() === certId);
    if (!cert) {
      return NextResponse.json({ error: "Certification not found" }, { status: 404 });
    }

    if (title !== undefined) cert.title = title;
    if (issuer !== undefined) cert.issuer = issuer;
    if (date !== undefined) cert.date = date;
    if (link !== undefined) cert.link = link;
    if (category !== undefined) cert.category = category;
    if (cloudinaryImageUrl !== undefined) cert.cloudinaryImageUrl = cloudinaryImageUrl;

    await portfolio.save();

    return NextResponse.json({
      success: true,
      certificates: portfolio.certificates
    });
  } catch (error: any) {
    console.error("PUT /api/ai/certifications error:", error);
    return NextResponse.json({ error: error.message || "Failed to update certification" }, { status: 500 });
  }
}


import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { DSA } from '@/models/DSA';
import { Portfolio } from '@/models/Portfolio';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { clerkId, name, email, techStack, platformUsernames, skillLevel } = body;
    
    if (!clerkId || !email || !name) {
      return NextResponse.json(
        { error: 'Missing required fields (clerkId, email, name)' },
        { status: 400 }
      );
    }
    
    // Map skillLevel (1-10) to placementScore (out of 1000). e.g., 8/10 -> 820.
    const placementScore = skillLevel ? Math.min(Math.max(skillLevel * 82, 100), 1000) : 400;
    
    // 1. Save or update the User profile
    const user = await User.findOneAndUpdate(
      { clerkId },
      {
        name,
        email,
        techStack: techStack || [],
        platformUsernames: platformUsernames || { leetcode: '', hackerrank: '', codechef: '' },
        placementScore,
      },
      { new: true, upsert: true }
    );
    
    // 2. Initialize default DSA progress track for this user (safely avoiding duplicate setup)
    await DSA.findOneAndUpdate(
      { userId: user._id },
      { 
        $setOnInsert: {
          userId: user._id, 
          currentTrack: '30_Days', 
          dailyHours: 2, 
          completedProblems: []
        }
      },
      { upsert: true, new: true }
    );
    
    // 3. Initialize default Portfolio for this user (safely avoiding duplicate setup)
    await Portfolio.findOneAndUpdate(
      { userId: user._id },
      { 
        $setOnInsert: {
          userId: user._id, 
          projects: [], 
          certificates: []
        }
      },
      { upsert: true, new: true }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Onboarding data calibrated and saved successfully.',
      user,
    });
  } catch (error: any) {
    console.error('Onboarding API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

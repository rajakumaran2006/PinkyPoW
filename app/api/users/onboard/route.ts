import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { DSA } from '@/models/DSA';
import { Portfolio } from '@/models/Portfolio';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const body = await req.json();
    const {
      username,
      password,
      name,
      email,
      techStack,
      platformUsernames,
      skillLevel,
      college,
      collegeLocation,
      collegeCountry,
      collegeState,
      course,
      yearOfStudy,
      interests,
      fullStackStack,
      fullStackLevel,
      fullStackBuiltApps,
      gpa,
      graduationDate,
      priorHackathons,
      preferredLocationType,
      preferredRole,
      certInterests
    } = body;
    
    if (!username || !password || !email || !name) {
      return NextResponse.json(
        { error: 'Missing required fields (username, password, email, name)' },
        { status: 400 }
      );
    }

    // Check duplicate username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 400 }
      );
    }

    // Check duplicate email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email is already registered' },
        { status: 400 }
      );
    }

    const clerkId = username; // Use username as clerkId for compatibility with dashboard endpoints
    
    // Map skillLevel (1-10) to placementScore (out of 1000). e.g., 8/10 -> 820.
    const placementScore = skillLevel ? Math.min(Math.max(skillLevel * 82, 100), 1000) : 400;
    
    // 1. Save or update the User profile
    const user = await User.findOneAndUpdate(
      { username },
      {
        name,
        email,
        username,
        password,
        clerkId,
        techStack: techStack || [],
        platformUsernames: platformUsernames || { leetcode: '', hackerrank: '', codechef: '' },
        placementScore,
        college: college || "",
        collegeLocation: collegeLocation || "",
        collegeCountry: collegeCountry || "",
        collegeState: collegeState || "",
        course: course || "",
        yearOfStudy: yearOfStudy || "",
        interests: interests || [],
        fullStackStack: fullStackStack || "",
        fullStackLevel: fullStackLevel || "",
        fullStackBuiltApps: fullStackBuiltApps || "",
        gpa: gpa || "",
        graduationDate: graduationDate || "",
        priorHackathons: priorHackathons || "",
        preferredLocationType: preferredLocationType || "",
        preferredRole: preferredRole || "",
        certInterests: certInterests || []
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

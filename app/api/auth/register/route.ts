import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { DSA } from '@/models/DSA';
import { Portfolio } from '@/models/Portfolio';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { 
      name, 
      email, 
      username, 
      password, 
      techStack, 
      skillLevel, 
      platformUsernames,
      college,
      collegeLocation,
      collegeCountry,
      collegeState,
      course,
      yearOfStudy,
      interests,
      fullStackStack,
      fullStackLevel,
      fullStackBuiltApps
    } = body;
    
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof username !== 'string' ||
      typeof password !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Invalid input types. Required fields must be strings.' },
        { status: 400 }
      );
    }

    if (!username.trim() || !password.trim() || !email.trim() || !name.trim()) {
      return NextResponse.json(
        { error: 'Required fields cannot be empty.' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username: username.trim() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email: email.trim() });
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Calculate placement score out of 1000 from skillLevel (1-10)
    const scoreVal = skillLevel ? Math.min(Math.max(skillLevel * 82, 100), 1000) : 400;

    // Hash user password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new User
    const user = await User.create({
      name: name.trim(),
      email: email.trim(),
      username: username.trim(),
      password: hashedPassword,
      clerkId: username.trim(), // For frontend query compatibility
      techStack: techStack || [],
      placementScore: scoreVal,
      platformUsernames: platformUsernames || { leetcode: '', hackerrank: '', codechef: '' },
      college: college || '',
      collegeLocation: collegeLocation || '',
      collegeCountry: collegeCountry || '',
      collegeState: collegeState || '',
      course: course || '',
      yearOfStudy: yearOfStudy || '',
      interests: interests || [],
      fullStackStack: fullStackStack || '',
      fullStackLevel: fullStackLevel || '',
      fullStackBuiltApps: fullStackBuiltApps || '',
      isProfileCalibrated: true,
      profileCalibrationScore: scoreVal
    });

    // Initialize default DSA tracking
    await DSA.create({
      userId: user._id,
      currentTrack: '30_Days',
      dailyHours: 2,
      completedProblems: []
    });

    // Initialize default Portfolio tracking
    await Portfolio.create({
      userId: user._id,
      projects: [],
      certificates: []
    });

    return NextResponse.json({
      success: true,
      message: 'User registered and profile calibrated successfully.',
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        clerkId: user.clerkId,
        placementScore: user.placementScore,
        techStack: user.techStack,
        platformUsernames: user.platformUsernames,
        college: user.college,
        collegeLocation: user.collegeLocation,
        collegeCountry: user.collegeCountry,
        collegeState: user.collegeState,
        course: user.course,
        yearOfStudy: user.yearOfStudy,
        interests: user.interests,
        fullStackStack: user.fullStackStack,
        fullStackLevel: user.fullStackLevel,
        fullStackBuiltApps: user.fullStackBuiltApps
      }
    });
  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { DSA } from '@/models/DSA';
import { Portfolio } from '@/models/Portfolio';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { username, password } = body;
    
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // 1. Handle hardcoded Najla1208 and Angela.1208 user logic
    if (
      (username === 'Najla1208' && password === 'Najla1208') ||
      (username === 'Angela.1208' && password === 'Angela.1208')
    ) {
      const targetUsername = username;
      const targetName = username === 'Najla1208' ? 'Najla' : 'Angela';
      const targetEmail = username === 'Najla1208' ? 'najla1208@pinkypow.com' : 'angela1208@pinkypow.com';
      
      let user = await User.findOne({ username: targetUsername });
      
      if (!user) {
        // Auto-seed this default account
        user = await User.create({
          name: targetName,
          email: targetEmail,
          username: targetUsername,
          password: targetUsername,
          clerkId: targetUsername, // for compatibility with old dashboard query fields
          techStack: ['fullstack', 'systems'],
          placementScore: 820,
          platformUsernames: {
            leetcode: targetUsername.toLowerCase().replace('.', ''),
            codechef: targetUsername.toLowerCase().replace('.', ''),
            hackerrank: targetUsername.toLowerCase().replace('.', '')
          }
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
      }

      return NextResponse.json({
        success: true,
        message: 'Successfully authenticated as default user',
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
          collegeCountry: user.collegeCountry || '',
          collegeState: user.collegeState || '',
          course: user.course,
          yearOfStudy: user.yearOfStudy,
          interests: user.interests,
          fullStackStack: user.fullStackStack,
          fullStackLevel: user.fullStackLevel,
          fullStackBuiltApps: user.fullStackBuiltApps,
          gpa: user.gpa || '',
          graduationDate: user.graduationDate || '',
          priorHackathons: user.priorHackathons || '',
          preferredLocationType: user.preferredLocationType || '',
          preferredRole: user.preferredRole || '',
          certInterests: user.certInterests || []
        }
      });
    }

    // 2. Custom User Login flow
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    // Compare passwords (plain text check as requested by user)
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully authenticated',
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
        collegeCountry: user.collegeCountry || '',
        collegeState: user.collegeState || '',
        course: user.course,
        yearOfStudy: user.yearOfStudy,
        interests: user.interests,
        fullStackStack: user.fullStackStack,
        fullStackLevel: user.fullStackLevel,
        fullStackBuiltApps: user.fullStackBuiltApps,
        gpa: user.gpa || '',
        graduationDate: user.graduationDate || '',
        priorHackathons: user.priorHackathons || '',
        preferredLocationType: user.preferredLocationType || '',
        preferredRole: user.preferredRole || '',
        certInterests: user.certInterests || []
      }
    });
  } catch (error: any) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

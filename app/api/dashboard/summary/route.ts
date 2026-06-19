import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { Internship } from '@/models/Internship';
import { DSA } from '@/models/DSA';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get('clerkId');

    // Safe fallback / mock data if no clerkId is provided
    if (!clerkId) {
      return NextResponse.json({
        success: true,
        isMock: true,
        placementScore: 820,
        activeInternshipsCount: 3,
        completedDsaCount: 15,
        todayDsaCount: 2,
      });
    }

    try {
      await connectDB();
    } catch (dbError) {
      console.warn('Database connection failed, serving fallback mock data.', dbError);
      return NextResponse.json({
        success: true,
        isMock: true,
        placementScore: 820,
        activeInternshipsCount: 3,
        completedDsaCount: 15,
        todayDsaCount: 2,
      });
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json(
        { error: `User with Clerk ID ${clerkId} not found.` },
        { status: 404 }
      );
    }

    const userId = user._id;

    // 1. Fetch Active Internships count
    // Status in ['Applied', 'Interviewing', 'Offer']
    const activeInternshipsCount = await Internship.countDocuments({
      userId,
      status: { $in: ['Applied', 'Interviewing', 'Offer'] }
    });

    // 2. Fetch DSA completed problems
    const dsaProgress = await DSA.findOne({ userId });
    const completedDsaCount = dsaProgress ? dsaProgress.completedProblems.length : 0;
    
    // Simulate "today's DSA problem count" based on the total completed problems
    const todayDsaCount = dsaProgress && dsaProgress.completedProblems.length > 0 
      ? Math.min(dsaProgress.completedProblems.length, 2) 
      : 0;

    return NextResponse.json({
      success: true,
      placementScore: user.placementScore || 0,
      activeInternshipsCount,
      completedDsaCount,
      todayDsaCount,
    });
  } catch (error: any) {
    console.error('Summary API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

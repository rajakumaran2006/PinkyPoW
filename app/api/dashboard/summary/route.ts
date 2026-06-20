import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { Internship } from '@/models/Internship';
import { DSA } from '@/models/DSA';
import { Hackathon } from '@/models/Hackathon';
import { Portfolio } from '@/models/Portfolio';

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
        dailyStreak: 5,
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
        dailyStreak: 5,
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

    // 3. Dynamic Placement Score Calculation
    let score = 400; // Base baseline score

    // Profile Calibration Contribution
    if (user.isProfileCalibrated) {
      score += (user.profileCalibrationScore || 0) * 1.5; // up to 150 points
    }

    // GPA Contribution
    if (user.gpa) {
      const gpaNum = parseFloat(user.gpa);
      if (!isNaN(gpaNum)) {
        if (gpaNum <= 10 && gpaNum > 4) {
          score += gpaNum * 15; // e.g. 9 GPA -> 135 points
        } else if (gpaNum <= 4) {
          score += gpaNum * 37.5; // e.g. 4 GPA -> 150 points
        }
      }
    }

    // Certifications Contribution
    const portfolio = await Portfolio.findOne({ userId });
    if (portfolio && portfolio.certificates) {
      score += portfolio.certificates.length * 25; // 25 points per certificate
    }

    // Hackathons Contribution
    const hackathons = await Hackathon.find({ userId });
    hackathons.forEach(hack => {
      if (hack.status === 'Won') {
        score += 100;
      } else if (hack.status === 'Shortlisted') {
        score += 60;
      } else if (hack.status === 'Participated') {
        score += 35;
      } else if (hack.status === 'Applied') {
        score += 15;
      }
    });

    // Internships Contribution
    const internships = await Internship.find({ userId });
    internships.forEach(intern => {
      if (intern.status === 'Decided' || intern.status === 'Offer') {
        score += 120; // completed or got offer
      } else if (intern.status === 'Interviewing') {
        score += 50;
      } else if (intern.status === 'Applied') {
        score += 20;
      }
    });

    // DSA Solved & Streak Contribution
    score += completedDsaCount * 5;
    const streak = user.dailyStreak !== undefined ? user.dailyStreak : 5;
    score += streak * 10;

    // Cap placement score between 100 and 1000
    const finalScore = Math.min(Math.max(Math.round(score), 100), 1000);

    // Save back to DB if different
    if (user.placementScore !== finalScore) {
      user.placementScore = finalScore;
      await user.save();
    }

    return NextResponse.json({
      success: true,
      placementScore: finalScore,
      dailyStreak: streak,
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

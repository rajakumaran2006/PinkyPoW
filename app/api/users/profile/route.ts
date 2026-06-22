import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { Internship } from '@/models/Internship';
import { DSA } from '@/models/DSA';
import { Hackathon } from '@/models/Hackathon';
import { Portfolio } from '@/models/Portfolio';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username') || searchParams.get('clerkId');

    if (!username) {
      return NextResponse.json({ success: false, error: 'Username or Clerk ID required' }, { status: 400 });
    }

    // Query user by username or clerkId
    const user = await User.findOne({ $or: [{ username }, { clerkId: username }] });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const userId = user._id;

    // Fetch related models in real-time
    const internships = await Internship.find({ userId });
    const hackathons = await Hackathon.find({ userId });
    const dsaProgress = await DSA.findOne({ userId });
    const portfolio = await Portfolio.findOne({ userId });

    const completedDsaCount = dsaProgress ? dsaProgress.completedProblems.length : 0;
    const streak = user.dailyStreak !== undefined ? user.dailyStreak : 5;

    // Recalculate score dynamically in real-time to save to DB
    let score = 400; // Base score
    if (user.isProfileCalibrated) {
      score += (user.profileCalibrationScore || 0) * 1.5;
    }
    if (user.gpa) {
      const gpaNum = parseFloat(user.gpa);
      if (!isNaN(gpaNum)) {
        if (gpaNum <= 10 && gpaNum > 4) {
          score += gpaNum * 15;
        } else if (gpaNum <= 4) {
          score += gpaNum * 37.5;
        }
      }
    }
    if (portfolio && portfolio.certificates) {
      score += portfolio.certificates.length * 25;
    }
    hackathons.forEach(hack => {
      if (hack.status === 'Won') score += 100;
      else if (hack.status === 'Shortlisted') score += 60;
      else if (hack.status === 'Participated') score += 35;
      else if (hack.status === 'Applied') score += 15;
    });
    internships.forEach(intern => {
      if (intern.status === 'Decided' || intern.status === 'Offer') score += 120;
      else if (intern.status === 'Interviewing') score += 50;
      else if (intern.status === 'Applied') score += 20;
    });
    score += completedDsaCount * 5;
    score += streak * 10;

    const finalScore = Math.min(Math.max(Math.round(score), 100), 1000);

    if (user.placementScore !== finalScore) {
      user.placementScore = finalScore;
      await user.save();
    }

    return NextResponse.json({
      success: true,
      user,
      internships,
      hackathons,
      dsaProgress,
      portfolio,
      placementScore: finalScore
    });
  } catch (error: any) {
    console.error('Error fetching full profile:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { Hackathon } from '@/models/Hackathon';

// Fetch all hackathons for a user (queries by username or clerkId)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username') || searchParams.get('clerkId');

    if (!username) {
      return NextResponse.json(
        { error: 'Username or Clerk ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the user to get their MongoDB _id
    const user = await User.findOne({ 
      $or: [{ username }, { clerkId: username }] 
    });

    if (!user) {
      return NextResponse.json(
        { error: `User with username/clerkId ${username} not found.` },
        { status: 404 }
      );
    }

    const userId = user._id;

    // Find user's hackathons
    let userHackathons = await Hackathon.find({ userId }).sort({ createdAt: -1 });

    // Seed default hackathons if user has none (first load experience)
    if (userHackathons.length === 0) {
      const defaultHackathons = [
        {
          userId,
          title: "CalHacks 13.0",
          hosts: "UC Berkeley",
          date: "June 25 - 27, 2026",
          location: "San Francisco, CA",
          isOnline: false,
          prizePool: "$100,000",
          category: "Generative AI & Web3",
          description: "The world's largest collegiate hackathon returns to SF. Build groundbreaking applications with top-tier API sponsors and compute resources.",
          skills: ["React", "Python", "Next.js", "Solidity"],
          status: "Participated",
          applyLink: "https://www.calhacks.io"
        },
        {
          userId,
          title: "Vercel Global AI Challenge",
          hosts: "Vercel × OpenAI",
          date: "July 2 - 5, 2026",
          location: "Online",
          isOnline: true,
          prizePool: "$50,000",
          category: "Artificial Intelligence",
          description: "Build Next.js AI applications that push the boundaries of product design, real-time audio, and developer productivity.",
          skills: ["Next.js", "OpenAI API", "Tailwind CSS", "TypeScript"],
          status: "Applied",
          applyLink: "https://vercel.com/blog/global-ai-challenge"
        },
        {
          userId,
          title: "Stripe API Buildathon",
          hosts: "Stripe Developer Relations",
          date: "July 20 - 22, 2026",
          location: "Online",
          isOnline: true,
          prizePool: "$20,000",
          category: "Fintech & Payments",
          description: "Reimagine the checkout experience, usage-based billing structures, or developer marketplaces using the latest Stripe SDK updates.",
          skills: ["React", "Node.js", "Stripe API", "PostgreSQL"],
          status: "Saved",
          applyLink: "https://stripe.com"
        }
      ];

      await Hackathon.insertMany(defaultHackathons);
      userHackathons = await Hackathon.find({ userId }).sort({ createdAt: -1 });
    }

    return NextResponse.json({
      success: true,
      hackathons: userHackathons
    });
  } catch (error: any) {
    console.error('GET /api/hackathons error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Create a new hackathon
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { 
      username, 
      clerkId,
      title, 
      hosts,
      date,
      location,
      isOnline,
      prizePool,
      category,
      description,
      skills,
      status,
      applyLink,
      shortlistedRounds
    } = body;

    const userIdentifier = username || clerkId;

    if (!userIdentifier || !title) {
      return NextResponse.json(
        { error: 'User identifier and title are required' },
        { status: 400 }
      );
    }

    // Find the user to resolve their ID
    const user = await User.findOne({ 
      $or: [{ username: userIdentifier }, { clerkId: userIdentifier }] 
    });

    if (!user) {
      return NextResponse.json(
        { error: `User ${userIdentifier} not found.` },
        { status: 404 }
      );
    }

    const newHackathon = await Hackathon.create({
      userId: user._id,
      title,
      hosts: hosts || '',
      date: date || '',
      location: location || '',
      isOnline: isOnline === undefined ? false : isOnline,
      prizePool: prizePool || '',
      category: category || '',
      description: description || '',
      skills: skills || [],
      status: status || 'Saved',
      applyLink: applyLink || '',
      shortlistedRounds: shortlistedRounds || 0
    });

    return NextResponse.json({
      success: true,
      hackathon: newHackathon
    });
  } catch (error: any) {
    console.error('POST /api/hackathons error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Update a hackathon status or details
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, ...updateFields } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Hackathon ID is required' },
        { status: 400 }
      );
    }

    const updatedHackathon = await Hackathon.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedHackathon) {
      return NextResponse.json(
        { error: `Hackathon with ID ${id} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      hackathon: updatedHackathon
    });
  } catch (error: any) {
    console.error('PUT /api/hackathons error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Delete a hackathon
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Hackathon ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const deletedHackathon = await Hackathon.findByIdAndDelete(id);

    if (!deletedHackathon) {
      return NextResponse.json(
        { error: `Hackathon with ID ${id} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Hackathon deleted successfully'
    });
  } catch (error: any) {
    console.error('DELETE /api/hackathons error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

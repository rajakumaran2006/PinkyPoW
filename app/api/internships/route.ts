import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { Internship } from '@/models/Internship';
import mongoose from 'mongoose';

// Fetch all internships for a user (queries by username or clerkId)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username') || searchParams.get('clerkId');
    const typeFilter = searchParams.get('type') || 'internship';

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

    // Find user's internships filtered by type
    let userInternships = await Internship.find({ userId, type: typeFilter as 'internship' | 'fulltime' }).sort({ createdAt: -1 });

    // Seed default cards only for internships on first load
    if (userInternships.length === 0 && typeFilter === 'internship') {
      const defaultCards = [
        {
          userId,
          company: 'Notion',
          role: 'Software Engineer Intern',
          location: 'San Francisco, CA (Office)',
          matchPercentage: 87,
          status: 'Saved',
          applyLink: 'https://notion.so',
          type: 'internship',
          startDate: '',
          endDate: '',
          description: ''
        },
        {
          userId,
          company: 'Airbnb',
          role: 'Frontend Intern',
          location: 'San Francisco, CA (Hybrid)',
          matchPercentage: 92,
          status: 'Applied',
          applyLink: 'https://airbnb.com',
          type: 'internship',
          startDate: '',
          endDate: '',
          description: ''
        },
        {
          userId,
          company: 'Coinbase',
          role: 'Backend Intern (Crypto)',
          location: 'Remote (US)',
          matchPercentage: 85,
          status: 'Interviewing',
          applyLink: 'https://coinbase.com',
          type: 'internship',
          startDate: '',
          endDate: '',
          description: ''
        },
        {
          userId,
          company: 'Netflix',
          role: 'UI Engineer Intern',
          location: 'Los Gatos, CA',
          matchPercentage: 78,
          status: 'Offer',
          applyLink: 'https://netflix.com',
          type: 'internship',
          startDate: '',
          endDate: '',
          description: ''
        }
      ];

      await Internship.insertMany(defaultCards);
      userInternships = await Internship.find({ userId, type: typeFilter }).sort({ createdAt: -1 });
    } else if (userInternships.length === 0 && typeFilter === 'fulltime') {
      const defaultCards = [
        {
          userId,
          company: 'Stripe',
          role: 'Software Engineer (New Grad)',
          location: 'San Francisco, CA (Hybrid)',
          matchPercentage: 94,
          status: 'Saved',
          applyLink: 'https://stripe.com/jobs',
          type: 'fulltime',
          startDate: '',
          endDate: '',
          description: ''
        },
        {
          userId,
          company: 'Google',
          role: 'Associate Software Engineer',
          location: 'Mountain View, CA (Office)',
          matchPercentage: 90,
          status: 'Applied',
          applyLink: 'https://careers.google.com',
          type: 'fulltime',
          startDate: '',
          endDate: '',
          description: ''
        },
        {
          userId,
          company: 'Vercel',
          role: 'Frontend Engineer (Next.js)',
          location: 'Remote (US)',
          matchPercentage: 89,
          status: 'Interviewing',
          applyLink: 'https://vercel.com/careers',
          type: 'fulltime',
          startDate: '',
          endDate: '',
          description: ''
        }
      ];

      await Internship.insertMany(defaultCards);
      userInternships = await Internship.find({ userId, type: typeFilter }).sort({ createdAt: -1 });
    }

    return NextResponse.json({
      success: true,
      internships: userInternships
    });
  } catch (error: any) {
    console.error('GET /api/internships error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Create a new internship
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { 
      username, 
      clerkId,
      company, 
      role, 
      status, 
      location, 
      applyLink, 
      matchPercentage, 
      startDate, 
      endDate, 
      description,
      type
    } = body;

    const userIdentifier = username || clerkId;

    if (!userIdentifier || !company || !role) {
      return NextResponse.json(
        { error: 'User identifier, company, and role are required' },
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

    const newInternship = await Internship.create({
      userId: user._id,
      company,
      role,
      status: status || 'Saved',
      location: location || '',
      applyLink: applyLink || '',
      matchPercentage: matchPercentage || 0,
      startDate: startDate || '',
      endDate: endDate || '',
      description: description || '',
      type: type || 'internship'
    });

    return NextResponse.json({
      success: true,
      internship: newInternship
    });
  } catch (error: any) {
    console.error('POST /api/internships error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Update an internship status or details
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, ...updateFields } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Internship ID is required' },
        { status: 400 }
      );
    }

    const updatedInternship = await Internship.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedInternship) {
      return NextResponse.json(
        { error: `Internship with ID ${id} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      internship: updatedInternship
    });
  } catch (error: any) {
    console.error('PUT /api/internships error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Delete an internship
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Internship ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const deletedInternship = await Internship.findByIdAndDelete(id);

    if (!deletedInternship) {
      return NextResponse.json(
        { error: `Internship with ID ${id} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Internship deleted successfully'
    });
  } catch (error: any) {
    console.error('DELETE /api/internships error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

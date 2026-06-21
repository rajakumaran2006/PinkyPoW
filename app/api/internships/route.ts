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

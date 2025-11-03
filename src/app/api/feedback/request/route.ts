import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import FeedbackRequest from '@/models/FeedbackRequest.model';
import User from '@/models/User.model';
import { sendFeedbackRequestEmail } from '@/lib/email';
import { generateToken } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { clientEmail, clientName, hrUserId } = await request.json();

    // 🧩 Validate input
    if (!clientEmail || !clientName || !hrUserId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 🧩 Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(hrUserId)) {
      return NextResponse.json(
        { error: 'Invalid HR user ID' },
        { status: 400 }
      );
    }

    // ✅ Validate HR user
    const hrUser = await User.findById(hrUserId);
    if (!hrUser || hrUser.role !== 'hr') {
      return NextResponse.json(
        { error: 'Unauthorized - HR access required' },
        { status: 403 }
      );
    }

    // ✅ Create feedback request
    const token = generateToken();
    const feedbackRequest = new FeedbackRequest({
      hrUserId,
      clientEmail,
      clientName,
      token,
    });

    await feedbackRequest.save();

    // ✅ Send email to client
    const feedbackLink = `${process.env.NEXTAUTH_URL}/feedback/${token}`;
    const emailResult = await sendFeedbackRequestEmail(
      clientEmail,
      clientName,
      feedbackLink
    );

    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error);
    }

    return NextResponse.json({
      success: true,
      data: feedbackRequest,
      message: 'Feedback request sent successfully',
    });
  } catch (error) {
    console.error('Error creating feedback request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

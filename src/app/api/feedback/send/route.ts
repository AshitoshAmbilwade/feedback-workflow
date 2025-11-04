import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FeedbackRequest from '@/models/FeedbackRequest.model';
import { randomUUID } from 'crypto';

export async function POST(req: Request) {
  try {
    await connectDB();

    const { hrUserId, hrEmail, hrName, clientEmail, clientName } = await req.json();

    // 🧩 Validate fields
    if (!hrUserId || !hrEmail || !hrName || !clientEmail || !clientName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    // 🔑 Generate unique feedback token
    const token = randomUUID();

    // 💾 Create feedback request record
    const feedbackRequest = await FeedbackRequest.create({
      hrUserId,
      hrEmail,
      hrName,
      clientEmail,
      clientName,
      token,
      status: 'pending',
    });

    const feedbackLink = `${process.env.NEXTAUTH_URL}/feedback/${token}`;

    console.log('✅ Feedback Request Created:', feedbackRequest);

    return NextResponse.json({
      success: true,
      message: 'Feedback request created successfully.',
      token,
      feedbackLink,
      feedbackRequest,
    });
  } catch (error) {
    console.error('❌ Error in /feedback/send:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create feedback request.' },
      { status: 500 }
    );
  }
}

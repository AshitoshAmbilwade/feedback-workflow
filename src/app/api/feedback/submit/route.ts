import { NextResponse } from 'next/server';
import connectDB  from '@/lib/mongodb';
import FeedbackRequest from '@/models/FeedbackRequest.model';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { token, feedback, rating } = await req.json();

    const feedbackRequest = await FeedbackRequest.findOne({ token });
    if (!feedbackRequest) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 404 });
    }

    feedbackRequest.status = 'submitted';
    feedbackRequest.submittedAt = new Date();
    await feedbackRequest.save();

    return NextResponse.json({
      success: true,
      clientEmail: feedbackRequest.clientEmail,
      clientName: feedbackRequest.clientName,
      hrEmail: feedbackRequest.hrEmail,
      hrName: feedbackRequest.hrName,
    });
  } catch (error) {
    console.error('❌ Error in /feedback/submit:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

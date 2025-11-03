import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FeedbackRequest from '@/models/FeedbackRequest.model';
import User from '@/models/User.model';
import { sendHRNotificationEmail, sendThankYouEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { token, feedback, rating } = await request.json();

    // Find feedback request
    const feedbackRequest = await FeedbackRequest.findOne({ token })
      .populate('hrUserId');

    if (!feedbackRequest) {
      return NextResponse.json(
        { error: 'Invalid feedback request' },
        { status: 404 }
      );
    }

    if (feedbackRequest.status === 'submitted') {
      return NextResponse.json(
        { error: 'Feedback already submitted' },
        { status: 400 }
      );
    }

    // Update feedback request
    feedbackRequest.status = 'submitted';
    feedbackRequest.submittedAt = new Date();
    feedbackRequest.feedback = feedback;
    feedbackRequest.rating = rating;
    
    await feedbackRequest.save();

    // Send notifications
    const hrUser = await User.findById(feedbackRequest.hrUserId);
    
    if (hrUser) {
      await sendHRNotificationEmail(hrUser.email, feedbackRequest.clientName);
    }
    
    await sendThankYouEmail(feedbackRequest.clientEmail, feedbackRequest.clientName);

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
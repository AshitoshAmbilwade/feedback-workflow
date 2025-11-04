import { NextResponse } from 'next/server';
import connectDB  from '@/lib/mongodb';
import FeedbackRequest from '@/models/FeedbackRequest.model';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ valid: false, error: 'Token missing' }, { status: 400 });
    }

    const feedbackReq = await FeedbackRequest.findOne({ token });

    if (!feedbackReq) {
      return NextResponse.json({ valid: false, error: 'Invalid token' }, { status: 404 });
    }

    return NextResponse.json({
      valid: true,
      clientEmail: feedbackReq.clientEmail,
      clientName: feedbackReq.clientName,
      hrEmail: 'hr@example.com', // you can store HR email in the same doc later
      hrName: 'HR User',
    });
  } catch (error) {
    console.error('❌ Error in /feedback/verify:', error);
    return NextResponse.json({ valid: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

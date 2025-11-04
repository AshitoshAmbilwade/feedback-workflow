'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';

export default function FeedbackForm() {
  const params = useParams();
  const token = params.token as string;

  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [clientEmail, setClientEmail] = useState('');
  const [clientName, setClientName] = useState('');
  const [hrEmail, setHrEmail] = useState('');
  const [hrName, setHrName] = useState('');

  // ✅ Step 1: Verify token & fetch info (client + HR)
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/feedback/verify?token=${token}`);
        const data = await response.json();

        if (!data.valid) {
          toast.error('This feedback link is invalid or has expired.');
          return;
        }

        // Assuming your /api/feedback/verify returns client + hr info
        setClientEmail(data.clientEmail);
        setClientName(data.clientName);
        setHrEmail(data.hrEmail);
        setHrName(data.hrName);
      } catch (error) {
        toast.error('Failed to verify feedback link');
      }
    };

    verifyToken();
  }, [token]);

  // ✅ Step 2: Handle submission

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await fetch('/api/feedback/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, feedback, rating }),
    });

    const data = await response.json();

    if (data.success) {
      // ✅ Send thank-you email to client
      try {
        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID1!,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_THANK_YOU!,
          {
            to_email: data.clientEmail,
            to_name: data.clientName,
            hr_name: data.hrName,
            rating,
            feedback,
          },
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY1!
        );
      } catch (err) {
        console.error('❌ Failed to send thank-you email:', err);
      }

      // ✅ Send notification email to HR
      try {
        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID1!,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_HR_NOTIFICATION!,
          {
            to_email: data.hrEmail,
            hr_name: data.hrName,
            client_name: data.clientName,
            client_email: data.clientEmail,
            feedback,
            rating,
          },
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY1!
        );
      } catch (err) {
        console.error('❌ Failed to send HR notification email:', err);
      }

      setIsSubmitted(true);
      toast.success('Thank you for your feedback!');
    } else {
      toast.error(data.error || 'Failed to submit feedback');
    }
  } catch (error) {
    toast.error('Failed to submit feedback');
  } finally {
    setIsLoading(false);
  }
};


  // ✅ Step 5: Thank-you screen
  if (isSubmitted) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h2>
            <p className="text-muted-foreground">
              Your feedback has been submitted successfully. We appreciate your time!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✅ Step 6: Feedback form UI
  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Provide Your Feedback</CardTitle>
          <CardDescription>We value your opinion. Please share your thoughts below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 rounded transition-colors ${
                        rating >= star
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {star} ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Your Feedback</Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                  placeholder="Please share your thoughts..."
                  rows={6}
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

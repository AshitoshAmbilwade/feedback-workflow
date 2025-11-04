'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import emailjs from '@emailjs/browser';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function HRDashboard() {
  const router = useRouter();

  const [clientEmail, setClientEmail] = useState('');
  const [clientName, setClientName] = useState('');
  const [hrUserId, setHrUserId] = useState<string | null>(null);
  const [hrName, setHrName] = useState<string>('');
  const [hrEmail, setHrEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  // ✅ Load HR info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      console.log('🧠 Loaded HR User:', userData);

      if (userData.role !== 'hr') {
        toast.error('Unauthorized access');
        router.push('/login');
        return;
      }

      setHrUserId(userData.id);
      setHrName(userData.name || 'HR User');
      setHrEmail(userData.email || '');
      setIsUserLoaded(true);
    } catch (err) {
      console.error('Error parsing user data:', err);
      localStorage.clear();
      router.push('/login');
    }
  }, [router]);

  // 📨 Send Feedback Request
  const handleSendFeedbackRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hrUserId || !hrEmail || !hrName) {
      toast.error('User info missing. Please log in again.');
      return;
    }

    if (!clientEmail || !clientName) {
      toast.error('Please fill all fields.');
      return;
    }

    setIsLoading(true);

    try {
      // 1️⃣ Create Feedback Request in DB
      const response = await fetch('/api/feedback/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hrUserId,
          hrEmail,
          hrName,
          clientEmail,
          clientName,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.error || 'Failed to create feedback request.');
        setIsLoading(false);
        return;
      }

      const { feedbackLink, token } = data;

      // 2️⃣ Send Feedback Email
      try {
        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_FEEDBACK_REQUEST!,
          {
            to_email: clientEmail,
            to_name: clientName,
            hr_name: hrName,
            feedback_link: feedbackLink,
          },
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
        );

        toast.success('Feedback request email sent successfully!');
      } catch (emailError) {
        console.error('📧 EmailJS Error:', emailError);
        toast.error('Failed to send feedback email.');
      }

      // 3️⃣ Save locally
      const tracking = JSON.parse(localStorage.getItem('feedbackTracking') || '[]');
      tracking.push({
        id: token,
        clientName,
        clientEmail,
        hrEmail,
        hrName,
        status: 'pending',
        link: feedbackLink,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('feedbackTracking', JSON.stringify(tracking));

      setClientEmail('');
      setClientName('');
    } catch (error) {
      console.error('❌ Error sending feedback request:', error);
      toast.error('Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  if (!isUserLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Welcome, {hrName}</h1>
          {hrEmail && <p className="text-sm text-gray-500">{hrEmail}</p>}
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Feedback Form */}
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Send Feedback Request</CardTitle>
          <CardDescription>Send a feedback form link to a client</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendFeedbackRequest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                placeholder="Enter client name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                required
                placeholder="Enter client email"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Sending...' : 'Send Feedback Request'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Verify login and role
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      const id =
        userData?.id ||
        userData?._id ||
        userData?.user?.id ||
        userData?.user?._id;
      const role = userData?.role || userData?.user?.role;

      if (!id || role !== 'hr') {
        toast.error('Unauthorized access');
        router.push('/login');
        return;
      }

      setHrUserId(id);
      setHrName(userData?.name || userData?.user?.name || 'HR User');
    } catch {
      localStorage.clear();
      router.push('/login');
    }
  }, [router]);

  // 📨 Send Feedback Request
  const handleSendFeedbackRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hrUserId) {
      toast.error('User not authenticated. Please log in again.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/feedback/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientEmail, clientName, hrUserId }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Feedback request sent successfully!');
        setClientEmail('');
        setClientName('');
      } else {
        toast.error(data.error || 'Failed to send feedback request');
      }
    } catch (error) {
      console.error('Error sending feedback request:', error);
      toast.error('Something went wrong while sending feedback request');
    } finally {
      setIsLoading(false);
    }
  };

  // 🚪 Logout Functionality
  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <div className="min-h-screen  p-6">
      {/* Top bar with HR name and Logout */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Welcome, {hrName}</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Feedback Form Card */}
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Send Feedback Request</CardTitle>
          <CardDescription>
            Send a feedback form link to a client
          </CardDescription>
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

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) return; // no token, stay here

      try {
        const res = await fetch('/api/auth/verify', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          // token valid, redirect
          router.push('/dashboard/hr');
        } else {
          // invalid token (user deleted / expired)
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-lg shadow-lg border border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight mb-2">
            Feedback Workflow System
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            Streamline your feedback process with secure and automated workflows.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground">
            Please log in or register to access your dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/login">Login</Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

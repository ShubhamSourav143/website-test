'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace('/login');
      } else {
        setUser(user);
      }
      setLoading(false);
    });
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome, {user?.user_metadata?.name || user?.email}!</h1>
        <div className="mb-4">
          <img
            src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.email}`}
            alt="Avatar"
            className="w-24 h-24 mx-auto rounded-full border-4 border-orange-200 bg-orange-50"
          />
        </div>
        <div className="text-gray-600 mb-6">
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Signed up:</strong> {user?.created_at?.slice(0, 10)}</p>
        </div>
        <a
          href="/"
          className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
}

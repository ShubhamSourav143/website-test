'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ posts: number; attempts: number; fosters: number }>({ posts: 0, attempts: 0, fosters: 0 });

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

  useEffect(() => {
    async function loadStats() {
      if (!user?.id) return;
      const [{ count: posts }, { count: attempts }] = await Promise.all([
        supabase.from('posts').select('*', { count: 'exact', head: true }).eq('author_id', user.id),
        supabase.from('quiz_attempts').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
      ]);
      setStats({ posts: posts || 0, attempts: attempts || 0, fosters: 0 });
    }
    loadStats();
  }, [user?.id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">Welcome, {user?.user_metadata?.name || user?.email}!</h1>
        <div className="mb-4">
          <img
            src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.email}`}
            alt="Avatar"
            className="w-24 h-24 mx-auto rounded-full border-4 border-orange-200 bg-orange-50"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 border rounded-xl text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.posts}</div>
            <div className="text-sm text-gray-600">Posts</div>
          </div>
          <div className="p-4 border rounded-xl text-center">
            <div className="text-2xl font-bold text-green-600">{stats.attempts}</div>
            <div className="text-sm text-gray-600">Quiz Attempts</div>
          </div>
          <div className="p-4 border rounded-xl text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.fosters}</div>
            <div className="text-sm text-gray-600">Fosters</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <a href="/articles/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Write Post</a>
          <a href="/quiz" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Take a Quiz</a>
          <a href="/foster" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Foster</a>
        </div>
      </div>
    </div>
  );
}

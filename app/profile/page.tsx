'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data.user;
      if (!user) {
        router.replace('/login');
        return;
      }
      setEmail(user.email ?? '');
      // Try fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      setFullName((profile?.full_name as string) || user.user_metadata?.name || '');
      setLoading(false);
    });
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, full_name: fullName }, { onConflict: 'id' });
    if (error) setMessage(error.message);
    else setMessage('Saved');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Profile / Settings</h1>
        <label className="text-sm text-gray-600">Email</label>
        <input value={email} disabled className="w-full rounded-xl border px-4 py-3 bg-gray-100" />
        <label className="text-sm text-gray-600">Full name</label>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-xl border px-4 py-3" />
        <button type="submit" className="w-full rounded-xl bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700 transition">Save</button>
        {message && <p className="text-sm text-green-700">{message}</p>}
      </form>
    </div>
  );
}



'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.signOut().finally(() => {
      router.replace('/');
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Signing you out…</p>
    </div>
  );
}



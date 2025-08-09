'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function MembershipPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleApplyCode = async () => {
    if (!code.startsWith('R')) {
      setError('Invalid code. Use format R###');
      return;
    }

    const amount = Number(code.slice(1));
    if (isNaN(amount) || amount < 199) {
      setError('Code must be like R199 or higher.');
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError('Not authenticated');
      return;
    }

    const { error: payError } = await supabase
      .from('membership_payments')
      .insert({ user_id: user.id, amount, code, status: 'success' });
    if (payError) {
      setError(payError.message);
      return;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ is_member: true })
      .eq('id', user.id);
    if (profileError) {
      setError(profileError.message);
      return;
    }

    router.push('/membership/confirm');
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="w-full max-w-md text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Membership Payment</h1>
          <p className="text-gray-600">Enter payment code to activate membership</p>
        </div>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. R500"
          className="w-full border rounded-lg px-4 py-2"
        />
        <button
          onClick={handleApplyCode}
          className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold"
        >
          Confirm Membership
        </button>
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </main>
  );
}
 'use client';

 import { useState } from 'react';
 import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

 export default function MembershipPage() {
   const supabase = createClientComponentClient();
   const [code, setCode] = useState('');
   const [errorMessage, setErrorMessage] = useState<string | null>(null);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const useFakePayments = process.env.NEXT_PUBLIC_USE_FAKE_PAYMENTS === 'true';

   async function handleApplyCode() {
     setErrorMessage(null);

     if (!useFakePayments) {
       setErrorMessage('Payments are disabled in this environment.');
       return;
     }

     if (!code.startsWith('R')) {
       setErrorMessage('Invalid code. Use format R###');
       return;
     }
     const amount = Number(code.slice(1));
     if (isNaN(amount) || amount < 199) {
       setErrorMessage('Code must be like R199 or higher.');
       return;
     }

     const { data: userRes } = await supabase.auth.getUser();
     const user = userRes?.user;
     if (!user) {
       setErrorMessage('Please login to continue.');
       return;
     }

     setIsSubmitting(true);
     const { error: insertError } = await supabase
       .from('membership_payments')
       .insert({ user_id: user.id, amount, code, status: 'success' });

     if (insertError) {
       setIsSubmitting(false);
       setErrorMessage(insertError.message);
       return;
     }

     const { error: updateError } = await supabase
       .from('profiles')
       .upsert({ id: user.id, is_member: true }, { onConflict: 'id' });

     setIsSubmitting(false);

     if (updateError) {
       setErrorMessage(updateError.message);
       return;
     }

     window.location.href = '/membership/confirm';
   }

   return (
     <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
       <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md space-y-4">
         <h1 className="text-2xl font-bold text-center">Membership Payment</h1>
         <p className="text-gray-600 text-sm text-center">
           Enter payment code to activate membership (e.g., R500). Minimum R199.
         </p>
         <input
           value={code}
           onChange={(e) => setCode(e.target.value)}
           placeholder="e.g. R500"
           className="w-full rounded-xl border px-4 py-3"
         />
         <button
           onClick={handleApplyCode}
           disabled={isSubmitting}
           className="w-full rounded-xl bg-green-600 text-white py-3 font-semibold hover:bg-green-700 transition"
         >
           {isSubmitting ? 'Processing...' : 'Confirm Membership'}
         </button>
         {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
       </div>
     </div>
   );
 }

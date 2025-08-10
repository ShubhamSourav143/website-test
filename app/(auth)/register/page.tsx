 'use client';

 import { useState } from 'react';
 import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

 export default function RegisterPage() {
   const supabase = createClientComponentClient();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [errorMessage, setErrorMessage] = useState<string | null>(null);
   const [isSubmitting, setIsSubmitting] = useState(false);

   async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
     e.preventDefault();
     setErrorMessage(null);
     setIsSubmitting(true);
     const { error } = await supabase.auth.signUp({ email, password });
     setIsSubmitting(false);
     if (error) {
       setErrorMessage(error.message);
       return;
     }
     window.location.href = '/membership';
   }

   return (
     <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
       <form
         onSubmit={handleSignUp}
         className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md space-y-4"
       >
         <h1 className="text-2xl font-bold text-center">Create Account</h1>
         <input
           type="email"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
           placeholder="Email"
           required
           className="w-full rounded-xl border px-4 py-3"
         />
         <input
           type="password"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           placeholder="Password"
           required
           className="w-full rounded-xl border px-4 py-3"
         />
         <button
           type="submit"
           disabled={isSubmitting}
           className="w-full rounded-xl bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700 transition"
         >
           {isSubmitting ? 'Signing up...' : 'Sign Up'}
         </button>
         {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
       </form>
     </div>
   );
 }


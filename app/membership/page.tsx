// app/membership/page.tsx

import JoinForm from '../../components/membership/JoinForm';

export default function MembershipPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Become a Member</h1>
        <JoinForm />
      </div>
    </main>
  );
}

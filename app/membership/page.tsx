'use client';

import JoinForm from '../../components/membership/JoinForm';

export default function MembershipPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Our Mission</h1>
          <p className="text-gray-600">Become a member of our animal welfare community</p>
        </div>
        <JoinForm />
      </div>
    </main>
  );
}
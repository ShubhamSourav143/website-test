export default function MembershipConfirmPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-2">Membership Activated 🎉</h1>
        <p className="text-gray-600">
          Thank you for becoming a member of IIT KGP Animal Welfare.
        </p>
        <a
          href="/dashboard"
          className="inline-block mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}


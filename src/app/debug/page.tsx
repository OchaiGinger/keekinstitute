export default function DebugPage() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const clerkDomain = process.env.CLERK_JWT_ISSUER_DOMAIN;

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Debug Environment Variables</h1>
      
      <div className="bg-gray-100 p-4 rounded">
        <p><strong>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:</strong></p>
        <code className="break-all">{publishableKey || "NOT SET"}</code>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <p><strong>CLERK_JWT_ISSUER_DOMAIN:</strong></p>
        <code className="break-all">{clerkDomain || "NOT SET"}</code>
      </div>

      <div className="bg-blue-100 p-4 rounded">
        <p><strong>Check browser console for Clerk errors</strong></p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function VerifyIdPage() {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const verifyWithId = useMutation(api.user.verifyWithId);

  const [verificationId, setVerificationId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!verificationId.trim()) {
        setError("Please enter your verification ID");
        setLoading(false);
        return;
      }

      if (!user?.id) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      await verifyWithId({
        clerkId: user.id,
        verificationId: verificationId.trim(),
      });

      // Verification successful
      toast({
        title: "Success!",
        description: "Your account has been verified. Redirecting to dashboard...",
      });

      // Redirect to dashboard after a short delay to show the toast
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.message || "Invalid verification ID. Please check and try again.";
      setError(errorMessage);
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Content */}
      <div className="w-full max-w-md relative z-10">
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Verify Your Account</CardTitle>
            <p className="text-sm text-gray-600">
              Enter the verification ID you received in your email from the admin
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="verification-id">Verification ID</Label>
                <Input
                  id="verification-id"
                  placeholder="e.g., 26/01/keek12"
                  value={verificationId}
                  onChange={(e) => setVerificationId(e.target.value)}
                  disabled={loading}
                  className="text-center tracking-wider font-mono"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? "Verifying..." : "Verify ID"}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                If you haven't received your verification ID, please contact the admin.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

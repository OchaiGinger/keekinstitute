import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SignUpPage() {
    const { userId } = await auth();

    // Protect this page - only non-authenticated users can access
    if (userId) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
                        Welcome to Creed Academy
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Discover your perfect tech career path with our AI-powered assessment
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {/* Sign In Card */}
                    <Card className="border-2 hover:border-primary hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                            <CardTitle className="text-2xl">Welcome Back</CardTitle>
                            <CardDescription className="text-base">
                                Have an account? Sign in to access your dashboard and continue your learning journey.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SignInButton mode="modal">
                                <button className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                                    Sign In
                                </button>
                            </SignInButton>
                        </CardContent>
                    </Card>

                    {/* Sign Up Card */}
                    <Card className="border-2 border-primary/20 hover:border-primary hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                            <CardTitle className="text-2xl">New Here?</CardTitle>
                            <CardDescription className="text-base">
                                Create an account to get started. You'll be guided through a quick onboarding to find your perfect tech path.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SignUpButton mode="modal" forceRedirectUrl="/onboarding">
                                <button className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                                    Create Account
                                </button>
                            </SignUpButton>
                        </CardContent>
                    </Card>
                </div>

                {/* Benefits Section */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
                    <div>
                        <div className="text-4xl font-bold text-primary mb-2">5 min</div>
                        <p className="text-muted-foreground">Quick Assessment</p>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-primary mb-2">100%</div>
                        <p className="text-muted-foreground">Free & Personalized</p>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-primary mb-2">5</div>
                        <p className="text-muted-foreground">Career Paths</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

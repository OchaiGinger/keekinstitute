import Link from "next/link";
import { Button } from "@/components/ui/button";
import { handleGetStarted } from "@/actions/handle-get-started";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const Navbar = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <div className="bg-blue-600 text-white p-2 rounded-lg">
                            <span className="font-bold text-base">CA</span>
                        </div>
                        <span className="font-bold text-lg hidden sm:inline">Keek institute</span>
                    </Link>

                    {/* Navigation Links - Centered */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/courses" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                            Courses
                        </Link>
                    </nav>

                    {/* Right Side - Auth Actions */}
                    <div className="flex items-center gap-4">
                        <SignedIn>
                            <form action={handleGetStarted}>
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                    Dashboard
                                </Button>
                            </form>
                            <UserButton 
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "h-10 w-10",
                                    },
                                }}
                            />
                        </SignedIn>
                        <SignedOut>
                            <form action={handleGetStarted}>
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                    Get Started
                                </Button>
                            </form>
                        </SignedOut>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

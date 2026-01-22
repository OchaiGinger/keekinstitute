"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";

export default function DashboardNavbar() {
    const { user } = useUser();

    return (
        <div className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-10">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Image
                    src="/logo.svg"
                    alt="Creed Academy"
                    width={32}
                    height={32}
                />
                <span className="font-semibold text-lg hidden sm:inline">Creed Academy</span>
            </Link>

            <div className="flex items-center gap-4">
                {user && (
                    <div className="text-sm text-muted-foreground">
                        {user.fullName || user.emailAddresses[0]?.emailAddress}
                    </div>
                )}
                <UserButton />
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Loader } from "lucide-react";

export default function DashboardPage() {
    const router = useRouter();
    const { user, isLoaded } = useUser();
    const [userId, setUserId] = useState<string | null>(null);
    const [redirected, setRedirected] = useState(false);

    const userRecord = useQuery(
        api.user.getByAuthId,
        userId ? { authUserId: userId } : "skip"
    );

    useEffect(() => {
        if (!isLoaded || !user) return;
        setUserId(user.id);
    }, [isLoaded, user]);

    useEffect(() => {
        if (!userRecord || redirected) return;

        // Redirect based on role - only once
        setRedirected(true);
        switch (userRecord.role) {
            case "admin":
                router.replace("/admin");
                break;
            case "instructor":
                router.replace("/instructor");
                break;
            case "student":
            default:
                router.replace("/student");
                break;
        }
    }, [userRecord, router, redirected]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading your dashboard...</p>
            </div>
        </div>
    );
}

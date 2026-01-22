"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StudentPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to analysis page
        router.push("/student/analysis");
    }, [router]);

    return null;
}
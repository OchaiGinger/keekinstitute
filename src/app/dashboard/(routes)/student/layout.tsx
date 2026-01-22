"use client";

import DynamicSidebar from "../_components/dynamic-sidebar";
import DashboardNavbar from "@/components/dashboard-navbar";

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen flex-col">
            <DashboardNavbar />
            <div className="flex flex-1 overflow-hidden">
                <DynamicSidebar role="student" />
                <div className="flex-1 overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}

"use client";

import { BarChart3, BookOpen } from "lucide-react";
import DashboardSidebar, { SidebarRoute } from "@/components/dashboard-sidebar";

const STUDENT_ROUTES: SidebarRoute[] = [
    {
        label: "Assessment Analysis",
        icon: BarChart3,
        href: "/student/analysis",
    },
    {
        label: "Courses",
        icon: BookOpen,
        href: "/student/courses",
    },
];

export default function RoleBasedSidebar() {
    return <DashboardSidebar routes={STUDENT_ROUTES} title="Student" />;
}

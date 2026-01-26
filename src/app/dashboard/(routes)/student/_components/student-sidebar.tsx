"use client";

import { BarChart3, BookOpen, FileText } from "lucide-react";
import DashboardSidebar, { SidebarRoute } from "@/components/dashboard-sidebar";

const STUDENT_ROUTES: SidebarRoute[] = [
    {
        label: "Assessment",
        icon: FileText,
        href: "/dashboard/student/assessment",
    },
    {
        label: "Assessment Analysis",
        icon: BarChart3,
        href: "/dashboard/student/analysis",
    },
    {
        label: "Courses",
        icon: BookOpen,
        href: "/dashboard/student/courses",
    },
];

export default function RoleBasedSidebar() {
    return <DashboardSidebar routes={STUDENT_ROUTES} title="Student" />;
}

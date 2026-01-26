"use client";

import { BarChart3, BookOpen, Users, Settings } from "lucide-react";
import DashboardSidebar, { SidebarRoute } from "@/components/dashboard-sidebar";

type UserRole = "admin" | "instructor" | "student";

interface DynamicSidebarProps {
    role: UserRole;
}

const ROLE_ROUTES: Record<UserRole, SidebarRoute[]> = {
    student: [
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
    ],
    instructor: [
        {
            label: "Courses",
            icon: BookOpen,
            href: "/dashboard/instructor",
        },
        {
            label: "Students",
            icon: Users,
            href: "/dashboard/instructor/students",
        },
        {
            label: "Analytics",
            icon: BarChart3,
            href: "/dashboard/instructor/analytics",
        },
        {
            label: "Profile",
            icon: Settings,
            href: "/dashboard/instructor/profile",
        },
    ],
    admin: [
        {
            label: "Users",
            icon: Users,
            href: "/admin",
        },
        {
            label: "Analytics",
            icon: BarChart3,
            href: "/dashboard/admin/analytics",
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/dahsboard/admin/settings",
        },
    ],
};

const ROLE_TITLES: Record<UserRole, string> = {
    student: "Student",
    instructor: "Instructor",
    admin: "Admin",
};

export default function DynamicSidebar({ role }: DynamicSidebarProps) {
    const routes = ROLE_ROUTES[role];
    const title = ROLE_TITLES[role];

    return <DashboardSidebar routes={routes} title={title} />;
}

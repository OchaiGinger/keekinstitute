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
            href: "/student/analysis",
        },
        {
            label: "Courses",
            icon: BookOpen,
            href: "/student/courses",
        },
    ],
    instructor: [
        {
            label: "Courses",
            icon: BookOpen,
            href: "/instructor",
        },
        {
            label: "Students",
            icon: Users,
            href: "/instructor/students",
        },
        {
            label: "Analytics",
            icon: BarChart3,
            href: "/instructor/analytics",
        },
        {
            label: "Profile",
            icon: Settings,
            href: "/instructor/profile",
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
            href: "/admin/analytics",
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/admin/settings",
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

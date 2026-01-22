"use client"

import { BarChart3, BookOpen, Users, Settings } from "lucide-react"
import DashboardSidebar, { SidebarRoute } from "@/components/dashboard-sidebar"

const INSTRUCTOR_ROUTES: SidebarRoute[] = [
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
]

export default function InstructorSidebar() {
    return <DashboardSidebar routes={INSTRUCTOR_ROUTES} title="Instructor" />
}

"use client"

import { Users, Settings, BarChart3 } from "lucide-react"
import DashboardSidebar, { SidebarRoute } from "@/components/dashboard-sidebar"

const ADMIN_ROUTES: SidebarRoute[] = [
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
]

export default function AdminSidebar() {
    return <DashboardSidebar routes={ADMIN_ROUTES} title="Admin" />
}

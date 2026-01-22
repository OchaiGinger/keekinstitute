"use client";

import { Layout, Compass, List, BarChart, Users, Settings, Plus } from "lucide-react";
import SidebarItem from "./sidebar-item";
import { usePathname } from "next/navigation";

const STUDENT_ROUTES = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/dashboard/student",
    },
    {
        icon: Compass,
        label: "Browse Courses",
        href: "/courses",
    }
]

const INSTRUCTOR_ROUTES = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/dashboard/instructor",
    },
    {
        icon: Plus,
        label: "Create Course",
        href: "/dashboard/instructor/create",
    },
    {
        icon: List,
        label: "My Courses",
        href: "/dashboard/instructor/courses",
    },
    {
        icon: Users,
        label: "Students",
        href: "/dashboard/instructor/users",
    },
    {
        icon: BarChart,
        label: "Analytics",
        href: "/dashboard/instructor/analyticss",
    },
]

const ADMIN_ROUTES = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/dashboard/admin",
    },
    {
        icon: Users,
        label: "Manage Instructors",
        href: "/dashboard/admin",
    },
    {
        icon: BarChart,
        label: "Analytics",
        href: "/dashboard/admin",
    },
    {
        icon: Settings,
        label: "Settings",
        href: "/dashboard/admin",
    }
]

interface SidebarRoutesProps {
    userRole?: "admin" | "instructor" | "student";
}

export const SidebarRoutes = ({ userRole = "student" }: SidebarRoutesProps) => {
    const pathname = usePathname();

    let routes;

    switch (userRole) {
        case "admin":
            routes = ADMIN_ROUTES;
            break;
        case "instructor":
            routes = INSTRUCTOR_ROUTES;
            break;
        case "student":
        default:
            routes = STUDENT_ROUTES;
            break;
    }

    return (
        <div className="flex flex-col w-full">
            {routes.map((route, index) => (
                <SidebarItem
                    key={index}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    )
}
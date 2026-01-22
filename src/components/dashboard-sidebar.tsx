"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface SidebarRoute {
    label: string;
    icon: LucideIcon;
    href: string;
}

interface DashboardSidebarProps {
    routes: SidebarRoute[];
    title: string;
    logo?: boolean;
}

export default function DashboardSidebar({ routes, title, logo = true }: DashboardSidebarProps) {
    const pathname = usePathname();

    return (
        <div className="w-64 border-r bg-slate-50 h-screen sticky top-0 flex flex-col">
            {/* Logo and Title */}
            <div className="p-6 border-b">
                {logo && (
                    <div className="flex items-center gap-2 mb-4">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={32}
                            height={32}
                        />
                    </div>
                )}
                <h2 className="text-lg font-semibold capitalize">{title}</h2>
            </div>

            {/* Navigation Routes */}
            <nav className="flex-1 space-y-2 px-3 py-4 overflow-y-auto">
                {routes.map((route) => {
                    const Icon = route.icon;
                    const isActive = pathname === route.href || pathname.startsWith(route.href + "/");

                    return (
                        <Link key={route.href} href={route.href}>
                            <div
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer",
                                    isActive
                                        ? "bg-blue-100 text-blue-700"
                                        : "text-slate-600 hover:bg-slate-100"
                                )}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                <span className="text-sm font-medium">{route.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

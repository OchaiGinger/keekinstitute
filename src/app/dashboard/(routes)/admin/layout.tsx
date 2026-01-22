"use client"

import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { redirect } from "next/navigation"
import { Loader } from "lucide-react"

import DynamicSidebar from "../_components/dynamic-sidebar"
import DashboardNavbar from "@/components/dashboard-navbar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoaded } = useUser()
    const profile = useQuery(
        api.user.getSafeProfile,
        isLoaded && user?.id ? { authUserId: user.id } : "skip"
    )

    if (!isLoaded) return null

    if (!user) {
        redirect("/sign-in")
    }

    // If profile is loading (undefined), show loading state instead of redirecting
    if (profile === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    // If profile exists and role is not admin, redirect
    if (profile && profile.role !== "admin") {
        redirect("/")
    }

    return (
        <div className="flex h-screen flex-col">
            <DashboardNavbar />
            <div className="flex flex-1 overflow-hidden">
                <DynamicSidebar role="admin" />
                <main className="flex-1 overflow-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import getSafeProfile from "@/actions/get-safe-profile"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { userId } = await auth()
    
    if (!userId) {
        redirect("/sign-in")
    }

    const profile = await getSafeProfile()

    if (!profile) {
        redirect("/")
    }

    // If profile exists and role is not admin, redirect
    if (profile.role !== "admin") {
        redirect("/")
    }

    // Admin layout just renders children - navbar and sidebar come from parent dashboard layout
    return <>{children}</>
}

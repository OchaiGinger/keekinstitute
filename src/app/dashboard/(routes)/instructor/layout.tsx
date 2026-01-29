import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import getSafeProfile from "@/actions/get-safe-profile"

export default async function InstructorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    try {
        const { userId } = await auth()
        
        if (!userId) {
            redirect("/sign-in")
        }

        const profile = await getSafeProfile()

        if (!profile) {
            redirect("/")
        }

        // Allow instructor and admin roles to access instructor pages
        // Only block students from accessing instructor pages
        if (profile.role === "student") {
            redirect("/dashboard/student")
        }
    } catch (error) {
        console.error("[InstructorLayout] Error:", error)
        redirect("/")
    }

    // Just render children
    return <>{children}</>
}

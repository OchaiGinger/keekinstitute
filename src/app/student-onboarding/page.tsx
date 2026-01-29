import StudentOnboardingForm from "@/app/dashboard/(routes)/student/onboarding/_components/student-onboarding-form"

export default async function StudentOnboardingPage() {
    // Onboarding layout already protected this route and checked auth
    // Just render the form in a centered, beautiful layout
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
            </div>

            {/* Content */}
            <div className="w-full max-w-md relative z-10">
                <StudentOnboardingForm />
            </div>
        </div>
    )
}

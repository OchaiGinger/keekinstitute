import InstructorOnboardingForm from "./_components/instructor-onboarding-form"

export const dynamic = "force-dynamic"

export default async function InstructorOnboardingPage() {
    // Dashboard layout already protected this route and checked auth
    // Just render the form
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4">
            <InstructorOnboardingForm />
        </div>
    )
}

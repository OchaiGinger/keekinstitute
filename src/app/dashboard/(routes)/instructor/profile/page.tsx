"use client"

import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "../../../../../../convex/_generated/api"
import { useState } from "react"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
    const { user } = useUser()
    const [isEditing, setIsEditing] = useState(false)

    const profile = useQuery(
        api.user.getSafeProfile,
        user?.id ? { clerkId: user.id } : "skip"
    )

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your instructor profile and public information
                </p>
            </div>

            {/* Basic Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                        Your personal and professional details
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b">
                        <div>
                            <p className="font-medium">{profile?.firstName} {profile?.lastName}</p>
                            <p className="text-sm text-muted-foreground">{profile?.email}</p>
                            <Badge className="mt-2">{profile?.role}</Badge>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? "Cancel" : "Edit"}
                        </Button>
                    </div>

                    {isEditing ? (
                        <div className="space-y-4">
                            <div>
                                <Label>Full Name</Label>
                                <Input value={`${profile?.firstName || ""} ${profile?.lastName || ""}`} disabled className="mt-1" />
                            </div>

                            <div>
                                <Label>Email</Label>
                                <Input value={profile?.email} disabled className="mt-1" />
                            </div>

                            <div className="flex gap-2">
                                <Button>Save Changes</Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-muted-foreground">Email Verified</p>
                                <p>✓ {profile?.email}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Account Status</p>
                                <p>
                                    {profile?.onboardingCompleted
                                        ? "✓ Onboarding Complete"
                                        : "⏳ Pending Onboarding"}
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Public Profile */}
            <Card>
                <CardHeader>
                    <CardTitle>Public Profile</CardTitle>
                    <CardDescription>
                        How you appear to students
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Bio</Label>
                        <Textarea
                            disabled
                            placeholder="Tell students about yourself..."
                            className="mt-1"
                            rows={4}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Specialization</Label>
                            <Input disabled className="mt-1" placeholder="—" />
                        </div>
                        <div>
                            <Label>Years of Experience</Label>
                            <Input disabled className="mt-1" placeholder="—" />
                        </div>
                    </div>

                    <div>
                        <Label>Qualifications</Label>
                        <Textarea
                            disabled
                            placeholder="Degrees, certifications, achievements..."
                            className="mt-1"
                            rows={3}
                        />
                    </div>

                    <Button>Edit Public Profile</Button>
                </CardContent>
            </Card>

            {/* Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>
                        Manage your notification and teaching preferences
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                        <p>✓ Email notifications for new enrollments</p>
                        <p>✓ Email notifications for student messages</p>
                        <p>✓ Weekly performance reports</p>
                    </div>
                    <Button variant="outline">Manage Preferences</Button>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200 bg-red-50">
                <CardHeader>
                    <CardTitle className="text-red-700">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive">Deactivate Account</Button>
                </CardContent>
            </Card>
        </div>
    )
}

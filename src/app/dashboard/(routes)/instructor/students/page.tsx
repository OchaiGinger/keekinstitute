"use client"

import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "../../../../../../convex/_generated/api"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function StudentPage() {
    const { user } = useUser()

    // Get all students enrolled in instructor's courses
    // For now, showing placeholder until enrollment tracking is fully implemented
    const allUsers = useQuery(api.user.getByRole, { role: "student" })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Students</h1>
                <p className="text-muted-foreground mt-2">
                    View and manage students enrolled in your courses
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Enrolled Students</CardTitle>
                </CardHeader>
                <CardContent>
                    {allUsers && allUsers.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Progress</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allUsers.map((student) => (
                                    <TableRow key={student._id}>
                                        <TableCell className="font-medium">
                                            {student.name}
                                        </TableCell>
                                        <TableCell>{student.email}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    student.onboardingCompleted
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {student.onboardingCompleted
                                                    ? "Active"
                                                    : "Pending"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>—</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            No students enrolled yet
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

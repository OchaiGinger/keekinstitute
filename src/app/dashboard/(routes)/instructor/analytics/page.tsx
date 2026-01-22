"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"

const courseData = [
    { month: "Jan", students: 40, enrolled: 24 },
    { month: "Feb", students: 35, enrolled: 13 },
    { month: "Mar", students: 20, enrolled: 98 },
    { month: "Apr", students: 27, enrolled: 39 },
    { month: "May", students: 20, enrolled: 48 },
    { month: "Jun", students: 36, enrolled: 38 },
]

const coursePerformance = [
    { course: "Web Dev 101", students: 124, avgScore: 82 },
    { course: "React Basics", students: 98, avgScore: 76 },
    { course: "Advanced JS", students: 65, avgScore: 88 },
    { course: "Node.js", students: 42, avgScore: 79 },
]

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground mt-2">
                    Track your course performance and student engagement
                </p>
            </div>

            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,248</div>
                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">329</div>
                        <p className="text-xs text-muted-foreground">+8% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">78%</div>
                        <p className="text-xs text-muted-foreground">Across all courses</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4.8</div>
                        <p className="text-xs text-muted-foreground">From 145 reviews</p>
                    </CardContent>
                </Card>
            </div>

            {/* Enrollment Trend */}
            <Card>
                <CardHeader>
                    <CardTitle>Enrollment Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={courseData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="students"
                                stroke="#3b82f6"
                                name="Views"
                            />
                            <Line
                                type="monotone"
                                dataKey="enrolled"
                                stroke="#10b981"
                                name="Enrollments"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Course Performance */}
            <Card>
                <CardHeader>
                    <CardTitle>Course Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={coursePerformance}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="course" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="students"
                                fill="#3b82f6"
                                name="Enrollments"
                            />
                            <Bar
                                dataKey="avgScore"
                                fill="#10b981"
                                name="Avg Score"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}

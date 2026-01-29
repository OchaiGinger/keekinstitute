"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users } from "lucide-react";

type UserRole = "admin" | "instructor" | "student";

export default function AdminDashboard() {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<UserRole>("instructor");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const admins = useQuery(api.user.getByRole, { role: "admin" });
    const instructors = useQuery(api.user.getByRole, { role: "instructor" });
    const students = useQuery(api.user.getByRole, { role: "student" });

    const createUser = useMutation(api.user.create);

    const handleAddUser = async () => {
        try {
            setError(null);
            setIsLoading(true);

            // Validate inputs
            if (!email) {
                setError("Email is required");
                return;
            }

            if (!email.includes("@")) {
                setError("Please enter a valid email");
                return;
            }

            // Create a temporary auth ID for manual user creation
            // The user will get their actual authUserId when they log in via Clerk
            const tempAuthId = `pending_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Call the mutation to create the user with just email and role
            // Name will be filled in during their onboarding
            await createUser({
                clerkId: tempAuthId,
                email: email,
                role: role,
            });

            // Reset form
            setEmail("");
            setRole("instructor");
            setIsDialogOpen(false);
        } catch (err) {
            console.error("Error adding user:", err);
            setError("Failed to add user. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const getRoleColor = (role: UserRole) => {
        switch (role) {
            case "admin":
                return "bg-red-100 text-red-800";
            case "instructor":
                return "bg-blue-100 text-blue-800";
            case "student":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const UsersList = ({ title, users, role }: { title: string; users: any[]; role: UserRole }) => (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {users?.length > 0 ? (
                        users.map((user) => (
                            <div
                                key={user._id}
                                className="flex items-center justify-between p-3 border rounded-lg"
                            >
                                <div>
                                    <p className="font-medium">{user.name || "Unknown"}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                                <Badge className={getRoleColor(role)}>
                                    {role}
                                </Badge>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-center py-4">
                            No {role}s yet
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    Manage instructors, students, and system settings
                </p>
            </div>

            {/* Add Instructor/User Button */}
            <div className="mb-8">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Instructor
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                                    {error}
                                </div>
                            )}
                            <div>
                                <label className="text-sm font-medium">Email</label>
                                <Input
                                    type="email"
                                    placeholder="user@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Role</label>
                                <Select value={role} onValueChange={(value: any) => setRole(value)} disabled={isLoading}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="instructor">Instructor</SelectItem>
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                className="w-full"
                                onClick={handleAddUser}
                                disabled={isLoading}
                            >
                                {isLoading ? "Adding..." : "Add User"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Instructors
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{instructors?.length || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Students
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{students?.length || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            System Admins
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{admins?.length || 0}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Users Lists */}
            <div className="grid grid-cols-1 gap-6">
                <UsersList title="Instructors" users={instructors || []} role="instructor" />
                <UsersList title="Students" users={students || []} role="student" />
                <UsersList title="Admins" users={admins || []} role="admin" />
            </div>
        </div>
    );
}

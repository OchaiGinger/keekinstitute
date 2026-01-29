"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Copy, Mail, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { sendVerificationEmail } from "@/actions/send-verification-email";
import { deleteUserFromClerk } from "@/actions/delete-user-from-clerk";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminStudentManagement() {
  const { toast } = useToast();
  const students = useQuery(api.user.getAllStudents);
  const generateId = useMutation(api.user.generateVerificationId);
  const deleteUserMutation = useMutation(api.user.deleteUser);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [emailSending, setEmailSending] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ _id: string; clerkId?: string; email: string; name: string } | null>(null);

  const handleGenerateAndSendId = async (studentId: string, studentEmail: string, studentName: string) => {
    setLoading(studentId);
    try {
      const result = await generateId({ userId: studentId as any });
      const verificationId = result.verificationId;

      setEmailSending(studentId);
      await sendVerificationEmail({
        studentEmail,
        studentName: studentName || "Student",
        verificationId,
      });

      toast({
        title: "Success",
        description: `ID generated and email sent to ${studentEmail}`,
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "Error generating ID or sending email",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
      setEmailSending(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setDeletingUserId(userToDelete._id);
    try {
      // Delete from Convex
      await deleteUserMutation({ userId: userToDelete._id as any });

      // Delete from Clerk if clerkId exists and is not a temporary one
      if (userToDelete.clerkId && !userToDelete.clerkId.startsWith("pending_")) {
        try {
          await deleteUserFromClerk(userToDelete.clerkId);
        } catch (clerkError) {
          console.error("Error deleting from Clerk:", clerkError);
          // Continue even if Clerk deletion fails
        }
      }

      toast({
        title: "Success",
        description: `User ${userToDelete.email} has been deleted`,
      });

      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openDeleteDialog = (student: any) => {
    setUserToDelete({
      _id: student._id,
      clerkId: student.clerkId,
      email: student.email,
      name: `${student.firstName || ""} ${student.lastName || ""}`.trim() || "Unnamed",
    });
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Student Management</CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Generate verification IDs and send emails to students. They'll use this ID to verify their account.
          </p>
        </CardHeader>
        <CardContent>
          {students === undefined ? (
            <div className="text-center py-8">Loading students...</div>
          ) : students.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No students registered yet.</AlertDescription>
            </Alert>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verification ID</TableHead>
                    <TableHead>Onboarding</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell className="font-medium">
                        {student.firstName && student.lastName
                          ? `${student.firstName} ${student.lastName}`
                          : student.firstName || "Unnamed"}
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        {student.isVerified ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-orange-600">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {student.verificationId ? (
                          <div className="flex items-center gap-2">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                              {student.verificationId}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyId(student.verificationId!)}
                              title="Copy to clipboard"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            {copiedId === student.verificationId && (
                              <span className="text-xs text-green-600">Copied!</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">Not generated</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {student.onboardingCompleted ? (
                          <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell className="space-x-2">
                        {!student.isVerified && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleGenerateAndSendId(
                                student._id,
                                student.email,
                                `${student.firstName || ""} ${student.lastName || ""}`.trim()
                              )
                            }
                            disabled={loading === student._id}
                            className="gap-2"
                          >
                            <Mail className="w-3 h-3" />
                            {loading === student._id ? "Sending..." : "Generate & Send"}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDeleteDialog(student)}
                          disabled={deletingUserId === student._id}
                          className="gap-2"
                        >
                          <Trash2 className="w-3 h-3" />
                          {deletingUserId === student._id ? "Deleting..." : "Delete"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription>
          <strong>Admin Instructions:</strong> Click "Generate & Send" to create a verification ID for each student and send it via email. The ID format is DD/MM/keek[number], e.g., 26/01/keek01. Click "Delete" to remove a student from the system entirely.
        </AlertDescription>
      </Alert>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{userToDelete?.name}</strong> ({userToDelete?.email})? This action cannot be undone and will remove all associated data including assessments, enrollments, and progress records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel disabled={deletingUserId === userToDelete?._id}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={deletingUserId === userToDelete?._id}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingUserId === userToDelete?._id ? "Deleting..." : "Delete Student"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

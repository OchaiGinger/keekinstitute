"use client";

import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const UsersPage = () => {
  // Fetch all students/users
  const users = useQuery(api.user.getByRole, { role: "student" });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Students</h1>
        <p className="text-muted-foreground">
          Total enrolled: {users?.length || 0}
        </p>
      </div>

      {users === undefined ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      ) : users && users.length > 0 ? (
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user._id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Joined</p>
                    <p className="text-xs text-muted-foreground">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No students enrolled yet
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UsersPage;
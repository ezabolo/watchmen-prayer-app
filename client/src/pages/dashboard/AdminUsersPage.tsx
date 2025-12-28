import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Settings, Shield, Key, UserX, UserCheck } from "lucide-react";

// Form schemas
const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm the password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const updateRoleSchema = z.object({
  role: z.enum(['watchman', 'partner', 'admin', 'regional_leader']),
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
type UpdateRoleForm = z.infer<typeof updateRoleSchema>;

export default function AdminUsersPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [updateRoleOpen, setUpdateRoleOpen] = useState(false);

  const { data: users = [] } = useQuery({
    queryKey: ['/api/admin/users'],
  });

  // Reset password form
  const resetPasswordForm = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update role form
  const updateRoleForm = useForm<UpdateRoleForm>({
    resolver: zodResolver(updateRoleSchema),
    defaultValues: {
      role: "watchman",
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { userId: number; newPassword: string }) => {
      return apiRequest("POST", "/api/admin/users/reset-password", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User password has been reset successfully",
      });
      setResetPasswordOpen(false);
      resetPasswordForm.reset();
      setSelectedUser(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      });
    },
  });

  // Toggle user status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async (data: { userId: number; isActive: boolean }) => {
      return apiRequest("POST", "/api/admin/users/toggle-status", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User status updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user status",
        variant: "destructive",
      });
    },
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async (data: { userId: number; role: string }) => {
      return apiRequest("POST", "/api/admin/users/update-role", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      setUpdateRoleOpen(false);
      updateRoleForm.reset();
      setSelectedUser(null);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    },
  });

  const handleResetPassword = (values: ResetPasswordForm) => {
    if (selectedUser) {
      resetPasswordMutation.mutate({
        userId: selectedUser.id,
        newPassword: values.newPassword,
      });
    }
  };

  const handleUpdateRole = (values: UpdateRoleForm) => {
    if (selectedUser) {
      updateRoleMutation.mutate({
        userId: selectedUser.id,
        role: values.role,
      });
    }
  };

  const handleToggleStatus = (user: any) => {
    toggleStatusMutation.mutate({
      userId: user.id,
      isActive: !user.is_active,
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'regional_leader': return 'bg-purple-100 text-purple-800';
      case 'partner': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Users ({users.length})</CardTitle>
          <CardDescription>Manage user accounts and their access levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user: any) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{user.name}</h3>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                    <Badge className={getStatusBadgeColor(user.is_active)}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500">
                    Region: {user.region || 'Not specified'} • 
                    Registered: {new Date(user.registered_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Reset Password Button */}
                  <Dialog open={resetPasswordOpen && selectedUser?.id === user.id} onOpenChange={setResetPasswordOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Key className="h-4 w-4 mr-1" />
                        Reset Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reset Password for {user.name}</DialogTitle>
                        <DialogDescription>
                          Enter a new password for this user. They will need to use this new password to log in.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...resetPasswordForm}>
                        <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className="space-y-4">
                          <FormField
                            control={resetPasswordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Enter new password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={resetPasswordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Confirm new password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setResetPasswordOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit" disabled={resetPasswordMutation.isPending}>
                              {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>

                  {/* Update Role Button */}
                  <Dialog open={updateRoleOpen && selectedUser?.id === user.id} onOpenChange={setUpdateRoleOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          updateRoleForm.setValue('role', user.role);
                        }}
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        Change Role
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Role for {user.name}</DialogTitle>
                        <DialogDescription>
                          Change the user's role and permissions level.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...updateRoleForm}>
                        <form onSubmit={updateRoleForm.handleSubmit(handleUpdateRole)} className="space-y-4">
                          <FormField
                            control={updateRoleForm.control}
                            name="role"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="watchman">Watchman</SelectItem>
                                    <SelectItem value="partner">Partner</SelectItem>
                                    <SelectItem value="regional_leader">Regional Leader</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setUpdateRoleOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit" disabled={updateRoleMutation.isPending}>
                              {updateRoleMutation.isPending ? "Updating..." : "Update Role"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>

                  {/* Toggle Status Button */}
                  <Button
                    variant={user.is_active ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleToggleStatus(user)}
                    disabled={toggleStatusMutation.isPending}
                  >
                    {user.is_active ? (
                      <>
                        <UserX className="h-4 w-4 mr-1" />
                        Disable
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-4 w-4 mr-1" />
                        Enable
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}

            {users.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No users found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
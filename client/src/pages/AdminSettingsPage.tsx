import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { changePasswordSchema, type ChangePassword } from '@shared/schema';
import { Shield, Key, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const form = useForm<ChangePassword>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePassword) => {
      return apiRequest("POST", "/api/auth/change-password", data);
    },
    onSuccess: () => {
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully. Please use your new password for future logins.",
      });
      form.reset();
      setIsChangingPassword(false);
    },
    onError: (error: any) => {
      toast({
        title: "Password Change Failed",
        description: error.message || "Failed to change password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ChangePassword) => {
    changePasswordMutation.mutate(data);
  };

  return (
    <>
      <Helmet>
        <title>Admin Settings | Prayer Watchman</title>
        <meta name="description" content="Manage admin account settings and security preferences for Prayer Watchman platform." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
              <p className="text-gray-600">Manage your account security and preferences</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account security and authentication
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant={isChangingPassword ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="font-medium">Security Tips:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Use a strong, unique password</li>
                      <li>• Include uppercase, lowercase, numbers</li>
                      <li>• Minimum 8 characters recommended</li>
                      <li>• Avoid common words or personal info</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {isChangingPassword ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your admin password to maintain account security
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          {...form.register("currentPassword")}
                          className="mt-1"
                          placeholder="Enter your current password"
                        />
                        {form.formState.errors.currentPassword && (
                          <p className="text-sm text-red-600 mt-1">
                            {form.formState.errors.currentPassword.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          {...form.register("newPassword")}
                          className="mt-1"
                          placeholder="Enter new password (min 8 characters)"
                        />
                        {form.formState.errors.newPassword && (
                          <p className="text-sm text-red-600 mt-1">
                            {form.formState.errors.newPassword.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          {...form.register("confirmPassword")}
                          className="mt-1"
                          placeholder="Confirm your new password"
                        />
                        {form.formState.errors.confirmPassword && (
                          <p className="text-sm text-red-600 mt-1">
                            {form.formState.errors.confirmPassword.message}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-4">
                        <Button
                          type="submit"
                          disabled={changePasswordMutation.isPending}
                          className="flex-1"
                        >
                          {changePasswordMutation.isPending ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Changing Password...
                            </div>
                          ) : (
                            "Change Password"
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsChangingPassword(false);
                            form.reset();
                          }}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-blue-900">Security Notice</p>
                          <p className="text-blue-700 mt-1">
                            Changing your password will help eliminate browser security warnings 
                            about password reuse. Use a unique, strong password for this admin account.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                    <CardDescription>
                      Keep your admin account secure and up to date
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">Password Security</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Update your password to maintain account security and eliminate browser warnings.
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsChangingPassword(true)}
                        >
                          <Key className="w-4 h-4 mr-2" />
                          Change Password
                        </Button>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">Account Type</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Administrator account with full system access and management privileges.
                        </p>
                        <div className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin Access
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-900 mb-2">Browser Security Warning</h4>
                      <p className="text-sm text-yellow-700">
                        If you're seeing browser warnings about password reuse, changing your password 
                        to a unique one will resolve these security alerts and improve your account protection.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
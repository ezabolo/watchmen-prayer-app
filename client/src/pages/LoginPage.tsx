import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { apiRequest } from "@/lib/queryClient";
import { loginSchema, type Login } from "@shared/schema";
import { Facebook, Mail, Apple, Shield } from "lucide-react";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [show2FA, setShow2FA] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");

  // Check for URL params (social login, verification, etc.)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    const verified = urlParams.get('verified');
    
    if (token) {
      localStorage.setItem('token', token);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Welcome!",
        description: "You have successfully logged in with your social account.",
      });
      setLocation('/dashboard');
    } else if (error) {
      const errorMessages = {
        'google_auth_failed': 'Google authentication failed. Please try again.',
        'google_auth_cancelled': 'Google authentication was cancelled.',
        'facebook_auth_failed': 'Facebook authentication failed. Please try again.',
        'facebook_auth_cancelled': 'Facebook authentication was cancelled.',
      };
      toast({
        title: "Login Failed",
        description: errorMessages[error as keyof typeof errorMessages] || "Social login failed.",
        variant: "destructive",
      });
      // Clean up URL
      window.history.replaceState({}, '', '/login');
    } else if (verified === 'true') {
      toast({
        title: "Email Verified!",
        description: "Your email has been verified successfully. You can now log in.",
      });
      // Clean up URL
      window.history.replaceState({}, '', '/login');
    }
  }, [setLocation, toast, queryClient]);
  
  const form = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (data: Login) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response;
    },
    onSuccess: (data) => {
      // Check if 2FA is required
      if (data.requires2FA) {
        setTempToken(data.tempToken);
        setShow2FA(true);
        toast({
          title: "2FA Required",
          description: "Please enter the code from your authenticator app.",
        });
        return;
      }
      
      // Store token if provided
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      // Invalidate auth query to refetch user data  
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      
      toast({
        title: "Welcome Back!",
        description: "You have successfully logged in.",
      });
      
      // Check if there's a return URL, otherwise go to dashboard
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('return') || '/dashboard';
      setLocation(returnUrl);
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Please check your credentials and try again.";
      
      // Check if it's an email verification error
      if (errorMessage.includes('Email not verified')) {
        toast({
          title: "Email Verification Required",
          description: "Please check your email and click the verification link before logging in.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
  });

  const verify2FAMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("POST", "/api/auth/verify-2fa", {
        tempToken,
        code
      });
      return response;
    },
    onSuccess: (data) => {
      // Store token
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      // Invalidate auth query to refetch user data  
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      
      toast({
        title: "Welcome Back!",
        description: "You have successfully logged in.",
      });
      
      // Check if there's a return URL, otherwise go to dashboard
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('return') || '/dashboard';
      setLocation(returnUrl);
    },
    onError: (error: any) => {
      toast({
        title: "2FA Verification Failed",
        description: error.message || "Invalid verification code.",
        variant: "destructive",
      });
    },
  });

  const socialLoginMutation = useMutation({
    mutationFn: async (provider: string) => {
      // Redirect to social auth endpoint
      window.location.href = `/api/auth/${provider}`;
    },
    onError: (error: any) => {
      toast({
        title: "Social Login Error",
        description: error.message || "Social login is not configured yet.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: Login) => {
    loginMutation.mutate(data);
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === 'apple') {
      toast({
        title: "Coming Soon",
        description: "Apple login will be available soon.",
        variant: "default",
      });
      return;
    }
    socialLoginMutation.mutate(provider);
  };

  const handle2FASubmit = () => {
    if (twoFactorCode.length === 6) {
      verify2FAMutation.mutate(twoFactorCode);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | Prayer Watchman Global Network</title>
        <meta name="description" content="Login to access your training modules and join the global prayer community of watchmen." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your account to access training modules
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!show2FA ? (
              <>
                {/* Social Login Options */}
                <div className="space-y-3 mb-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSocialLogin('google')}
                    disabled={socialLoginMutation.isPending}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Continue with Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSocialLogin('facebook')}
                    disabled={socialLoginMutation.isPending}
                  >
                    <Facebook className="w-4 h-4 mr-2" />
                    Continue with Facebook
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full opacity-50 cursor-not-allowed"
                    disabled
                  >
                    <Apple className="w-4 h-4 mr-2" />
                    Continue with Apple (Coming Soon)
                  </Button>
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-50 px-2 text-gray-500">Or continue with email</span>
                  </div>
                </div>

                {/* Email Login Form */}
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email")}
                      className="mt-1"
                      placeholder="Enter your email"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-1">{form.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...form.register("password")}
                      className="mt-1"
                      placeholder="Enter your password"
                    />
                    {form.formState.errors.password && (
                      <p className="text-sm text-red-600 mt-1">{form.formState.errors.password.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing In..." : "Sign In"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                      Click here to register
                    </Link>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Note: Social login requires OAuth setup by administrator
                  </p>
                </div>
              </>
            ) : (
              /* 2FA Verification Form */
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <Shield className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>

                <div>
                  <Label htmlFor="2fa-code">Verification Code</Label>
                  <Input
                    id="2fa-code"
                    type="text"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="mt-1 text-center text-2xl tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>

                <Button
                  type="button"
                  className="w-full"
                  onClick={handle2FASubmit}
                  disabled={verify2FAMutation.isPending || twoFactorCode.length !== 6}
                >
                  {verify2FAMutation.isPending ? "Verifying..." : "Verify Code"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setShow2FA(false);
                    setTwoFactorCode("");
                    setTempToken("");
                  }}
                >
                  Back to Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
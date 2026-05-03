import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ResetForm {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetForm>();
  const password = watch("password", "");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (!t) {
      setStatus("error");
    } else {
      setToken(t);
    }
  }, []);

  const onSubmit = async (data: ResetForm) => {
    setStatus("loading");
    try {
      await apiRequest("POST", "/api/auth/reset-password", { token, password: data.password });
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      toast({
        title: "Reset Failed",
        description: err?.message || "The link may have expired. Please request a new one.",
        variant: "destructive",
      });
      setStatus("idle");
    }
  };

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <XCircle className="w-16 h-16 mx-auto text-red-500" />
            <p className="text-gray-700 font-medium">Invalid or missing reset token</p>
            <p className="text-sm text-gray-500">This link may have expired. Please request a new password reset.</p>
            <Link to="/forgot-password">
              <Button className="w-full">Request New Link</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
            <p className="text-gray-700 font-medium">Password reset successfully!</p>
            <p className="text-sm text-gray-500">You can now sign in with your new password.</p>
            <Button className="w-full" onClick={() => setLocation("/login")}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Reset Password | Watchmen Nations Prayer</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Set New Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="password">New Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 8, message: "Password must be at least 8 characters" }
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat your new password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (val) => val === password || "Passwords do not match"
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={status === "loading"}>
                {status === "loading" ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Resetting…</> : "Reset Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

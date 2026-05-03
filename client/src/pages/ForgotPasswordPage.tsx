import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { apiRequest } from "@/lib/queryClient";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>();

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    try {
      await apiRequest("POST", "/api/auth/forgot-password", { email: data.email });
    } catch {
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password | Watchmen Nations Prayer</title>
        <meta name="description" content="Reset your Watchmen Nations Prayer account password." />
      </Helmet>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
            <CardDescription>
              Enter your email and we'll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!submitted ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    className="mt-1"
                    placeholder="you@example.com"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" />Sending…</>
                  ) : (
                    <><Mail className="w-4 h-4 mr-2" />Send Reset Link</>
                  )}
                </Button>
                <Link to="/login">
                  <Button type="button" variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />Back to Sign In
                  </Button>
                </Link>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                <p className="text-gray-700 font-medium">Check your inbox</p>
                <p className="text-sm text-gray-500">
                  If an account with that email exists, we've sent a password reset link. Please check your inbox and spam folder.
                </p>
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />Back to Sign In
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { apiRequest } from "@/lib/queryClient";
import { registerSchema, type Register } from "@shared/schema";

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<Register>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "watchman",
      region: "africa"
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (data: Register) => {
      return apiRequest("POST", "/api/auth/register", data);
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "Welcome to the Prayer Watchman community! Please login to continue.",
      });
      setLocation("/login");
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: Register) => {
    registerMutation.mutate(data);
  };

  return (
    <>
      <Helmet>
        <title>Join the Watchmen | Prayer Watchman Global Network</title>
        <meta name="description" content="Register to become a prayer watchman and access comprehensive training modules for effective intercession and spiritual warfare." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Join the Watchmen</CardTitle>
            <CardDescription>
              Register to access training modules and join the global prayer network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  className="mt-1"
                  placeholder="Enter your full name"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  className="mt-1"
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
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...form.register("confirmPassword")}
                  className="mt-1"
                />
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(value) => form.setValue("role", value as any)} defaultValue="watchman">
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="watchman">Watchman</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.role && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.role.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="region">Region</Label>
                <Select onValueChange={(value) => form.setValue("region", value as any)} defaultValue="africa">
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="africa">Africa</SelectItem>
                    <SelectItem value="asia">Asia</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="north_america">North America</SelectItem>
                    <SelectItem value="south_america">South America</SelectItem>
                    <SelectItem value="oceania">Oceania</SelectItem>
                    <SelectItem value="middle_east">Middle East</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.region && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.region.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Creating Account..." : "Join the Watchmen"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
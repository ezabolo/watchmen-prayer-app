import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import GoogleLogin from "./GoogleLogin";
import { registerSchema, loginSchema } from "@shared/schema";

// Extend the schema with client-side validations
const clientLoginSchema = loginSchema.extend({
  rememberMe: z.boolean().optional(),
});

// Create a new schema for registration with rememberMe
const clientRegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6),
  role: z.enum(["watchman", "partner", "admin", "regional_leader"]).default("watchman"),
  rememberMe: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AuthFormProps = {
  mode: "login" | "register";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Use different schema based on mode
  const formSchema = mode === "login" ? clientLoginSchema : clientRegisterSchema;
  
  type FormValues = z.infer<typeof formSchema>;

  // Default values for the form
  const defaultValues: Partial<FormValues> = {
    email: "",
    password: "",
    rememberMe: false,
  };

  if (mode === "register") {
    defaultValues.name = "";
    defaultValues.confirmPassword = "";
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      if (mode === "login") {
        await login(data.email, data.password);
        toast({
          title: "Login successful",
          description: "Welcome back to Prayer Watchman!",
        });
      } else {
        await register(data);
        toast({
          title: "Registration successful",
          description: "Welcome to Prayer Watchman!",
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || "";
      
      if (mode === "login") {
        // Friendly login error messages
        if (errorMessage.toLowerCase().includes('invalid') || errorMessage.toLowerCase().includes('password') || errorMessage.toLowerCase().includes('credentials')) {
          toast({
            title: "Incorrect Email or Password",
            description: "The email or password you entered doesn't match our records. Please double-check and try again.",
            variant: "destructive",
          });
        } else if (errorMessage.includes('Email not verified')) {
          toast({
            title: "Please Verify Your Email",
            description: "Check your inbox for a verification link to activate your account.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Unable to Sign In",
            description: "Something went wrong. Please check your details and try again.",
            variant: "destructive",
          });
        }
      } else {
        // Friendly registration error messages
        if (errorMessage.toLowerCase().includes('already exists') || errorMessage.toLowerCase().includes('duplicate') || errorMessage.toLowerCase().includes('email')) {
          toast({
            title: "Email Already Registered",
            description: "An account with this email already exists. Try signing in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Registration Unsuccessful",
            description: "We couldn't complete your registration. Please check your details and try again.",
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {mode === "register" && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {mode === "register" && (
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-medium">Remember me</FormLabel>
              </FormItem>
            )}
          />
          {mode === "login" && (
            <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              Forgot your password?
            </Link>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            "Loading..."
          ) : mode === "login" ? (
            "Sign in"
          ) : (
            "Register"
          )}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6">
          <GoogleLogin mode={mode} />
        </div>
      </div>

      <div className="mt-6 text-center text-sm">
        {mode === "login" ? (
          <p>
            Not registered yet?{" "}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              Create an account
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </Form>
  );
}

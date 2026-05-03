import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { apiRequest } from "@/lib/queryClient";

export default function VerifyEmailPage() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error" | "expired">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token found. Please check your email link.");
      return;
    }

    apiRequest("GET", `/api/auth/verify-email/${token}`)
      .then(() => {
        setStatus("success");
        setMessage("Your email has been verified successfully! You can now sign in.");
      })
      .catch((err: any) => {
        const msg = err?.message || "";
        if (msg.includes("expired") || msg.includes("Invalid")) {
          setStatus("expired");
          setMessage("This verification link has expired or is invalid. Please request a new one.");
        } else {
          setStatus("error");
          setMessage(msg || "Verification failed. Please try again.");
        }
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>Verify Email | Watchmen Nations Prayer</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
            <CardDescription>Activating your Watchmen Nations Prayer account</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {status === "loading" && (
              <>
                <Loader2 className="w-16 h-16 mx-auto text-blue-600 animate-spin" />
                <p className="text-gray-600">Verifying your email address…</p>
              </>
            )}
            {status === "success" && (
              <>
                <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                <p className="text-gray-700 font-medium">{message}</p>
                <Button className="w-full" onClick={() => setLocation("/login?verified=true")}>
                  Sign In Now
                </Button>
              </>
            )}
            {(status === "error" || status === "expired") && (
              <>
                <XCircle className="w-16 h-16 mx-auto text-red-500" />
                <p className="text-gray-700">{message}</p>
                {status === "expired" && (
                  <ResendVerificationButton />
                )}
                <Link to="/login">
                  <Button variant="outline" className="w-full">Back to Sign In</Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function ResendVerificationButton() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await apiRequest("POST", "/api/auth/resend-verification", { email });
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex items-center gap-2 justify-center text-green-600 bg-green-50 p-3 rounded-lg">
        <Mail className="w-4 h-4" />
        <span className="text-sm">If that email exists, a new link has been sent.</span>
      </div>
    );
  }

  if (!showForm) {
    return (
      <Button variant="outline" className="w-full" onClick={() => setShowForm(true)}>
        Resend Verification Email
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Button className="w-full" onClick={handleResend} disabled={loading || !email}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        Send New Link
      </Button>
    </div>
  );
}

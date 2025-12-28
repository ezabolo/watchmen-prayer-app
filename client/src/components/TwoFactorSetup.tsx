import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Shield, QrCode, Key } from "lucide-react";

interface TwoFactorSetupProps {
  onComplete: () => void;
}

export default function TwoFactorSetup({ onComplete }: TwoFactorSetupProps) {
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const setupMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/setup-2fa");
      return response;
    },
    onSuccess: (data) => {
      setQrCode(data.qrCode);
      setSecret(data.secret);
      setStep('verify');
      toast({
        title: "2FA Setup",
        description: "Scan the QR code with your authenticator app, then enter the verification code.",
      });
    },
    onError: () => {
      toast({
        title: "Setup Failed",
        description: "Failed to setup 2FA. Please try again.",
        variant: "destructive",
      });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (token: string) => {
      const response = await apiRequest("POST", "/api/auth/verify-2fa-setup", { token });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been successfully enabled for your account.",
      });
      onComplete();
    },
    onError: () => {
      toast({
        title: "Verification Failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSetup = () => {
    setupMutation.mutate();
  };

  const handleVerify = () => {
    if (verificationCode.length === 6) {
      verifyMutation.mutate(verificationCode);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Shield className="w-6 h-6 text-blue-600" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          {step === 'setup' 
            ? "Secure your account with 2FA" 
            : "Verify your authenticator app setup"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 'setup' ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Two-factor authentication adds an extra layer of security to your account.
                You'll need an authenticator app like Google Authenticator or Authy.
              </p>
            </div>
            <Button
              onClick={handleSetup}
              disabled={setupMutation.isPending}
              className="w-full"
            >
              {setupMutation.isPending ? "Setting up..." : "Setup 2FA"}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* QR Code */}
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg border inline-block">
                <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Scan this QR code with your authenticator app
              </p>
            </div>

            {/* Manual Entry Option */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Or enter this code manually:
              </p>
              <div className="bg-gray-100 p-2 rounded font-mono text-sm break-all">
                {secret}
              </div>
            </div>

            {/* Verification */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                />
              </div>
              <Button
                onClick={handleVerify}
                disabled={verifyMutation.isPending || verificationCode.length !== 6}
                className="w-full"
              >
                {verifyMutation.isPending ? "Verifying..." : "Verify & Enable 2FA"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
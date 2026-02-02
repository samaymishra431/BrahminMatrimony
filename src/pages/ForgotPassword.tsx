import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Heart,
  Loader2,
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CardTitle, CardDescription } from "@/components/ui/card";
import bannerImage from "@/images/forgot3img.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ Define baseUrl once
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:9099";

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Enter your registered email.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${baseUrl}/api/users/send-otp?email=${encodeURIComponent(email.trim())}`,
        { method: "POST" }
      );
      const data = await response.json();

      if (data.statusCode === 200) {
        toast({
          title: "OTP Sent",
          description: data.message || "Check your email for the OTP.",
        });
        setStep(2);
      } else {
        throw new Error(data.message || "Failed to send OTP");
      }
    } catch (error: any) {
      toast({
        title: "Failed",
        description: error.message || "Server error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast({
        title: "Error",
        description: "Enter the OTP sent to your email.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${baseUrl}/api/users/verify-otp-for-forgot-password?email=${encodeURIComponent(
          email
        )}&otp=${otp}`,
        { method: "POST" }
      );
      const data = await response.json();

      if (data.statusCode === 200 && data.payload) {
        setResetToken(data.payload);
        toast({
          title: "OTP Verified",
          description: "You can now set a new password.",
        });
        setStep(3);
      } else {
        throw new Error(data.message || "Invalid OTP");
      }
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Both passwords must be the same.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${baseUrl}/api/users/reset-password?token=${resetToken}&newPassword=${encodeURIComponent(
          newPassword
        )}`,
        { method: "POST" }
      );
      const data = await response.json();

      if (data.statusCode === 200) {
        toast({
          title: "Success",
          description: "Password reset successfully!",
        });
        navigate("/");
      } else {
        throw new Error(data.message || "Failed to reset password");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-rose-100 p-6">
      <div
        className="flex flex-col lg:flex-row w-full max-w-5xl rounded-2xl shadow-xl border border-gray-200 overflow-hidden bg-white animate-fade-in"
        style={{ maxHeight: "600px" }}
      >
        {/* LEFT IMAGE SECTION */}
        <div className="hidden lg:flex lg:w-1/2 h-full">
          <img
            src={bannerImage}
            alt="Matrimony Love"
            className="object-cover w-full h-full"
          />
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
          <form
            onSubmit={
              step === 1
                ? handleSendOtp
                : step === 2
                ? handleVerifyOtp
                : handleResetPassword
            }
            className="w-full max-w-md space-y-6"
          >
            {/* HEADER */}
            <div className="text-center space-y-3">
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 flex items-center justify-center shadow-md">
                  <Heart className="w-7 h-7 text-white fill-current" />
                </div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent">
                  MatrimonyHub
                </h1>
                <p className="text-sm text-gray-500">
                  Recover your password 🔐
                </p>
              </div>

              <div>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  {step === 1 && "Send OTP"}
                  {step === 2 && "Verify OTP"}
                  {step === 3 && "Reset Password"}
                </CardTitle>
                <CardDescription className="text-gray-500">
                  {step === 1 &&
                    "Enter your registered email to receive an OTP."}
                  {step === 2 && "Enter the OTP sent to your email."}
                  {step === 3 &&
                    "Enter and confirm your new password to complete the reset."}
                </CardDescription>
              </div>
            </div>

            {/* FORM INPUTS */}
            {step === 1 && (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 pl-10 border-gray-300 focus:ring-2 focus:ring-rose-400 transition-all"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-gray-700 font-medium">
                  OTP
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="h-11 pl-10 border-gray-300 focus:ring-2 focus:ring-rose-400 transition-all"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <>
                {/* New Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="newPassword"
                    className="text-gray-700 font-medium"
                  >
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-11 pl-10 pr-10 border-gray-300 focus:ring-2 focus:ring-rose-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPassword(!showNewPassword)
                      }
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-gray-700 font-medium"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      className="h-11 pl-10 pr-10 border-gray-300 focus:ring-2 focus:ring-rose-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* BUTTON */}
            <div className="flex flex-col gap-4 pt-2">
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {step === 1
                      ? "Sending..."
                      : step === 2
                      ? "Verifying..."
                      : "Resetting..."}
                  </>
                ) : (
                  <>
                    {step === 1 && "Send OTP"}
                    {step === 2 && "Verify OTP"}
                    {step === 3 && "Reset Password"}
                  </>
                )}
              </Button>

              <p className="text-sm text-center text-gray-500">
                Remembered your password?{" "}
                <Link
                  to="/login"
                  className="text-rose-600 font-medium hover:underline"
                >
                  Back to Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

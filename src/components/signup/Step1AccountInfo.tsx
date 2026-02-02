import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Check, X, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://10.166.81.197:9099";

interface StepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const Step1AccountInfo = ({ data, onNext }: StepProps) => {
  const [formData, setFormData] = useState({
    email: data.email || "",
    phoneNumber: data.phoneNumber || "",
    username: data.username || "",
    password: data.password || "",
    confirmPassword: data.confirmPassword || "",
  });

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // Password Validation Rules
  const validations = [
    { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { label: "At least one uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "At least one lowercase letter", test: (p: string) => /[a-z]/.test(p) },
    { label: "At least one number", test: (p: string) => /\d/.test(p) },
    { label: "At least one special character (@$!%*?&)", test: (p: string) => /[@$!%*?&]/.test(p) },
  ];

  const strengthScore = validations.filter((v) => v.test(formData.password)).length;

  const getStrengthColor = (score: number) => {
    if (score <= 2) return "bg-red-500";
    if (score <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthLabel = (score: number) => {
    if (score <= 2) return "Weak";
    if (score <= 4) return "Medium";
    return "Strong";
  };

  // ✅ Handle form submission — send OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Password and confirm password must match.",
        variant: "destructive",
      });
      return;
    }

    // Validate Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Validate Phone Number
    if (!/^\d{10}$|^\d{13}$/.test(formData.phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Phone number must be exactly 10 or 13 digits.",
        variant: "destructive",
      });
      return;
    }

    // Validate Username
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      toast({
        title: "Invalid Username",
        description: "Username must be 3-20 characters (letters, numbers, _).",
        variant: "destructive",
      });
      return;
    }

    // Validate Password Strength
    const isPasswordValid = validations.every((v) => v.test(formData.password));
    if (!isPasswordValid) {
      toast({
        title: "Weak Password",
        description: "Please ensure your password meets all requirements.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/users/send-otp-for-sign-up?email=${encodeURIComponent(formData.email)}`, {
        method: "POST",
      });

      const result = await res.json();
      if (result.statusCode === 200) {
        toast({
          title: "OTP Sent",
          description: "Please check your email for the OTP.",
        });
        setIsOtpModalOpen(true);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to send OTP.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Unable to reach the server.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP and continue registration
  const handleVerifyOtp = async () => {
    if (!otp) {
      toast({ title: "Enter OTP", description: "Please enter the OTP sent to your email." });
      return;
    }

    try {
      setLoading(true);
      const verifyRes = await fetch(
        `${BASE_URL}/api/users/verify-otp?email=${encodeURIComponent(formData.email)}&otp=${otp}`,
        { method: "POST" }
      );
      const verifyData = await verifyRes.json();

      if (verifyData.statusCode === 200 && verifyData.payload === true) {
        toast({ title: "OTP Verified", description: "Email verified successfully!" });

        // ✅ Proceed to Signup API
        const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            password: formData.password,
            roles: ["ROLE_USER"],
          }),
        });

        const signupData = await signupRes.json();
        if (signupData.statusCode === 201) {
          // toast({ title: "Signup Successful", description: "Account created successfully." });

          // ✅ Proceed to Signin API
          const loginRes = await fetch(`${BASE_URL}/api/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: formData.username,
              password: formData.password,
            }),
          });

          const loginData = await loginRes.json();

          if (loginData.statusCode === 200 && loginData.payload) {
            sessionStorage.setItem("token", loginData.payload.token);
            sessionStorage.setItem("refreshToken", loginData.payload.refreshToken);
            sessionStorage.setItem("username", loginData.payload.username);
            sessionStorage.setItem("roles", JSON.stringify(loginData.payload.roles));

            // toast({ title: "Login Successful", description: "You are now logged in." });

            setIsOtpModalOpen(false);
            onNext(formData); // Move to next step/page
          } else {
            toast({
              title: "Login Failed",
              description: loginData.message || "Please try again.",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Signup Failed",
            description: signupData.message || "Unable to create account.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Invalid OTP",
          description: verifyData.message || "OTP verification failed.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong during verification.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-orange-900 mb-6">
        <div className="flex items-center gap-2 font-semibold mb-2 text-orange-800 text-lg">
          <AlertTriangle className="w-4 h-4" />
          Important Notice
        </div>
        {/* English */}
          {/* English */}
  <p className="leading-relaxed text-justify font-semibold">
    This platform has been established as a selfless social service for the Brahmin community, with the purpose of protecting, preserving, and promoting eternal culture, scriptural traditions, and family values.
  </p>

  <p className="leading-relaxed text-justify mt-3 font-semibold">
    Only individuals belonging to the Brahmin community will be allowed to register and use this platform. It is mandatory that every piece of information provided during registration is true, accurate, and authentic.
  </p>

  <p className="leading-relaxed text-justify mt-3 font-semibold">
    Providing any false, misleading, or unverified information, or registering without belonging to the Brahmin community, will be considered a serious violation of the platform’s rules. In such a case, the concerned account may be suspended or canceled without prior notice, and legal action may be taken under the prevailing law if necessary.
  </p>

  {/* Hindi */}
  <p className="leading-relaxed text-justify text-gray-700 mt-6 font-semibold">
    यह प्लेटफ़ॉर्म ब्राह्मण समाज हेतु एक निःस्वार्थ सामाजिक सेवा के रूप में स्थापित किया गया है, जिसका उद्देश्य सनातन संस्कृति, शास्त्रीय परंपराओं एवं पारिवारिक मूल्यों की रक्षा, संरक्षण और संवर्धन करना है।
  </p>

  <p className="leading-relaxed text-justify text-gray-700 mt-3 font-semibold">
    इस मंच पर केवल ब्राह्मण समुदाय से संबंधित व्यक्तियों को ही पंजीकरण एवं उपयोग की अनुमति प्राप्त होगी। पंजीकरण के दौरान प्रस्तुत की गई प्रत्येक जानकारी का सत्य, सटीक और प्रमाणिक होना अनिवार्य है।
  </p>

  <p className="leading-relaxed text-justify text-gray-700 mt-3 font-semibold">
    किसी भी प्रकार की असत्य, भ्रामक अथवा तथ्यहीन जानकारी देना, या ब्राह्मण समुदाय से संबंधित न होते हुए पंजीकरण करना, प्लेटफ़ॉर्म के नियमों का गंभीर उल्लंघन माना जाएगा। ऐसी स्थिति में संबंधित खाता बिना पूर्व सूचना निलंबित अथवा निरस्त किया जा सकता है तथा आवश्यक होने पर प्रचलित विधि के अंतर्गत विधिक कार्रवाई भी की जा सकती है।
  </p>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address (ईमेल पता) *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
              <p className="text-xs text-red-500 mt-1">
                Please enter a valid email address.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number (फ़ोन नंबर) *</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val)) {
                  setFormData({ ...formData, phoneNumber: val });
                }
              }}
              required
            />
            {formData.phoneNumber && !/^\d{10}$|^\d{13}$/.test(formData.phoneNumber) && (
              <p className="text-xs text-red-500 mt-1">
                Phone number must be 10 or 13 digits.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username (उपयोगकर्ता नाम) *</Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a unique username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
            {formData.username && !/^[a-zA-Z0-9_]{3,20}$/.test(formData.username) && (
              <p className="text-xs text-red-500 mt-1">
                Username must be 3-20 characters (letters, numbers, _).
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password (पासवर्ड) *</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            {/* Password Strength & Validation */}
            {formData.password && (
              <div className="mt-2 space-y-2">
                {/* Strength Bar */}
                <div className="flex gap-1 h-1.5 w-full">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-full w-1/5 rounded-full transition-colors ${
                        strengthScore >= level ? getStrengthColor(strengthScore) : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-right text-muted-foreground">
                  Strength: <span className="font-medium">{getStrengthLabel(strengthScore)}</span>
                </p>

                {/* Validation Rules */}
                <div className="grid grid-cols-1 text-xs gap-1">
                  {validations.map((rule, index) => {
                    const isValid = rule.test(formData.password);
                    return (
                      <div
                        key={index}
                        className={`flex items-center ${
                          isValid ? "text-green-600" : "text-muted-foreground"
                        }`}
                      >
                        {isValid ? (
                          <Check className="w-3 h-3 mr-2" />
                        ) : (
                          <X className="w-3 h-3 mr-2" />
                        )}
                        {rule.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password (पासवर्ड की पुष्टि करें) *</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-primary hover:opacity-90"
          >
            {loading ? "Please wait..." : <>Next <ArrowRight className="ml-2 w-4 h-4" /></>}
          </Button>
        </div>
      </form>

      {/* OTP Verification Modal */}
      <Dialog open={isOtpModalOpen} onOpenChange={setIsOtpModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter OTP</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="otp">We’ve sent an OTP to your email (हमने आपके ईमेल पर एक ओटीपी भेजा है)</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-gradient-primary"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Step1AccountInfo;

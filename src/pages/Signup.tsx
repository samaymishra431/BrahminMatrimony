import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Steps
import Step1AccountInfo from "@/components/signup/Step1AccountInfo";
import Step2BasicDetails from "@/components/signup/Step2BasicDetails";
import Step3Education from "@/components/signup/Step3Education";
import Step4Family from "@/components/signup/Step4Family";
import Step5Hobbies from "@/components/signup/Step5Hobbies";
import Step6PartnerPreferences from "@/components/signup/Step6PartnerPreferences";
import Step7Location from "@/components/signup/Step7Location";

const Signup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const totalSteps = 7;

  const steps = [
    { number: 1, title: "Social Account Info", component: Step1AccountInfo },
    { number: 2, title: "Basic Details", component: Step2BasicDetails },
    { number: 3, title: "Education & Occupation", component: Step3Education },
    { number: 4, title: "Family Details", component: Step4Family },
    { number: 5, title: "Hobbies & Interests", component: Step5Hobbies },
    { number: 6, title: "Partner Preferences", component: Step6PartnerPreferences },
    { number: 7, title: "Location Details", component: Step7Location },
  ];

  const CurrentStepComponent = steps[currentStep - 1].component;

  const handleNext = (data: any) => {
    setFormData({ ...formData, ...data });
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
    else handleSubmit({ ...formData, ...data });
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (finalData: any) => {
    console.log("Final form data:", finalData);
    toast({
      title: "Registration Successful!",
      description: "Welcome to Brahmin Matrimony. Let's find your perfect match!",
    });
    setTimeout(() => navigate("/login"), 1500);
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-warm py-8 px-4">
      <div className="max-w-3xl mx-auto animate-fade-in">
        {/* Entire content inside single card */}
        <Card className="shadow-large border-0">
          <CardHeader className="text-center space-y-4">
            {/* Header */}
            <Link to="/" className="inline-flex items-center gap-2 mx-auto group">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary-foreground fill-current" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Brahmin Matrimony
              </h1>
            </Link>
            <p className="text-muted-foreground">
              Create your profile to find your soulmate
            </p>

            {/* Progress Info */}
            <div className="text-left mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-sm text-muted-foreground">
                  {steps[currentStep - 1].title}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Step Indicators */}
            <div className="flex justify-between mt-6 overflow-x-auto pb-2">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center min-w-[80px]"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-smooth ${
                      step.number < currentStep
                        ? "bg-primary text-primary-foreground"
                        : step.number === currentStep
                        ? "bg-gradient-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.number < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className="text-xs mt-2 text-center hidden sm:block text-muted-foreground">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>

            <CardTitle className="text-xl font-semibold mt-6">
              {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>

          {/* Form and footer */}
          <CardContent className="space-y-6">
            <CurrentStepComponent
              data={formData}
              onNext={handleNext}
              onBack={handleBack}
              isFirstStep={currentStep === 1}
              isLastStep={currentStep === totalSteps}
            />

            {/* Footer inside card */}
            <p className="text-center text-sm text-muted-foreground pt-6 border-t border-muted">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary-dark font-medium transition-smooth"
              >
                Sign In
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;

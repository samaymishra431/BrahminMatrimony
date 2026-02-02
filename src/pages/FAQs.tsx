import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQs = () => {
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I create an account?",
          a: "Click on the 'Sign Up' button and follow the 7-step registration process. You'll need to provide basic information, education details, family background, and partner preferences.",
        },
        {
          q: "Is registration free?",
          a: "Yes, basic registration is completely free. You can create a profile, search for matches, and express interest without any cost.",
        },
        {
          q: "How long does registration take?",
          a: "The complete registration process takes about 10-15 minutes. You can save your progress and complete it later if needed.",
        },
      ],
    },
    {
      category: "Profile & Privacy",
      questions: [
        {
          q: "How can I make my profile stand out?",
          a: "Upload clear photos, write a detailed 'About Me' section, keep your information up-to-date, and respond promptly to messages.",
        },
        {
          q: "Can I hide my profile temporarily?",
          a: "Yes, you can hide your profile from the Privacy Settings page. Your profile will not appear in search results or matches until you unhide it.",
        },
        {
          q: "Who can see my contact details?",
          a: "You can control this in Privacy Settings. Options include everyone, matches only, premium members, or accepted requests only.",
        },
      ],
    },
    {
      category: "Matches & Communication",
      questions: [
        {
          q: "How does matching work?",
          a: "Our system matches profiles based on your partner preferences including age, location, education, religion, and lifestyle choices.",
        },
        {
          q: "Can I contact profiles directly?",
          a: "Yes, you can send messages to any profile that matches your preferences. Some profiles may have restricted contact settings.",
        },
        {
          q: "What if I'm not interested in a match?",
          a: "You can skip matches by clicking the 'Skip' button. They won't be shown to you again.",
        },
      ],
    },
    {
      category: "Safety & Security",
      questions: [
        {
          q: "Is my information secure?",
          a: "Yes, we use industry-standard encryption to protect your data. We never share your information with third parties without consent.",
        },
        {
          q: "How do I report suspicious profiles?",
          a: "If you encounter any suspicious activity, please report it immediately through the Help Center or contact our support team.",
        },
        {
          q: "Can I block someone?",
          a: "Yes, you can block any profile from viewing or contacting you. This action is permanent and cannot be undone.",
        },
      ],
    },
    {
      category: "Account & Billing",
      questions: [
        {
          q: "What are the premium features?",
          a: "Premium members get unlimited messaging, advanced search filters, profile highlighting, and priority customer support.",
        },
        {
          q: "Can I delete my account?",
          a: "Yes, you can delete your account from Account Settings. This action is permanent and cannot be reversed.",
        },
        {
          q: "How do I change my password?",
          a: "Go to Account Settings and use the 'Change Password' section to update your password securely.",
        },
      ],
    },
    {
      category: "Technical Support",
      questions: [
        {
          q: "I'm facing issues loading the website. What should I do?",
          a: "First, try refreshing the page or clearing your browser cache. If the problem persists, try using a different browser or device.",
        },
        {
          q: "The app isn’t working properly on my phone. Any tips?",
          a: "Ensure that you’re using the latest version of the app. If the issue continues, uninstall and reinstall it or contact our support team.",
        },
        {
          q: "How can I report a technical bug?",
          a: "Go to the Help Center and select 'Report a Bug'. Provide as much detail as possible including screenshots if applicable.",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Card */}
      <Card className="border-0 shadow-medium">
        <CardHeader className="pb-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl md:text-3xl">
              Frequently Asked Questions
            </CardTitle>
            <p className="text-muted-foreground mt-1">
              Find answers to common questions
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* FAQ Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {faqs.map((category, idx) => (
          <Card key={idx} className="border-0 shadow-medium">
            <CardHeader>
              <CardTitle className="text-xl">{category.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, qIdx) => (
                  <AccordionItem key={qIdx} value={`${idx}-${qIdx}`}>
                    <AccordionTrigger className="text-left">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Support Card */}
      <Card className="border-0 shadow-medium bg-primary/5">
        <CardContent className="pt-6 text-center">
          <h3 className="font-semibold text-lg mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-4">
            Our support team is here to help you 24×5
          </p>
          <Button
            onClick={() =>
              (window.location.href = "/dashboard?section=help-center")
            }
            className="bg-gradient-primary"
          >
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQs;

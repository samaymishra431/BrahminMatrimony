import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs?: FAQ[];
}

const defaultFaqs: FAQ[] = [
  {
    question: "How do I create a profile?",
    answer: "Creating a profile is simple! Click on 'Register Free' and follow our step-by-step registration process. You'll need to provide basic information, upload photos, and describe your preferences."
  },
  {
    question: "Is my information secure?",
    answer: "Yes, we take privacy seriously. All your personal information is encrypted and protected. We never share your contact details without your consent."
  },
  {
    question: "How does the matching algorithm work?",
    answer: "Our intelligent matching system analyzes your preferences, background, lifestyle, and values to suggest compatible matches. The more complete your profile, the better your matches."
  },
  {
    question: "Can I search for matches myself?",
    answer: "Absolutely! Besides our automated suggestions, you can use our advanced search filters to find matches based on age, location, profession, religion, and many other criteria."
  },
 {
  question: "What Sevadakshina plan is available?",
  answer: "We offer a single Sevadakshina subscription of ₹2,100, which remains valid until marriage. This ensures full access to all features, allowing you to connect respectfully with families and find a partner aligned with our traditions and values."
}
,
  {
    question: "How can I verify my profile?",
    answer: "Profile verification involves uploading a government-issued ID and a selfie. Our team reviews the documents within 24-48 hours to add a verified badge to your profile."
  },
  {
    question: "Can family members manage my profile?",
    answer: "Yes, we understand that family plays an important role. You can add family members as profile managers who can help search and communicate on your behalf."
  },
  {
    question: "What is the refund policy?",
    answer: "We offer a refund within 7 days of purchase if you're not satisfied. Please contact our support team with your concerns and we'll process your request."
  },
  {
    question: "How do I contact customer support?",
    answer: "You can reach us via email, phone. Our support team is available 24x5 to assist you with any queries or concerns."
  },
  {
    question: "Are there any community events?",
    answer: "Yes! We regularly organize matrimonial meets, cultural events, and workshops. Premium members get exclusive invites to these special gatherings."
  }
];

const FAQSection = ({ faqs = defaultFaqs }: FAQSectionProps) => {
  const leftColumn = faqs.slice(0, 5);
  const rightColumn = faqs.slice(5, 10);

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our matrimonial services
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <Accordion type="single" collapsible className="space-y-4">
            {leftColumn.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`left-item-${index}`}
                className="bg-card rounded-xl px-6 border border-border"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Right Column */}
          <Accordion type="single" collapsible className="space-y-4">
            {rightColumn.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`right-item-${index}`}
                className="bg-card rounded-xl px-6 border border-border"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
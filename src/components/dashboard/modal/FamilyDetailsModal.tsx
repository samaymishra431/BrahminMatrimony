import { User } from "@/types/user";
import { Users, Phone, Home, Briefcase, Globe, ChevronDown } from "lucide-react";
import { useState } from "react";
import { SubscriptionModal } from "@/components/common/SubscriptionModal";

interface FamilyDetailsModalProps {
  user: User;
}

const CompactDetailItem = ({ icon: Icon, label, value }: any) => (
  <div className="flex items-start gap-3 py-2 px-3 hover:bg-primary/5 rounded-lg transition-colors group">
    <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors flex-shrink-0 mt-0.5">
      <Icon className="w-3.5 h-3.5 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{value}</p>
    </div>
  </div>
);

const AccordionItem = ({ icon: Icon, title, subtitle, children, defaultOpen = false }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-primary/20 shadow-md overflow-hidden rounded-lg border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gradient-to-r from-primary/10 to-transparent border-b border-primary/10 hover:from-primary/15 hover:to-primary/5 transition-colors p-4"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 text-left">
            <div className="p-2 rounded-lg bg-primary/20">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-primary transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      
      {isOpen && (
        <div className="pt-2 pb-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

const FamilyDetailsModal = ({ user }: FamilyDetailsModalProps) => {
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);

  const renderOrUpgrade = (val: any) =>
    (val || val === 0) ? val : (
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsSubscriptionOpen(true);
        }}
        className="text-primary underline hover:text-primary/80 transition-colors"
      >
        Upgrade to View
      </button>
    );

  const familyBasicDetails = [
    { icon: Users, label: "Family Value (पारिवारिक मूल्य)", value: user.familyValue },
    { icon: Users, label: "Family Type (परिवार का प्रकार)", value: user.familyType },
    { icon: Users, label: "Family Status (पारिवारिक स्थिति)", value: user.familyStatus },
    { icon: Home, label: "Native Place (मूल स्थान)", value: user.nativePlace || "N/A" },
  ];

  const parentOccupationDetails = [
    { icon: Briefcase, label: "Father's Occupation (पिता का व्यवसाय)", value: user.fatherOccupation || "N/A" },
    { icon: Briefcase, label: "Mother's Occupation (माता का व्यवसाय)", value: user.motherOccupation || "N/A" },
  ];

  const siblingDetails = [
    { icon: Users, label: "Brothers (भाई)", value: user.noOfBrothers || "0" },
    { icon: Users, label: "Brothers Married (विवाहित भाई)", value: user.brothersMarried || "0" },
    { icon: Users, label: "Sisters (बहनें)", value: user.noOfSisters || "0" },
    { icon: Users, label: "Sisters Married (विवाहित बहनें)", value: user.sistersMarried || "0" },
  ];

  const contactDetails = [
    { icon: Phone, label: "Parents Contact (माता-पिता का संपर्क)", value: renderOrUpgrade(user.parentsContactNo) },
  ];

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Family Basics Accordion */}
      <AccordionItem
        icon={Users}
        title="Family Information (पारिवारिक जानकारी)"
        subtitle="Family background"
        defaultOpen={true}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-3">
          {familyBasicDetails.map((detail, idx) => (
            <CompactDetailItem key={idx} {...detail} />
          ))}
        </div>
      </AccordionItem>

      {/* Parent Occupation Accordion */}
      <AccordionItem
        icon={Briefcase}
        title="Parents Occupation (माता-पिता का व्यवसाय)"
        subtitle="Professional details"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-3">
          {parentOccupationDetails.map((detail, idx) => (
            <CompactDetailItem key={idx} {...detail} />
          ))}
        </div>
      </AccordionItem>

      {/* Siblings Accordion */}
      <AccordionItem
        icon={Users}
        title="Siblings Information (भाई-बहनों की जानकारी)"
        subtitle="Brothers & sisters"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-3">
          {siblingDetails.map((detail, idx) => (
            <CompactDetailItem key={idx} {...detail} />
          ))}
        </div>
      </AccordionItem>

      {/* Contact Accordion */}
      <AccordionItem
        icon={Phone}
        title="Contact Information (संपर्क जानकारी)"
        subtitle="Family contact details"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-3">
          {contactDetails.map((detail, idx) => (
            <CompactDetailItem key={idx} {...detail} />
          ))}
        </div>
      </AccordionItem>

      {/* About Family Accordion */}
      {user.aboutMyFamily && (
        <AccordionItem
          icon={Globe}
          title="About My Family (मेरे परिवार के बारे में)"
          subtitle="Family description"
        >
          <div className="px-3 pb-2">
            <p className="text-sm text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded-lg">{user.aboutMyFamily}</p>
          </div>
        </AccordionItem>
      )}

      <SubscriptionModal isOpen={isSubscriptionOpen} onClose={() => setIsSubscriptionOpen(false)} />
    </div>
  );
};

export default FamilyDetailsModal;

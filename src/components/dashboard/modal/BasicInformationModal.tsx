import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User as UserType } from "@/types/user";
import { User, Calendar, MapPin, Heart, Users, Utensils, Cigarette, Wine, Globe, ChevronDown } from "lucide-react";
import { useState } from "react";
import { SubscriptionModal } from "@/components/common/SubscriptionModal";

interface BasicInformationModalProps {
  user: UserType;
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

const BasicInformationModal = ({ user }: BasicInformationModalProps) => {
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);

  // helper to render value or an upgrade link when value is null/undefined
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

  const personalDetails = [
    { icon: User, label: "First Name (नाम)", value: user.firstName },
    { icon: User, label: "Last Name (उपनाम)", value: user.lastName },
    { icon: Users, label: "Gender (लिंग)", value: user.gender },
    { icon: Heart, label: "Profile Created For (प्रोफ़ाइल किसके लिए)", value: user.profileCreatedFor },
    { icon: Calendar, label: "Date of Birth (जन्म तिथि)", value: new Date(user.dateOfBirth).toLocaleDateString() },
    { icon: Calendar, label: "Time of Birth (जन्म समय)", value: user.timeOfBirth || "N/A" },
    { icon: MapPin, label: "Place of Birth (जन्म स्थान)", value: user.placeOfBirth },
  ];

  const religionDetails = [
    { icon: Heart, label: "Religion (धर्म)", value: user.religion },
    { icon: Heart, label: "Caste (जाति)", value: renderOrUpgrade(user.caste) },
    { icon: Heart, label: "Sub Caste (उप जाति)", value: renderOrUpgrade(user.subCaste) },
    { icon: Globe, label: "Mother Tongue (मातृभाषा)", value: user.motherTongue },
    { icon: Globe, label: "Gothra (गोत्र)", value: renderOrUpgrade(user.gothra) },
  ];

  const astrologyDetails = [
    { icon: Globe, label: "Star (नक्षत्र)", value: renderOrUpgrade(user.star) },
    { icon: Globe, label: "Rashi (राशि)", value: renderOrUpgrade(user.rashi) },
    { icon: Globe, label: "Manglik (मांगलिक)", value: renderOrUpgrade(user.manglik) },
  ];

  const lifestyleDetails = [
    { icon: Users, label: "Marital Status (वैवाहिक स्थिति)", value: user.maritalStatus },
    { icon: Users, label: "Height (कद)", value: user.heightIn },
    { icon: Users, label: "Weight (वजन)", value: user.weight || "N/A" },
    { icon: Heart, label: "Physical Status (शारीरिक स्थिति)", value: user.physicalStatus },
    { icon: Utensils, label: "Dietary Habits (खान-पान की आदतें)", value: user.dietaryHabits },
    { icon: Cigarette, label: "Smoking Habits (धूम्रपान की आदतें)", value: user.smokingHabits },
    { icon: Wine, label: "Drinking Habits (पीने की आदतें)", value: user.drinkingHabits },
  ];

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Personal Details Accordion */}
      <AccordionItem
        icon={User}
        title="Personal Details (व्यक्तिगत विवरण)"
        subtitle="Basic information"
        defaultOpen={true}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-3">
          {personalDetails.map((detail, idx) => (
            <CompactDetailItem key={idx} {...detail} />
          ))}
        </div>
      </AccordionItem>

      {/* Religion & Culture Accordion */}
      <AccordionItem
        icon={Heart}
        title="Religion & Culture (धर्म और संस्कृति)"
        subtitle="Religious background"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-3">
          {religionDetails.map((detail, idx) => (
            <CompactDetailItem key={idx} {...detail} />
          ))}
        </div>
      </AccordionItem>

      {/* Astrology Accordion */}
      <AccordionItem
        icon={Globe}
        title="Astrology (ज्योतिष)"
        subtitle="Astrological details"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-3">
          {astrologyDetails.map((detail, idx) => (
            <CompactDetailItem key={idx} {...detail} />
          ))}
        </div>
      </AccordionItem>

      {/* Lifestyle Accordion */}
      <AccordionItem
        icon={Heart}
        title="Lifestyle (जीवन शैली)"
        subtitle="Health & habits"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-3">
          {lifestyleDetails.map((detail, idx) => (
            <CompactDetailItem key={idx} {...detail} />
          ))}
        </div>
      </AccordionItem>

      {/* About Section Accordion */}
      {user.about && (
        <AccordionItem
          icon={Globe}
          title="About Me (मेरे बारे में)"
          subtitle="Personal description"
        >
          <div className="px-3 pb-2">
            <p className="text-sm text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded-lg">{user.about}</p>
          </div>
        </AccordionItem>
      )}

      <SubscriptionModal isOpen={isSubscriptionOpen} onClose={() => setIsSubscriptionOpen(false)} />
    </div>
  );
};

export default BasicInformationModal;

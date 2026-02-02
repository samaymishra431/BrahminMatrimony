import { User } from "@/types/user";
import { GraduationCap, Briefcase, BookOpen, MapPin, DollarSign, Building2, Globe, ChevronDown } from "lucide-react";
import { useState } from "react";

interface EducationOccupationModalProps {
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

const EducationOccupationModal = ({ user }: EducationOccupationModalProps) => {
  const educationDetails = [
    { icon: BookOpen, label: "Highest Education (उच्चतम शिक्षा)", value: user.highestEducation },
    ...(user.additionalDegree ? [{ icon: BookOpen, label: "Additional Degree (अतिरिक्त डिग्री)", value: user.additionalDegree }] : []),
    ...(user.collegeInstitution ? [{ icon: Building2, label: "College/Institution (कॉलेज / संस्थान)", value: user.collegeInstitution }] : []),
  ];

  const occupationDetails = [
    { icon: Building2, label: "Employed In (कार्यरत)", value: user.employedIn },
    { icon: Briefcase, label: "Occupation (व्यवसाय)", value: user.occupation },
    ...(user.annualIncome ? [{ icon: DollarSign, label: "Annual Income (वार्षिक आय)", value: `${user.incomeCurrency} ${user.annualIncome}` }] : []),
    ...(user.workCity ? [{ icon: MapPin, label: "Work Location (कार्य स्थान)", value: `${user.workCity}, ${user.workCountry}` }] : []),
  ];

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Education Accordion */}
      <AccordionItem
        icon={GraduationCap}
        title="Education Details (शिक्षा विवरण)"
        subtitle="Academic background"
        defaultOpen={true}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-3">
          {educationDetails.map((detail, idx) => (
            <CompactDetailItem key={idx} {...detail} />
          ))}
          {user.educationInDetail && (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 mt-2 pt-3 border-t border-primary/10">
              <div className="flex gap-2 mb-2">
                <div className="p-1.5 rounded-md bg-primary/10 flex-shrink-0">
                  <Globe className="w-3.5 h-3.5 text-primary" />
                </div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Details (विवरण)</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed ml-6 bg-muted/20 p-2.5 rounded-lg">{user.educationInDetail}</p>
            </div>
          )}
        </div>
      </AccordionItem>

      {/* Occupation Accordion */}
      <AccordionItem
        icon={Briefcase}
        title="Occupation Details (व्यवसाय विवरण)"
        subtitle="Professional information"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-3">
          {occupationDetails.map((detail, idx) => (
            <CompactDetailItem key={idx} {...detail} />
          ))}
          {user.occupationInDetail && (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 mt-2 pt-3 border-t border-primary/10">
              <div className="flex gap-2 mb-2">
                <div className="p-1.5 rounded-md bg-primary/10 flex-shrink-0">
                  <Globe className="w-3.5 h-3.5 text-primary" />
                </div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Details (विवरण)</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed ml-6 bg-muted/20 p-2.5 rounded-lg">{user.occupationInDetail}</p>
            </div>
          )}
        </div>
      </AccordionItem>
    </div>
  );
};

export default EducationOccupationModal;

import { User } from "@/types/user";
import { MapPin, Globe, ChevronDown } from "lucide-react";
import { useState } from "react";

interface LocationDetailsModalProps {
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

const LocationDetailsModal = ({ user }: LocationDetailsModalProps) => {
  const locationDetails = [
    { icon: MapPin, label: "City (शहर)", value: user.city },
    { icon: MapPin, label: "State (राज्य)", value: user.state },
    { icon: Globe, label: "Country (देश)", value: user.country },
    { icon: MapPin, label: "Postal Code (पिन कोड)", value: user.postalCode },
    { icon: Globe, label: "Citizenship (नागरिकता)", value: user.citizenship },
    { icon: Globe, label: "Residency Status (निवासी स्थिति)", value: user.residencyStatus },
    { icon: MapPin, label: "Living Since Year (इस वर्ष से रह रहे हैं)", value: user.livingSinceYear || "N/A" },
  ];

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Current Location Accordion */}
      <AccordionItem
        icon={MapPin}
        title="Current Location (वर्तमान स्थान)"
        subtitle="Residence details"
        defaultOpen={true}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-3">
          {locationDetails.map((detail, idx) => (
            <CompactDetailItem key={idx} {...detail} />
          ))}
        </div>
      </AccordionItem>

      {/* Full Address Accordion */}
      <AccordionItem
        icon={Globe}
        title="Full Address (पूरा पता)"
        subtitle="Complete address"
      >
        <div className="px-3 pb-2">
          <p className="text-sm text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded-lg">
            {user.city}, {user.state} {user.postalCode}
            <br />
            {user.country}
          </p>
        </div>
      </AccordionItem>
    </div>
  );
};

export default LocationDetailsModal;

import { User } from "@/types/user";
import { Mail, Phone, ChevronDown } from "lucide-react";
import { useState } from "react";

interface ContactDetailsModalProps {
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

const ContactDetailsModal = ({ user }: ContactDetailsModalProps) => {
  const contactDetails = [
    { icon: Mail, label: "Email Address (ईमेल पता)", value: user.email },
    { icon: Phone, label: "Contact Number (संपर्क नंबर)", value: user.contactNumber || "Not provided" },
    ...(user.parentsContactNo ? [{ icon: Phone, label: "Parents Contact Number (माता-पिता का संपर्क नंबर)", value: user.parentsContactNo }] : []),
  ];

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Contact Information Accordion */}
      <AccordionItem
        icon={Phone}
        title="Contact Information (संपर्क जानकारी)"
        subtitle="Email & phone details"
        defaultOpen={true}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-3">
          {contactDetails.map((detail, idx) => (
            <CompactDetailItem key={idx} {...detail} />
          ))}
        </div>
      </AccordionItem>
    </div>
  );
};

export default ContactDetailsModal;

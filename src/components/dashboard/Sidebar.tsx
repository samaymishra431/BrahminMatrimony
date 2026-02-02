import { Home, Users, MessageSquare, User, GraduationCap, Heart, MapPin, Phone, Mail, Image, Settings, Bell, Shield, HelpCircle, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";
import { SubscriptionModal } from "../common/SubscriptionModal";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isMobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

const Sidebar = ({ activeSection, onSectionChange, isMobileOpen, onMobileOpenChange }: SidebarProps) => {
  const navigate = useNavigate();
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  
  const mainMenuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "matches", label: "Matches", icon: Users },
    { id: "interests", label: "Interests", icon: Heart },
    { id: "messages", label: "Messages", icon: MessageSquare },
  ];

  const profileMenuItems = [
    { id: "profile-info", label: "Profile Info", icon: User },
    { id: "basic-info", label: "Basic Information", icon: User },
    { id: "education", label: "Education & Occupation", icon: GraduationCap },
    { id: "family", label: "Family Details", icon: Heart },
    { id: "hobbies", label: "Hobbies & Interests", icon: Heart },
    { id: "partner-preference", label: "Partner Preference", icon: Users },
    { id: "contact", label: "Contact Details", icon: Phone },
    { id: "location", label: "Location", icon: MapPin },
  ];

  const enhanceProfileItems = [
    { id: "photos", label: "Photos", icon: Image },
  ];

  const settingsItems = [
    { id: "subscription", label: "Join the initiative", icon: Crown },
    { id: "account-settings", label: "Account Settings", icon: Settings },
    { id: "communication-settings", label: "Communication", icon: Bell },
    { id: "privacy-settings", label: "Privacy", icon: Shield },
  ];

  const helpItems = [
    { id: "help-center", label: "Help Center", icon: HelpCircle },
    { id: "faqs", label: "FAQs", icon: HelpCircle },
    { id: "success-stories", label: "Success Stories", icon: Heart },
  ];

  const MenuItem = ({ item }: { item: any }) => {
    const Icon = item.icon;
    const isActive = activeSection === item.id;

    const handleClick = () => {
      if (item.id === "subscription") {
        setIsSubscriptionOpen(true);
        onMobileOpenChange?.(false);
        return;
      }
      navigate(`/dashboard?section=${item.id}`);
      onSectionChange(item.id);
      onMobileOpenChange?.(false); // Close mobile menu on item click
    };

    return (
      <button
        onClick={handleClick}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth text-left",
          isActive
            ? "bg-gradient-primary text-primary-foreground shadow-soft"
            : "text-foreground hover:bg-muted"
        )}
      >
        <Icon className="w-5 h-5" />
        <span className="text-sm font-medium">{item.label}</span>
      </button>
    );
  };

  const sidebarContent = (
    <div className="p-4 space-y-6">
      {/* Main Menus */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">
          Main
        </h3>
        <div className="space-y-1">
          {mainMenuItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Profile Sections */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">
          Profile Info
        </h3>
        <div className="space-y-1">
          {profileMenuItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Contact Details */}
      {/* <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">
          Contact Details
        </h3>
        <div className="space-y-1">
          <MenuItem item={{ id: "email", label: "Email", icon: Mail }} />
          <MenuItem item={{ id: "phone", label: "Contact Number", icon: Phone }} />
        </div>
      </div> */}

      {/* Enhance Profile */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">
          Enhance Profile
        </h3>
        <div className="space-y-1">
          {enhanceProfileItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Settings */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">
          Settings
        </h3>
        <div className="space-y-1">
          {settingsItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Help */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">
          Help
        </h3>
        <div className="space-y-1">
          {helpItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border overflow-y-auto shadow-medium">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="w-64 p-0 overflow-y-auto">
          {sidebarContent}
        </SheetContent>
      </Sheet>
      <SubscriptionModal isOpen={isSubscriptionOpen} onClose={() => setIsSubscriptionOpen(false)} />
    </>
  );
};

export default Sidebar;

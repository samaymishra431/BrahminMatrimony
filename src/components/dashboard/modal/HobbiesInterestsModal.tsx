import { User } from "@/types/user";
import { Heart, Music, Trophy, Utensils, ChevronDown } from "lucide-react";
import { useState } from "react";

interface HobbiesInterestsModalProps {
  user: User;
}

const CompactDetailItem = ({ icon: Icon, label, value }: any) => (
  <div className="flex items-start gap-3 py-2 px-3 hover:bg-primary/5 rounded-lg transition-colors group">
    <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors flex-shrink-0 mt-0.5">
      <Icon className="w-3.5 h-3.5 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">{value}</p>
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

const HobbiesInterestsModal = ({ user }: HobbiesInterestsModalProps) => {
  const hobbiesDetails = [
    { icon: Heart, label: "Hobbies (शौक)", value: user.hobbies.join(", ") },
    ...(user.otherHobbies ? [{ icon: Heart, label: "Other Hobbies (अन्य शौक)", value: user.otherHobbies }] : []),
  ];

  const musicDetails = [
    { icon: Music, label: "Favourite Music (पसंदीदा संगीत)", value: user.favouriteMusic.join(", ") },
    ...(user.otherMusic ? [{ icon: Music, label: "Other Music (अन्य संगीत)", value: user.otherMusic }] : []),
  ];

  const sportsDetails = [
    { icon: Trophy, label: "Sports (खेल)", value: user.sports.join(", ") },
    ...(user.otherSports ? [{ icon: Trophy, label: "Other Sports (अन्य खेल)", value: user.otherSports }] : []),
  ];

  const foodDetails = [
    { icon: Utensils, label: "Favourite Food (पसंदीदा भोजन)", value: user.favouriteFood.join(", ") },
    ...(user.otherFood ? [{ icon: Utensils, label: "Other Food (अन्य भोजन)", value: user.otherFood }] : []),
  ];

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Hobbies Accordion */}
      <AccordionItem
        icon={Heart}
        title="Hobbies & Activities (शौक और गतिविधियां)"
        subtitle="Personal interests"
        defaultOpen={true}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 px-3">
          {hobbiesDetails.map((detail, idx) => (
            <CompactDetailItem key={idx} {...detail} />
          ))}
        </div>
      </AccordionItem>

      {/* Music Accordion */}
      <AccordionItem
        icon={Music}
        title="Music Preferences (संगीत प्राथमिकताएं)"
        subtitle="Favourite music genres"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 px-3">
          {musicDetails.map((detail, idx) => (
            <CompactDetailItem key={idx} {...detail} />
          ))}
        </div>
      </AccordionItem>

      {/* Sports Accordion */}
      <AccordionItem
        icon={Trophy}
        title="Sports & Fitness (खेल और फिटनेस)"
        subtitle="Athletic interests"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 px-3">
          {sportsDetails.map((detail, idx) => (
            <CompactDetailItem key={idx} {...detail} />
          ))}
        </div>
      </AccordionItem>

      {/* Food Accordion */}
      <AccordionItem
        icon={Utensils}
        title="Food Preferences (भोजन प्राथमिकताएं)"
        subtitle="Favourite cuisines"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 px-3">
          {foodDetails.map((detail, idx) => (
            <CompactDetailItem key={idx} {...detail} />
          ))}
        </div>
      </AccordionItem>
    </div>
  );
};

export default HobbiesInterestsModal;

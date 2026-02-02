import { Heart, MapPin, Briefcase, GraduationCap, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProfileCardProps {
  name: string;
  age: number;
  location: string;
  profession: string;
  education: string;
  imageUrl?: string;
  verified?: boolean;
}

const ProfileCard = ({ 
  name, 
  age, 
  location, 
  profession, 
  education,
  imageUrl,
  verified = false 
}: ProfileCardProps) => {
  return (
    <Card className="overflow-hidden group hover:shadow-[var(--shadow-glow)] transition-[var(--transition-smooth)] bg-[image:var(--gradient-card)]">
      {/* Image Section */}
      <div className="relative h-72 bg-muted overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
            <User className="w-24 h-24 text-muted-foreground/30" />
          </div>
        )}
        
        {verified && (
          <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
            Verified
          </Badge>
        )}
        
        <button className="absolute top-4 left-4 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-[var(--transition-smooth)]">
          <Heart className="w-5 h-5" />
        </button>
      </div>
      
      {/* Content Section */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground">{name}</h3>
          <p className="text-muted-foreground">{age} years</p>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="w-4 h-4 text-primary" />
            <span>{profession}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span>{education}</span>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button className="flex-1 bg-[image:var(--gradient-primary)] hover:opacity-90 transition-opacity">
            View Profile
          </Button>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
            Connect
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;

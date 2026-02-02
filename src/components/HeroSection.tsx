import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-couple.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-[image:var(--gradient-hero)]" />
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Life Partner
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of individuals finding their soulmate. Start your journey to a beautiful future together.
          </p>
          
          {/* Search Bar */}
          <div className="bg-card p-6 rounded-2xl shadow-[var(--shadow-soft)] max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input 
                  placeholder="Search by ID, name, or profession..." 
                  className="h-12 border-border"
                />
              </div>
              <Button className="h-12 px-8 bg-[image:var(--gradient-primary)] hover:opacity-90 transition-opacity">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              <button className="px-4 py-1.5 text-sm rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
                Age 25-30
              </button>
              <button className="px-4 py-1.5 text-sm rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
                Professional
              </button>
              <button className="px-4 py-1.5 text-sm rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
                Same City
              </button>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-[image:var(--gradient-primary)] hover:opacity-90 transition-opacity">
              Register Free
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary/5">
              Browse Profiles
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

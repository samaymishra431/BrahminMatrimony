import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import FAQSection from "@/components/FAQSection";

import { Button } from "@/components/ui/button";
import { Heart, Play, Quote } from "lucide-react";
import { Newsletter } from "@/components/Newsletter";

const featuredStory = {
  couple: "Raj & Priya",
  image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=500&fit=crop",
  location: "Mumbai, India",
  marriedDate: "December 2023",
  story: "Through BOI Matrimony, we met in a safe, value-driven environment. After family discussions and heartfelt conversations, we realized our paths were meant to join. Our families are overjoyed, and we are grateful to this seva-driven platform that made this sacred connection possible."
};

const stories = [
  { couple: "Amit & Sneha", location: "Delhi", image: "https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=400&h=300&fit=crop", quote: "BOI Matrimony guided us to our soulmate in a secure, dharmic manner. Forever thankful!" },
  { couple: "Vikram & Deepa", location: "Bangalore", image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop", quote: "Our families connected safely through this platform. A truly sacred matchmaking experience!" },
  { couple: "Arjun & Kavitha", location: "Chennai", image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&h=300&fit=crop", quote: "In just weeks, we met in a respectful and values-driven environment. Amazing journey!" },
  { couple: "Suresh & Meera", location: "Hyderabad", image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=300&fit=crop", quote: "The verified, community-focused profiles gave us confidence. Grateful to BOI Matrimony!" },
  { couple: "Rahul & Anjali", location: "Pune", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop", quote: "Shared values and family support made our match perfect. Truly a sacred connection!" },
  { couple: "Karthik & Lakshmi", location: "Kolkata", image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&h=300&fit=crop", quote: "BOI Matrimony's thoughtful approach worked beautifully. We are living proof!" },
];

const videoTestimonials = [
  { couple: "Rohan & Nisha", thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop" },
  { couple: "Aakash & Pooja", thumbnail: "https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=400&h=300&fit=crop" },
  { couple: "Nikhil & Swati", thumbnail: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop" },
];

const SuccessStories = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageBanner
  title="Success Stories"
  subtitle="Sacred unions formed through shared values, tradition, and mutual respect"
  backgroundImage="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=600&fit=crop"
 />

      
      {/* Featured Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-2xl border border-border overflow-hidden max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2">
              <img src={featuredStory.image} alt={featuredStory.couple} className="w-full h-80 lg:h-full object-cover" />
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-primary mb-4">
                  <Heart className="w-5 h-5 fill-current" />
                  <span className="text-sm font-medium">Featured Story</span>
                </div>
                <h2 className="text-3xl font-bold mb-2">{featuredStory.couple}</h2>
                <p className="text-muted-foreground mb-4">{featuredStory.location} • Married {featuredStory.marriedDate}</p>
                <Quote className="w-8 h-8 text-primary/30 mb-2" />
                <p className="text-muted-foreground italic">{featuredStory.story}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stories Grid */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            More <span className="text-primary">Blessed Couples</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {stories.map((story, index) => (
              <div key={index} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
                <img src={story.image} alt={story.couple} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4 text-primary fill-current" />
                    <span className="font-semibold">{story.couple}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-2">{story.location}</p>
                  <p className="text-sm italic">"{story.quote}"</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">Load More Stories</Button>
          </div>
        </div>
      </section>
      
      {/* Video Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Video <span className="text-primary">Testimonials</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {videoTestimonials.map((video, index) => (
              <div key={index} className="relative rounded-xl overflow-hidden group cursor-pointer">
                <img src={video.thumbnail} alt={video.couple} className="w-full aspect-video object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
                    <Play className="w-6 h-6 text-primary-foreground fill-current" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white font-medium">{video.couple}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Share Your Story */}
      <section className="py-16 bg-[image:var(--gradient-primary)] text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Heart className="w-16 h-16 mx-auto mb-6 fill-current opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Share Your Brahmin Love Story</h2>
          <p className="max-w-2xl mx-auto mb-8 opacity-90">
            Found your life partner through BOI Matrimony? Inspire other Brahmin families by sharing your sacred journey of love and values-based connection.
          </p>
          <Button size="lg" variant="secondary">
            Submit Your Story
          </Button>
        </div>
      </section>
      
      <FAQSection />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default SuccessStories;

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Quote } from "lucide-react";

const SuccessStories = () => {
  const stories = [
    {
      names: "Raj & Priya",
      location: "Mumbai, India",
      date: "Married on December 15, 2024",
      story:
        "Our connection began through a carefully verified, values-driven platform created purely for the Brahmin community. With family guidance, mutual respect, and shared cultural understanding, our journey naturally led to marriage. We are grateful to this seva-based initiative for protecting and nurturing genuine connections.",
    },
    {
      names: "Aditya & Sneha",
      location: "Bangalore, India",
      date: "Married on November 20, 2024",
      story:
        "What stood out for us was the sincerity of the platform. Profiles were authentic, intentions were clear, and families were equally involved. This was not matchmaking for numbers, but for lifelong responsibility. We found trust, values, and a meaningful bond here.",
    },
    {
      names: "Vikram & Anjali",
      location: "Delhi, India",
      date: "Married on October 5, 2024",
      story:
        "After a long search, we finally felt secure and respected on this platform. The focus on culture, family values, and verified connections made every interaction comfortable. Our families felt confident, and our relationship grew with clarity and purpose.",
    },
    {
      names: "Arjun & Divya",
      location: "Hyderabad, India",
      date: "Married on September 12, 2024",
      story:
        "We were initially hesitant about online matchmaking, but this platform felt different from the very beginning. Its disciplined verification process and community-first approach created trust. We met with confidence, family support, and shared values.",
    },
    {
      names: "Karthik & Meera",
      location: "Chennai, India",
      date: "Married on August 28, 2024",
      story:
        "Finding someone who respected tradition, family, and long-term commitment felt rare. This platform made it possible by bringing together individuals with aligned values. Our marriage stands on mutual respect and cultural understanding.",
    },
    {
      names: "Rohit & Kavya",
      location: "Pune, India",
      date: "Married on July 15, 2024",
      story:
        "Despite being from different cities, our connection felt natural and safe. Conversations were thoughtful, families were involved early, and intentions were transparent. This initiative truly protects the sanctity of marriage.",
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Card */}
      <Card className="border-0 shadow-medium">
        <CardHeader className="pb-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary-foreground fill-current" />
            </div>
            <CardTitle className="text-2xl md:text-3xl">
              Sacred Union Stories
            </CardTitle>
            <p className="text-muted-foreground mt-1">
              Real Brahmin families united through a values-driven, community-led initiative
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stories.map((story, idx) => (
          <Card
            key={idx}
            className="border-0 shadow-medium hover:shadow-large transition-smooth"
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-primary">
                  <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                    {story.names[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-xl">{story.names}</CardTitle>
                  <CardDescription>{story.location}</CardDescription>
                  <p className="text-xs text-primary font-medium mt-1">
                    {story.date}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
                <p className="text-muted-foreground leading-relaxed pl-6">
                  {story.story}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call To Action */}
      <Card className="border-0 shadow-medium bg-gradient-primary text-primary-foreground">
        <CardContent className="py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Your Sacred Journey Begins Here
          </h2>
          <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
            This platform exists to serve, protect, and unite Brahmin families
            through respectful, verified, and value-aligned matchmaking.
            Your story of lifelong partnership can begin with trust and dignity.
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => (window.location.href = "/dashboard?section=matches")}
          >
            Begin Your Journey
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessStories;

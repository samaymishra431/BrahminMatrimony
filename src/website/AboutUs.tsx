import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import FAQSection from "@/components/FAQSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import team1 from "@/images/team/Pt. Sukhbir Sharma.jpg";
import team2 from "@/images/team/Pt. Ramesh Kitchloo.jpg";
import team3 from "@/images/team/Dr. Ravi Dutt Gaur.jpg";

import { Shield, Heart, Users, Award, CheckCircle } from "lucide-react";
import { MilestoneTimeline } from "@/components/MilestoneTimeline";
import { Newsletter } from "@/components/Newsletter";

const leaders = [
  { name: "Leader 1", role: "Designation", image: team1},
  { name: "Leader 2", role: "Designation", image: team2},
  { name: "Leader 3", role: "Designation", image: team3},
];
const differentiators = [
  {
    icon: Users,
    title: "For the Brahmin Community",
    description:
      "This platform is created only for Brahmin families to help them find suitable, like-minded life partners who respect culture, traditions, and family values."
  },
  {
    icon: Shield,
    title: "Safe & Trust-Based Platform",
    description:
      "Profiles may be checked to maintain trust within the community. We encourage families and users to interact carefully and make informed decisions."
  },
  {
    icon: Award,
    title: "Rooted in Culture & Traditions",
    description:
      "Our aim is not just to find matches, but to protect Sanatan values, Vedic traditions, and the sacred meaning of marriage."
  },
  {
    icon: CheckCircle,
    title: "Support from Community Volunteers",
    description:
      "The platform is supported by volunteers who guide families with honesty, care, and a sense of social responsibility."
  }
];


// const achievements = [
//   { number: "3,50,000+", label: "Registered Brahmin Profiles" },
//   { number: "95,000+", label: "Successful Matches" },
//   { number: "28+", label: "States Covered" },
//   { number: "99%", label: "Trust & Satisfaction" },
// ];
const achievements = [
  { number: "100%", label: "Dedicated to Brahmin Profiles" },
  { number: "New", label: "Growing Community Trust" },
  { number: "Core", label: "Respect for Traditions & Values" },
  { number: "India", label: "Open to Brahmin Families Nationwide" },
];


const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageBanner
  title="About Brahmin Matrimony"
  subtitle="A selfless social initiative preserving Sanatan values, cultural harmony, and sacred marital traditions within the Brahmin community"
  backgroundImage="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1920&h=600&fit=crop"
/>


      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                About <span className="text-primary">Us</span>
              </h2>

              <p className="text-muted-foreground mb-4 text-justify">
                Brahmin Matrimony is a selfless social initiative dedicated to the Brahmin community, with the objective of preserving and promoting Sanatan culture, classical traditions, and strong family values. This platform is founded on the belief that cultural awareness and ethical conduct form the foundation of a stable and balanced married life.
              </p>

              <p className="text-muted-foreground mb-4 text-justify">
                In today’s rapidly changing social landscape, many families and young individuals find it difficult to identify a life partner who respects traditions while adapting to modern life. Understanding this need, Brahmin Matrimony offers a trustworthy, dignified, and well-organized platform where cultural and spiritual harmony is given equal importance alongside personal preferences.
              </p>

              <p className="text-muted-foreground text-justify">
                For us, marriage is not merely a union of two individuals, but a sacred bond that connects families, values, and generations. Driven not by commercial motives but by a sense of social responsibility, this service strives to strengthen mutual trust, harmony, and relationships within the Brahmin community, ensuring that our rich traditions and values continue to flow with dignity to future generations.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop" alt="Our team" className="rounded-xl w-full h-48 object-cover" />
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop" alt="Office" className="rounded-xl w-full h-48 object-cover mt-8" />
              <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&h=300&fit=crop" alt="Meeting" className="rounded-xl w-full h-48 object-cover" />
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop" alt="Collaboration" className="rounded-xl w-full h-48 object-cover mt-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
<section className="py-16 bg-background">
  <div className="container mx-auto px-4">
    <div className="grid md:grid-cols-3 gap-8">
      
      <div className="text-center p-6 border border-border rounded-xl hover:shadow-lg transition-shadow">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <Heart className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-semibold text-lg mb-2">Sacred Matrimonial Bond</h3>
        <p className="text-muted-foreground text-sm">
          We believe marriage is a sacred union of individuals, families, and generations, rooted in Sanatan culture, moral values, and spiritual harmony.
        </p>
      </div>

      <div className="text-center p-6 border border-border rounded-xl hover:shadow-lg transition-shadow">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-semibold text-lg mb-2">Trust, Dignity & Privacy</h3>
        <p className="text-muted-foreground text-sm">
          We provide a respectful and reliable platform where privacy, authenticity, and ethical conduct are upheld to foster confidence among families and individuals.
        </p>
      </div>

      <div className="text-center p-6 border border-border rounded-xl hover:shadow-lg transition-shadow">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <Users className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-semibold text-lg mb-2">Social & Non-Commercial Initiative</h3>
        <p className="text-muted-foreground text-sm">
          This platform is driven by social responsibility, not profit, with the sole purpose of strengthening trust, unity, and cultural continuity within the Brahmin community.
        </p>
      </div>

    </div>
  </div>
</section>


      {/* What Makes Us Different */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What Makes Us <span className="text-primary">Unique</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {differentiators.map((item, index) => (
              <div key={index} className="bg-card p-6 rounded-xl border border-border text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
          
        </div>
      </section>

      {/* History Timeline */}
      <MilestoneTimeline />

      {/* Achievements */}
      <section className="py-16 bg-[image:var(--gradient-primary)] text-primary-foreground">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{achievement.number}</div>
                <div className="text-sm opacity-90">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our <span className="text-primary">Leadership</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {leaders.map((leader, index) => (
              <div key={index} className="text-center">
                <img 
                  src={leader.image} 
                  alt={leader.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-primary/20"
                />
                <h3 className="font-semibold text-lg">{leader.name}</h3>
                <p className="text-muted-foreground text-sm">{leader.role}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/team">View More</Link>
            </Button>
          </div>
        </div>
      </section>

      <FAQSection />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default AboutUs;

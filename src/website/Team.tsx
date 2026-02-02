import { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import FAQSection from "@/components/FAQSection";
import { Newsletter } from "@/components/Newsletter";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Instagram, X } from "lucide-react";

// Team Images
import team1 from "@/images/team/Pt. Sukhbir Sharma.jpg";
import team2 from "@/images/team/Pt. Ramesh Kitchloo.jpg";
import team3 from "@/images/team/Dr. Ravi Dutt Gaur.jpg";
import team4 from "@/images/team/Dr Kuldeep Sharma.jpg";
import team5 from "@/images/team/Goswami S.K. Puri.jpg";

// Team Data
const teamMembers = [
  {
    name: "Pt. Sukhbir Sharma",
    designation: "Founder",
    image: team1,
    social: { facebook: "#", twitter: "#", linkedin: "#", instagram: "#" },
  },
  {
    name: "Pt. Ramesh Kitchloo",
    designation: "President",
    image: team2,
    social: { facebook: "#", twitter: "#", linkedin: "#", instagram: "#" },
  },
  {
    name: "Dr. Ravi Dutt Gaur",
    designation: "General Secretary",
    image: team3,
    social: { facebook: "#", twitter: "#", linkedin: "#", instagram: "#" },
  },
  {
    name: "Dr Kuldeep Sharma",
    designation: "General Secretary",
    image: team4,
    social: { facebook: "#", twitter: "#", linkedin: "#", instagram: "#" },
  },
  {
    name: "Goswami S.K. Puri",
    designation: "Treasurer",
    image: team5,
    social: { facebook: "#", twitter: "#", linkedin: "#", instagram: "#" },
  },
];

// Community Gallery Images
const communityImages = [
  "https://boindia.org/images/gallery/1.jpg",
  "https://boindia.org/images/gallery/2.jpg",
  "https://boindia.org/images/gallery/3.jpg",
  "https://boindia.org/images/gallery/4.jpg",
  "https://boindia.org/images/gallery/5.jpg",
  "https://boindia.org/images/gallery/6.jpg",
  "https://boindia.org/images/gallery/7.jpg",
  "https://boindia.org/images/gallery/8.jpg",
  "https://boindia.org/images/gallery/9.jpg",
  "https://boindia.org/images/gallery/10.jpg",
  "https://boindia.org/images/gallery/11.jpg",
  "https://boindia.org/images/gallery/13.jpg",
  
];

const Team = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageBanner
        title="Our Team"
        subtitle="Dedicated individuals united by integrity, commitment, and Brahmin cultural values"
        backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=600&fit=crop"
      />

      {/* Team Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-saffron font-semibold text-sm uppercase tracking-wider">
              Leadership
            </span>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet the <span className="text-primary">Dedicated Team</span>
            </h2>

            <p className="text-muted-foreground max-w-2xl mx-auto">
              A group of committed community members, united by a shared mission
              to preserve Sanatan culture, uphold family values, and support
              meaningful, tradition-based alliances. Each member works with
              integrity, compassion, and cultural pride to ensure a safe and
              respectful matchmaking experience for every Brahmin family.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="group relative">
                <div className="relative overflow-hidden rounded-xl bg-cream">
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Social Icons */}
                    <div className="absolute top-0 left-0 h-full flex flex-col justify-center gap-2 px-3">
                      {[
                        { icon: Facebook, link: member.social.facebook },
                        { icon: Twitter, link: member.social.twitter },
                        { icon: Linkedin, link: member.social.linkedin },
                        { icon: Instagram, link: member.social.instagram },
                      ].map((social, idx) => (
                        <a
                          key={idx}
                          href={social.link}
                          className="w-10 h-10 rounded-full bg-saffron flex items-center justify-center text-primary-foreground hover:bg-navy transition-all duration-300 transform -translate-x-16 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                          style={{ transitionDelay: `${idx * 75}ms` }}
                        >
                          <social.icon className="w-5 h-5" />
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-lg">
                      {member.name}
                    </h3>
                    <p className="text-saffron text-sm font-medium">
                      {member.designation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Gallery Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How Our <span className="text-primary">Community</span> Makes a Difference
          </h2>

          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">
            Images that reflect the collective journey of Brahmin community
            members dedicated to preserving Sanatan culture, honoring classical
            traditions, and nurturing meaningful alliances rooted in shared
            values and cultural harmony.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {communityImages.map((image, index) => (
              <div
                key={index}
                className="aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`Community moment ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/gallery">View More</Link>
            </Button>
          </div>

        </div>
      </section>

      
      {/* Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 border-0 bg-transparent">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Gallery"
              className="w-full rounded-xl"
            />
          )}
        </DialogContent>
      </Dialog>

      <FAQSection />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Team;

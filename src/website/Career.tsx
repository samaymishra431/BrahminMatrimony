import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import FAQSection from "@/components/FAQSection";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  MapPin,
  Clock,
  Briefcase,
  Users,
  Heart,
  Rocket,
  Coffee,
  Gift,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Newsletter } from "@/components/Newsletter";

/*
  Career.jsx — Rewritten in a strong traditional cultural tone (Seva-first)
  Mixed page: some paid technical roles + many volunteer / seva roles.
  Corporate-style perks removed and replaced with spiritual / cultural offerings.
*/

const culturalBenefits = [
  {
    icon: Heart,
    title: "Preserving Sanatan Culture",
    description:
      "Join a selfless initiative dedicated to promoting classical traditions and strong family values within the community.",
  },
  {
    icon: Rocket,
    title: "Social Responsibility",
    description:
      "Be part of a platform driven not by commercial motives, but by a deep sense of duty to strengthen community bonds.",
  },
  {
    icon: Coffee,
    title: "Ethical Conduct",
    description:
      "Work in an environment where cultural awareness and ethical behavior form the foundation of every action.",
  },
  {
    icon: Gift,
    title: "Dignified Service",
    description:
      "Help ensure that our rich traditions and values continue to flow with dignity to future generations.",
  },
];

/* Example openings: mixed (technical paid roles + volunteer seva roles) */
const openings = [
];

const lifeImages = [
  "/placeholder.svg",
  "/placeholder.svg",
  "/placeholder.svg",
  "/placeholder.svg",
  "/placeholder.svg",
  "/placeholder.svg",
];

const testimonials = [
  {
    name: "Rahul Verma",
    role: "Senior Developer",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfXGsgZ-eg2R33OiL9JjAVQ7EicmcQzP_BSWitif69qw&s",
    quote:
      "Contributing to a platform that views marriage as a sacred bond connecting generations is a privilege.",
  },
  {
    name: "Deepa Krishnan",
    role: "Volunteer — Women's Wing",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOGwfUocgt06bolZVFKcwKotR052n6afrPkg&s",
    quote:
      "Our objective is selfless service. Helping families find harmony and trust is the ultimate reward.",
  },
  {
    name: "Amit Patel",
    role: "Product Lead",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfXGsgZ-eg2R33OiL9JjAVQ7EicmcQzP_BSWitif69qw&s",
    quote:
      "We build technology not for commerce, but to ensure our rich traditions flow with dignity to future generations.",
  },
  {
    name: "Sneha Reddy",
    role: "Volunteer — Verification",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOGwfUocgt06bolZVFKcwKotR052n6afrPkg&s",
    quote:
      "Verifying profiles is about maintaining the ethical conduct that forms the foundation of a stable married life.",
  },
  {
    name: "Vikram Singh",
    role: "Data Scientist",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfXGsgZ-eg2R33OiL9JjAVQ7EicmcQzP_BSWitif69qw&s",
    quote:
      "Adapting to modern life while respecting traditions—that's the balance we strive to support every day.",
  },
  {
    name: "Priya Sharma",
    role: "HR — Volunteer Liaison",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOGwfUocgt06bolZVFKcwKotR052n6afrPkg&s",
    quote:
      "Driven by social responsibility, we work to strengthen mutual trust within the Brahmin community.",
  },
];

const Career = () => {
  // testimonials pager
  const [currentTestimonialPage, setCurrentTestimonialPage] = useState(0);
  const testimonialsPerPage = 3;
  const totalTestimonialPages = Math.ceil(testimonials.length / testimonialsPerPage);
  const paginatedTestimonials = testimonials.slice(
    currentTestimonialPage * testimonialsPerPage,
    (currentTestimonialPage + 1) * testimonialsPerPage
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageBanner
  title="Join Our Mission"
  subtitle="Be a part of a selfless effort to uphold Sanatan values, sacred traditions, and strong family bonds"
  backgroundImage="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&h=600&fit=crop"
 />


      {/* Why Join */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            A Selfless <span className="text-primary">Social Initiative</span>
          </h2>
          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-12">
            Brahmin Matrimony is dedicated to the Brahmin community with the objective of preserving and promoting Sanatan culture, classical traditions, and strong family values.
            This platform is founded on the belief that cultural awareness and ethical conduct form the foundation of a stable and balanced married life.
            <br /><br />
            In today’s rapidly changing social landscape, many families find it difficult to identify a life partner who respects traditions while adapting to modern life.
            Understanding this need, we offer a trustworthy, dignified, and well-organized platform where cultural and spiritual harmony is given equal importance alongside personal preferences.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {culturalBenefits.map((b, i) => (
              <div
                key={i}
                className="bg-card rounded-xl border border-border p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <b.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{b.title}</h3>
                <p className="text-muted-foreground text-sm">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
  Opportunities to <span className="text-primary">Uphold Religion</span>
</h2>


          {openings.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {openings.map((job, idx) => (
                <div
                  key={idx}
                  className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow flex flex-col"
                >
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {job.experience}
                      </span>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4">{job.description}</p>
                  </div>

                  <div className="mt-4">
                    {job.type.toLowerCase().includes("volunteer") ? (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.alert("Thank you for your interest. Please contact your local Samaj coordinator.")}
                      >
                        Volunteer for Seva
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => window.alert("Redirecting to application form...")}
                      >
                        Apply Now
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center max-w-md mx-auto bg-card border border-border rounded-xl p-8">
              <h3 className="text-xl font-semibold mb-2">No Openings Right Now</h3>
              <p className="text-muted-foreground">
                We are driven by a sense of social responsibility. While there are no current openings, we welcome those who wish to strengthen mutual trust and relationships within the community to connect with us.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Life at MatHub (Seva Life) */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            A Culture of <span className="text-primary">Trust & Harmony</span>
          </h2>
          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-10">
            Our work environment is rooted in the principles of Dharma and Seva. We function not just as colleagues, but as a family united by a shared mission. Every day, we collaborate with humility and integrity, supporting one another to ensure that we serve the community with the highest standards of respect and cultural responsibility.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {lifeImages.map((img, i) => (
              <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden">
                <img
                  src={img}
                  alt={`Life at MatHub ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Testimonials (Seva Voices) */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Voices of <span className="text-primary">Dedication</span>
          </h2>

          <div className="relative max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {paginatedTestimonials.map((t, i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-6">
                  <p className="text-muted-foreground italic mb-6">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-muted-foreground text-sm">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalTestimonialPages > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 rounded-full"
                  onClick={() =>
                    setCurrentTestimonialPage((p) => (p === 0 ? totalTestimonialPages - 1 : p - 1))
                  }
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 rounded-full"
                  onClick={() =>
                    setCurrentTestimonialPage((p) => (p === totalTestimonialPages - 1 ? 0 : p + 1))
                  }
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Internship / Youth Seva Program */}
      {/* <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Youth <span className="text-primary">Leadership in Seva</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Encouraging young individuals to identify with their roots and respect traditions while adapting to modern life. Join us to carry our rich values forward with dignity.
          </p>
          <Button
            size="lg"
            onClick={() => window.alert("Thank you for your interest. Please share your details on the Volunteer form.")}
          >
            Apply for Youth Seva
          </Button>
        </div>
      </section> */}

      <FAQSection />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Career;

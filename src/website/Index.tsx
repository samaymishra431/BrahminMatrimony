import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FooterGallery from "@/components/FooterGallery";
import { SubscriptionSection } from "@/components/SubscriptionSection"; 
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Play, Star, ChevronLeft, ChevronRight, Shield, Heart, Users, Check, CheckCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import StatsSection from "@/components/StatsSection";
import HeroImage2 from "@/images/hero-2.png";
import HeroImage7 from "@/images/hero-7.png";
import HeroImage6 from "@/images/hero-6.png";
import HeroImage5 from "@/images/hero-5.png";
import matchPeopleImage1 from "@/images/team-member-5.jpg";
import matchPeopleImage2 from "@/images/team-member-2.jpg";
import matchPeopleImage3 from "@/images/team-member-3.jpg";
import proudMem1 from "@/images/proud-mem1.png";
import proudMem2 from "@/images/proud-mem2.png";
import proudMem3 from "@/images/proud-mem3.png";
import proudMem4 from "@/images/proud-mem4.png";
import proudMem5 from "@/images/proud-mem5.png";
import proudMem6 from "@/images/proud-mem6.png";
import proudMem7 from "@/images/proud-mem7.png";
import proudMem8 from "@/images/proud-mem8.png";


import { m } from "framer-motion";

const Index = () => {
  const [currentStory, setCurrentStory] = useState(0);

  // ⭐ Strong Brahmin Community Identity
  const popularMatches = [
    { name: "Rahul Sharma", age: 26, profession: "Software Engineer", location: "Delhi", image: matchPeopleImage1 },
    { name: "Priya Dixit", age: 27, profession: "Doctor", location: "Mumbai", image: matchPeopleImage2 },
    { name: "Ankit Mishra", age: 30, profession: "Business Analyst", location: "Bangalore", image: matchPeopleImage3 },
  ];

  // ⭐ Updated with protective tone
  // const whyChooseUs = [
  //   {
  //     icon: Users,
  //     title: "A Platform of Purpose",
  //     description:
  //       "Driven by service, values, and responsibility, we work to safeguard the culture, heritage, and future of the Brahmin community."
  //   },
  //   {
  //     icon: Shield,
  //     title: "Preserving Our Roots",
  //     description:
  //       " For generations, our elders upheld our traditions and values. We continue this responsibility today by thoughtfully using modern technology to support cultural continuity."
  //   },
  //   {
  //     icon: Star,
  //     title: "Cultural Continuity Through Seva",
  //     description:
  //       "This platform helps Brahmin families find value-based marriages within the community, preserving traditions, and Dharma while guiding the next generation responsibly."
  //   },
  //   {
  //     icon: Heart,
  //     title: "Guidance for Families",
  //     description:
  //       "We assist families through every step—matching, communication, and decision-making—so that choosing a Brahmin life partner becomes easier and stress-free."
  //   },
  // ];

  const whyChooseUs = [
  {
    icon: Users,
    title: "A Purposeful Platform",
    description:
      "Established as a selfless initiative for the Brahmin community, we aim to protect and promote our cultural heritage, traditions, and family values."
  },
  {
    icon: Shield,
    title: "Preserving Our Heritage",
    description:
      "For generations, our families have upheld the principles and traditions of the Brahmin community. We continue this legacy by providing a respectful platform that honors cultural continuity."
  },
  {
    icon: Star,
    title: "Supporting Value-Based Marriages",
    description:
      "The platform enables Brahmin families to find partners who align with shared values, traditions, and ethics, ensuring that cultural and spiritual heritage is carried forward."
  },
  {
    icon: Heart,
    title: "Strengthening Community Bonds",
    description:
      "By creating meaningful connections within the community, we help families maintain cultural alignment and uphold the pride and integrity of Brahmin traditions."
  },  
];


  const stats = [
    { value: "10K+", label: "COMMUNITY MARRIAGES" },
    { value: "5K+", label: "ACTIVE BRAHMIN MEMBERS" },
    { value: "20K+", label: "VERIFIED FAMILY PROFILES" },
    { value: "100+", label: "SUCCESSFUL MATCHES EVERY MONTH" },
  ];

  const memberPhotos = [
    proudMem1,
    proudMem2,
    proudMem3,
    proudMem4,
    proudMem5,
    proudMem6,
    proudMem7,
    proudMem8,
  ];

  // ⭐ Stories rewritten for emotional impact
 const successStories = [
  {
    names: "Meera & Amit",
    rating: 4,
    text: "Our families wanted a trusted platform where our daughter could meet partners who honor Brahmin traditions. This initiative gave us confidence, culture, and the perfect match."
  },
  {
    names: "Rohan & Kavya",
    rating: 5,
    text: "We were concerned about the younger generation drifting away from community values. This platform helped us find a life partner within the Brahmin samaj."
  },
  {
    names: "Nitin & Shreya",
    rating: 5,
    text: "Through this platform, we found a partner who shares our rituals, upbringing, and dharmic lifestyle—a true blessing for our families."
  },
  {
    names: "Priya & Sameer",
    rating: 5,
    text: "Our daughter is now happily married to a Brahmin boy who respects traditions, family values, and cultural heritage, thanks to this community initiative."
  },
  {
    names: "Aditi & Vikram",
    rating: 4,
    text: "This initiative protects our lineage and culture. We found a wonderful match for our son who truly understands and honors our heritage."
  },
  {
    names: "Anjali & Deepak",
    rating: 5,
    text: "A platform with purpose, not business. We connected through this initiative and now share a life built on love, values, and shared Brahmin traditions."
  },
  {
    names: "Sanjay & Ritu",
    rating: 5,
    text: "Finding a culturally aligned partner was our priority. This platform enabled it in a respectful, secure, and heritage-focused way."
  },
  {
    names: "Mahesh & Geeta",
    rating: 4,
    text: "This platform brought our families together, emphasizing tradition, dharma, and values. We are grateful for this community effort."
  },
  {
    names: "Arun & Sunita",
    rating: 5,
    text: "A truly dharmic experience. The focus on family values, cultural roots, and traditions made it possible for us to find our perfect match."
  },
];


  // ⭐ Hero slides rewritten with protective tone
  const heroSlides = [
  {
    title: (
      <>
        <span className="text-primary">Preserve</span> Our<br />Cultural Heritage
      </>
    ),
    description: "A dedicated initiative to help Brahmin families find matches within our community, safeguarding our traditions, values, and spiritual continuity for future generations.",
    image: HeroImage2,
  },


   {
    title: (
      <>
        <span className="text-primary">Community Mission</span><br />Not For Profit
      </>
    ),
    description: "This is a social initiative, not a business. Designed to strengthen our cultural fabric by connecting families who share the same values and traditions.",
    image: HeroImage7,
  },


{
  title: (
    <>
      <span className="text-primary">Exclusive</span> Brahmin Community<br />Profiles Only
    </>
  ),
  description: "This platform is dedicated to Brahmin families. While we do not directly verify profiles, we encourage families to ensure authenticity and alignment of values within the community.",
  image: HeroImage6,
} 


,
{
    title: (
      <>
        <span className="text-primary">Service</span> Not Business<br />Lifetime Access
      </>
    ),
    description: "A single contribution supports lifelong access. This is a community-driven effort to guide our youth toward partners who share our cultural foundation.",
    image: HeroImage5,
  },
  ];

  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [currentStoryPage, setCurrentStoryPage] = useState(0);

  const nextHeroSlide = useCallback(() => {
    setCurrentHeroSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  }, [heroSlides.length]);

  const prevHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const slideInterval = setInterval(() => {
      nextHeroSlide();
    }, 3000);

    return () => clearInterval(slideInterval);
  }, [nextHeroSlide]);

  const [storiesPerPage, setStoriesPerPage] = useState(3);

  useEffect(() => {
    const updateStoriesPerPage = () => {
      setStoriesPerPage(window.innerWidth < 768 ? 1 : 3);
    };
    updateStoriesPerPage();
    window.addEventListener("resize", updateStoriesPerPage);
    return () => window.removeEventListener("resize", updateStoriesPerPage);
  }, []);
  const totalStoryPages = Math.ceil(successStories.length / storiesPerPage);
  const paginatedStories = successStories.slice(
    currentStoryPage * storiesPerPage,
    (currentStoryPage + 1) * storiesPerPage
  );

  const nextStoryPage = () => {
    setCurrentStoryPage((prev) => (prev === totalStoryPages - 1 ? 0 : prev + 1));
  };

  const prevStoryPage = () => {
    setCurrentStoryPage((prev) => (prev === 0 ? totalStoryPages - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden pt-16">
      <Navbar />

      {/* HERO SECTION */}
      <section
        className="relative h-[600px] bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${heroSlides[currentHeroSlide].image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20" />
        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
          <div className="max-w-xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {heroSlides[currentHeroSlide].title}
            </h1>
            <p className="text-white/80 mb-8 text-lg">
              {heroSlides[currentHeroSlide].description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link to="/signup">Join the Initiative</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent text-white border-white hover:bg-white hover:text-foreground"
                asChild
              >
                <Link to="/about">Why This Seva Matters</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              onClick={prevHeroSlide}
              className="w-12 h-12 rounded-full border border-white/30 text-white flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
            >
              <ChevronLeft />
            </div>
            <div
              onClick={nextHeroSlide}
              className="w-12 h-12 rounded-full border border-white/30 text-white flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
            >
              <ChevronRight />
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        Why Choose <span className="text-primary">Brahmin Matrimony?</span>
    </h2>
    <p className="text-muted-foreground max-w-3xl mx-auto">
       Brahmin Matrimony is a selfless social initiative created to preserve Sanatan culture, traditional values, and the rich heritage of the Brahmin community. We offer a trusted platform where individuals and families can find culturally aligned matches who respect and honor our traditions, ensuring our values are carried forward with pride to the next generation.
    </p>
</div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-2xl shadow-sm border border-border hover:shadow-lg transition-all duration-300 text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[image:var(--gradient-primary)] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <item.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StatsSection />

      {/* POPULAR MATCHES */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center mb-12">
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Brahmin Profiles</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Suggested <span className="text-primary">Matches</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Browse profiles of genuine Brahmin members who value dharma, culture, and strong family traditions.
          </p>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {popularMatches.map((match, index) => (
              <div key={index} className="group cursor-pointer text-left">
                <div className="relative rounded-2xl overflow-hidden">
                  <img
                    src={match.image}
                    alt={match.name}
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="font-bold text-lg text-white">{match.name}</h3>
                    <p className="text-white/80 text-sm">{match.profession}, {match.age} yrs, {match.location}</p>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-primary fill-primary" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/login">
            <Button variant="outline">View More Brahmin Profiles</Button>
          </Link>
        </div>
      </section>

      {/* VIDEO CTA */}
      <section className="relative py-20 bg-[url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&h=600&fit=crop')] bg-cover bg-center bg-fixed">
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-8">
            <Play className="w-8 h-8 text-primary-foreground ml-1" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            A Platform for the Brahmin Community
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Established as a selfless initiative, this platform works to protect, preserve, and promote Sanatan culture, classical traditions, and strong family values, helping families connect with like-minded partners within the community.
          </p>

          <div className="flex justify-center gap-4 mb-12">
            <Link to="/login">
              <Button>Browse Profiles</Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-foreground">
                Learn About Our Mission
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* LIFETIME SEVA SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center mb-14">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">LIFETIME COMMUNITY INITIATIVE</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">
            One <span className="text-primary">Community</span>, One Purpose
          </h2>
          <p className="text-muted-foreground mt-4 max-w-4xl mx-auto">
            This platform is not a business. It is a heartfelt initiative to protect our culture, safeguard our lineage, and guide the younger generation toward marriages that honor Brahmin traditions. Your contribution helps maintain this platform as a trusted space for families, ensuring that our dharma, heritage, values, and bloodline are preserved for generations to come.
          </p>
        </div>

        {/* Cards */}
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="relative rounded-[24px] overflow-hidden h-[420px] group shadow-xl">
              <img
                src="https://images.pexels.com/photos/19982637/pexels-photo-19982637.jpeg"
                alt="Find Partner"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20" />

              <div className="absolute bottom-6 left-6 w-[85%] max-w-[380px] bg-white/85 backdrop-blur-sm rounded-2xl p-5 shadow-lg">
                <span className="text-sm text-primary font-medium uppercase tracking-wide">Brahmin Matrimonial</span>

                <h3 className="text-xl md:text-2xl font-bold mt-2">Find a Life Partner Within the Community</h3>
                <p className="text-base text-muted-foreground mt-3 leading-relaxed">
                  Lifetime access to Brahmin profiles. A trusted community platform to help ensure that our children marry within the commnuity - honoring values, traditions, and our lineage.
                </p>

                <p className="text-primary font-bold text-lg mt-3">Contribution: ₹2100</p>

                <Link to="/signup">
                  <Button size="sm" className="mt-4 rounded-full px-6">Join the Initiative</Button>
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative rounded-[24px] overflow-hidden h-[420px] group shadow-xl">
              <img
                src="https://images.pexels.com/photos/26056318/pexels-photo-26056318.jpeg"
                alt="Support Community"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20" />

              <div className="absolute bottom-6 left-6 w-[85%] max-w-[380px] bg-white/85 backdrop-blur-sm rounded-2xl p-5 shadow-lg">
                <span className="text-sm text-primary font-medium uppercase tracking-wide">Support Our Culture</span>

                <h3 className="text-xl md:text-2xl font-bold mt-2">Strengthen the Brahmin Community</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Your seva helps fight cultural dilution, maintain this platform, and support volunteers working tirelessly for the community's upliftment.
                </p>

                <p className="text-primary font-bold text-lg mt-3">Seva-Dakshina: ₹2100</p>

                <Link to="/signup">
                  <Button size="sm" className="mt-4 rounded-full px-6">Contribute Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEMBER PHOTOS */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center mb-12">
          <span className="text-primary text-sm font-medium uppercase tracking-wider">PHOTO GALLERY</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Proud <span className="text-primary">Brahmin Members</span>
          </h2>
          <p className="text-muted-foreground mt-2">Moments of families and individuals connected through shared values, culture, and community seva.</p>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {memberPhotos.map((photo, index) => (
              <div key={index} className="rounded-xl overflow-hidden aspect-square group cursor-pointer">
                <img
                  src={photo}
                  alt={`Member ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

{/* Seva Dakshina Banner */}
<section className="py-16 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=400&fit=crop')] bg-cover bg-center bg-fixed relative">
  <div className="absolute inset-0 bg-black/70" />
  <div className="container mx-auto px-4 relative z-10 text-center">
    <span className="text-primary text-md font-medium uppercase tracking-wider">
      PRESERVE OUR TRADITIONS
    </span>

    <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
      Join the Community with Purpose
    </h2>

    <p className="text-white/80 max-w-3xl mx-auto mb-8">
      
This platform is a social community initiative that helps families connect with partners who
share common values, traditions, and cultural roots. Your participation supports this shared
effort to preserve our heritage, family values, and lineage with dignity.
    </p>

    <Link to="/signup">
      <Button size="lg">Contribute & Join</Button>
    </Link>
  </div>
</section>


      {/* SUCCESS STORIES */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center mb-12">
          <span className="text-primary text-sm font-medium uppercase tracking-wider">COMMUNITY VOICES</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Success Stories</h2>
          <p className="text-muted-foreground mt-2">
            This section shares the experiences of families who connected through this community initiative.
These reflections highlight mutual respect, shared values, and collective efforts to preserve
Brahmin traditions, cultural understanding, and family harmony across generations.</p>
        </div>

        <div className="container mx-auto px-4">
          <div className="relative max-w-5xl mx-auto">
            <div className={`grid gap-8 ${storiesPerPage === 1 ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
              {paginatedStories.map((story, index) => (
                <div key={index} className="bg-card rounded-xl p-6 shadow-md">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < story.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mb-4 text-left">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">{story.names[0]}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{story.names}</h4>
                      <span className="text-primary text-xs">BRAHMIN COUPLE</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm text-left">{story.text}</p>
                </div>
              ))}
            </div>

            {totalStoryPages > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-card/80 hover:bg-card absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12"
                  onClick={prevStoryPage}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-card/80 hover:bg-card absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12"
                  onClick={nextStoryPage}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

     {/* How It Works Section */}
<section className="py-16">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        How It Works
      </h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        A simple, respectful, and value-driven process to help Brahmin families
        connect through shared traditions and mutual understanding.
      </p>
    </div>

    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {[
          {
            step: 1,
            title: "Create Your Profile",
            desc: "Create a detailed profile that reflects your family background, cultural values, and traditions."
          },
          {
            step: 2,
            title: "Set Preferences & View Matches",
            desc: "Define partner preferences and explore suitable profiles aligned with your expectations and values."
          },
          {
            step: 3,
            title: "Send Connection Request",
            desc: "Show interest respectfully by sending a connection request to families you find compatible."
          },
          {
            step: 4,
            title: "Connect & Communicate",
            desc: "Once accepted, communicate with confidence to move towards a meaningful and sacred alliance."
          }
        ].map((item) => (
          <div key={item.step} className="text-center space-y-4 relative">
            <div className="w-16 h-16 mx-auto rounded-full bg-[image:var(--gradient-primary)] flex items-center justify-center text-2xl font-bold text-primary-foreground">
              {item.step}
            </div>
            <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
            <p className="text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>


{/* Sevadakshina Plans */}
<section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        Community Support Membership
      </h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        A one-time contribution of ₹2,100 supports this selfless community initiative helping Brahmin families find respectful, value-based, and tradition-aligned relationships. This contribution ensures the smooth functioning of the platform and supports volunteers serving the community with dedication and integrity.
      </p>
    </div>

   <SubscriptionSection />
  </div>
</section>

{/* App Promotion */}
<section className="py-16">
  <div className="container mx-auto px-4">
    <div className="grid lg:grid-cols-2 gap-12 items-center lg:pl-16">

      <div>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Download Our <span className="text-primary">Mobile App</span>
        </h2>

        <p className="text-muted-foreground mb-6">
          Stay connected to profiles that reflect your cultural values and family 
          traditions—anytime, anywhere. The app keeps your journey simple, safe, 
          and aligned with what matters most.
        </p>

        <ul className="space-y-3 mb-8">
          <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-primary" /><span>Instant culturally-compatible match alerts</span></li>
          <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-primary" /><span>Effortless profile browsing</span></li>
          <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-primary" /><span>Secure in-app conversations</span></li>
          <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-primary" /><span>Optional video meetings</span></li>
        </ul>

        <div className="flex gap-4">
          <Button size="lg">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10" />
          </Button>
          <Button size="lg" variant="outline">
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-10" />
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        <img
          src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=600&fit=crop"
          alt="Mobile App"
          className="rounded-3xl shadow-2xl max-w-sm w-full"
        />
      </div>

    </div>
  </div>
</section>


      {/* CTA SECTION */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-center space-y-6 bg-[image:var(--gradient-primary)] p-12 rounded-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Protect Our Culture. Choose the Right Partner.
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Become part of a community that honors our Sanatan heritage through meaningful, value-based alliances.
            </p>

            <Button size="lg" variant="secondary" asChild>
              <Link to="/signup">Start Your Journey</Link>
            </Button>
          </div>
        </div>
      </section>

      <FooterGallery />
      <Footer />
    </div>
  );
};

export default Index;

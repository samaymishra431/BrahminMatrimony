import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import FAQSection from "@/components/FAQSection";
import { SubscriptionSection } from "@/components/SubscriptionSection"; 

import { Button } from "@/components/ui/button";
import { Search, Crown, Shield, Users, Calendar, Sparkles, CheckCircle, Check } from "lucide-react";
import { Newsletter } from "@/components/Newsletter";
import meetUpImage from "@/images/meetups.png";
import strictPrivacyImage from "@/images/strictPrivacy.png";
import culturalMatchmakingImage from "@/images/culturalMatchmaking.png";
import dedicateCommunityGuidanceImage from "@/images/dedicatedCommunity.png";
import verifiedProfilesImage from "@/images/verifiedProfiles.png";
import lifeLongSevaImage from "@/images/lifeLongSeva.png";

const services = [
  {
    icon: Search,
    title: "ALGORITHM-BASED MATCH RECOMMENDATIONS",
    description:
      "Our platform uses intelligent matchmaking algorithms to suggest profiles that best align with your spiritual, cultural, and family values, ensuring meaningful and compatible connections.",
    buttonText: "Explore Matches",
    image: verifiedProfilesImage,
  },
  {
    icon: Crown,
    title: "ADVANCED FILTERS FOR CUSTOM MATCHING",
    description:
      "Families and individuals can refine their search using advanced filters such as gotra, tradition, education, lifestyle, and values, making it easier to find the perfect match.",
    buttonText: "Use Filters",
    image: culturalMatchmakingImage,
  },
  {
    icon: Users,
    title: "PRIVACY WITH RESPONSIBILITY",
    description:
      "Member privacy and dignity are treated with utmost seriousness. We promote mindful interactions and responsible decision-making within a respectful community environment.",
    buttonText: "Know Our Principles",
    image: strictPrivacyImage,
  },
  // {
  //   icon: Shield,
  //   title: "COMMUNITY-LED GUIDANCE",
  //   description:
  //     "Guided by volunteers from the Brahmin Organisation of India, families receive personal support rooted in dharma, understanding, and social responsibility throughout their matrimonial journey.",
  //   buttonText: "Seek Guidance",
  //   image: dedicateCommunityGuidanceImage,
  // },
  // {
  //   icon: Sparkles,
  //   title: "MATRIMONY AS SEVA",
  //   description:
  //     "This initiative is driven by service, not profit. Contributions help sustain cultural preservation, youth awareness, and matrimonial welfare across Brahmin society.",
  //   buttonText: "Be a Part",
  //   image: lifeLongSevaImage,
  // },
  // {
  //   icon: Calendar,
  //   title: "CULTURAL MEETS & FAMILY GATHERINGS",
  //   description:
  //     "We organize tradition-oriented introductions, samskar-based events, and community gatherings to foster meaningful connections between families in a respectful setting.",
  //   buttonText: "View Programs",
  //   image: meetUpImage,
  // },
];

const sevadakshinaPlans = [
  {
    name: "Silver",
    price: "₹2,999",
    duration: "3 Months",
    features: [
      "Access to 100% verified Brahmin profiles",
      "View 50 profiles per month",
      "Send 30 interests monthly",
      "Chat with approved matches",
      "Basic community support",
    ],
    popular: false,
  },
  {
    name: "Gold",
    price: "₹5,999",
    duration: "6 Months",
    features: [
      "Unlimited profile viewing",
      "Unlimited interests & requests",
      "Video meeting feature",
      "Priority matchmaking support",
      "Highlighted profile listing",
    ],
    popular: true,
  },
  {
    name: "Platinum",
    price: "₹9,999",
    duration: "12 Months",
    features: [
      "All Gold plan benefits",
      "Dedicated relationship manager",
      "Monthly profile boost",
      "VIP badge for top visibility",
      "Exclusive community event access",
    ],
    popular: false,
  },
];

const Services = () => {
  return (
    <div className="overflow-hidden">
      <Navbar />

      <PageBanner
  title="Our Services"
  subtitle="Thoughtfully guided matrimonial support rooted in Sanatan Dharma, Brahmin traditions, and family values"
  backgroundImage="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=600&fit=crop"
 />


      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Our Services: Preserving <span className="text-primary">Tradition, Culture & Family Values</span>
          </h2>
          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-12">
            Every service we offer is guided by one purpose to protect the dignity, unity, and cultural purity of the Brahmin community.
            Our platform is a sacred space where families find trustworthy matches who share the same spiritual, traditional, and emotional foundation.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="relative rounded-3xl overflow-hidden">
                <img src={service.image} alt={service.title} className="w-full h-96 object-cover" />
                <div className="absolute inset-0 bg-black/60 text-white p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4">
                    <service.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-xl uppercase mb-4">{service.title}</h3>
                  <p className="mb-6">{service.description}</p>
                </div>
              </div>
            ))}
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


      <FAQSection />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Services;

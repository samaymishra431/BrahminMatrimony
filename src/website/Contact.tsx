import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import FAQSection from "@/components/FAQSection";
import { Mail, Phone, MapPin, Send, CheckCircle, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Users, IndianRupee } from "lucide-react";
import { Newsletter } from "@/components/Newsletter";
import { motion } from "framer-motion";
import { toast } from "sonner";

const missionCards = [
  {
    icon: Shield,
    title: "Sacred Intention",
    lines: [
      "Our platform is built with the pure intention of preserving Brahmin values and traditions.",
      "We guide families toward meaningful, respectful, and culturally aligned matchmaking.",
      "This initiative is driven by service to the community, not commercial gain."
    ]
  },
  {
    icon: Users,
    title: "Community First",
    lines: [
      "Every action is focused on uplifting the Brahmin community and honoring our cultural heritage.",
      "Volunteers dedicate themselves selflessly to help families find trustworthy and compatible life partners.",
      "Together, we safeguard our customs, traditions, and the integrity of marriages."
    ]
  },
  {
    icon: IndianRupee,
    title: "One-Time Contribution",
    lines: [
      "We do not charge monthly or yearly fees — matchmaking is not a business.",
      "A single contribution of ₹2,100 ensures smooth functioning of the platform and supports volunteers serving the community.",
      "Your support helps maintain this initiative and strengthens it for generations of Brahmin families."
    ]
  }
];


const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

const Contact = () => {  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Thank you for reaching out. Our volunteer team will connect with you shortly.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

 <PageBanner
  title="Contact Us"
  subtitle="Reach out to us with trust and confidence. We’re dedicated to assisting you with care, respect, and a commitment to preserving the values, traditions, and harmony that guide every family connection."
  backgroundImage="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&h=600&fit=crop"
/>



      {/* Seva Initiative Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h3 className="text-sm font-semibold text-saffron uppercase tracking-widest">
              BRAHMIN MATRIMONY • A COMMUNITY INITIATIVE
            </h3>
            <h2 className="mt-4 text-3xl font-heading font-bold text-foreground md:text-4xl">
              A Sacred Platform Led by Community, Not Commerce
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Brahmin Matrimony is a selfless initiative designed to help Brahmin families find respectful, value-based, and tradition-aligned relationships. This platform is not a business it is guided by love, integrity, and a commitment to preserving our cultural heritage. The one-time contribution of ₹2,100 ensures smooth functioning of the portal and supports volunteers who work selflessly for the community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-card p-8 rounded-xl border border-border"
            >
              <h2 className="text-2xl font-heading font-bold text-foreground mb-8">
                Connect With Our Volunteer Team
              </h2>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-saffron" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Office Address</h3>
                  <p className="text-muted-foreground text-sm">
                    A-2, Opp. Badli Industrial Area, Suraj Park, Sector 18,<br />
                    Rohini, Delhi, 110042
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center">
                  <Phone className="w-5 h-5 text-saffron" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                  <p className="text-muted-foreground text-sm">07266858699</p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center">
                  <Mail className="w-5 h-5 text-saffron" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email</h3>
                  <p className="text-muted-foreground text-sm">support@brahminmatrimony.com</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="group w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-cream hover:bg-saffron"
                    >
                      <social.icon className="w-5 h-5 text-saffron group-hover:text-white" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-lg overflow-hidden border border-border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3498.8776851847384!2d77.09729!3d28.7364189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d01988d7b6c9d%3A0x3f8c6a7c9a8b0e1d!2sSuraj%20Park%2C%20Sector%2018%2C%20Rohini%2C%20Delhi%2C%20110042!5e0!3m2!1sen!2sin!4v1699123456789!5m2!1sen!2sin"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  title="BOI Office Location"
                />
              </div>

              <a
                href="https://www.google.com/maps/place/Suraj+Park,+Sector+18,+Rohini,+Delhi,+110042/@28.7364189,77.09729,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-saffron hover:underline mt-2 inline-block"
              >
                View larger map
              </a>
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-card p-8 rounded-xl border border-border"
            >
              <h2 className="text-2xl font-heading font-bold text-foreground mb-8">
                Send Us a Message
              </h2>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="font-heading font-semibold text-2xl text-foreground mb-2">
                    Message Received With Gratitude
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you for connecting with us. Our volunteer team will reach out within 24–48 hours.
                  </p>
                  <Button variant="default" onClick={() => setIsSubmitted(false)}>
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" required placeholder="Enter your full name" className="bg-background border-border" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required placeholder="your.email@example.com" className="bg-background border-border" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+91 1234567890" className="bg-background border-border" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" required placeholder="How can we help you?" className="bg-background border-border" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" required rows={4} placeholder="Your message" className="bg-background border-border resize-none" />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full" size="lg" variant="default">
                    {isSubmitting ? "Sending..." : <>Send Message <Send className="w-4 h-4 ml-2" /></>}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {missionCards.map((card, index) => (
              <div key={index} className="bg-card rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <card.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-4 uppercase tracking-wide">{card.title}</h3>
                <div className="space-y-3">
                  {card.lines.map((line, idx) => (
                    <p key={idx} className="text-muted-foreground text-sm">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Contact;

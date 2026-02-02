import { Heart, Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const recentPosts = [
  {
    title: "Finding Your Perfect Match: Tips for Success",
    date: "December 5, 2025",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=100&h=80&fit=crop"
  },
  {
    title: "The Importance of Family Values in Marriage",
    date: "December 3, 2025",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=100&h=80&fit=crop"
  }
];

const galleryImages = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=100&h=100&fit=crop",
];

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {/* <div className="w-10 h-10 rounded-full bg-[image:var(--gradient-primary)] flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary-foreground fill-current" />
              </div> */}
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Brahmin Matrimony
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Dedicated to connecting hearts through tradition, trust, and technology. Your journey to finding a life partner starts here.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-secondary hover:bg-primary/10 flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4 text-primary" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-secondary hover:bg-primary/10 flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4 text-primary" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-secondary hover:bg-primary/10 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4 text-primary" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-secondary hover:bg-primary/10 flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4 text-primary" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">Our Services</Link></li>
              <li><Link to="/team" className="text-muted-foreground hover:text-primary transition-colors">Our Team</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/gallery" className="text-muted-foreground hover:text-primary transition-colors">Gallery</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/success-stories" className="text-muted-foreground hover:text-primary transition-colors">Success Stories</Link></li>
              <li><Link to="/careers" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Recent Posts */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Recent Updates</h3>
            <div className="space-y-4">
              {recentPosts.map((post, index) => (
                <div key={index} className="flex gap-3">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-16 h-12 rounded object-cover flex-shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-medium text-foreground line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                      {post.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">{post.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Gallery</h3>
            <div className="grid grid-cols-4 gap-2">
              {galleryImages.map((image, index) => (
                <div key={index} className="aspect-square rounded overflow-hidden">
                  <img 
                    src={image} 
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 MatrimonyHub. All rights reserved. | Designed with <Heart className="w-4 h-4 text-primary inline-block" /> for the community</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import FAQSection from "@/components/FAQSection";

import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Newsletter } from "@/components/Newsletter";

const featuredPost = {
  title: "10 Tips for a Successful First Meeting with Your Match",
  excerpt: "Making a great first impression is crucial. Here are expert tips to help you navigate that important first meeting with confidence and authenticity.",
  image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=400&fit=crop",
  category: "Dating Tips",
  author: "Priya Sharma",
  authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  date: "Dec 5, 2024",
  readTime: "8 min read"
};

const latestPosts = [
  {
    title: "Understanding Compatibility in Arranged Marriages",
    excerpt: "Explore the key factors that contribute to lasting compatibility in arranged marriages.",
    image: "https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=400&h=300&fit=crop",
    category: "Relationship Advice",
    author: "Dr. Anand Murthy",
    date: "Dec 3, 2024",
    readTime: "6 min"
  },
  {
    title: "How to Write an Attractive Matrimony Profile",
    excerpt: "Your profile is your first impression. Learn how to make it stand out.",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=300&fit=crop",
    category: "Profile Tips",
    author: "Meera Singh",
    date: "Dec 1, 2024",
    readTime: "5 min"
  },
  {
    title: "The Role of Family in Modern Matchmaking",
    excerpt: "Balancing traditional values with modern expectations in matrimonial decisions.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop",
    category: "Family",
    author: "Kavita Iyer",
    date: "Nov 28, 2024",
    readTime: "7 min"
  },
  {
    title: "Red Flags to Watch Out for in Online Profiles",
    excerpt: "Protect yourself by learning to identify warning signs in matrimonial profiles.",
    image: "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=400&h=300&fit=crop",
    category: "Safety",
    author: "Vikram Rao",
    date: "Nov 25, 2024",
    readTime: "6 min"
  },
  {
    title: "Planning Your Wedding: A Complete Guide",
    excerpt: "From venue selection to honeymoon planning, here's everything you need to know.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
    category: "Wedding Planning",
    author: "Anjali Nair",
    date: "Nov 22, 2024",
    readTime: "10 min"
  },
  {
    title: "Navigating Cultural Differences in Inter-Community Marriages",
    excerpt: "Tips for building a strong relationship across cultural boundaries.",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop",
    category: "Relationship Advice",
    author: "Sunita Desai",
    date: "Nov 20, 2024",
    readTime: "8 min"
  }
];

const categories = [
  { name: "Dating Tips", count: 24 },
  { name: "Relationship Advice", count: 18 },
  { name: "Profile Tips", count: 12 },
  { name: "Wedding Planning", count: 15 },
  { name: "Family", count: 10 },
  { name: "Safety", count: 8 },
  { name: "Success Stories", count: 30 }
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageBanner
  title="Blog"
  subtitle="Insights, guidance, and reflections on marriage, culture, and dharmic living"
  backgroundImage="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1920&h=600&fit=crop"
 />

      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Featured Post */}
              <article className="bg-card rounded-xl border border-border overflow-hidden mb-8">
                <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-64 md:h-80 object-cover" />
                <div className="p-6">
                  <Badge className="mb-3">{featuredPost.category}</Badge>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 hover:text-primary transition-colors cursor-pointer">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground mb-4">{featuredPost.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={featuredPost.authorImage} alt={featuredPost.author} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-medium text-sm">{featuredPost.author}</p>
                        <div className="flex items-center gap-2 text-muted-foreground text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>{featuredPost.date}</span>
                          <Clock className="w-3 h-3 ml-2" />
                          <span>{featuredPost.readTime}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" className="text-primary">
                      Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </article>
              
              {/* Latest Posts Grid */}
              <h3 className="text-2xl font-bold mb-6">Latest Articles</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {latestPosts.map((post, index) => (
                  <article key={index} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
                    <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <Badge variant="secondary" className="mb-2">{post.category}</Badge>
                      <h4 className="font-semibold mb-2 hover:text-primary transition-colors cursor-pointer line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Articles
                </Button>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
              {/* Categories */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold text-lg mb-4">Categories</h3>
                <ul className="space-y-3">
                  {categories.map((category, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <a href="#" className="hover:text-primary transition-colors">{category.name}</a>
                      <Badge variant="secondary">{category.count}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Newsletter */}
              <div className="bg-[image:var(--gradient-primary)] rounded-xl p-6 text-primary-foreground">
                <h3 className="font-semibold text-lg mb-2">Subscribe to Newsletter</h3>
                <p className="text-sm opacity-90 mb-4">Get the latest articles and tips delivered to your inbox.</p>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-4 py-2 rounded-lg text-foreground mb-3"
                />
                <Button className="w-full bg-card text-primary hover:bg-card/90">
                  Subscribe
                </Button>
              </div>
              
              {/* Popular Tags */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold text-lg mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {["Marriage", "Dating", "Love", "Family", "Wedding", "Tips", "Advice", "Profile", "Safety", "Success"].map((tag, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
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

export default Blog;

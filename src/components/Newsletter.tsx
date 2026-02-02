import { useState } from "react";
import { Mail, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubscribed(true);
    setEmail("");
    toast.success("Thank you for subscribing to our newsletter!");
  };

  return (
    <section className="py-5 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center bg-background p-8 rounded-xl">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Subscribe to Our <span className="text-primary">Newsletter</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Stay updated with our latest news, success stories, and community events.
          </p>

          {isSubscribed ? (
            <div className="flex items-center justify-center gap-3 text-green-500">
              <CheckCircle className="w-6 h-6" />
              <span className="font-medium">You're subscribed! Check your inbox for updates.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-grow p-3 rounded-md border border-border focus:ring-2 focus:ring-primary focus:outline-none text-sm bg-transparent"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  "Subscribing..."
                ) : (
                  <>
                    Subscribe
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

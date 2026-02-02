import {
  ShieldCheck,
  Landmark,
  Users,
  Infinity as InfinityIcon,
  ArrowRight,
  Lock,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";

interface SubscriptionSectionProps {
  onSubscribe?: () => void;
}

export const SubscriptionSection = ({
  onSubscribe,
}: SubscriptionSectionProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 font-sans">
      <div className="w-full bg-white dark:bg-[#2a2418] rounded-2xl shadow-lg overflow-hidden border border-[#e6e2db] dark:border-[#3a332a] flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="relative h-48 lg:h-auto lg:w-5/12">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEg387WAQs9iRayOkxTJF_WjjHGy7PmsEKh0iXBPtN0MCZFjSNj3jDvc_ZhSprkFVkbDtiItBJd9eGZ6l8ngs93Pv44z0F6F6Lsaxf-ufmPh3IPoryi0mWvumcXc5szV3y2B7rGYKUmh1bnE69ds0b6Rce5DG9e0mp2BbmmHAisw16ugUpI6dVtgiLxcdVYsjQd1MktlIQGWqJHyXUcAXje88qkIyw6JhF_Tn_0Oh0hIlLbEoOnH-Thyb6wc2t_y9q_h4yUU-aMDs"
            alt="Community Support"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 z-20">
            <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase">
              Best Value
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6 lg:w-7/12">
          {/* Header */}
          <div className="text-center pb-4 border-b border-[#e6e2db] dark:border-[#3a332a]">
            <h2 className="text-2xl font-bold text-[#181611] dark:text-white">
              Community Support Membership
            </h2>
            <p className="text-sm text-[#897c61] dark:text-gray-400 mt-1">
              (समुदाय समर्थन सदस्यता)
            </p>
            <div className="mt-2 text-[#eead2b]">
              <span className="text-4xl font-extrabold text-primary">₹2100</span>
            </div>
            <p className="text-xs text-[#897c61] dark:text-gray-400 mt-1">
              One-time payment • Until you find your life partner
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-col gap-4">
            <Feature
              icon={<ShieldCheck />}
              title="Brahmin Families"
              description="Browse verified Brahmin family profiles."
            />
            <Feature
              icon={<Landmark />}
              title="Culturally Aligned"
              description="Profiles aligned with shared traditions."
            />
            <Feature
              icon={<Users />}
              title="Advanced Filters"
              description="Find matches that fit your preferences."
            />
            <Feature
              icon={<InfinityIcon />}
              title="Lifetime Access"
              description="Access until you find your life partner."
            />
          </div>

          {/* CTA */}
          <Link
            to="/signup"
            className="mt-2 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            Become a Member
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ---------- Helper Components ---------- */

const Feature = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="flex gap-3 items-start">
    <div className="text-[#eead2b] w-5 h-5">{icon}</div>
    <div>
      <p className="text-sm font-bold text-[#181611] dark:text-white">
        {title}
      </p>
      <p className="text-xs text-[#897c61] dark:text-gray-400">
        {description}
      </p>
    </div>
  </div>
);

const FooterItem = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) => (
  <div className="flex items-center gap-1.5 text-xs text-[#897c61] dark:text-gray-400">
    <span className="w-4 h-4">{icon}</span>
    {text}
  </div>
);

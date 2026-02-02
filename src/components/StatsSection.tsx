import { Users, Heart, Award, Globe } from "lucide-react";

// const stats = [
//   {
//     icon: Users,
//     value: "50K+",
//     label: "Active Members",
//   },
//   {
//     icon: Heart,
//     value: "15K+",
//     label: "Success Stories",
//   },
//   {
//     icon: Award,
//     value: "98%",
//     label: "Verified Profiles",
//   },
//   {
//     icon: Globe,
//     value: "150+",
//     label: "Countries",
//   },
// ];

const stats = [
  {
    icon: Users,
    value: "Growing",
    label: "Early Members",
  },
  {
    icon: Heart,
    value: "Real",
    label: "Genuine Connections",
  },
  {
    icon: Award,
    value: "Verified",
    label: "Manual Profile Checks",
  },
  {
    icon: Globe,
    value: "Global",
    label: "Open Worldwide",
  },
];

const StatsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center space-y-3 group"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[image:var(--gradient-primary)] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
